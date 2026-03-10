const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Ingredient = require("../models/Ingredient");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

let razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env");
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

/**
 * After a successful payment, deduct ingredient stock based on the order's
 * customizations and send a low-stock alert email to the admin if any
 * ingredient drops below its threshold.
 */
async function deductStockAndNotify(order) {
  try {
    const allIngredients = await Ingredient.find();
    const ingredientMap = new Map();
    allIngredients.forEach((ing) => ingredientMap.set(ing.name.toLowerCase(), ing));

    const lowStockItems = [];

    for (const item of order.items) {
      const customizations = item.customizations || [];
      const qty = item.quantity || 1;

      for (const customName of customizations) {
        const ingredient = ingredientMap.get(customName.toLowerCase());
        if (ingredient) {
          ingredient.stock = Math.max(0, ingredient.stock - qty);
          await ingredient.save();

          if (ingredient.stock < ingredient.threshold) {
            lowStockItems.push(ingredient);
          }
        }
      }
    }

    // Send low-stock notification email to admin
    if (lowStockItems.length > 0) {
      const admin = await User.findOne({ role: "admin" });
      if (admin) {
        const itemRows = lowStockItems
          .map(
            (i) =>
              `<tr><td style="padding:8px;border:1px solid #ddd;">${i.name}</td>` +
              `<td style="padding:8px;border:1px solid #ddd;">${i.type}</td>` +
              `<td style="padding:8px;border:1px solid #ddd;color:#e11d48;font-weight:bold;">${i.stock}</td>` +
              `<td style="padding:8px;border:1px solid #ddd;">${i.threshold}</td></tr>`
          )
          .join("");

        await sendEmail({
          to: admin.email,
          subject: "⚠️ Pizzonex — Low Stock Alert",
          html: `
            <h2>Low Stock Alert</h2>
            <p>The following ingredients have fallen below their threshold after a recent order:</p>
            <table style="border-collapse:collapse;width:100%;margin:16px 0;">
              <thead>
                <tr style="background:#f3f4f6;">
                  <th style="padding:8px;border:1px solid #ddd;text-align:left;">Ingredient</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:left;">Type</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:left;">Current Stock</th>
                  <th style="padding:8px;border:1px solid #ddd;text-align:left;">Threshold</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
            <p>Please restock these items as soon as possible.</p>
            <p style="color:#888;">— Pizzonex Inventory System</p>
          `,
        });
        console.log(`📧 Low-stock alert sent to ${admin.email} for ${lowStockItems.length} item(s)`);
      }
    }
  } catch (err) {
    // Log but don't fail the payment response
    console.error("Stock deduction/notification error:", err);
  }
}

// POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // amount is in paisa (₹1 = 100 paisa)
    const razorpayOrder = await getRazorpay().orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
    });

    // Update our order with the Razorpay order ID
    await Order.findByIdAndUpdate(orderId, {
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: "Failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order with payment details
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    // Deduct stock and send low-stock alerts (non-blocking for response)
    deductStockAndNotify(order);

    res.json({ message: "Payment verified successfully", order });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
