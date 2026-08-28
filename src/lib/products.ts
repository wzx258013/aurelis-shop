export type Product = {
  slug: string;
  name: string;
  cn: string;
  price: string;
  tag: string;
  category: string;
  material: string;
  description: string;
  image: string;
  detailImage: string;
};

export const products: Product[] = [
  {
    slug: "the-oblique-pump",
    name: "The Oblique Pump",
    cn: "Oblique 尖头高跟鞋",
    price: "$1,280",
    tag: "Edition 01",
    category: "Pumps",
    material: "Black calfskin",
    description: "A sharp, architectural pump defined by its angled vamp and quiet gloss. Cut from supple Italian calfskin and finished by hand in our Milanese atelier.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=88",
    detailImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=2200&q=90",
  },
  {
    slug: "the-equis-loafer",
    name: "The Equis Loafer",
    cn: "Equis 手工乐福鞋",
    price: "$1,140",
    tag: "Signature",
    category: "Loafers",
    material: "Polished calfskin",
    description: "A considered loafer with a strong instep and an easy, balanced line. Its hand-burnished finish deepens with wear.",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1400&q=88",
    detailImage: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=2200&q=90",
  },
  {
    slug: "the-nocturne-boot",
    name: "The Nocturne Boot",
    cn: "Nocturne 皮革短靴",
    price: "$1,490",
    tag: "Limited",
    category: "Boots",
    material: "Vegetable-tanned leather",
    description: "A close-fitting ankle boot with a sculptural heel and a precise, uninterrupted profile. Limited to 50 pairs.",
    image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1400&q=88",
    detailImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=2200&q=90",
  },
];
