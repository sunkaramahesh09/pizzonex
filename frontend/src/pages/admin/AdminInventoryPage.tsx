import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Edit, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Ingredient {
  _id: string;
  name: string;
  type: "Base" | "Sauce" | "Cheese" | "Veggie" | "Meat";
  stock: number;
  threshold: number;
}

export default function AdminInventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Ingredient | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Ingredient["type"]>("Base");
  const [newStock, setNewStock] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [editStock, setEditStock] = useState("");

  useEffect(() => {
    api
      .getIngredients()
      .then((data) => setIngredients(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    try {
      const ingredient = await api.createIngredient({
        name: newName,
        type: newType,
        stock: Number(newStock),
        threshold: Number(newThreshold),
      });
      setIngredients((prev) => [...prev, ingredient]);
      setAddOpen(false);
      setNewName("");
      setNewStock("");
      setNewThreshold("");
      toast.success("Ingredient added!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add ingredient");
    }
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      const updated = await api.updateIngredient(editItem._id, { stock: Number(editStock) });
      setIngredients((prev) =>
        prev.map((i) => (i._id === editItem._id ? updated : i))
      );
      setEditItem(null);
      toast.success("Stock updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update stock");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Inventory</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Ingredient</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Ingredient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as Ingredient["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Base", "Sauce", "Cheese", "Veggie", "Meat"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Threshold</Label>
                  <Input type="number" value={newThreshold} onChange={(e) => setNewThreshold(e.target.value)} />
                </div>
              </div>
              <Button className="w-full" onClick={handleAdd}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((item) => {
                const isLow = item.stock < item.threshold;
                return (
                  <TableRow key={item._id} className={isLow ? "bg-destructive/5" : ""}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                    <TableCell className={isLow ? "text-destructive font-bold" : ""}>{item.stock}</TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive">Low Stock</Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditItem(item);
                          setEditStock(String(item.stock));
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit modal */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stock — {editItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleEditSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
