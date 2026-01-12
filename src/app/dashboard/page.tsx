"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Role } from "@/types";
import loading from "./loading";

export default function DashboardPage() {
     const { data: session, status } = useSession();
     const router = useRouter();

     useEffect(() => {
          if (status === "loading") return;

          if (!session) {
               router.push("/auth/login");
               return;
          }

          switch (session.user?.role) {
               case Role.SUPER_ADMIN:
                    router.push("/dashboard/super-admin");
                    break;
               case Role.ADMIN:
                    router.push("/dashboard/admin");
                    break;
               case Role.CLIENT:
                    router.push("/");
                    break;
               default:
                    router.push("/auth/login");
          }
     }, [session, status, router]);

     return (
          <Suspense fallback={loading()}>
               <div>

               </div>
          </Suspense>
     );
}