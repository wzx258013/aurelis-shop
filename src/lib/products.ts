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
    image: "/images/pump.jpg",
    detailImage: "/images/pump.jpg",
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
    image: "/images/loafer.jpg",
    detailImage: "/images/loafer.jpg",
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
    image: "/images/boot.jpg",
    detailImage: "/images/boot.jpg",
  },
];
