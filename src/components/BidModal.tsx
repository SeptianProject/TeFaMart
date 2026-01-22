"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/helper/format-currency";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productSlug: string;
  currentBid: number;
  minimumBid: number;
  onBidSuccess: () => void;
}

const BidModal: React.FC<BidModalProps> = ({
  isOpen,
  onClose,
  productName,
  productSlug,
  currentBid,
  minimumBid,
  onBidSuccess,
}) => {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const amount = parseFloat(bidAmount.replace(/\./g, ""));

    if (isNaN(amount) || amount < minimumBid) {
      setError(`Bid minimal ${formatCurrency(minimumBid)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/client/product/${productSlug}/auction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bidAmount: amount }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal melakukan bid");
      }

      onBidSuccess();
      onClose();
      setBidAmount("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBidAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setBidAmount(formatted);
  };

  const quickBidOptions = [
    minimumBid,
    minimumBid + 50000,
    minimumBid + 100000,
    minimumBid + 200000,
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ikuti Lelang</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Bid Tertinggi Saat Ini:
              </span>
              <span className="font-semibold">
                {formatCurrency(currentBid)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bid Minimal:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(minimumBid)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bidAmount">Jumlah Bid Anda (Rp)</Label>
            <Input
              id="bidAmount"
              placeholder="Masukkan jumlah bid"
              value={bidAmount}
              onChange={handleBidAmountChange}
              disabled={isSubmitting}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Bid Cepat:</Label>
            <div className="grid grid-cols-2 gap-2">
              {quickBidOptions.map((amount, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setBidAmount(
                      amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
                    )
                  }
                  disabled={isSubmitting}>
                  {formatCurrency(amount)}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || !bidAmount}>
              {isSubmitting ? "Memproses..." : "Ajukan Bid"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
