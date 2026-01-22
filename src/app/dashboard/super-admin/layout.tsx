import DashboardLayout, { MenuItem } from "@/components/DashboardLayout";
import { Role } from "@/types";
import { LayoutDashboard, Users, UserCheck } from "lucide-react";
import { ReactNode } from "react";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Overview",
    href: "/dashboard/super-admin",
    icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
  },
  {
    name: "Kelola User",
    href: "/dashboard/super-admin/users",
    icon: <Users className="mr-3 h-5 w-5" />,
  },
  {
    name: "Persetujuan User",
    href: "/dashboard/super-admin/approvals",
    icon: <UserCheck className="mr-3 h-5 w-5" />,
  },
];

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <DashboardLayout
      title="Super Admin"
      mobileTitle="Super Admin Dashboard"
      menuItems={menuItems}
      allowedRole={Role.SUPER_ADMIN}>
      {children}
    </DashboardLayout>
  );
}
