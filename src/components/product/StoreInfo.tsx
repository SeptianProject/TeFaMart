"use client";

import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, GraduationCap, MapPin, MessageCircle } from "lucide-react";
import Link from "next/link";

interface StoreInfoProps {
  product: Product;
}

export function StoreInfo({ product }: StoreInfoProps) {
  if (!product.tefa) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {product.tefa.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>{product.tefa.major}</span>
          </div>
          {product.tefa.campus && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{product.tefa.campus.name}</span>
            </div>
          )}
        </div>
        <Badge variant="secondary">
          <Building2 className="w-3 h-3 mr-1" />
          TEFA
        </Badge>
      </div>

      {product.tefa.description && (
        <p className="text-sm text-gray-600 line-clamp-3">
          {product.tefa.description}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/detailStore(pProduk)/${product.tefa.campusId}`}>
            <Building2 className="w-4 h-4 mr-2" />
            Kunjungi Toko
          </Link>
        </Button>
        <Button variant="outline" size="icon">
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
