import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function EmailVerificationPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    api
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const success = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-background">
      <Card className="w-full max-w-md shadow-2xl text-center">
        <CardHeader className="space-y-2">
          <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-2 ${success ? "bg-success" : "bg-destructive"}`}>
            {success ? <CheckCircle2 className="h-8 w-8 text-success-foreground" /> : <XCircle className="h-8 w-8 text-destructive-foreground" />}
          </div>
          <CardTitle className="text-2xl font-display">
            {success ? "Email Verified!" : "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {success
              ? "Your email has been verified. You can now sign in."
              : "The verification link is invalid or has expired."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/login">{success ? "Sign In" : "Try Again"}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
