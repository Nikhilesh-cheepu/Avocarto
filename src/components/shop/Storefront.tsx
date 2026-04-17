"use client";

import { useMemo, useState } from "react";

type Props = {
  products: Product[];
};

type Product = {
  id: number;
  category_id: number;
  category_slug: string;
  category_name: string;
  name: string;
  description: string;
  price_inr: number;
  image_url: string | null;
  available_sizes: string[];
  is_active: boolean;
  created_at: Date;
};

type CartItem = { product: Product; qty: number };
type ShirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

const WHATSAPP_NUMBER = "919703271632";
const SHIRT_SIZES: ShirtSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

function isShirtSize(value: string): value is ShirtSize {
  return SHIRT_SIZES.includes(value as ShirtSize);
}

function formatInr(priceInr: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(priceInr);
}

export function Storefront({ products }: Props) {
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<number, ShirtSize>>({});

  const grouped = useMemo(() => {
    return {
      tshirt: products.filter((p) => p.category_slug === "tshirt-prints"),
      cute: products.filter((p) => p.category_slug === "cute-toys-stuff"),
    };
  }, [products]);

  const items = Object.values(cart);
  const total = items.reduce((sum, i) => sum + i.product.price_inr * i.qty, 0);

  function addToCart(product: Product) {
    if (product.category_slug === "tshirt-prints" && !selectedSizes[product.id]) {
      return;
    }
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: { product, qty: existing ? existing.qty + 1 : 1 },
      };
    });
  }

  const message = encodeURIComponent(
    [
      "Hi Avacarto! I want to place this order:",
      ...items.map(
        (i) => {
          const size = selectedSizes[i.product.id];
          const sizePart =
            i.product.category_slug === "tshirt-prints" && size ? ` (Size: ${size})` : "";
          return `- ${i.product.name}${sizePart} x${i.qty} = ${formatInr(
            i.qty * i.product.price_inr
          )}`;
        }
      ),
      `Total: ${formatInr(total)}`,
      "",
      "Please confirm availability and next steps.",
    ].join("\n")
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
      <section className="mt-1">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Launch T-Shirts</h2>
          <span className="text-xs text-[var(--foreground-muted)]">Swipe →</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {(grouped.tshirt.length > 0
            ? grouped.tshirt
            : getPlaceholders("tshirt-prints", 4)
          ).map((p, index) => (
            <article
              key={`tshirt-${p.id}-${index}`}
              className="min-w-[78%] overflow-hidden rounded-xl border border-[var(--card-border)] bg-white shadow-[var(--shadow-soft)] sm:min-w-[320px]"
            >
              <div className="aspect-square bg-[var(--avo-green-pale)]">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">👕</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
                <p className="line-clamp-1 text-xs text-[var(--foreground-muted)]">
                  {p.description || "Fresh design coming soon."}
                </p>
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-medium text-[var(--foreground-muted)]">
                    Select Size
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      p.available_sizes.length > 0
                        ? p.available_sizes.filter(isShirtSize)
                        : SHIRT_SIZES
                    ).map((size) => (
                      <button
                        key={`${p.id}-${size}`}
                        type="button"
                        onClick={() =>
                          setSelectedSizes((prev) => ({
                            ...prev,
                            [p.id]: size,
                          }))
                        }
                        className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                          selectedSizes[p.id] === size
                            ? "border-[var(--avo-green)] bg-[var(--avo-green)] text-white"
                            : "border-[var(--card-border)] bg-white text-[var(--foreground)]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">{formatInr(p.price_inr)}</span>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={!p.id || !selectedSizes[p.id]}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
                      !p.id || !selectedSizes[p.id]
                        ? "bg-stone-400"
                        : "bg-[var(--avo-green)]"
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProductSection
        title="Cute Toys & Stuff"
        products={grouped.cute}
        onAdd={addToCart}
        emptyIcon="🧸"
        emptyCategory="cute-toys-stuff"
      />

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--card-border)] bg-white/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{items.length} items</p>
            <p className="text-xs text-[var(--foreground-muted)]">{formatInr(total)}</p>
          </div>
          <a
            href={items.length ? `https://wa.me/${WHATSAPP_NUMBER}?text=${message}` : "#"}
            target="_blank"
            rel="noreferrer"
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${items.length ? "bg-[var(--avo-green)]" : "bg-stone-400 pointer-events-none"}`}
          >
            Checkout on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductSection({
  title,
  products,
  onAdd,
  emptyIcon,
  emptyCategory,
}: {
  title: string;
  products: Product[];
  onAdd: (p: Product) => void;
  emptyIcon: string;
  emptyCategory: Product["category_slug"];
}) {
  const items = products.length > 0 ? products : getPlaceholders(emptyCategory, 4);
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, index) => (
          <article key={`${p.id}-${index}`} className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-white shadow-[var(--shadow-soft)]">
            <div className="aspect-square bg-[var(--avo-green-pale)]">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl">{emptyIcon}</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="line-clamp-1 text-sm font-semibold">{p.name}</h3>
              <p className="line-clamp-1 text-xs text-[var(--foreground-muted)]">
                {p.description || "New item coming soon."}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{formatInr(p.price_inr)}</span>
                <button
                  onClick={() => onAdd(p)}
                  disabled={!p.id}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium text-white ${
                    !p.id ? "bg-stone-400" : "bg-[var(--avo-green)]"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getPlaceholders(categorySlug: Product["category_slug"], count: number): Product[] {
  return Array.from({ length: count }).map((_, index) => ({
    id: 0,
    category_id: 0,
    category_slug: categorySlug,
    category_name: categorySlug,
    name: "Coming Soon",
    description: "More styles arriving soon",
    price_inr: 0,
    image_url: null,
    available_sizes: SHIRT_SIZES,
    is_active: false,
    created_at: new Date(),
  }));
}
