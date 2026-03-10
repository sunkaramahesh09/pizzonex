import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { Minus, Plus, Trash2, CreditCard, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [paymentState, setPaymentState] = useState<"cart" | "processing" | "success">("cart");

  const handlePayment = async () => {
    if (!items.length) return;

    setPaymentState("processing");

    try {
      // 1. Create order in our backend
      const orderItems = items.map((item) => ({
        name: item.pizza.name,
        description: item.pizza.description,
        price: item.pizza.price,
        quantity: item.quantity,
        image: item.pizza.image,
        customizations: item.customizations,
      }));

      const order = await api.createOrder({ items: orderItems, total });

      // 2. Create Razorpay order
      const paymentOrder = await api.createPaymentOrder({
        amount: total,
        orderId: order._id,
      });

      // 3. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setPaymentState("cart");
        return;
      }

      // 4. Open Razorpay checkout
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Pizzonex",
        description: "Pizza Order Payment",
        order_id: paymentOrder.orderId,
        handler: async (response: any) => {
          try {
            // 5. Verify payment
            await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            clearCart();
            setPaymentState("success");
          } catch {
            toast.error("Payment verification failed");
            setPaymentState("cart");
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentState("cart");
          },
        },
        theme: { color: "#e11d48" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
      setPaymentState("cart");
    }
  };

  if (paymentState === "success") {
    return (
      <div className="container py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="inline-block"
        >
          <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-success-foreground" />
          </div>
        </motion.div>
        <h1 className="font-display text-3xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">Your order has been placed and is being prepared 🍕</p>
        <Button onClick={() => setPaymentState("cart")} variant="outline">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add some delicious pizzas to get started!</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.pizza.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card>
                  <CardContent className="p-4 flex items-center gap-4">
                    {item.pizza.image && (
                      <img
                        src={item.pizza.image}
                        alt={item.pizza.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold">{item.pizza.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.pizza.description}</p>
                      <p className="text-primary font-bold mt-1">₹{item.pizza.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.pizza.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:w-80">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="font-display">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.pizza.id} className="flex justify-between text-sm">
                  <span>{item.pizza.name} × {item.quantity}</span>
                  <span>₹{item.pizza.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-display text-2xl font-bold text-primary">₹{total}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePayment}
                disabled={paymentState === "processing"}
              >
                {paymentState === "processing" ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
                ) : (
                  <><CreditCard className="h-5 w-5 mr-2" /> Pay with Razorpay</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
