import { mockOrders } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

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
                {mockOrders.map((order) => (
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
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-display font-semibold">{order.id}</span>
                <Badge variant={order.paymentStatus === "Paid" ? "default" : "destructive"}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{order.date}</span>
                <span className="font-bold text-primary text-base">₹{order.total}</span>
              </div>
              <OrderStatusTracker currentStatus={order.orderStatus} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
