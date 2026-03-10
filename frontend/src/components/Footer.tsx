import { Pizza } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Pizza className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold text-primary">Pizzonex</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Freshly baked, delivered hot. Made with ❤️ by Mahesh.
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pizzonex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
