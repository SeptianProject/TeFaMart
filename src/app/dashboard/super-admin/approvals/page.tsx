"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Clock, Building2, School } from "lucide-react";
import { useAlert } from "@/hooks/useAlert";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  campus?: { id: string; name: string } | null;
  industry?: { id: string; name: string } | null;
}

export default function UserApprovalsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">(
    "PENDING",
  );
  const { showError, showSuccess, AlertComponent } = useAlert();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/super-admin/user-approvals?status=${filter}`,
      );
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        showError(data.error || "Gagal mengambil data");
      }
    } catch {
      showError("Terjadi kesalahan saat mengambil data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleAction = async (
    userId: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    try {
      const response = await fetch("/api/super-admin/user-approvals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, action }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess(
          `User berhasil ${action === "APPROVED" ? "disetujui" : "ditolak"}`,
        );
        fetchUsers(); // Refresh list
      } else {
        showError(data.error || "Gagal mengupdate status");
      }
    } catch {
      showError("Terjadi kesalahan saat mengupdate status");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "INDUSTRI":
        return "Mitra Industri";
      case "ADMIN":
        return "Admin Campus";
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "INDUSTRI":
        return "default";
      case "ADMIN":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <AlertComponent />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Persetujuan User</h1>
          <p className="text-muted-foreground">
            Kelola persetujuan untuk user Industri dan Admin Campus
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={filter === "PENDING" ? "default" : "outline"}
          onClick={() => setFilter("PENDING")}
          className="gap-2">
          <Clock className="h-4 w-4" />
          Menunggu Persetujuan
        </Button>
        <Button
          variant={filter === "APPROVED" ? "default" : "outline"}
          onClick={() => setFilter("APPROVED")}
          className="gap-2">
          <Check className="h-4 w-4" />
          Disetujui
        </Button>
        <Button
          variant={filter === "REJECTED" ? "default" : "outline"}
          onClick={() => setFilter("REJECTED")}
          className="gap-2">
          <X className="h-4 w-4" />
          Ditolak
        </Button>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "PENDING"
              ? "User Menunggu Persetujuan"
              : filter === "APPROVED"
                ? "User yang Disetujui"
                : "User yang Ditolak"}
          </CardTitle>
          <CardDescription>{users.length} user ditemukan</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                Tidak ada user{" "}
                {filter === "PENDING"
                  ? "yang menunggu persetujuan"
                  : filter === "APPROVED"
                    ? "yang disetujui"
                    : "yang ditolak"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organisasi</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  {filter === "PENDING" && <TableHead>Aksi</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getRoleBadgeVariant(user.role) as
                            | "default"
                            | "secondary"
                            | "outline"
                        }>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.role === "INDUSTRI" && user.industry ? (
                          <>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{user.industry.name}</span>
                          </>
                        ) : user.role === "ADMIN" && user.campus ? (
                          <>
                            <School className="h-4 w-4 text-muted-foreground" />
                            <span>{user.campus.name}</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    {filter === "PENDING" && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAction(user.id, "APPROVED")}
                            className="gap-1">
                            <Check className="h-4 w-4" />
                            Setuju
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(user.id, "REJECTED")}
                            className="gap-1">
                            <X className="h-4 w-4" />
                            Tolak
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
