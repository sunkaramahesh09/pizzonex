import { Link, useLocation } from "react-router-dom";
import { Pizza, ShoppingCart, LogOut, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/orders", label: "My Orders" },
  { to: "/builder", label: "Build Pizza" },
];

export default function UserNavbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Pizza className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-primary">Pizzonex</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              <Button
                variant={location.pathname === l.to ? "default" : "ghost"}
                size="sm"
              >
                {l.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Profile dropdown */}
          <div className="relative hidden md:block" ref={profileRef}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <User className="h-4 w-4" />
              <span className="max-w-[120px] truncate">{user?.name}</span>
            </Button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-card shadow-lg p-4 space-y-3 z-50">
                <div>
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-2">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
              <Button
                variant={location.pathname === l.to ? "default" : "ghost"}
                className="w-full justify-start"
              >
                {l.label}
              </Button>
            </Link>
          ))}
          {user && (
            <div className="border-t pt-2 mt-2 px-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
            </div>
          )}
          <Button variant="ghost" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
