import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard from "./ProductCard";
import customFetch from "../utils/customFetch"; // ✅ added

const AUTO_MS = 2800;

const PopularProducts = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused]       = useState(false);

  const trackRef    = useRef(null);
  const autoRef     = useRef(null);
  const resumeTimer = useRef(null);

  /* ── ✅ Fetch using customFetch ── */
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await customFetch.get("/products/popular");
        const data = res.data;

        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Popular products error:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const totalItems = loading ? 4 : products.length;

  const scrollToIdx = useCallback((idx) => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll(".pp-slide");
    if (!slides[idx]) return;

    const diff =
      slides[idx].getBoundingClientRect().left -
      track.getBoundingClientRect().left;

    track.scrollBy({ left: diff, behavior: "smooth" });
    setActiveIdx(idx);
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll(".pp-slide");
    const tl = track.getBoundingClientRect().left;

    let best = 0,
      bestD = Infinity;

    slides.forEach((el, i) => {
      const d = Math.abs(el.getBoundingClientRect().left - tl);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });

    setActiveIdx(best);
  }, []);

  const handleTouchStart = useCallback(() => {
    setPaused(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 5000);
  }, []);

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

  useEffect(
    () => () => {
      clearInterval(autoRef.current);
      clearTimeout(resumeTimer.current);
    },
    []
  );

  return (
    <section className="py-16 bg-[#faf7f2]">
      <div className="max-w-6xl mx-auto px-4">

        <h2 className="text-3xl font-semibold mb-6">
          Popular Products
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No popular products</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default PopularProducts;