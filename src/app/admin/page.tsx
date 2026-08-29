"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ImagePlus, LogOut, Plus, Save, Settings, Trash2, Upload, X } from "lucide-react";
import { cmsConfigured, fallbackSettings, normalizeCmsProduct, supabase, type CmsProduct, type SiteSettings } from "@/lib/cms";

const emptyProduct: CmsProduct = {
  slug: "", name: "", cn: "", price: "", tag: "", category: "Pumps", material: "", description: "", image: "", detailImage: "", published: true, sort_order: 0,
};

export default function AdminPage() {
  const [sessionReady, setSessionReady] = useState(!supabase);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => { setLoggedIn(Boolean(data.session)); setSessionReady(true); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setLoggedIn(Boolean(nextSession)));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function submitAuth(event: FormEvent) {
    event.preventDefault(); setMessage("");
    if (!supabase) return;
    const result = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) setMessage(result.error.message);
    else if (authMode === "signup") { setPendingEmail(email); setMessage("注册成功。请检查邮箱和垃圾邮件，点击 AEQUO 验证邮件后再登录。"); }
    else setMessage("登录成功。");
  }

  async function resendConfirmation() {
    if (!supabase || !pendingEmail) return;
    const result = await supabase.auth.resend({ type: "signup", email: pendingEmail });
    setMessage(result.error ? `邮件发送失败：${result.error.message}` : "验证邮件已重新发送，请检查收件箱和垃圾邮件。");
  }

  if (!sessionReady) return <AdminShell><div className="admin-loading">Loading atelier…</div></AdminShell>;
  if (!cmsConfigured) return <AdminShell><div className="admin-empty"><p className="admin-kicker">AEQUO ADMIN</p><h1>Connect your atelier.</h1><p>Add the two Supabase public values to the GitHub repository secrets, then redeploy the site. The setup file is ready in <code>supabase-schema.sql</code>.</p></div></AdminShell>;
  if (!loggedIn) return <AdminShell><form className="auth-panel" onSubmit={submitAuth}><p className="admin-kicker">AEQUO PRIVATE</p><h1>{authMode === "login" ? "Welcome back." : "Create access."}</h1><div className="auth-tabs"><button type="button" className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setMessage(""); }}>Sign in</button><button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => { setAuthMode("signup"); setMessage(""); }}>Create account</button></div><label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required /></label><label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} required /></label>{message && <p className="admin-message">{message}</p>}<button className="admin-primary auth-submit" type="submit">{authMode === "login" ? "Sign in" : "Create account"}</button>{pendingEmail && authMode === "signup" && <button className="admin-text-button resend-button" type="button" onClick={resendConfirmation}>Resend verification email</button>}</form></AdminShell>;
  return <Dashboard onSignOut={() => supabase?.auth.signOut()} />;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <main className="admin-page"><header className="admin-header"><Link className="wordmark" href="/">AEQUO<span>.</span></Link><span>CONTENT ATELIER</span><Link href="/">View site ↗</Link></header>{children}</main>;
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [products, setProducts] = useState<CmsProduct[]>([]);
  const [editing, setEditing] = useState<CmsProduct | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!supabase) return;
    Promise.all([supabase.from("products").select("*").order("sort_order"), supabase.from("site_settings").select("*").eq("id", "default").maybeSingle()]).then(([productResult, settingsResult]) => {
      if (productResult.data) setProducts(productResult.data.map((row) => normalizeCmsProduct(row)));
      if (settingsResult.data) setSettings(settingsResult.data as SiteSettings);
    });
  }, []);
  async function removeProduct(id?: string) {
    if (!supabase || !id || !window.confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    setNotice(error ? error.message : "Product deleted."); if (!error) setProducts(products.filter((product) => product.id !== id));
  }
  async function toggleProduct(product: CmsProduct) {
    if (!supabase || !product.id) return;
    const { error } = await supabase.from("products").update({ published: !product.published }).eq("id", product.id);
    if (!error) setProducts(products.map((item) => item.id === product.id ? { ...item, published: !item.published } : item));
  }
  async function saveSettings(event: FormEvent) {
    event.preventDefault(); if (!supabase) return;
    const { error } = await supabase.from("site_settings").upsert(settings);
    setNotice(error ? error.message : "Contact information saved.");
  }
  return <AdminShell><div className="admin-layout"><aside className="admin-sidebar"><p className="admin-kicker">CONTROL ROOM</p><button className={tab === "products" ? "active" : ""} onClick={() => setTab("products")}><ImagePlus size={16} /> Products <span>{products.length}</span></button><button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}><Settings size={16} /> Contact information</button><button className="admin-signout" onClick={onSignOut}><LogOut size={16} /> Sign out</button></aside><section className="admin-content">{notice && <div className="admin-notice">{notice}<button onClick={() => setNotice("")}><X size={14} /></button></div>}{tab === "products" ? <><div className="admin-title-row"><div><p className="admin-kicker">COLLECTION / CONTENT</p><h1>Products</h1></div><button className="admin-primary" onClick={() => setEditing({ ...emptyProduct, sort_order: products.length })}><Plus size={16} /> Add product</button></div><div className="admin-product-list">{products.length === 0 ? <div className="admin-empty-row">No products yet. Add the first piece to your collection.</div> : products.map((product) => <article className="admin-product-row" key={product.id}><div className="admin-thumb">{product.image ? <img src={product.image} alt="" /> : <ImagePlus size={18} />}</div><div className="admin-product-name"><strong>{product.name || "Untitled product"}</strong><span>{product.category} · {product.price}</span></div><button className={`status-button ${product.published ? "published" : "draft"}`} onClick={() => toggleProduct(product)}>{product.published ? "Published" : "Draft"}</button><button className="icon-button" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}><Settings size={16} /></button><button className="icon-button danger" onClick={() => removeProduct(product.id)} aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button></article>)}</div></> : <><div className="admin-title-row"><div><p className="admin-kicker">SITE / CONTACT</p><h1>Contact information</h1></div></div><form className="settings-form" onSubmit={saveSettings}><Field label="Email address" value={settings.email} onChange={(value) => setSettings({ ...settings, email: value })} /><Field label="WhatsApp number" value={settings.whatsapp} onChange={(value) => setSettings({ ...settings, whatsapp: value })} /><Field label="Instagram URL" value={settings.instagram} onChange={(value) => setSettings({ ...settings, instagram: value })} /><Field label="Facebook URL" value={settings.facebook} onChange={(value) => setSettings({ ...settings, facebook: value })} /><label>Appointment message<textarea value={settings.appointment_text} onChange={(event) => setSettings({ ...settings, appointment_text: event.target.value })} /></label><button className="admin-primary" type="submit"><Save size={16} /> Save changes</button></form></>}</section></div>{editing && <ProductEditor product={editing} onClose={() => setEditing(null)} onSaved={(saved) => { setProducts((current) => saved.id ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]); setEditing(null); setNotice("Product saved."); }} />}</AdminShell>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label>{label}<input value={value} onChange={(event) => onChange(event.target.value)} /></label>; }

