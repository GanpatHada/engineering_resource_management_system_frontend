import { ManagerNavbar } from "@/components/ManagerNavbar";
import { Outlet } from "react-router-dom";

export function ManagerDashboard() {
  return (
    <div>
      <ManagerNavbar/>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
