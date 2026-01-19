import DashboardLayout, { MenuItem } from "@/components/DashboardLayout";
import { Role } from "@/types";
import {
  LayoutDashboard,
  GraduationCap,
  Package,
  FileText,
} from "lucide-react";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
  },
  {
    name: "Kelola TEFA",
    href: "/dashboard/admin/tefa",
    icon: <GraduationCap className="mr-3 h-5 w-5" />,
  },
  {
    name: "Kelola Product",
    href: "/dashboard/admin/products",
    icon: <Package className="mr-3 h-5 w-5" />,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardLayout
      title="Admin Kampus"
      mobileTitle="Admin Dashboard"
      menuItems={menuItems}
      allowedRole={Role.ADMIN}>
      {children}
    </DashboardLayout>
  );
}
