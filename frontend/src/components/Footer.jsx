import { Instagram, Facebook, MessageCircle } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300&family=Outfit:wght@200;300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }

  .ft-social { border:1px solid rgba(212,175,55,0.18); color:rgba(245,240,232,0.4); transition:border-color .35s,color .35s,transform .35s; position:relative; overflow:hidden; }
  .ft-social::before { content:''; position:absolute; inset:0; background:rgba(212,175,55,0.1); transform:scaleY(0); transform-origin:bottom; transition:transform .4s ease; }
  .ft-social:hover::before { transform:scaleY(1); }
  .ft-social:hover { border-color:rgba(212,175,55,0.65); color:#d4af37; transform:translateY(-2px); }

  .ft-link { color:rgba(245,240,232,0.4); font-family:'Outfit',sans-serif; font-size:13px; font-weight:300; display:flex; align-items:center; gap:8px; text-decoration:none; letter-spacing:0.04em; transition:color .3s,gap .3s; line-height:1; }
  .ft-link::before { content:''; display:block; width:10px; height:1px; background:rgba(212,175,55,0.35); transition:width .3s ease,background .3s ease; flex-shrink:0; }
  .ft-link:hover { color:#f5f0e8; gap:13px; }
  .ft-link:hover::before { width:16px; background:#d4af37; }

  .ft-map-iframe { filter:grayscale(100%) invert(88%) contrast(88%) brightness(0.65); transition:filter .6s ease; display:block; }
  .ft-map-wrap:hover .ft-map-iframe { filter:grayscale(50%) invert(80%) contrast(92%) brightness(0.75); }

  .ft-policy { color:rgba(245,240,232,0.18); font-family:'Outfit',sans-serif; font-size:10px; font-weight:300; text-decoration:none; letter-spacing:0.14em; text-transform:uppercase; transition:color .3s; }
  .ft-policy:hover { color:rgba(212,175,55,0.55); }

  .ft-col-label { font-family:'Outfit',sans-serif; font-size:9px; font-weight:500; letter-spacing:0.3em; text-transform:uppercase; color:#d4af37; display:flex; align-items:center; gap:10px; margin-bottom:20px; }
  .ft-col-label::after { content:''; flex:1; max-width:36px; height:1px; background:linear-gradient(90deg,rgba(212,175,55,0.35),transparent); }

  .ft-contact-item { text-decoration:none; }
  .ft-contact-item:hover .ft-contact-val { color:rgba(245,240,232,0.82); }
`;

const Footer = () => {
  const year = new Date().getFullYear();
  const shopLinks = [
    "Men's Collection",
    "Women's Collection",
    "Footwear",
    "Fragrances",
    "Accessories",
    "Popular Products",
  ];

  return (
    <>
      <style>{styles}</style>
      <footer className="font-outfit bg-[#0a0a0a] relative overflow-hidden">

        {/* Top ambient line + glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent 0%,rgba(212,175,55,0.3) 30%,rgba(212,175,55,0.5) 50%,rgba(212,175,55,0.3) 70%,transparent 100%)" }} />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[320px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(212,175,55,0.05) 0%,transparent 68%)" }} />

        <div className="max-w-[1300px] mx-auto px-8 md:px-12 pt-20 pb-14 relative z-10">

          {/* ── Brand headline row ── */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-12 mb-14 border-b border-[rgba(212,175,55,0.1)]">
            <div>
              <span className="block font-outfit text-[9px] font-normal tracking-[0.38em] uppercase text-[rgba(212,175,55,0.5)] mb-3">
                Est. 2012 · Jammu & Kashmir
              </span>
              <h2 className="font-cormorant m-0 font-extralight text-[#f5f0e8] leading-none"
                style={{ fontSize: "clamp(38px,5vw,62px)", letterSpacing: "0.02em" }}>
                Universal{" "}
                <em className="italic font-light text-[#d4af37]">Trend</em>
              </h2>
            </div>
            <p className="font-outfit text-[13px] font-light text-[rgba(245,240,232,0.38)] leading-relaxed max-w-sm tracking-wide m-0">
              Your one-stop destination for modern styles crafted for comfort
              and confidence — fashion, footwear &amp; fragrance.
            </p>
          </div>

          {/* ── Three columns ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-14">

            {/* Shop links */}
            <div>
              <div className="ft-col-label">Shop</div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3.5">
                {shopLinks.map((l) => (
                  <li key={l}><a href="#" className="ft-link">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <div className="ft-col-label">Connect</div>
              <div className="flex flex-col gap-5 mb-8">
                {[
                  { label: "Email", value: "universaltrendkralpora@gmail.com", href: "mailto:universaltrendkralpora@gmail.com" },
                  { label: "WhatsApp", value: "+91 7006298380", href: "https://wa.me/917006298380" },
                  { label: "Address", value: "Kralpora,Srinagar J&K, India", href: "" },
                ].map(({ label, value, href }) => (
                  <a key={label} href={href} className="ft-contact-item flex flex-col gap-1">
                    <span className="font-outfit text-[9px] font-medium tracking-[0.25em] uppercase text-[rgba(212,175,55,0.5)]">
                      {label}
                    </span>
                    <span className="ft-contact-val font-outfit text-[13px] font-light text-[rgba(245,240,232,0.42)] tracking-wide transition-colors duration-300">
                      {value}
                    </span>
                  </a>
                ))}
              </div>

              {/* Social icons */}
              <div className="flex gap-2.5">
                {[
                  { icon: <Instagram size={14} />, label: "Instagram" },
                  { icon: <Facebook size={14} />, label: "Facebook" },
                  { icon: <MessageCircle size={14} />, label: "WhatsApp" },
                ].map(({ icon, label }) => (
                  <a key={label} href="#" aria-label={label}
                    className="ft-social w-9 h-9 flex items-center justify-center no-underline rounded-sm">
                    <span className="relative z-10">{icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="ft-col-label">Visit Us</div>
              <div className="ft-map-wrap relative border border-[rgba(212,175,55,0.14)] overflow-hidden rounded-sm">
                {/* Corner brackets */}
                {[
                  "top-0 left-0 border-t border-l",
                  "top-0 right-0 border-t border-r",
                  "bottom-0 left-0 border-b border-l",
                  "bottom-0 right-0 border-b border-r",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-2.5 h-2.5 border-[#d4af37] opacity-50 z-10 ${cls}`} />
                ))}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.956639083192!2d74.814139!3d33.9936475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18ddbca53feb5%3A0x804ec14e8fc466c8!2sUniversal%20Trend!5e0!3m2!1sen!2sin!4v1770114679225!5m2!1sen!2sin"
                  loading="lazy"
                  title="Store Location"
                  className="ft-map-iframe w-full h-48 border-0"
                />
                <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[rgba(212,175,55,0.08)]"
                  style={{ background: "rgba(212,175,55,0.03)" }}>
                  <svg width="10" height="13" viewBox="0 0 12 14" fill="none" className="opacity-55 flex-shrink-0">
                    <path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z"
                      stroke="#d4af37" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="6" cy="5" r="1.2" stroke="#d4af37" strokeWidth="1" />
                  </svg>
                  <span className="font-outfit text-[11px] font-light tracking-wide text-[rgba(245,240,232,0.33)]">
                    Universal Trend · J&amp;K, India
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Separator ── */}
          <div className="flex items-center gap-5 mb-6">
            <div className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.2))" }} />
            <div className="w-1 h-1 border border-[rgba(212,175,55,0.4)] rotate-45 flex-shrink-0" />
            <div className="w-8 h-px bg-[rgba(212,175,55,0.2)] flex-shrink-0" />
            <div className="w-1 h-1 border border-[rgba(212,175,55,0.4)] rotate-45 flex-shrink-0" />
            <div className="flex-1 h-px"
              style={{ background: "linear-gradient(90deg,rgba(212,175,55,0.2),transparent)" }} />
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <span className="font-outfit text-[11px] font-light text-[rgba(245,240,232,0.22)] tracking-wide">
              © {year}{" "}
              <span className="text-[rgba(212,175,55,0.45)] font-normal">Universal Trend</span>
              . All rights reserved.
            </span>

            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[rgba(212,175,55,0.25)]" />
              <span className="font-outfit text-[10px] font-light text-[rgba(245,240,232,0.17)] tracking-[0.2em] uppercase">
                Crafted with care
              </span>
              <div className="w-1 h-1 rounded-full bg-[rgba(212,175,55,0.25)]" />
            </div>

            <div className="flex gap-5 items-center">
              {["Privacy", "Terms", "Cookies"].map((l) => (
                <a key={l} href="#" className="ft-policy">{l}</a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;