function ProductEditor({ product, onClose, onSaved }: { product: CmsProduct; onClose: () => void; onSaved: (product: CmsProduct) => void }) {
  const [draft, setDraft] = useState(product); const [saving, setSaving] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState("");
  const update = (key: keyof CmsProduct, value: string | boolean | number) => setDraft({ ...draft, [key]: value });
  async function uploadImage(file: File) {
    if (!supabase) return; setUploading(true); setError(""); const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-"); const path = `${crypto.randomUUID()}-${safeName}`; const result = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (result.error) setError(result.error.message); else { const url = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl; update("image", url); if (!draft.detailImage) update("detailImage", url); } setUploading(false);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setSaving(true);
    setError("");
    const numericPrice = Number(draft.price.replace(/[^\d.]/g, "")) || 0;
    let result = await supabase.from("products").upsert({
      id: draft.id || undefined,
      slug: draft.slug,
      name: draft.name,
      cn: draft.cn,
      price: numericPrice,
      tag: draft.tag,
      category: draft.category,
      material: draft.material,
      description: draft.description,
      image: draft.image,
      detail_image: draft.detailImage,
      published: draft.published,
      sort_order: draft.sort_order,
    }).select().single();

    // Keep the editor usable while an older products table is waiting for schema-cache refresh.
    if (result.error && /schema|column|缓存|找不到.*cn|cn.*列/i.test(result.error.message)) {
      result = await supabase.from("products").upsert({
        id: draft.id || undefined,
        name: draft.name,
        sub: draft.material,
        price: draft.price,
        category: draft.category,
        badge: draft.tag,
        image: draft.image,
        description: draft.description,
        details: draft.description,
        status: draft.published ? "published" : "draft",
      }).select().single();
    }

    if (result.error) setError(result.error.message);
    else onSaved(normalizeCmsProduct(result.data));
    setSaving(false);
  }
  return <div className="editor-backdrop"><form className="editor-panel" onSubmit={save}><div className="editor-header"><div><p className="admin-kicker">PRODUCT EDITOR</p><h2>{draft.id ? "Edit product" : "New product"}</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={20} /></button></div><div className="editor-grid"><label>Name<input value={draft.name} onChange={(event) => update("name", event.target.value)} required /></label><label>Slug<input value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="the-new-piece" required /></label><label>Chinese name<input value={draft.cn} onChange={(event) => update("cn", event.target.value)} /></label><label>Price<input value={draft.price} onChange={(event) => update("price", event.target.value)} /></label><label>Category<select value={draft.category} onChange={(event) => update("category", event.target.value)}><option>Pumps</option><option>Loafers</option><option>Boots</option><option>Bespoke</option></select></label><label>Tag<input value={draft.tag} onChange={(event) => update("tag", event.target.value)} placeholder="Limited" /></label><label>Material<input value={draft.material} onChange={(event) => update("material", event.target.value)} /></label><label>Sort order<input value={draft.sort_order} onChange={(event) => update("sort_order", Number(event.target.value))} type="number" /></label></div><label>Description<textarea value={draft.description} onChange={(event) => update("description", event.target.value)} /></label><div className="upload-zone">{draft.image ? <img src={draft.image} alt="Product preview" /> : <ImagePlus size={26} />}<label className="upload-button"><Upload size={16} /> {uploading ? "Uploading…" : "Upload product image"}<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file); }} /></label></div><label className="checkbox-line"><input type="checkbox" checked={draft.published} onChange={(event) => update("published", event.target.checked)} /> Visible on website</label>{error && <p className="admin-error">{error}</p>}<div className="editor-actions"><button type="button" className="admin-secondary" onClick={onClose}>Cancel</button><button className="admin-primary" type="submit" disabled={saving || uploading}><Save size={16} /> {saving ? "Saving…" : "Save product"}</button></div></form></div>;
}
