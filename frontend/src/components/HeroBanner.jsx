      import { useEffect, useState, useRef } from "react";
      import heroSlides from "../data/herodata";

      const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300&family=Outfit:wght@200;300;400;500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-outfit    { font-family: 'Outfit', sans-serif; }
        @keyframes hb-zoom  { from{transform:scale(1.06)} to{transform:scale(1.0)} }
        @keyframes hb-rise  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hb-drip  { 0%,100%{opacity:.7;transform:scaleY(1);transform-origin:top} 50%{opacity:.15;transform:scaleY(0.4);transform-origin:top} }
        .hb-zoom  { animation: hb-zoom  6s ease-out forwards; }
        .hb-rise-1{ animation: hb-rise 0.6s ease 0.15s both; }
        .hb-rise-2{ animation: hb-rise 0.75s ease 0.32s both; }
        .hb-rise-3{ animation: hb-rise 0.65s ease 0.50s both; }
        .hb-rise-4{ animation: hb-rise 0.65s ease 0.65s both; }
        .hb-rise-scroll { animation: hb-rise 1s ease 2s both; }
        .hb-drip  { animation: hb-drip  2s ease-in-out infinite; }
        .hb-btn-primary::before { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.18); transform:translateX(-110%); transition:transform .45s ease; }
        .hb-btn-primary:hover::before { transform:translateX(0); }
        .hb-btn-ghost { border-bottom:1px solid rgba(212,175,55,0.38); transition:color .3s,border-color .3s,gap .3s; }
        .hb-btn-ghost:hover { color:#f5f0e8; border-color:rgba(212,175,55,0.75); gap:14px; }
      `;

      const HeroBanner = () => {
        const [current, setCurrent] = useState(0);
        const [progress, setProgress] = useState(0);
        const timerRef  = useRef(null);
        const progRef   = useRef(null);
        const DURATION  = 5000;

        const startTimers = () => {
          clearTimeout(timerRef.current);
          clearInterval(progRef.current);
          setProgress(0);
          let elapsed = 0;
          progRef.current = setInterval(() => {
            elapsed += 40;
            setProgress(Math.min((elapsed / DURATION) * 100, 100));
          }, 40);
          timerRef.current = setTimeout(() => {
            setCurrent((c) => (c + 1) % heroSlides.length);
          }, DURATION);
        };

        useEffect(() => {
          startTimers();
          return () => { clearTimeout(timerRef.current); clearInterval(progRef.current); };
        }, [current]);

        const goTo = (idx) => { if (idx !== current) setCurrent(idx); };

        const slide = heroSlides[current];
        const words = slide.title.trim().split(" ");
        const lastWord = words.pop();
        const restWords = words.join(" ");

        const C = 2 * Math.PI * 9; // circumference r=9

        return (
          <>
            <style>{styles}</style>
            <section className="font-outfit relative w-full overflow-hidden bg-[#0a0a0a]"
              style={{height:"100svh", minHeight:"520px", maxHeight:"1080px"}}
              aria-label="Hero banner">

              {/* BG — keyed for Ken Burns restart */}
              <div
                key={`bg-${current}`}
                className="hb-zoom absolute inset-0 bg-cover bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundPosition: "center center",
                }}
              />

              {/* Overlay — left+bottom gradient */}
              <div className="absolute inset-0"
                style={{background:"linear-gradient(105deg,rgba(0,0,0,0.78) 0%,rgba(0,0,0,0.35) 55%,rgba(0,0,0,0.05) 100%), linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 55%)"}}/>

              {/* Gold vertical rule */}
              <div className="absolute top-[12%] bottom-[12%] left-14 w-px hidden md:block"
                style={{background:"linear-gradient(to bottom,transparent,rgba(212,175,55,0.4),transparent)"}}/>

              {/* Text content — keyed for animation replay */}
              <div key={`text-${current}`}
                className="absolute inset-0 z-10 flex items-end px-6 pb-16 md:pb-20 md:pl-24 md:pr-16">
                <div className="max-w-[580px] w-full">

                  {/* Eyebrow */}
                  <div className="hb-rise-1 flex items-center gap-3 font-outfit text-[10px] font-normal tracking-[0.34em] uppercase text-[#d4af37] mb-3.5">
                    <div className="w-7 h-px bg-[#d4af37] flex-shrink-0"/>
                    Universal Trend
                  </div>

                  {/* Title */}
                  <h1 className="hb-rise-2 font-cormorant font-extralight text-[#f5f0e8] leading-none tracking-tight m-0 mb-4"
                    style={{fontSize:"clamp(42px,6.5vw,86px)"}}>
                    {restWords && <>{restWords} </>}
                    <em className="italic font-light text-[#d4af37]">{lastWord}</em>
                  </h1>

                  {/* Subtitle */}
                  <p className="hb-rise-3 font-outfit text-[13px] font-light tracking-wide text-[rgba(245,240,232,0.58)] leading-7 m-0 mb-8">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="hb-rise-4 flex items-center gap-5 flex-wrap">
                    <a href="/men"
                      className="hb-btn-primary relative overflow-hidden inline-flex items-center gap-3 px-8 py-3.5 bg-[#d4af37] text-[#0a0a0a] font-outfit text-[10px] font-semibold tracking-[0.26em] uppercase no-underline cursor-pointer"
                      style={{transition:"gap .35s ease"}}>
                      <span className="relative z-10">Shop Now</span>
                      <svg className="relative z-10" width="13" height="9" viewBox="0 0 13 9" fill="none">
                        <path d="M8.5 1L12 4.5M12 4.5L8.5 8M12 4.5H1" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                    {/* <a href="/collections"
                      className="hb-btn-ghost inline-flex items-center gap-2 pb-2 bg-transparent font-outfit text-[10px] font-normal tracking-[0.2em] uppercase no-underline cursor-pointer text-[rgba(245,240,232,0.6)]">
                      Explore All
                      <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path d="M7 1L10 4.5M10 4.5L7 8M10 4.5H1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a> */}
                  </div>
                </div>
              </div>

              {/* Ghost slide counter */}
              <div className="absolute bottom-20 right-16 z-20 pointer-events-none hidden md:flex items-baseline gap-1">
                <span className="font-cormorant font-extralight leading-none tracking-tight"
                  style={{fontSize:"52px", color:"rgba(245,240,232,0.07)"}}>
                  {String(current+1).padStart(2,"0")}
                </span>
                <span className="font-cormorant font-light text-xs mx-1"
                  style={{color:"rgba(212,175,55,0.25)", letterSpacing:"0.1em"}}>/</span>
                <span className="font-cormorant font-light text-sm"
                  style={{color:"rgba(212,175,55,0.3)"}}>
                  {String(heroSlides.length).padStart(2,"0")}
                </span>
              </div>

              {/* Dot nav */}
              <nav className="absolute right-7 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1.5
                sm:right-7 sm:top-1/2 sm:-translate-y-1/2 sm:flex-col
                max-sm:right-auto max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-auto max-sm:bottom-5 max-sm:translate-y-0 max-sm:flex-row max-sm:gap-2"
                aria-label="Slides">
                {heroSlides.map((_, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      aria-label={`Slide ${idx+1}`}
                      className="relative w-6 h-6 flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                    >
                      {isActive && (
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(212,175,55,0.18)" strokeWidth="1"/>
                          <circle cx="12" cy="12" r="9" fill="none" stroke="#d4af37" strokeWidth="1"
                            strokeDasharray={C}
                            strokeDashoffset={C-(progress/100)*C}
                            strokeLinecap="round"
                            style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset .04s linear"}}/>
                        </svg>
                      )}
                      <div className={`w-1.5 h-1.5 rounded-full relative z-10 transition-all duration-300 ${isActive?"bg-[#d4af37] scale-125":"bg-[rgba(212,175,55,0.3)]"}`}/>
                    </button>
                  );
                })}
              </nav>

              {/* Scroll hint */}
              <div className="hb-rise-scroll absolute bottom-6 left-24 z-20 hidden md:flex flex-col items-center gap-1.5 pointer-events-none">
                <span className="font-outfit text-[8px] font-normal tracking-[0.3em] uppercase text-[rgba(212,175,55,0.4)]">
                  Scroll
                </span>
                <div className="hb-drip w-px h-8"
                  style={{background:"linear-gradient(to bottom,rgba(212,175,55,0.45),transparent)"}}/>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 z-30 bg-[rgba(255,255,255,0.06)]">
                <div className="h-full relative transition-[width] duration-[40ms] linear"
                  style={{
                    width:`${progress}%`,
                    background:"linear-gradient(90deg,#b8932e,#d4af37,#f0d060)"
                  }}>
                  <div className="absolute -right-px -top-px w-0.5 h-1 bg-[rgba(245,240,232,0.7)] rounded-sm"/>
                </div>
              </div>

            </section>
          </>
        );
      };
      export default HeroBanner;