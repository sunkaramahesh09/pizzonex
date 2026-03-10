import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  _id: string;
  createdAt: string;
  items: any[];
  total: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Order Received" | "In Kitchen" | "Sent to Delivery" | "Delivered";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api
      .getMyOrders()
      .then((data) => setOrders(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
    setLoading(false);
  }, []);

  // Poll every 30 seconds if there are active (non-delivered) orders
  useEffect(() => {
    const hasActiveOrders = orders.some((o) => o.orderStatus !== "Delivered");
    if (!hasActiveOrders) return;

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [orders]);

  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet. Start ordering some pizzas!</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="w-[300px]">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order._id.slice(-8).toUpperCase()}</TableCell>
                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                        <TableCell className="font-bold text-primary">₹{order.total}</TableCell>
                        <TableCell>
                          <Badge variant={order.paymentStatus === "Paid" ? "default" : "destructive"}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <OrderStatusTracker currentStatus={order.orderStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-display font-semibold">{order._id.slice(-8).toUpperCase()}</span>
                    <Badge variant={order.paymentStatus === "Paid" ? "default" : "destructive"}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatDate(order.createdAt)}</span>
                    <span className="font-bold text-primary text-base">₹{order.total}</span>
                  </div>
                  <OrderStatusTracker currentStatus={order.orderStatus} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
