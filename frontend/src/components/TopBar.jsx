
import { useState } from "react";
import { Menu, Search, ShoppingCart, LogIn, X } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
const TopBar = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
const cartCount = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="h-14 px-4 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center  gap-4 w-3xl">
          <button onClick={onMenuClick} className="text-xl">
            <Menu size={22}/>
          </button>
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-xl"
            >
              <Search size={22} />
            </button>
          ) : (
            <button onClick={() => setSearchOpen(false)} className="ml-2">
              <X size={18} />
            </button>
          )}
          {/* Search input */}
          {searchOpen && (
            <input
              autoFocus
              type="text"
              placeholder="Search…"
              className="w-full  border-[1px] border-gray-200 bg-gray-100 px-3 py-1.5 text-sm rounded-sm "
            />
          )}
        </div>

        {/* CENTER */}
        <div className=" md:hidden flex items-center">
          {!searchOpen && (
            <span className=" text-sm sm:text-base self-center font-semibold tracking-[0.35em] uppercase">
              Universal Trend
            </span>
          )}
        </div>
          <div className="hidden  md:flex items-center">
        
            <span className=" text-sm sm:text-base self-center font-semibold tracking-[0.35em] uppercase">
              Universal Trend
            </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Hide login on very small screens */}
          {!user && (
          <button
          onClick={() => navigate("/login")}
          className="hidden sm:block text-sm border px-3 py-1">
          Login
          </button>
)}

          <button
          onClick={() => navigate("/cart")}
          className="relative text-xl">         
          <ShoppingCart size={22} />
          {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
          {cartCount}
          </span>
  )}
</button>



        </div>
      </div>
    </header>
  );
};

export default TopBar;
