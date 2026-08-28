import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { products } from "@/lib/products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return (
    <main className="inner-page product-detail-page">
      <header className="inner-header"><Link className="wordmark" href="/">AEQUO<span>.</span></Link><nav><Link href="/collection">Collection</Link><Link href="/#craft">Craft</Link><Link href="/#bespoke">Bespoke</Link><Link href="/#contact">Contact</Link></nav><Link className="header-consult" href="/#contact">Consult an advisor</Link></header>
      <div className="detail-back"><Link href="/collection"><ArrowLeft size={15} /> Back to collection</Link></div>
      <section className="detail-layout"><div className="detail-gallery"><div className="detail-main-image"><img src={product.detailImage} alt={product.name} /></div><div className="detail-note"><span>AEQUO / 01</span><span>Handmade in Italy</span><span>Worldwide delivery</span></div></div><div className="detail-info"><p className="eyebrow gold">{product.tag} · {product.category}</p><h1>{product.name}</h1><p className="detail-cn">{product.cn}</p><div className="detail-price">{product.price}</div><p className="detail-description">{product.description}</p><div className="detail-specs"><div><span>Material</span><strong>{product.material}</strong></div><div><span>Availability</span><strong>By consultation</strong></div><div><span>Production</span><strong>4–6 weeks</strong></div></div><Link className="button button-gold detail-button" href="/#contact">Speak with an advisor <MessageCircle size={16} /></Link><p className="detail-footnote">No online checkout. Every AEQUO piece is reserved through our atelier.</p></div></section>
      <section className="detail-story"><p className="eyebrow gold">THE OBJECT</p><h2>Every line<br /><em>has a reason.</em></h2><Link className="text-link" href="/#craft">Read the craft story <ArrowRight size={16} /></Link></section>
    </main>
  );
}
