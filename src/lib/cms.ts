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

export async function fetchPublishedProducts(): Promise<CmsProduct[]> {
  if (!supabase) return fallbackCmsProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return fallbackCmsProducts;
  return data as CmsProduct[];
}

export async function fetchSettings(): Promise<SiteSettings> {
  if (!supabase) return fallbackSettings;
  const { data } = await supabase.from("site_settings").select("*").eq("id", "default").maybeSingle();
  return (data as SiteSettings | null) || fallbackSettings;
}
