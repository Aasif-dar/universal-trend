import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

const SideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [view, setView] = useState("menu"); // menu | profile
  const isAdmin = user?.user?.role === "admin";

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  // Disable scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  // Reset view when closed
  useEffect(() => {
    if (!isOpen) setView("menu");
  }, [isOpen]);

  const linkClass = (path) =>
    `px-3 py-2 rounded cursor-pointer transition ${
      location.pathname === path
        ? "bg-black text-white"
        : "hover:bg-gray-100"
    }`;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400">
              {user ? "Welcome" : "Hello"}
            </p>
            <p className="font-semibold">
              {user ? user.user.name : "Guest"}
            </p>
          </div>

          {view === "profile" && (
            <button
              onClick={() => setView("menu")}
              className="text-sm underline"
            >
              Back
            </button>
          )}
        </div>

        {/* BODY */}
        <nav className="px-6 py-6 space-y-8 text-sm font-medium">

          {/* PROFILE VIEW */}
          {view === "profile" && user && (
            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Name</p>
                <p>{user.user.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p>{user.user.email}</p>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/");
                }}
                className="w-full border border-red-500 text-red-500 py-2"
              >
                Logout
              </button>
            </div>
          )}

          {/* MENU VIEW */}
          {view === "menu" && (
            <>
              {/* SHOP CATEGORIES */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Shop
                </h4>
                <ul className="space-y-2">
                  <li onClick={() => goTo("/men")} className={linkClass("/men")}>
                    Men
                  </li>
                  <li
                    onClick={() => goTo("/women")}
                    className={linkClass("/women")}
                  >
                    Women
                  </li>
                  <li
                    onClick={() => goTo("/fragrances")}
                    className={linkClass("/fragrances")}
                  >
                    Fragrances
                  </li>
                </ul>
              </div>

              {/* USER ACCOUNT */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Account
                </h4>
                <ul className="space-y-2">
                  {user ? (
                    <>
                      <li
                        onClick={() => setView("profile")}
                        className="px-3 py-2 rounded cursor-pointer hover:bg-gray-100"
                      >
                        My Profile
                      </li>
                      <li
                        onClick={() => goTo("/my-orders")}
                        className={linkClass("/my-orders")}
                      >
                        My Orders
                      </li>
                      <li
                        onClick={() => goTo("/cart")}
                        className={linkClass("/cart")}
                      >
                        Cart
                      </li>
                    </>
                  ) : (
                    <li
                      onClick={() => goTo("/login")}
                      className={linkClass("/login")}
                    >
                      Login
                    </li>
                  )}
                </ul>
              </div>

              {/* ADMIN SECTION */}
              {isAdmin && (
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                    Admin
                  </h4>
                  <ul className="space-y-2">
                    <li
                      onClick={() => goTo("/admin/add-product")}
                      className={linkClass("/admin/add-product")}
                    >
                      Add Product
                    </li>
                    <li
                      onClick={() => goTo("/admin/products")}
                      className={linkClass("/admin/products")}
                    >
                      Manage Products
                    </li>
                    <li
                      onClick={() => goTo("/admin/orders")}
                      className={linkClass("/admin/orders")}
                    >
                      Manage Orders
                    </li>
                  </ul>
                </div>
              )}
            </>
          )}
        </nav>

        {/* FOOTER */}
        <div className="absolute bottom-0 w-full px-6 py-4 border-t text-xs text-gray-500">
          © {new Date().getFullYear()} Universal Trend
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
