import { createClient } from "@supabase/supabase-js";
import { products as fallbackProducts, type Product } from "@/lib/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const cmsConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = cmsConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export type CmsProduct = Product & {
  id?: string;
  published: boolean;
  sort_order: number;
};

export type SiteSettings = {
  id: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  appointment_text: string;
};

export const fallbackCmsProducts: CmsProduct[] = fallbackProducts.map((product, index) => ({
  ...product,
  published: true,
  sort_order: index,
}));

export const fallbackSettings: SiteSettings = {
  id: "default",
  email: "atelier@aequo.studio",
  whatsapp: "+390000000000",
  instagram: "https://instagram.com",
  facebook: "",
  appointment_text: "Private appointments are available by consultation.",
};

export function normalizeCmsProduct(row: Record<string, unknown>): CmsProduct {
  const name = String(row.name || "Untitled product");
  const slug = String(row.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  const priceValue = row.price === null || row.price === undefined ? "" : String(row.price);
  return {
    id: row.id ? String(row.id) : undefined,
    slug,
    name,
    cn: String(row.cn || name),
    price: priceValue.startsWith("$") ? priceValue : `$${Number(priceValue || 0).toLocaleString("en-US")}`,
    tag: String(row.tag || row.badge || ""),
    category: String(row.category || "Collection"),
    material: String(row.material || row.sub || ""),
    description: String(row.description || ""),
    image: String(row.image || ""),
    detailImage: String(row.detail_image || row.image || ""),
    published: row.published === undefined ? row.status !== "draft" : Boolean(row.published),
    sort_order: Number(row.sort_order || 0),
  };
}

export async function fetchPublishedProducts(): Promise<CmsProduct[]> {
  if (!supabase) return fallbackCmsProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return fallbackCmsProducts;
  return data.map((row) => normalizeCmsProduct(row));
}

export async function fetchSettings(): Promise<SiteSettings> {
  if (!supabase) return fallbackSettings;
  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  return (data as SiteSettings | null) || fallbackSettings;
}
