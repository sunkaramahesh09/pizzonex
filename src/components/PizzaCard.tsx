import { Pizza } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Paintbrush } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface PizzaCardProps {
  pizza: Pizza;
  index: number;
}

export default function PizzaCard({ pizza, index }: PizzaCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="card-hover overflow-hidden group">
        <div className="aspect-square overflow-hidden">
          <img
            src={pizza.image}
            alt={pizza.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg">{pizza.name}</h3>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {pizza.category}
              </span>
            </div>
            <span className="font-display font-bold text-xl text-primary">₹{pizza.price}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{pizza.description}</p>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1"
              onClick={() => addToCart(pizza)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" /> Add
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/builder")}
            >
              <Paintbrush className="h-4 w-4 mr-1" /> Customize
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
