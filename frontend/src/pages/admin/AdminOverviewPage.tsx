import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAllOrders(), api.getIngredients()])
      .then(([orders, ingredients]) => {
        const totalRevenue = orders
          .filter((o: any) => o.paymentStatus === "Paid")
          .reduce((s: number, o: any) => s + o.total, 0);
        const lowStock = ingredients.filter((i: any) => i.stock < i.threshold).length;
        const activeOrders = orders.filter((o: any) => o.orderStatus !== "Delivered").length;

        setStats([
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-success",
          },
          {
            title: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "text-primary",
          },
          {
            title: "Low Stock Items",
            value: lowStock,
            icon: AlertTriangle,
            color: "text-warning",
          },
          {
            title: "Active Orders",
            value: activeOrders,
            icon: TrendingUp,
            color: "text-secondary",
          },
        ]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
