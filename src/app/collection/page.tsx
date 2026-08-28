import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { products } from "@/lib/products";

export default function CollectionPage() {
  return (
    <main className="inner-page">
      <header className="inner-header"><Link className="wordmark" href="/">AEQUO<span>.</span></Link><nav><Link href="/collection">Collection</Link><Link href="/#craft">Craft</Link><Link href="/#bespoke">Bespoke</Link><Link href="/#contact">Contact</Link></nav><Link className="header-consult" href="/#contact">Consult an advisor</Link></header>
      <section className="collection-intro"><p className="eyebrow gold">AEQUO / COLLECTION 01</p><h1>The edit</h1><p>A study in line, material and movement. Each silhouette is made in limited numbers, and available by private consultation.</p></section>
      <div className="collection-toolbar"><span>{products.length} objects</span><div><button className="filter-active">All</button><button>Pumps</button><button>Loafers</button><button>Boots</button></div><span>Sort / Featured</span></div>
      <section className="collection-grid">{products.map((product) => <Link href={`/collection/${product.slug}`} className="product-card" key={product.slug}><div className="product-image-wrap"><img src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><span className="product-arrow"><ArrowUpRight size={18} /></span></div><div className="product-meta"><div><h3>{product.name}</h3><p>{product.material}</p></div><strong>{product.price}</strong></div></Link>)}</section>
      <div className="collection-appointment"><p className="eyebrow gold">PRIVATE ACCESS</p><h2>For a closer look.</h2><p>Speak with an AEQUO advisor about availability, fit and private appointments.</p><Link className="text-link" href="/#contact">Contact the atelier <ArrowRight size={16} /></Link></div>
    </main>
  );
}
