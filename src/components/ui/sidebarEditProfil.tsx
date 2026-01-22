"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, Lock, LogOut } from "lucide-react";

type SidebarEditProfileProps = {
  active?: "info" | "password";
  onLogout?: () => void;
};

export default function SidebarEditProfile({
  active = "info",
  onLogout,
}: SidebarEditProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="flex items-center justify-between lg:hidden">
        {/* menu icon */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setOpen(!open)}>
            <Menu size={18} />
          </Button>

          {/* dropdown */}
          {open && (
            <div className="absolute left-0 z-20 mt-2 w-48 rounded-xl border bg-background p-2 shadow">
              <Button
                variant={active === "info" ? "default" : "ghost"}
                size="sm"
                className="mb-2 w-full justify-start gap-2">
                <User size={16} />
                Informasi Akun
              </Button>

              <Button
                variant={active === "password" ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2">
                <Lock size={16} />
                Ubah Password
              </Button>
            </div>
          )}
        </div>

        {/* logout right */}
        <Button
          onClick={onLogout}
          size="sm"
          className="
            grid grid-cols-[auto_1fr]
            items-center gap-2
            px-3 py-1.5
            text-sm
            border border-red-200
            bg-red-600
            hover:bg-red-50
            text-white
            hover:text-red-600
            ">
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>

      {/* ===== DESKTOP ===== */}
      <aside className="hidden lg:block">
        <Button
          variant={active === "info" ? "default" : "outline"}
          className="mb-3 w-full">
          Informasi Akun
        </Button>

        <Button
          variant={active === "password" ? "default" : "outline"}
          className="mb-3 w-full">
          Pengaturan Password
        </Button>

        <Button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600">
          Logout
        </Button>
      </aside>
    </>
  );
}
