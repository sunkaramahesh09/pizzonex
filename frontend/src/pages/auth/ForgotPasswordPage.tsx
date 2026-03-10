import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pizza, ArrowLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSubmitting(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-2">
            {sent ? <Mail className="h-8 w-8 text-primary-foreground" /> : <Pizza className="h-8 w-8 text-primary-foreground" />}
          </div>
          <CardTitle className="text-2xl font-display">
            {sent ? "Email Sent!" : "Forgot Password"}
          </CardTitle>
          <CardDescription>
            {sent
              ? `We've sent a reset link to ${email}`
              : "Enter your email and we'll send you a reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <Button asChild className="w-full" variant="outline">
              <Link to="/login"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Login</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
