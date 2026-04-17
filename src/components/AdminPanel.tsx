"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type Product = {
  id: number;
  category_id: number;
  category_slug: string;
  name: string;
  description: string;
  price_inr: number;
  image_url: string | null;
  available_sizes: string[];
  is_active: boolean;
};

type ProductForm = {
  category_id: number;
  name: string;
  description: string;
  price_inr: string;
  image_url: string;
  available_sizes: string[];
  is_active: boolean;
};

type Status = { type: "success" | "error"; message: string } | null;
type ProductCategory = "tshirt-prints" | "cute-toys-stuff";

export function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProductCategory>("tshirt-prints");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productForm, setProductForm] = useState<ProductForm>({
    category_id: 1,
    name: "",
    description: "",
    price_inr: "",
    image_url: "",
    available_sizes: ["M", "L", "XL"],
    is_active: true,
  });
  const [productStatus, setProductStatus] = useState<Status>(null);
  const [uploadingNewImage, setUploadingNewImage] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ProductForm | null>(null);
  const [editingStatus, setEditingStatus] = useState<Status>(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  useEffect(() => {
    refreshProducts().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setProductForm((prev) => ({
      ...prev,
      category_id: getCategoryIdFromSlug(activeTab),
      available_sizes: activeTab === "tshirt-prints" ? prev.available_sizes : [],
    }));
  }, [activeTab]);

  async function refreshProducts() {
    setProductsLoading(true);
    try {
      const refresh = await fetch("/api/products?includeInactive=true");
      const data = await refresh.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setProductsLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    setProductStatus(null);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...productForm,
        price_inr: Number(productForm.price_inr),
        available_sizes:
          productForm.category_id === 1 ? productForm.available_sizes : [],
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setProductStatus({
        type: "error",
        message: data.error || "Failed to add product",
      });
      return;
    }
    setProductForm({
      category_id: 1,
      name: "",
      description: "",
      price_inr: "",
      image_url: "",
      available_sizes: ["M", "L", "XL"],
      is_active: true,
    });
    setProductStatus({ type: "success", message: "Product added successfully." });
    await refreshProducts();
  }

  function startEdit(product: Product) {
    setEditingStatus(null);
    setEditingProductId(product.id);
    setEditForm({
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      price_inr: String(product.price_inr),
      image_url: product.image_url ?? "",
      available_sizes: product.available_sizes ?? [],
      is_active: product.is_active,
    });
  }

  function cancelEdit() {
    setEditingProductId(null);
    setEditForm(null);
    setEditingStatus(null);
  }

  async function saveEdit(productId: number) {
    if (!editForm) return;
    setEditingStatus(null);
    const res = await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        price_inr: Number(editForm.price_inr),
        available_sizes: editForm.category_id === 1 ? editForm.available_sizes : [],
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditingStatus({
        type: "error",
        message: data.error || "Failed to update product",
      });
      return;
    }
    setEditingStatus({ type: "success", message: "Product updated." });
    await refreshProducts();
    cancelEdit();
  }

  async function deleteProduct(productId: number) {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;
    const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    if (!res.ok) {
      setProductStatus({ type: "error", message: "Failed to delete product." });
      return;
    }
    setProductStatus({ type: "success", message: "Product deleted." });
    await refreshProducts();
  }

  async function uploadProductImage(file: File, target: "new" | "edit") {
    const formData = new FormData();
    formData.append("file", file);

    if (target === "new") setUploadingNewImage(true);
    else setUploadingEditImage(true);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error || "Failed to upload image";
        if (target === "new") setProductStatus({ type: "error", message: msg });
        else setEditingStatus({ type: "error", message: msg });
        return;
      }

      if (target === "new") {
        setProductForm((s) => ({ ...s, image_url: data.url || "" }));
        setProductStatus({ type: "success", message: "Image uploaded." });
      } else {
        setEditForm((s) => (s ? { ...s, image_url: data.url || "" } : s));
        setEditingStatus({ type: "success", message: "Image uploaded." });
      }
    } finally {
      if (target === "new") setUploadingNewImage(false);
      else setUploadingEditImage(false);
    }
  }

  function productsByCategory(category: ProductCategory): Product[] {
    return products.filter((p) => p.category_slug === category);
  }

  function getCategoryIdFromSlug(category: ProductCategory): number {
    return category === "tshirt-prints" ? 1 : 2;
  }

  function getCategoryLabel(category: ProductCategory): string {
    return category === "tshirt-prints" ? "T-Shirts" : "Cute Toys & Stuff";
  }

  const activeProducts = productsByCategory(activeTab);

  if (loading) {
    return <div className="text-stone-500 text-sm">Loading products…</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-stone-800">Product Admin</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <TabButton
            label="T-Shirts"
            active={activeTab === "tshirt-prints"}
            onClick={() => setActiveTab("tshirt-prints")}
          />
          <TabButton
            label="Cute Stuff"
            active={activeTab === "cute-toys-stuff"}
            onClick={() => setActiveTab("cute-toys-stuff")}
          />
        </div>

        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          Add in {getCategoryLabel(activeTab)}
        </h3>
        <form onSubmit={handleCreateProduct} className="space-y-4">
          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-center">
            <span className="text-sm font-medium text-stone-700">
              {uploadingNewImage ? "Uploading image..." : "Tap to Upload Big Product Image"}
            </span>
            <span className="mt-1 text-xs text-stone-500">JPG, PNG, WEBP, GIF</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadProductImage(file, "new");
                e.currentTarget.value = "";
              }}
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              value={productForm.name}
              onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Product Name"
              className="rounded-lg border border-stone-300 px-3 py-2"
              required
            />
            <input
              value={productForm.price_inr}
              onChange={(e) => setProductForm((s) => ({ ...s, price_inr: e.target.value }))}
              placeholder="Price"
              className="rounded-lg border border-stone-300 px-3 py-2"
              required
            />
            <input
              value={productForm.image_url}
              onChange={(e) => setProductForm((s) => ({ ...s, image_url: e.target.value }))}
              placeholder="Image URL (optional)"
              className="rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2"
            />
            <input
              value={productForm.description}
              onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Description"
              className="rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2"
            />
          </div>

          {activeTab === "tshirt-prints" && (
            <div>
              <p className="mb-2 text-sm font-medium text-stone-700">Available sizes</p>
              <div className="flex flex-wrap gap-2">
                {TSHIRT_SIZES.map((size) => {
                  const selected = productForm.available_sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setProductForm((s) => ({
                          ...s,
                          available_sizes: selected
                            ? s.available_sizes.filter((item) => item !== size)
                            : [...s.available_sizes, size],
                        }))
                      }
                      className={`rounded-md border px-2 py-1 text-xs ${
                        selected
                          ? "border-[var(--avo-green)] bg-[var(--avo-green)] text-white"
                          : "border-stone-300 bg-white text-stone-700"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <label className="inline-flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={productForm.is_active}
              onChange={(e) => setProductForm((s) => ({ ...s, is_active: e.target.checked }))}
            />
            Show on website
          </label>

          {productStatus && (
            <p
              className={`text-sm ${
                productStatus.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {productStatus.message}
            </p>
          )}
          <button className="w-full rounded-lg bg-[var(--avo-green)] px-4 py-2.5 font-medium text-white">
            Add Product
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          {getCategoryLabel(activeTab)} Products
        </h3>
        {productsLoading ? (
          <p className="text-sm text-stone-500">Loading...</p>
        ) : activeProducts.length === 0 ? (
          <p className="text-sm text-stone-500">No products yet.</p>
        ) : (
          <div className="space-y-3">
            {activeProducts.map((p) => (
              <div key={p.id} className="rounded-lg border border-stone-200 p-3 text-sm">
                {editingProductId === p.id && editForm ? (
                  <div className="space-y-3">
                    <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 bg-stone-50 text-center">
                      <span className="text-sm text-stone-700">
                        {uploadingEditImage ? "Uploading..." : "Upload image"}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadProductImage(file, "edit");
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((s) => (s ? { ...s, name: e.target.value } : s))
                        }
                        className="rounded-lg border border-stone-300 px-3 py-2"
                        placeholder="Name"
                      />
                      <input
                        value={editForm.price_inr}
                        onChange={(e) =>
                          setEditForm((s) => (s ? { ...s, price_inr: e.target.value } : s))
                        }
                        className="rounded-lg border border-stone-300 px-3 py-2"
                        placeholder="Price"
                      />
                      <input
                        value={editForm.image_url}
                        onChange={(e) =>
                          setEditForm((s) => (s ? { ...s, image_url: e.target.value } : s))
                        }
                        className="rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2"
                        placeholder="Image URL"
                      />
                      <input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((s) => (s ? { ...s, description: e.target.value } : s))
                        }
                        className="rounded-lg border border-stone-300 px-3 py-2 sm:col-span-2"
                        placeholder="Description"
                      />
                    </div>
                    {activeTab === "tshirt-prints" && (
                      <div>
                        <p className="mb-1 text-sm font-medium text-stone-700">Sizes</p>
                        <div className="flex flex-wrap gap-2">
                          {TSHIRT_SIZES.map((size) => {
                            const selected = editForm.available_sizes.includes(size);
                            return (
                              <button
                                key={`${p.id}-${size}`}
                                type="button"
                                onClick={() =>
                                  setEditForm((s) =>
                                    s
                                      ? {
                                          ...s,
                                          available_sizes: selected
                                            ? s.available_sizes.filter((item) => item !== size)
                                            : [...s.available_sizes, size],
                                        }
                                      : s
                                  )
                                }
                                className={`rounded-md border px-2 py-1 text-xs ${
                                  selected
                                    ? "border-[var(--avo-green)] bg-[var(--avo-green)] text-white"
                                    : "border-stone-300 bg-white text-stone-700"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.is_active}
                        onChange={(e) =>
                          setEditForm((s) => (s ? { ...s, is_active: e.target.checked } : s))
                        }
                      />
                      Show on website
                    </label>
                    {editingStatus && (
                      <p
                        className={`text-sm ${
                          editingStatus.type === "success" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {editingStatus.message}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(p.id)}
                        className="rounded-lg bg-[var(--avo-green)] px-3 py-2 text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="rounded-lg border border-stone-300 px-3 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{p.name}</p>
                      <p className="truncate text-stone-500">₹{p.price_inr}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          p.is_active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {p.is_active ? "Live" : "Hidden"}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded border border-stone-300 px-2 py-1 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-[var(--avo-green)] text-white"
          : "border border-stone-300 bg-white text-stone-700"
      }`}
    >
      {label}
    </button>
  );
}
