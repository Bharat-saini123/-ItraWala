import { ProductCard } from "@/components/ProductCard";
import type { ProductDTO } from "@/types";

export function ProductCarousel({ products }: { products: ProductDTO[] }) {
  return (
    <div className="product-carousel" aria-label="Bestselling products">
      <div className="product-carousel-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="product-carousel-group" aria-hidden={copy === 1}>
            {products.map((product) => (
              <div key={`${copy}-${product.id}`} className="product-carousel-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
