"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, Camera, Check, Globe2, Menu, MessageCircle, MoveRight, X } from "lucide-react";
import { products } from "@/lib/products";

type Language = "EN" | "中文";

const copy = {
  EN: {
    announcement: "Complimentary worldwide delivery on every pair",
    nav: ["Collection", "Craft", "Bespoke", "Our story"],
    consult: "Consult an advisor",
    heroKicker: "Handmade in Italy · Edition 01",
    heroTitle: "Cut different.",
    heroText: "A study in proportion, material and movement. Each pair is shaped by hand, in limited numbers, for the few who notice the difference.",
    explore: "Explore the collection",
    bespoke: "Begin a bespoke enquiry",
    featured: "The edit",
    featuredTitle: "Objects of intention",
    featuredText: "A precise selection of silhouettes made to stay with you.",
    viewCollection: "View collection",
    craftKicker: "01 / The making",
    craftTitle: "The hand leaves a signature.",
    craftText: "From the first cut of a traceable hide to the final polish, every AEQUO piece passes through the hands of an Italian artisan.",
    discover: "Discover our craft",
    promise: "The AEQUO promise",
    promiseItems: ["Italian handcraft", "Traceable materials", "Private consultation"],
    newsletter: "Private dispatches",
    newsletterText: "New editions, atelier notes and private appointments, sent sparingly.",
    email: "Your email address",
    subscribe: "Subscribe",
    subscribed: "You are on the list",
    footer: "Made slowly. Worn distinctly.",
  },
  "中文": {
    announcement: "每一双鞋履均享全球免费配送",
    nav: ["系列作品", "工艺", "私人定制", "品牌故事"],
    consult: "联系专属顾问",
    heroKicker: "意大利手工 · 第 01 版",
    heroTitle: "切割不凡。",
    heroText: "关于比例、材质与步伐的探索。每一双皆由匠人手工塑造，限量制作，只为真正懂得差异的人。",
    explore: "探索系列作品",
    bespoke: "开始私人定制",
    featured: "精选系列",
    featuredTitle: "有意而作的作品",
    featuredText: "一组值得长久相伴的精准廓形。",
    viewCollection: "查看系列",
    craftKicker: "01 / 制作之道",
    craftTitle: "手工，留下独有印记。",
    craftText: "从可追溯皮革的第一道切割，到最后一次抛光，每件 AEQUO 作品都经过意大利匠人的双手。",
    discover: "探索匠人工艺",
    promise: "AEQUO 的坚持",
    promiseItems: ["意大利手工制作", "可追溯皮料", "专属顾问服务"],
    newsletter: "私人信笺",
    newsletterText: "新品、工坊手记与私人预约，克制地送达。",
    email: "您的邮箱地址",
    subscribe: "订阅",
    subscribed: "订阅成功",
    footer: "慢慢制作，清晰表达。",
  },
} as const;

