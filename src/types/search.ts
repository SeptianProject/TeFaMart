// Types for Search functionality

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
  tefa: {
    id: string;
    name: string;
    campus: {
      name: string;
    };
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
};

export type Tefa = {
  id: string;
  name: string;
  major: string;
  description: string | null;
  campus: {
    name: string;
  };
  _count: {
    products: number;
  };
};

export type SearchData = {
  tefas: Tefa[];
  products: Product[];
  categories: Category[];
  suggestions: string[];
  query?: string;
};

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
