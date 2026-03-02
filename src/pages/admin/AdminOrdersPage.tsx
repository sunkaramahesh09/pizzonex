import { useState } from "react";
import { mockOrders, Order } from "@/data/mockData";
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
import { Eye } from "lucide-react";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import { toast } from "sonner";

const statusOptions: Order["orderStatus"][] = [
  "Order Received",
  "In Kitchen",
  "Sent to Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const updateStatus = (orderId: string, status: Order["orderStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    toast.success(`Order ${orderId} updated to "${status}"`);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Orders Management</h1>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
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
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
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
                      onValueChange={(v) => updateStatus(order.id, v as Order["orderStatus"])}
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
            <DialogTitle>Order Details — {viewOrder?.id}</DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date</span>
                  <p className="font-medium">{viewOrder.date}</p>
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
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p className="font-medium">{viewOrder.orderStatus}</p>
                </div>
              </div>
              <OrderStatusTracker currentStatus={viewOrder.orderStatus} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
