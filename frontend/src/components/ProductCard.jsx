import { Link } from "react-router-dom";
import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');
  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }
  .pc-card .pc-img { transform:scale(1.06); filter:brightness(0.97); transition:transform 0.8s cubic-bezier(.25,.46,.45,.94),filter .5s ease,opacity .4s ease; }
  .pc-card:hover .pc-img { transform:scale(1.0); filter:brightness(0.88); }
  .pc-card .pc-sweep { width:0%; transition:width 0.55s cubic-bezier(.25,.46,.45,.94); }
  .pc-card:hover .pc-sweep { width:100%; }
  .pc-card .pc-wish { opacity:0; transform:translateY(-4px); transition:opacity .35s,transform .35s,background .3s; }
  .pc-card:hover .pc-wish { opacity:1; transform:translateY(0); }
  .pc-card .pc-quick { transform:translateY(100%); transition:transform 0.45s cubic-bezier(.25,.46,.45,.94); }
  .pc-card:hover .pc-quick { transform:translateY(0%); }
  .pc-wish.wished { opacity:1; transform:translateY(0); background:#0a0a0a; border-color:#0a0a0a; }
  @keyframes pc-fadein { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .pc-fadein { animation: pc-fadein 0.6s ease both; }
`;

const ProductCard = ({ product, index = 0 }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <>
      <style>{styles}</style>
      <Link
        to={`/product/${product._id}`}
        className="pc-card font-outfit pc-fadein flex flex-col no-underline text-inherit bg-white"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Image wrap */}
        <div className="relative overflow-hidden bg-[#f5f0e8]" style={{aspectRatio:"3/4"}}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={`pc-img absolute inset-0 w-full h-full object-cover ${imgLoaded?"opacity-100":"opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none"/>
          {/* Gold sweep */}
          <div className="pc-sweep absolute bottom-0 left-0 h-0.5"
            style={{background:"linear-gradient(90deg,#d4af37,#f0d060,#d4af37)"}}/>

          {/* Discount badge */}
          {discountPct && (
            <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-[#0a0a0a] text-[#d4af37] font-outfit text-[9px] font-semibold tracking-[0.2em] uppercase z-10">
              −{discountPct}%
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 px-4 py-4 pb-5 border border-t-0 border-[#ece8df] flex-1">
          {product.category && (
            <span className="font-outfit text-[9px] font-medium tracking-[0.22em] uppercase text-[#d4af37]">
              {product.category}
            </span>
          )}
          <h3 className="font-cormorant text-[19px] font-normal text-[#1a1a1a] leading-tight tracking-wide m-0">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full overflow-hidden bg-[#ece8df] relative">
                    <div className="absolute inset-0 bg-[#d4af37] rounded-full"
                      style={{width:`${Math.min(100,Math.max(0,(product.rating-(i-1))*100))}%`}}/>
                  </div>
                ))}
              </div>
              <span className="font-outfit text-[10px] font-light text-[#999] tracking-wide">
                {product.rating?.toFixed(1)} ({product.reviewCount||0})
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="font-outfit text-base font-medium text-[#1a1a1a] tracking-wide">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            {hasDiscount && (
              <>
                <span className="font-outfit text-[13px] font-light text-[#aaa] line-through">
                  ₹{product.originalPrice?.toLocaleString("en-IN")}
                </span>
                <span className="font-outfit text-[10px] font-medium text-[#b5883a] tracking-wide">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};
export default ProductCard;