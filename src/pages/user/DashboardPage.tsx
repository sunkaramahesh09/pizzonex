import { pizzas } from "@/data/mockData";
import PizzaCard from "@/components/PizzaCard";
import { motion } from "framer-motion";
import heroPizza from "@/assets/hero-pizza.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Paintbrush } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="container py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            className="flex-1 text-center md:text-left space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight">
              Freshly Baked,<br />Delivered Hot 🔥
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Handcrafted pizzas made with love, fresh ingredients, and baked to perfection.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/builder")}
              className="mt-2"
            >
              <Paintbrush className="h-5 w-5 mr-2" /> Build Your Own
            </Button>
          </motion.div>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={heroPizza}
              alt="Delicious pizza"
              className="w-64 md:w-80 rounded-full shadow-2xl border-4 border-primary-foreground/20"
            />
          </motion.div>
        </div>
      </section>

      {/* Pizza grid */}
      <section className="container py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Our Menu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pizzas.map((pizza, i) => (
            <PizzaCard key={pizza.id} pizza={pizza} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
