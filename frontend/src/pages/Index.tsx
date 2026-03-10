import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pizza, ArrowRight } from "lucide-react";
import heroPizza from "@/assets/hero-pizza.png";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Pizza className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-primary">Pizzonex</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1 space-y-6 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
              Pizza So Good,<br />
              <span className="text-primary">It Delivers Itself</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Handcrafted pizzas with the freshest ingredients, baked in a stone oven and delivered hot to your doorstep. Build your own or choose from our signature collection.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link to="/register">
                <Button size="lg">
                  Order Now <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src={heroPizza}
              alt="Delicious pizza"
              className="w-72 md:w-96 rounded-full shadow-2xl"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
