export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortSummary: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  volumeMl: number | null;
  isVisible: boolean;
  isFeatured: boolean;
  images: string[];
  scentNotes: string[];
  categoryId: string | null;
  category?: { id: string; name: string; slug: string } | null;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};
