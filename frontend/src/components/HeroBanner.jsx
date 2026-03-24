

import { useEffect, useState } from "react";
import heroSlides from "../data/herodata";

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[50vh] md:h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0"
          }`}
        >
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Text */}
          <div className="relative z-20 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="ml-auto max-w-xl text-right text-white">
                <span className="text-xs tracking-[0.35em] uppercase text-gray-200">
                  Universal Trend
                </span>

                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold">
                  {slide.title}
                </h1>

                <p className="mt-4 text-gray-200 text-base sm:text-lg">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroBanner;
