export interface CreateCommentInput {
  content: string;
  rating?: number;
  images?: string[];
  productId: string;
  userId: string;
}
