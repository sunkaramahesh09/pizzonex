import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders, mockIngredients } from "@/data/mockData";
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Total Revenue",
    value: `₹${mockOrders.reduce((s, o) => s + o.total, 0).toLocaleString()}`,
    icon: DollarSign,
    color: "text-success",
  },
  {
    title: "Total Orders",
    value: mockOrders.length,
    icon: ShoppingBag,
    color: "text-primary",
  },
  {
    title: "Low Stock Items",
    value: mockIngredients.filter((i) => i.stock < i.threshold).length,
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    title: "Active Orders",
    value: mockOrders.filter((o) => o.orderStatus !== "Delivered").length,
    icon: TrendingUp,
    color: "text-secondary",
  },
];

export default function AdminOverviewPage() {
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
