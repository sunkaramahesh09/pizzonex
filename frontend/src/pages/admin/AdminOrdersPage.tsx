import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Loader2 } from "lucide-react";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import { toast } from "sonner";

interface Order {
  _id: string;
  createdAt: string;
  user?: { name: string; email: string };
  items: any[];
  total: number;
  paymentStatus: "Paid" | "Pending" | "Failed";
  orderStatus: "Order Received" | "In Kitchen" | "Sent to Delivery" | "Delivered";
}

const statusOptions: Order["orderStatus"][] = [
  "Order Received",
  "In Kitchen",
  "Sent to Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    api
      .getAllOrders()
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: Order["orderStatus"]) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: updated.orderStatus } : o))
      );
      toast.success(`Order updated to "${status}"`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Orders Management</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Update</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id.slice(-8).toUpperCase()}</TableCell>
                  <TableCell>{order.user?.name || "N/A"}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="font-bold text-primary">₹{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "Paid" ? "default" : "destructive"}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-[200px]">
                      <OrderStatusTracker currentStatus={order.orderStatus} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.orderStatus}
                      onValueChange={(v) => updateStatus(order._id, v as Order["orderStatus"])}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setViewOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View order modal */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details — {viewOrder?._id.slice(-8).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer</span>
                  <p className="font-medium">{viewOrder.user?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{formatDate(viewOrder.createdAt)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total</span>
                  <p className="font-bold text-primary">₹{viewOrder.total}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Payment</span>
                  <p>
                    <Badge variant={viewOrder.paymentStatus === "Paid" ? "default" : "destructive"}>
                      {viewOrder.paymentStatus}
                    </Badge>
                  </p>
                </div>
              </div>
              {viewOrder.items.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Items</span>
                  <div className="mt-1 space-y-1">
                    {viewOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <OrderStatusTracker currentStatus={viewOrder.orderStatus} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
