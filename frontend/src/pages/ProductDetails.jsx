import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";

const sizes = ["S", "M", "L", "XL", "XXL"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }

  /* ── Skeleton shimmer ── */
  @keyframes pd-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .pd-skel { background:linear-gradient(90deg,#f0ebe2 25%,#e8e2d9 50%,#f0ebe2 75%); background-size:200% 100%; animation:pd-shimmer 1.8s infinite; }

  /* ── Page fade in ── */
  @keyframes pd-rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .pd-rise-1 { animation: pd-rise 0.6s ease 0.1s both; }
  .pd-rise-2 { animation: pd-rise 0.6s ease 0.22s both; }
  .pd-rise-3 { animation: pd-rise 0.6s ease 0.34s both; }
  .pd-rise-4 { animation: pd-rise 0.6s ease 0.46s both; }
  .pd-rise-5 { animation: pd-rise 0.6s ease 0.58s both; }

  /* ── Thumbnail ── */
  .pd-thumb {
    width: 64px; height: 64px;
    object-fit: cover;
    border: 1px solid rgba(212,175,55,0.15);
    cursor: pointer;
    transition: border-color .3s, transform .3s;
    flex-shrink: 0;
  }
  .pd-thumb:hover  { border-color: rgba(212,175,55,0.5); transform: scale(1.03); }
  .pd-thumb.active { border-color: #d4af37; }

  /* ── Main image zoom ── */
  .pd-main-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(.25,.46,.45,.94);
  }
  .pd-img-wrap:hover .pd-main-img { transform: scale(1.04); }

  /* ── Size button ── */
  .pd-size {
    width: 48px; height: 40px;
    border: 1px solid rgba(212,175,55,0.25);
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: rgba(26,26,26,0.6);
    background: transparent;
    cursor: pointer;
    transition: border-color .3s, color .3s, background .3s;
  }
  .pd-size:hover { border-color: rgba(212,175,55,0.6); color: #1a1a1a; }
  .pd-size.sel   { background: #0a0a0a; color: #d4af37; border-color: #0a0a0a; }

  /* ── Add to cart button ── */
  .pd-atc {
    position: relative; overflow: hidden;
    background: #0a0a0a;
    color: #d4af37;
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    border: none; cursor: pointer;
    transition: gap .35s ease;
    display: inline-flex; align-items: center; gap: 14px;
  }
  .pd-atc::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(212,175,55,0.12);
    transform: translateX(-110%);
    transition: transform .45s ease;
  }
  .pd-atc:hover::before { transform: translateX(0); }
  .pd-atc:hover { gap: 20px; }
  .pd-atc span, .pd-atc svg { position: relative; z-index: 1; }

  /* ── Back link ── */
  .pd-back {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 400;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(26,26,26,0.4);
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: color .3s, gap .3s;
    border: none; background: transparent; cursor: pointer;
  }
  .pd-back:hover { color: #1a1a1a; gap: 12px; }

  /* ── Review card ── */
  .pd-review {
    border: 1px solid rgba(212,175,55,0.12);
    background: #fff;
    position: relative;
    overflow: hidden;
    transition: border-color .4s;
  }
  .pd-review::before {
    content: '';
    position: absolute; bottom: 0; left: 0;
    width: 0%; height: 1px;
    background: linear-gradient(90deg, #d4af37, transparent);
    transition: width .5s ease;
  }
  .pd-review:hover::before { width: 100%; }
  .pd-review:hover { border-color: rgba(212,175,55,0.3); }

  /* ── Breadcrumb sep ── */
  .pd-sep { color: rgba(212,175,55,0.4); margin: 0 6px; }

  /* ── Image badge ── */
  .pd-badge {
    position: absolute; top: 14px; left: 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 9px; font-weight: 600;
    letter-spacing: 0.2em; text-transform: uppercase;
    background: #0a0a0a; color: #d4af37;
    padding: 4px 10px;
    z-index: 5;
  }
`;

const ProductDetails = () => {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage]     = useState("");
  const [imgLoaded, setImgLoaded]     = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res  = await customFetch.get(`/products/${id}`);
        const data = res.data;
        setProduct(data);
        if (data.images?.length > 0) setMainImage(data.images[0]);
      } catch (err) {
        console.error("Fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize && product.type !== "fragrances") {
      toast.warning("Please select a size first");
      return;
    }
    addToCart({ ...product, size: selectedSize || "Standard", quantity: 1 });
    toast.success("Added to cart");
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <section className="font-outfit min-h-screen bg-[#faf7f2] py-16 px-5 sm:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="pd-skel h-4 w-48 mb-10 rounded"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="pd-skel rounded-sm" style={{ aspectRatio:"1/1" }}/>
              <div className="flex flex-col gap-5 pt-4">
                <div className="pd-skel h-3 w-24 rounded"/>
                <div className="pd-skel h-10 w-3/4 rounded"/>
                <div className="pd-skel h-6 w-28 rounded"/>
                <div className="pd-skel h-24 w-full rounded"/>
                <div className="flex gap-2 mt-4">
                  {[1,2,3,4,5].map(i => <div key={i} className="pd-skel w-12 h-10 rounded-sm"/>)}
                </div>
                <div className="pd-skel h-12 w-48 mt-2 rounded-sm"/>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <>
        <style>{styles}</style>
        <section className="font-outfit min-h-[60vh] bg-[#faf7f2] flex flex-col items-center justify-center gap-6 px-5">
          <div className="w-12 h-12 border border-[#d4af37] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V10M10 14H10.01" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="8.5" stroke="#d4af37" strokeWidth="1"/>
            </svg>
          </div>
          <p className="font-cormorant text-2xl font-light text-[#1a1a1a]">Product not found</p>
          <button onClick={() => navigate(-1)} className="pd-back">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M4 1L1 4.5M1 4.5L4 8M1 4.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go Back
          </button>
        </section>
      </>
    );
  }

  const hasDiscount    = product.originalPrice && product.originalPrice > product.price;
  const discountPct    = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <style>{styles}</style>
      <section className="font-outfit bg-[#faf7f2] relative overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background:"radial-gradient(ellipse,rgba(212,175,55,0.04) 0%,transparent 70%)" }}/>

        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-10 md:py-16">

          {/* ── Breadcrumb ── */}
          <div className="pd-rise-1 flex items-center mb-10">
            <button onClick={() => navigate("/")} className="pd-back text-[9px]">Home</button>
            <span className="pd-sep text-xs">◆</span>
            <span className="font-outfit text-[9px] tracking-[0.2em] uppercase text-[rgba(26,26,26,0.35)] capitalize">
              {product.type}
            </span>
            <span className="pd-sep text-xs">◆</span>
            <span className="font-outfit text-[9px] tracking-[0.2em] uppercase text-[rgba(26,26,26,0.55)] truncate max-w-[160px]">
              {product.name}
            </span>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

            {/* ─── IMAGE GALLERY ─── */}
            <div className="pd-rise-2 flex gap-3">

              {/* Thumbnails */}
              {product.images?.length > 1 && (
                <div className="flex flex-col gap-2.5 flex-shrink-0">
                  {product.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`View ${i + 1}`}
                      onClick={() => { setMainImage(img); setImgLoaded(false); }}
                      className={`pd-thumb ${mainImage === img ? "active" : ""}`}
                    />
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="pd-img-wrap relative flex-1 overflow-hidden bg-[#f0ebe2]"
                style={{ aspectRatio:"1/1" }}>
                {/* Badge */}
                {discountPct && (
                  <div className="pd-badge">−{discountPct}%</div>
                )}
                {/* Category tag */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="font-outfit text-[8px] font-medium tracking-[0.2em] uppercase text-[rgba(245,240,232,0.7)] bg-[rgba(10,10,10,0.5)] px-2.5 py-1 backdrop-blur-sm">
                    {product.type}
                  </span>
                </div>
                <img
                  src={mainImage}
                  alt={product.name}
                  className={`pd-main-img ${imgLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
                  onLoad={() => setImgLoaded(true)}
                />
                {!imgLoaded && <div className="pd-skel absolute inset-0"/>}

                {/* Bottom gold sweep */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background:"linear-gradient(90deg,transparent,#d4af37,transparent)" }}/>
              </div>
            </div>

            {/* ─── PRODUCT INFO ─── */}
            <div className="flex flex-col">

              {/* Category eyebrow */}
              <div className="pd-rise-2 flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#d4af37]"/>
                <span className="font-outfit text-[9px] font-medium tracking-[0.32em] uppercase text-[#d4af37]">
                  {product.category || product.type}
                </span>
              </div>

              {/* Name */}
              <h1 className="pd-rise-3 font-cormorant font-light text-[#1a1a1a] leading-none tracking-tight m-0 mb-5"
                style={{ fontSize:"clamp(30px,4vw,50px)" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="pd-rise-3 flex items-baseline gap-4 mb-6">
                <span className="font-outfit text-2xl font-medium text-[#1a1a1a] tracking-wide">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <>
                    <span className="font-outfit text-base font-light text-[#aaa] line-through">
                      ₹{product.originalPrice?.toLocaleString("en-IN")}
                    </span>
                    <span className="font-outfit text-[11px] font-medium text-[#b5883a] tracking-wide">
                      {discountPct}% off
                    </span>
                  </>
                )}
              </div>

              {/* Thin gold rule */}
              <div className="pd-rise-3 w-full h-px mb-6"
                style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.4),transparent)" }}/>

              {/* Description */}
              <p className="pd-rise-4 font-outfit text-[13px] font-light text-[rgba(26,26,26,0.6)] leading-relaxed mb-8 tracking-wide">
                {product.description}
              </p>

              {/* Size selector */}
              {product.type !== "fragrances" && (
                <div className="pd-rise-4 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-outfit text-[9px] font-medium tracking-[0.28em] uppercase text-[rgba(26,26,26,0.5)]">
                      Select Size
                    </span>
                    {selectedSize && (
                      <span className="font-outfit text-[9px] tracking-[0.15em] uppercase text-[#d4af37]">
                        — {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`pd-size ${selectedSize === size ? "sel" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA row */}
              <div className="pd-rise-5 flex flex-col gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={handleAddToCart}
                    className="pd-atc px-10 py-4"
                  >
                    <span>Add to Cart</span>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M9 1L13 5M13 5L9 9M13 5H1" stroke="#d4af37" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <button onClick={() => navigate(-1)} className="pd-back mt-1">
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M4 1L1 4.5M1 4.5L4 8M1 4.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to products
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-[rgba(212,175,55,0.1)] flex flex-wrap gap-5">
                {[
                  { icon: "🚚", label: "Free Delivery within 10km", sub: "On orders above ₹3000 and within" },
                  { icon: "↩", label: "Easy Returns",  sub: "7-day return policy with returning Charges"  },
                  { icon: "✓", label: "Genuine",       sub: "100% authentic"       },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{icon}</span>
                    <div>
                      <p className="font-outfit text-[10px] font-medium tracking-[0.12em] uppercase text-[rgba(26,26,26,0.65)] m-0">
                        {label}
                      </p>
                      <p className="font-outfit text-[10px] font-light text-[rgba(26,26,26,0.35)] m-0 tracking-wide">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Separator ── */}
          <div className="flex items-center gap-5 my-16">
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.2))" }}/>
            <div className="w-1.5 h-1.5 border border-[rgba(212,175,55,0.4)] rotate-45 flex-shrink-0"/>
            <span className="font-outfit text-[9px] font-medium tracking-[0.3em] uppercase text-[rgba(212,175,55,0.5)] whitespace-nowrap">
              Customer Reviews
            </span>
            <div className="w-1.5 h-1.5 border border-[rgba(212,175,55,0.4)] rotate-45 flex-shrink-0"/>
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.2),transparent)" }}/>
          </div>

          {/* ── Reviews ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e8e2d9]">
            {[
              { name:"Verified Buyer", rating:5, text:"Excellent quality and premium feel. The fabric is outstanding and fits perfectly.", date:"Jan 2025" },
              { name:"Verified Buyer", rating:5, text:"Fast delivery and the product matches exactly what was shown. Very satisfied.", date:"Feb 2025" },
              { name:"Verified Buyer", rating:4, text:"Great product, love the design. Will definitely order again from Universal Trend.", date:"Mar 2025" },
            ].map((r, i) => (
              <div key={i} className="pd-review bg-white p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <div key={s} className={`w-1.5 h-1.5 rounded-full ${s < r.rating ? "bg-[#d4af37]" : "bg-[#e8e2d9]"}`}/>
                  ))}
                </div>
                <p className="font-outfit text-[13px] font-light text-[rgba(26,26,26,0.65)] leading-relaxed mb-4 tracking-wide">
                  "{r.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-outfit text-[10px] font-medium tracking-[0.15em] uppercase text-[rgba(26,26,26,0.4)]">
                    {r.name}
                  </span>
                  <span className="font-outfit text-[10px] font-light text-[rgba(212,175,55,0.5)] tracking-wide">
                    {r.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom ornament */}
          <div className="flex items-center gap-5 mt-12">
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,#d4af37,rgba(212,175,55,0.1))" }}/>
            <div className="w-1 h-1 border border-[rgba(212,175,55,0.4)] rotate-45 flex-shrink-0"/>
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.1),#d4af37)" }}/>
          </div>

        </div>
      </section>
    </>
  );
};

export default ProductDetails;