export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  isAvailable?: string;
  imageUrl?: string;
  category?: string;
  saleType?: string;
  tefaId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  isAvailable?: string;
  imageUrl?: string;
  category?: string;
  saleType?: string;
  tefaId?: string;
}
