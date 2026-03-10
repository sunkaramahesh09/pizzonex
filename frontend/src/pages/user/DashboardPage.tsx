import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import PizzaCard from "@/components/PizzaCard";
import { motion } from "framer-motion";
import heroPizza from "@/assets/hero-pizza.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Paintbrush, Loader2 } from "lucide-react";

interface Pizza {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPizzas()
      .then((data) => setPizzas(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2d0a0a] via-[#4a1111] to-[#1a0505]">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-72 h-72 bg-red-500/25 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl"
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container relative py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1 text-center md:text-left space-y-6 z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              🍕 #1 Pizza Delivery App
            </motion.span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
              Freshly Baked,<br />
              <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Delivered Hot
              </span>
            </h1>
            <p className="text-red-100/70 text-lg max-w-md leading-relaxed">
              Handcrafted pizzas made with love, fresh ingredients, and baked to perfection. Build your dream pizza today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={() => navigate("/builder")}
                className="bg-primary hover:bg-primary/90 text-white px-8 shadow-lg shadow-primary/30"
              >
                <Paintbrush className="h-5 w-5 mr-2" /> Build Your Own
              </Button>
              <Button
                size="lg"
                onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-amber-700/60 hover:bg-amber-700/80 text-amber-100 border border-amber-600/40 px-8"
              >
                View Menu ↓
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              className="flex gap-6 justify-center md:justify-start pt-4 text-red-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {[
                { value: "12+", label: "Pizzas" },
                { value: "30 min", label: "Delivery" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-white font-display font-bold text-xl">{stat.value}</p>
                  <p className="text-red-300/60 text-xs uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center relative z-10"
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          >
            {/* Glow ring behind pizza */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-72 md:w-96 h-72 md:h-96 rounded-full border-2 border-dashed border-primary/20" />
            </motion.div>
            <div className="relative">
              <motion.div
                className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <img
                src={heroPizza}
                alt="Delicious pizza"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover shadow-2xl shadow-primary/20 border-4 border-white/10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pizza grid */}
      <section id="menu" className="container py-10">
        <h2 className="font-display text-2xl font-bold mb-6">Our Menu</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pizzas.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No pizzas available yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pizzas.map((pizza, i) => (
              <PizzaCard
                key={pizza._id}
                pizza={{ ...pizza, id: pizza._id }}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
