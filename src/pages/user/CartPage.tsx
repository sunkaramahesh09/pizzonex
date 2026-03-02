import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, CreditCard, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [paymentState, setPaymentState] = useState<"cart" | "success">("cart");

  const handlePayment = () => {
    setPaymentState("success");
    clearCart();
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
              <Button className="w-full" size="lg" onClick={handlePayment}>
                <CreditCard className="h-5 w-5 mr-2" /> Pay with Razorpay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
