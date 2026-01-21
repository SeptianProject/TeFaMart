"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StoreProductsPage() {
  const params = useParams();
  const campusId = params.campusId;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Produk Toko</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Halaman produk untuk toko dengan ID: {campusId}
            </p>
            <p className="text-sm text-gray-500">
              Daftar produk akan ditampilkan di sini.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
