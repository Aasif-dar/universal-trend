import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }

  @keyframes pp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .pp-skel-img {
    background: linear-gradient(90deg,#f0ebe2 25%,#ece6db 50%,#f0ebe2 75%);
    background-size: 200% 100%;
    animation: pp-shimmer 1.6s infinite;
  }
  .pp-skel-line {
    background: linear-gradient(90deg,#f0ebe2 25%,#ece6db 50%,#f0ebe2 75%);
    background-size: 200% 100%;
    animation: pp-shimmer 1.6s infinite;
    border-radius: 2px;
    height: 10px;
  }

  .pp-viewmore { position:relative; border-bottom:1px solid #d4af37; transition:color .3s; }
  .pp-viewmore::after { content:''; position:absolute; bottom:-1px; left:0; width:0%; height:1px; background:#0a0a0a; transition:width .4s ease; }
  .pp-viewmore:hover::after { width:100%; }
  .pp-viewmore:hover { color:#0a0a0a; }

  .pp-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-left: 20px;
    padding-right: 20px;
    gap: 2px;
  }
  .pp-track::-webkit-scrollbar { display: none; }

  .pp-slide {
    flex: 0 0 72vw;
    max-width: 265px;
    min-width: 200px;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  .pp-prog-bg {
    height: 1px;
    background: rgba(212,175,55,0.15);
    border-radius: 1px;
    overflow: hidden;
    margin: 0 20px;
  }
  .pp-prog-fill {
    height: 100%;
    background: linear-gradient(90deg, #d4af37, #f0d060);
    border-radius: 1px;
    transition: width 0.35s ease;
  }

  .pp-dot {
    height: 2px;
    border-radius: 1px;
    background: rgba(212,175,55,0.2);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background .35s, width .35s;
  }
  .pp-dot.on { background: #d4af37; }

  .pp-arr {
    width: 34px; height: 34px;
    border: 1px solid rgba(212,175,55,0.28);
    background: rgba(250,247,242,0.92);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border-radius: 2px;
    color: rgba(26,26,26,0.65);
    transition: border-color .3s, color .3s, transform .15s;
    flex-shrink: 0;
  }
  .pp-arr:hover  { border-color: rgba(212,175,55,0.65); color: #1a1a1a; }
  .pp-arr:active { transform: scale(0.92); }
  .pp-arr:disabled { opacity: 0.22; cursor: default; transform: none; }

  .pp-pulse {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(212,175,55,0.35);
    transition: background .4s;
  }
  .pp-pulse.playing { background: #d4af37; animation: pp-blink 1.4s ease-in-out infinite; }
  @keyframes pp-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .pp-fade-l {
    position:absolute; left:0; top:0; bottom:4px; width:16px; z-index:20; pointer-events:none;
    background: linear-gradient(to right, #faf7f2, transparent);
  }
  .pp-fade-r {
    position:absolute; right:0; top:0; bottom:4px; width:48px; z-index:20; pointer-events:none;
    background: linear-gradient(to left, #faf7f2 20%, transparent);
  }
`;

const AUTO_MS = 2800;

const PopularProducts = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused]       = useState(false);

  const trackRef    = useRef(null);
  const autoRef     = useRef(null);
  const resumeTimer = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    fetch("/api/products/popular")
      .then((r) => r.json())
      .then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalItems = loading ? 4 : products.length;

  /* ── Scroll to index ── */
  const scrollToIdx = useCallback((idx) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll(".pp-slide");
    if (!slides[idx]) return;
    const diff = slides[idx].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollBy({ left: diff, behavior: "smooth" });
    setActiveIdx(idx);
  }, []);

  /* ── Manual scroll → sync dot ── */
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll(".pp-slide");
    const tl = track.getBoundingClientRect().left;
    let best = 0, bestD = Infinity;
    slides.forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - tl);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActiveIdx(best);
  }, []);

  /* ── Touch → pause 5s then resume ── */
  const handleTouchStart = useCallback(() => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 5000);
  }, []);

  /* ── Auto-slide ── */
  useEffect(() => {
    clearInterval(autoRef.current);
    if (loading || totalItems <= 1 || paused) return;

    autoRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % totalItems;
        scrollToIdx(next);
        return next;
      });
    }, AUTO_MS);

    return () => clearInterval(autoRef.current);
  }, [loading, totalItems, paused, scrollToIdx]);

  /* ── Cleanup ── */
  useEffect(() => () => {
    clearInterval(autoRef.current);
    clearTimeout(resumeTimer.current);
  }, []);

  const progressPct = totalItems > 1 ? (activeIdx / (totalItems - 1)) * 100 : 0;

  return (
    <>
      <style>{styles}</style>
      <section className="font-outfit py-16 md:py-24 bg-[#faf7f2] relative overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[400px] pointer-events-none"
          style={{ background:"radial-gradient(ellipse 500px 400px at 10% 20%,rgba(212,175,55,0.05) 0%,transparent 60%)" }}/>
        <div className="absolute bottom-0 right-0 w-[400px] h-[350px] pointer-events-none"
          style={{ background:"radial-gradient(ellipse 400px 350px at 90% 80%,rgba(212,175,55,0.04) 0%,transparent 60%)" }}/>

        {/* ── Header ── */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10 mb-10 md:mb-16">
          <header className="flex items-end justify-between gap-4 flex-wrap">

            <div className="flex flex-col">
              <span className="font-outfit text-[10px] font-medium tracking-[0.35em] uppercase text-[#d4af37] mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#d4af37] flex-shrink-0"/>
                Bestsellers
              </span>
              <h2 className="font-cormorant font-light text-[#1a1a1a] leading-none tracking-tight m-0"
                style={{ fontSize:"clamp(32px,5vw,62px)" }}>
                Popular{" "}
                <em className="italic text-[#d4af37] font-light">Picks</em>
                {!loading && products.length > 0 && (
                  <span className="inline-flex items-center justify-center w-8 h-8 border border-[#d4af37] font-outfit text-[10px] font-medium text-[#d4af37] ml-2.5 rounded-sm align-middle relative -top-1.5">
                    {products.length}
                  </span>
                )}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile: arrows + auto-play dot */}
              <div className="flex items-center gap-2 md:hidden">
                <button className="pp-arr" aria-label="Previous"
                  disabled={activeIdx === 0}
                  onClick={() => { setPaused(true); scrollToIdx(Math.max(0, activeIdx - 1)); }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M4 1L1 4.5M1 4.5L4 8M1 4.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Blinking dot = auto-playing; solid = paused */}
                <div
                  className={`pp-pulse ${!paused && !loading ? "playing" : ""}`}
                  title={paused ? "Auto-paused" : "Auto-playing"}
                />

                <button className="pp-arr" aria-label="Next"
                  disabled={activeIdx === totalItems - 1}
                  onClick={() => { setPaused(true); scrollToIdx(Math.min(totalItems - 1, activeIdx + 1)); }}>
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M7 1L10 4.5M10 4.5L7 8M10 4.5H1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <a href="/products"
                className="pp-viewmore inline-flex items-center gap-2.5 pb-2 bg-transparent border-none font-outfit text-[10px] font-medium tracking-[0.22em] uppercase text-[#1a1a1a] cursor-pointer no-underline flex-shrink-0">
                View All
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path d="M9 1L13 4.5M13 4.5L9 8M13 4.5H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </header>
        </div>

        {/* ═══════════════════════ */}
        {/* MOBILE carousel         */}
        {/* ═══════════════════════ */}
        <div className="md:hidden relative z-10">
          <div className="pp-fade-l"/>
          <div className="pp-fade-r"/>

          <div
            ref={trackRef}
            className="pp-track"
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="pp-slide bg-white flex flex-col">
                    <div className="pp-skel-img" style={{ aspectRatio:"3/4" }}/>
                    <div className="p-3 flex flex-col gap-2">
                      <div className="pp-skel-line" style={{ width:"40%" }}/>
                      <div className="pp-skel-line" style={{ width:"75%" }}/>
                      <div className="pp-skel-line" style={{ width:"50%" }}/>
                    </div>
                  </div>
                ))
              : products.length === 0
              ? (
                  <div className="px-5 py-16 w-full text-center">
                    <p className="font-cormorant text-xl font-light text-[#999]">No popular products found</p>
                  </div>
                )
              : products.map((product, i) => (
                  <div key={product._id} className="pp-slide">
                    <ProductCard product={product} index={i}/>
                  </div>
                ))
            }
          </div>

          {/* Controls */}
          {totalItems > 1 && (
            <div className="mt-5 flex flex-col gap-3">
              {/* Gold progress bar */}
              <div className="pp-prog-bg">
                <div className="pp-prog-fill" style={{ width:`${progressPct}%` }}/>
              </div>

              {/* Dots + Cormorant counter */}
              <div className="flex items-center justify-between px-5">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalItems }).map((_, i) => (
                    <button
                      key={i}
                      className={`pp-dot ${i === activeIdx ? "on" : ""}`}
                      style={{ width: i === activeIdx ? "28px" : "14px" }}
                      onClick={() => { setPaused(true); scrollToIdx(i); }}
                      aria-label={`Go to item ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="font-cormorant text-[13px] font-light tracking-widest select-none"
                  style={{ color:"rgba(26,26,26,0.28)" }}>
                  {String(activeIdx + 1).padStart(2,"0")}
                  <span className="mx-1" style={{ color:"rgba(212,175,55,0.38)" }}>/</span>
                  {String(totalItems).padStart(2,"0")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════ */}
        {/* DESKTOP 4-col grid      */}
        {/* ═══════════════════════ */}
        <div className="hidden md:block max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e8e2d9]">
            {loading
              ? Array.from({ length: 4 }).map((_,i) => (
                  <div key={i} className="bg-white flex flex-col">
                    <div className="pp-skel-img" style={{ aspectRatio:"3/4" }}/>
                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="pp-skel-line" style={{ width:"40%" }}/>
                      <div className="pp-skel-line" style={{ width:"80%" }}/>
                      <div className="pp-skel-line" style={{ width:"50%" }}/>
                    </div>
                  </div>
                ))
              : products.length === 0
              ? (
                  <div className="col-span-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-[#d4af37] rounded-sm mb-5">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L12.4 7.2L18 8.2L14 12.1L15 17.7L10 15L5 17.7L6 12.1L2 8.2L7.6 7.2L10 2Z"
                          stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="font-cormorant text-[22px] font-light text-[#999]">No popular products found</p>
                  </div>
                )
              : products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i}/>
                ))
            }
          </div>

          {/* Footer ornament */}
          <div className="flex items-center gap-6 mt-14">
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,#d4af37,rgba(212,175,55,0.1))" }}/>
            <div className="w-1.5 h-1.5 border border-[#d4af37] rotate-45 flex-shrink-0"/>
            <span className="font-outfit text-[10px] font-normal tracking-[0.25em] uppercase text-[#c4a832] whitespace-nowrap">
              Handpicked for you
            </span>
            <div className="w-1.5 h-1.5 border border-[#d4af37] rotate-45 flex-shrink-0"/>
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.1),#d4af37)" }}/>
          </div>
        </div>

        {/* Mobile footer ornament */}
        <div className="md:hidden max-w-[1400px] mx-auto px-5 mt-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,#d4af37,rgba(212,175,55,0.1))" }}/>
            <div className="w-1 h-1 border border-[#d4af37] rotate-45 flex-shrink-0"/>
            <span className="font-outfit text-[9px] font-normal tracking-[0.22em] uppercase text-[#c4a832] whitespace-nowrap">
              Handpicked for you
            </span>
            <div className="w-1 h-1 border border-[#d4af37] rotate-45 flex-shrink-0"/>
            <div className="flex-1 h-px" style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.1),#d4af37)" }}/>
          </div>
        </div>

      </section>
    </>
  );
};

export default PopularProducts;