import { Outlet } from "react-router-dom";
import UserNavbar from "@/components/UserNavbar";
import Footer from "@/components/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <UserNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
