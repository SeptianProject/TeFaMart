export interface CreateAuctionInput {
  productId: string;
  startPrice: number;
  startTime: Date;
  endTime: Date;
  status?: string;
}

export interface UpdateAuctionInput {
  startPrice?: number;
  currentBid?: number;
  startTime?: Date;
  endTime?: Date;
  status?: string;
}
