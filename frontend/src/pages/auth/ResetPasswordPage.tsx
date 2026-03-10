import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pizza, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    setSubmitting(true);
    try {
      await api.resetPassword(token, password);
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-2">
            <Pizza className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary font-medium hover:underline">Back to Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