export default function Home() {
  const [language, setLanguage] = useState<Language>("EN");
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const t = copy[language];

  return (
    <main>
      <div className="announcement">{t.announcement}</div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="AEQUO home">AEQUO<span>.</span></a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`}>
          <a href="#collection" onClick={() => setMenuOpen(false)}>{t.nav[0]}</a><a href="#craft" onClick={() => setMenuOpen(false)}>{t.nav[1]}</a><a href="#bespoke" onClick={() => setMenuOpen(false)}>{t.nav[2]}</a><a href="#story" onClick={() => setMenuOpen(false)}>{t.nav[3]}</a>
        </nav>
        <div className="header-actions">
          <button className="language-switcher" onClick={() => setLanguage(language === "EN" ? "中文" : "EN")} aria-label="Switch language"><Globe2 size={15} strokeWidth={1.4} /> {language}</button>
          <a className="header-consult" href="#contact">{t.consult}</a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="/images/hero.jpg" alt="Black leather shoes in sculptural light" />
        <div className="hero-shade" />
        <div className="hero-content"><p className="eyebrow">{t.heroKicker}</p><h1>{t.heroTitle}</h1><p className="hero-copy">{t.heroText}</p><div className="hero-links"><a className="button button-light" href="#collection">{t.explore}<ArrowRight size={16} /></a><a className="text-link light-link" href="#bespoke">{t.bespoke}<ArrowDownRight size={16} /></a></div></div>
        <div className="hero-index">AEQUO / 001</div><a className="scroll-cue" href="#collection"><span /> Scroll to enter</a>
      </section>

      <section className="promise-bar"><p className="section-label">{t.promise}</p><div className="promise-list">{t.promiseItems.map((item) => <span key={item}><Check size={14} />{item}</span>)}</div></section>

      <section className="section collection-section" id="collection">
        <div className="section-heading"><div><p className="eyebrow gold">{t.featured}</p><h2>{t.featuredTitle}</h2></div><div className="heading-side"><p>{t.featuredText}</p><a className="text-link" href="#collection">{t.viewCollection}<MoveRight size={16} /></a></div></div>
        <div className="product-grid">{products.map((product, index) => <Link className={`product-card product-${index + 1}`} href={`/collection/${product.slug}`} key={product.name}><div className="product-image-wrap"><img src={product.image} alt={language === "中文" ? product.cn : product.name} /><span className="product-tag">{product.tag}</span><span className="product-arrow"><ArrowRight size={18} /></span></div><div className="product-meta"><div><h3>{language === "中文" ? product.cn : product.name}</h3><p>{language === "中文" ? product.name : product.cn}</p></div><strong>{product.price}</strong></div></Link>)}</div>
      </section>

      <section className="craft-section" id="craft"><div className="craft-image"><img src="/images/craft.jpg" alt="Craftsperson working with leather" /></div><div className="craft-content"><p className="eyebrow gold">{t.craftKicker}</p><h2>{t.craftTitle}</h2><p>{t.craftText}</p><a className="text-link" href="#story">{t.discover}<MoveRight size={16} /></a><div className="craft-mark">A<span>/</span>Q</div></div></section>

      <section className="bespoke-section" id="bespoke"><div className="bespoke-inner"><p className="eyebrow gold">AEQUO PRIVATE</p><h2>Made for one.</h2><p>From the measure of your foot to the final delivery, your private advisor will accompany every decision.</p><a className="button button-gold" href="#contact">{t.bespoke}<ArrowRight size={16} /></a></div></section>
      <section className="story-section" id="story"><div><p className="eyebrow gold">OBLIK. / CUT DIFFERENT.</p><h2>Elegance,<br /><em>reconsidered.</em></h2></div><p className="story-copy">AEQUO was born from an obsession with the perfect cut: a line that gives a silhouette its tension, a material its voice, a step its presence.</p></section>

      <footer className="site-footer" id="contact"><div className="footer-top"><div><a className="wordmark footer-mark" href="#top">AEQUO<span>.</span></a><p>{t.footer}</p></div><div className="footer-contact"><p>PRIVATE APPOINTMENTS</p><a href="mailto:atelier@aequo.studio">atelier@aequo.studio</a><a href="https://wa.me/390000000000">WhatsApp advisor <MessageCircle size={14} /></a></div><div className="footer-social"><p>FOLLOW THE CUT</p><a href="https://instagram.com" aria-label="Instagram"><Camera size={18} /></a></div></div><div className="newsletter"><div><p className="eyebrow gold">{t.newsletter}</p><p>{t.newsletterText}</p></div>{subscribed ? <div className="subscribed"><Check size={16} /> {t.subscribed}</div> : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input type="email" placeholder={t.email} aria-label={t.email} required /><button type="submit" aria-label={t.subscribe}><ArrowRight size={17} /></button></form>}</div><div className="footer-bottom"><span>© 2026 AEQUO STUDIO</span><div><a href="#contact">Shipping & returns</a><a href="#contact">Privacy</a><a href="#contact">FAQ</a></div><span>ITALY / WORLDWIDE</span></div></footer>
    </main>
  );
}
