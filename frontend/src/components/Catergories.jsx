import { useNavigate } from "react-router-dom";
import categories from "../data/CategoriesProduct";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }
  .cat-card .cat-img { transform:scale(1.08); filter:brightness(0.65) saturate(0.8); transition:transform 0.9s cubic-bezier(.25,.46,.45,.94), filter 0.9s ease; }
  .cat-card:hover .cat-img { transform:scale(1.0); filter:brightness(0.45) saturate(0.6); }
  .cat-card .cat-overlay { background:linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.4) 40%,rgba(0,0,0,0.05) 70%,transparent 100%); transition:background .5s ease; }
  .cat-card:hover .cat-overlay { background:linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.6) 50%,rgba(0,0,0,0.2) 80%,transparent 100%); }
  .cat-card .cat-sweep { width:0%; transition:width 0.55s cubic-bezier(.25,.46,.45,.94); }
  .cat-card:hover .cat-sweep { width:100%; }
  .cat-card .cat-shimmer { left:-100%; transition:left 0.7s ease; pointer-events:none; }
  .cat-card:hover .cat-shimmer { left:150%; }
  .cat-card .cat-num { color:rgba(212,175,55,0.5); transition:color .4s; }
  .cat-card:hover .cat-num { color:rgba(212,175,55,0.9); }
  .cat-card .cat-content { transform:translateY(8px); transition:transform .5s cubic-bezier(.25,.46,.45,.94); }
  .cat-card:hover .cat-content { transform:translateY(0); }
  .cat-card .cat-tag { opacity:0; transform:translateY(10px); transition:opacity .4s ease .1s,transform .4s ease .1s; }
  .cat-card:hover .cat-tag { opacity:1; transform:translateY(0); }
  .cat-card .cat-cta { opacity:0; transform:translateY(10px); transition:opacity .4s ease .15s,transform .4s ease .15s; }
  .cat-card:hover .cat-cta { opacity:1; transform:translateY(0); }
  .cat-view-btn { position:relative; overflow:hidden; letter-spacing:0.3em; border:1px solid rgba(212,175,55,0.3); color:#d4af37; transition:border-color .4s,letter-spacing .4s; }
  .cat-view-btn::before { content:''; position:absolute; inset:0; background:rgba(212,175,55,0.08); transform:scaleX(0); transform-origin:left; transition:transform .4s ease; }
  .cat-view-btn:hover::before { transform:scaleX(1); }
  .cat-view-btn:hover { border-color:rgba(212,175,55,0.7); letter-spacing:0.35em; }
`;

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{styles}</style>
      <section className="font-outfit py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 70%)"}}/>
        <div className="absolute -bottom-36 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{background:"radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%)"}}/>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          {/* Header */}
          <header className="text-center mb-16">
            <span className="font-outfit text-[11px] font-medium tracking-[0.35em] uppercase text-[#d4af37] mb-4 block">
              Curated Collections
            </span>
            <h2 className="font-cormorant text-[clamp(48px,6vw,76px)] font-light text-[#f5f0e8] leading-none tracking-tight mb-7">
              Top <em className="italic text-[#d4af37] font-light">Trends</em>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(212,175,55,0.5))"}}/>
              <div className="w-1.5 h-1.5 bg-[#d4af37] rotate-45 flex-shrink-0"/>
              <div className="w-16 h-px" style={{background:"linear-gradient(90deg,rgba(212,175,55,0.5),transparent)"}}/>
            </div>
          </header>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-px bg-[#222]">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="cat-card relative cursor-pointer overflow-hidden bg-[#111]"
                style={{aspectRatio:"3/4"}}
                onClick={() => navigate(`${cat.path}?category=${cat.category}`)}
                role="button" tabIndex={0}
                onKeyDown={(e) => e.key==="Enter" && navigate(`${cat.path}?category=${cat.category}`)}
                aria-label={`Browse ${cat.title}`}
              >
                <img src={cat.image} alt={cat.title}
                  className="cat-img absolute inset-0 w-full h-full object-cover"/>
                {/* Shimmer */}
                <div className="cat-shimmer absolute inset-0 w-[60%] h-full"
                  style={{background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.04) 50%,transparent 60%)"}}/>
                {/* Overlay */}
                <div className="cat-overlay absolute inset-0"/>
                {/* Gold sweep */}
                <div className="cat-sweep absolute bottom-0 left-0 h-0.5"
                  style={{background:"linear-gradient(90deg,#d4af37,#f0d060,#d4af37)"}}/>
                {/* Number */}
                <span className="cat-num font-cormorant absolute top-6 right-6 text-[13px] tracking-widest">
                  {String(i+1).padStart(2,"0")}
                </span>
                {/* Content */}
                <div className="cat-content absolute bottom-0 left-0 right-0 px-7 pb-9 pt-6">
                  <span className="cat-tag font-outfit text-[10px] font-medium tracking-[0.25em] uppercase text-[#d4af37] block mb-2">
                    {cat.category||"Collection"}
                  </span>
                  <h3 className="font-cormorant text-2xl font-normal text-[#f5f0e8] leading-tight mb-2">
                    {cat.title}
                  </h3>
                  {cat.subtitle && (
                    <p className="font-outfit text-[13px] font-light text-[rgba(245,240,232,0.55)] mb-4 leading-relaxed">
                      {cat.subtitle}
                    </p>
                  )}
                  <div className="cat-cta flex items-center gap-2 font-outfit text-[11px] font-medium tracking-[0.2em] uppercase text-[#d4af37]">
                    <span>Explore</span>
                    <div className="h-px w-10 flex-shrink-0"
                      style={{background:"linear-gradient(90deg,#d4af37,transparent)"}}/>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M9 1L13 5M13 5L9 9M13 5H1" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <a href="/men"
              className="cat-view-btn inline-flex items-center gap-3 px-10 py-3.5 font-outfit text-[11px] font-medium uppercase bg-transparent">
              <span className="relative z-10">View All Collections</span>
              <svg className="relative z-10" width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M11 1L15 5M15 5L11 9M15 5H1" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
export default Categories;