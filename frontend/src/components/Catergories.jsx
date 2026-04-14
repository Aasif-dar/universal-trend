import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import categories from "../data/CategoriesProduct";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }

  /* ── Card hover effects ── */
  .cat-card .cat-img {
    transform: scale(1.08);
    filter: brightness(0.65) saturate(0.8);
    transition: transform 0.9s cubic-bezier(.25,.46,.45,.94), filter 0.9s ease;
  }
  .cat-card:hover .cat-img { transform: scale(1.0); filter: brightness(0.45) saturate(0.6); }

  .cat-card .cat-overlay {
    background: linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.4) 40%,rgba(0,0,0,0.05) 70%,transparent 100%);
    transition: background .5s ease;
  }
  .cat-card:hover .cat-overlay {
    background: linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.6) 50%,rgba(0,0,0,0.2) 80%,transparent 100%);
  }

  .cat-card .cat-sweep { width: 0%; transition: width 0.55s cubic-bezier(.25,.46,.45,.94); }
  .cat-card:hover .cat-sweep { width: 100%; }

  .cat-card .cat-shimmer { left: -100%; transition: left 0.7s ease; pointer-events: none; }
  .cat-card:hover .cat-shimmer { left: 150%; }

  .cat-card .cat-num { color: rgba(212,175,55,0.5); transition: color .4s; }
  .cat-card:hover .cat-num { color: rgba(212,175,55,0.9); }

  .cat-card .cat-content { transform: translateY(8px); transition: transform .5s cubic-bezier(.25,.46,.45,.94); }
  .cat-card:hover .cat-content { transform: translateY(0); }

  .cat-card .cat-tag { opacity:0; transform:translateY(10px); transition:opacity .4s ease .1s,transform .4s ease .1s; }
  .cat-card:hover .cat-tag { opacity:1; transform:translateY(0); }

  .cat-card .cat-cta { opacity:0; transform:translateY(10px); transition:opacity .4s ease .15s,transform .4s ease .15s; }
  .cat-card:hover .cat-cta { opacity:1; transform:translateY(0); }

  /* ── Carousel track ── */
  .cat-track {
    display: flex;
    transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .cat-slide {
    flex-shrink: 0;
    padding: 0 6px;
  }

  /* ── Arrow buttons ── */
  .cat-arrow {
    width: 48px; height: 48px;
    border: 1px solid rgba(212,175,55,0.25);
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border-radius: 2px;
    color: rgba(212,175,55,0.7);
    transition: border-color .35s, color .35s, background .35s, transform .2s;
    position: relative; overflow: hidden;
  }
  .cat-arrow::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(212,175,55,0.08);
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s ease;
  }
  .cat-arrow:hover::before { transform: scaleX(1); }
  .cat-arrow:hover { border-color: rgba(212,175,55,0.6); color: #d4af37; }
  .cat-arrow:active { transform: scale(0.94); }
  .cat-arrow:disabled { opacity: 0.2; cursor: default; pointer-events: none; }
  .cat-arrow svg { position: relative; z-index: 1; }

  /* ── Progress bar ── */
  .cat-progress-bg {
    height: 1px;
    background: rgba(212,175,55,0.12);
    border-radius: 1px;
    overflow: hidden;
  }
  .cat-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #b8932e, #d4af37, #f0d060);
    border-radius: 1px;
    transition: width 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
  }

  /* ── Dot nav ── */
  .cat-dot {
    height: 2px; border-radius: 1px;
    background: rgba(212,175,55,0.18);
    border: none; padding: 0; cursor: pointer;
    transition: background .35s, width .35s;
  }
  .cat-dot.on { background: #d4af37; }

  /* ── View all button ── */
  .cat-view-btn {
    position: relative; overflow: hidden;
    letter-spacing: 0.3em;
    border: 1px solid rgba(212,175,55,0.3);
    color: #d4af37;
    transition: border-color .4s, letter-spacing .4s;
  }
  .cat-view-btn::before {
    content: ''; position: absolute; inset: 0;
    background: rgba(212,175,55,0.08);
    transform: scaleX(0); transform-origin: left;
    transition: transform .4s ease;
  }
  .cat-view-btn:hover::before { transform: scaleX(1); }
  .cat-view-btn:hover { border-color: rgba(212,175,55,0.7); letter-spacing: 0.35em; }
`;

/* How many slides visible per breakpoint */
const getSlidesVisible = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 640)  return 1.15;  // mobile: 1 + peek
  if (window.innerWidth < 1024) return 2.15;  // tablet: 2 + peek
  return 3.2;                                  // desktop: 3 + peek
};

const AUTOPLAY_MS = 3500;

const Categories = () => {
  const navigate = useNavigate();

  const [activeIdx, setActiveIdx]   = useState(0);
  const [slidesVis, setSlidesVis]   = useState(getSlidesVisible);
  const [paused, setPaused]         = useState(false);
  const [ringPct, setRingPct]       = useState(0);

  const trackRef   = useRef(null);
  const autoRef    = useRef(null);
  const ringRef    = useRef(null);
  const ringElapsed = useRef(0);

  const total     = categories.length;
  const maxIdx    = Math.max(0, total - Math.floor(slidesVis));
  const slideW    = trackRef.current
    ? trackRef.current.parentElement.offsetWidth / slidesVis
    : 0;

  /* ── Responsive listener ── */
  useEffect(() => {
    const onResize = () => setSlidesVis(getSlidesVisible());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Translate track ── */
  useEffect(() => {
    if (!trackRef.current) return;
    const w = trackRef.current.parentElement.offsetWidth / slidesVis;
    trackRef.current.style.transform = `translateX(-${activeIdx * w}px)`;
  }, [activeIdx, slidesVis]);

  /* ── Auto-play ── */
  const startAuto = useCallback(() => {
    clearTimeout(autoRef.current);
    clearInterval(ringRef.current);
    ringElapsed.current = 0;
    setRingPct(0);

    ringRef.current = setInterval(() => {
      ringElapsed.current += 40;
      setRingPct(Math.min((ringElapsed.current / AUTOPLAY_MS) * 100, 100));
    }, 40);

    autoRef.current = setTimeout(() => {
      setActiveIdx((prev) => (prev >= maxIdx ? 0 : prev + 1));
    }, AUTOPLAY_MS);
  }, [maxIdx]);

  const stopAuto = useCallback(() => {
    clearTimeout(autoRef.current);
    clearInterval(ringRef.current);
    setRingPct(0);
  }, []);

  useEffect(() => {
    if (paused) { stopAuto(); return; }
    startAuto();
    return () => stopAuto();
  }, [activeIdx, paused, startAuto, stopAuto]);

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(maxIdx, idx));
    setActiveIdx(clamped);
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  };

  const prev = () => goTo(activeIdx <= 0 ? maxIdx : activeIdx - 1);
  const next = () => goTo(activeIdx >= maxIdx ? 0 : activeIdx + 1);

  const progressPct = maxIdx > 0 ? (activeIdx / maxIdx) * 100 : 0;
  const C = 2 * Math.PI * 8;

  return (
    <>
      <style>{styles}</style>
      <section className="font-outfit py-20 md:py-24 bg-[#0a0a0a] relative overflow-hidden">

        {/* Ambient glows */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,rgba(212,175,55,0.06) 0%,transparent 70%)" }}/>
        <div className="absolute -bottom-36 -right-24 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background:"radial-gradient(circle,rgba(255,255,255,0.03) 0%,transparent 70%)" }}/>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">

          {/* ── Header ── */}
          <header className="mb-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              {/* Title */}
              <div>
                <span className="font-outfit text-[11px] font-medium tracking-[0.35em] uppercase text-[#d4af37] mb-4 block">
                  Curated Collections
                </span>
                <h2 className="font-cormorant font-light text-[#f5f0e8] leading-none tracking-tight m-0"
                  style={{ fontSize:"clamp(40px,6vw,72px)" }}>
                  Top <em className="italic text-[#d4af37] font-light">Trends</em>
                </h2>
              </div>

              {/* Right: counter + arrows */}
              <div className="flex items-center gap-4">

                {/* Slide counter with ring */}
                <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <svg className="absolute inset-0" width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1"/>
                    {!paused && (
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#d4af37" strokeWidth="1"
                        strokeDasharray={2 * Math.PI * 16}
                        strokeDashoffset={2 * Math.PI * 16 * (1 - ringPct / 100)}
                        strokeLinecap="round"
                        style={{ transform:"rotate(-90deg)", transformOrigin:"center", transition:"stroke-dashoffset 0.04s linear" }}
                      />
                    )}
                  </svg>
                  <span className="font-cormorant font-light text-[13px] relative z-10"
                    style={{ color:"rgba(212,175,55,0.6)" }}>
                    {String(activeIdx + 1).padStart(2,"0")}
                  </span>
                </div>

                <span className="font-cormorant font-light text-[11px]"
                  style={{ color:"rgba(212,175,55,0.25)", letterSpacing:"0.1em" }}>
                  / {String(total).padStart(2,"0")}
                </span>

                {/* Arrows */}
                <div className="flex items-center gap-2 ml-2">
                  <button className="cat-arrow" onClick={prev} aria-label="Previous">
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                      <path d="M5 1L1 5M1 5L5 9M1 5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="cat-arrow"
                    onClick={() => setPaused(p => !p)}
                    aria-label={paused ? "Play" : "Pause"}
                  >
                    {paused ? (
                      <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                        <path d="M2 1.5L9.5 6L2 10.5V1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                        <path d="M2 2V10M7 2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </button>
                  <button className="cat-arrow" onClick={next} aria-label="Next">
                    <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                      <path d="M8 1L12 5M12 5L8 9M12 5H1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Thin rule below header */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px"
                style={{ background:"linear-gradient(90deg,rgba(212,175,55,0.3),transparent)" }}/>
              <div className="w-1 h-1 bg-[#d4af37] rotate-45 flex-shrink-0"/>
              <div className="w-8 h-px bg-[rgba(212,175,55,0.15)] flex-shrink-0"/>
            </div>
          </header>

          {/* ── Carousel viewport ── */}
          <div className="overflow-hidden -mx-1.5">
            <div ref={trackRef} className="cat-track">
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  className="cat-slide"
                  style={{ width:`${100 / slidesVis}%` }}
                >
                  <div
                    className="cat-card relative cursor-pointer overflow-hidden bg-[#111]"
                    style={{ aspectRatio:"3/4" }}
                    onClick={() => navigate(`${cat.path}?category=${cat.category}`)}
                    role="button" tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`${cat.path}?category=${cat.category}`)}
                    aria-label={`Browse ${cat.title}`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="cat-img absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="cat-shimmer absolute inset-0 w-[60%] h-full"
                      style={{ background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.04) 50%,transparent 60%)" }}/>
                    <div className="cat-overlay absolute inset-0"/>
                    <div className="cat-sweep absolute bottom-0 left-0 h-0.5"
                      style={{ background:"linear-gradient(90deg,#d4af37,#f0d060,#d4af37)" }}/>

                    <span className="cat-num font-cormorant absolute top-5 right-5 text-[12px] tracking-widest">
                      {String(i + 1).padStart(2,"0")}
                    </span>

                    <div className="cat-content absolute bottom-0 left-0 right-0 px-6 pb-8 pt-5">
                      <span className="cat-tag font-outfit text-[9px] font-medium tracking-[0.25em] uppercase text-[#d4af37] block mb-1.5">
                        {cat.category || "Collection"}
                      </span>
                      <h3 className="font-cormorant text-xl font-normal text-[#f5f0e8] leading-tight mb-2">
                        {cat.title}
                      </h3>
                      {cat.subtitle && (
                        <p className="font-outfit text-[12px] font-light text-[rgba(245,240,232,0.55)] mb-3.5 leading-relaxed">
                          {cat.subtitle}
                        </p>
                      )}
                      <div className="cat-cta flex items-center gap-2 font-outfit text-[10px] font-medium tracking-[0.2em] uppercase text-[#d4af37]">
                        <span>Explore</span>
                        <div className="h-px w-8 flex-shrink-0"
                          style={{ background:"linear-gradient(90deg,#d4af37,transparent)" }}/>
                        <svg width="13" height="9" viewBox="0 0 13 9" fill="none">
                          <path d="M8.5 1L12 4.5M12 4.5L8.5 8M12 4.5H1" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom controls ── */}
          <div className="mt-8 flex flex-col gap-4">

            {/* Progress bar */}
            <div className="cat-progress-bg">
              <div className="cat-progress-fill" style={{ width:`${progressPct}%` }}/>
            </div>

            {/* Dots + CTA */}
            <div className="flex items-center justify-between flex-wrap gap-4">

              {/* Dot row */}
              <div className="flex items-center gap-1.5">
                {categories.map((_, i) => {
                  const isActive = i === activeIdx ||
                    (i > activeIdx && i < activeIdx + Math.floor(slidesVis));
                  return (
                    <button
                      key={i}
                      className={`cat-dot ${i === activeIdx ? "on" : ""}`}
                      style={{ width: i === activeIdx ? "28px" : "14px" }}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  );
                })}
              </div>

              {/* View all */}
              <a href="/men"
                className="cat-view-btn inline-flex items-center gap-3 px-8 py-3 font-outfit text-[10px] font-medium uppercase bg-transparent">
                <span className="relative z-10">View All Collections</span>
                <svg className="relative z-10" width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path d="M9 1L13 4.5M13 4.5L9 8M13 4.5H1" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
// developed by asif section
export default Categories;