// ==================== CATEGORY INPUT TYPES ====================

export interface CategoryInputCreate {
  name: string;
  slug: string;
}

export interface CategoryInputUpdate {
  name?: string;
  slug?: string;
}

export interface CategoryFilter {
  search?: string;
}
