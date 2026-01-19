export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  INDUSTRI = "INDUSTRI",
}

export enum RequestStatus {
  PENDING = "pending",
  SUCCESS = "success",
  CANCELLED = "cancelled",
}

export enum IndustryStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ProductAvailability {
  AVAILABLE = "Tersedia",
  NOT_AVAILABLE = "Tidak Tersedia",
}

export enum SaleType {
  AUCTION = "auction",
  DIRECT = "direct",
}

export enum AuctionStatus {
  COMING_SOON = "coming_soon",
  ACTIVE = "active",
  END = "end",
  CANCELLED = "cancelled",
}

export enum BidStatus {
  ACTIVE = "active",
  ACCEPT = "accept",
  MISSED = "missed",
  CANCELLED = "cancelled",
}
