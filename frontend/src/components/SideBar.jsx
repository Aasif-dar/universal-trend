import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

import {
  FiUser,
  FiShoppingBag,
  FiPackage,
  FiLogOut,
  FiShoppingCart,
  FiGrid,
} from "react-icons/fi";

const SideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [view, setView] = useState("menu");
  const isAdmin = user?.user?.role === "admin";

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition ${
      location.pathname === path
        ? "bg-black text-white"
        : "hover:bg-gray-100 text-gray-700"
    }`;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "visible" : "invisible"}`}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
            {user ? user?.user?.name?.charAt(0) : "G"}
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Welcome
            </p>
            <p className="font-semibold">
              {user ? user.user.name : "Guest"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm font-medium">

          {/* Shop */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">Shop</p>

            <ul className="space-y-1">
              <li onClick={() => goTo("/men")} className={linkClass("/men")}>
                <FiShoppingBag /> Men
              </li>

              <li onClick={() => goTo("/women")} className={linkClass("/women")}>
                <FiShoppingBag /> Women
              </li>

              <li
                onClick={() => goTo("/fragrances")}
                className={linkClass("/fragrances")}
              >
                <FiShoppingBag /> Fragrances
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">Account</p>

            <ul className="space-y-1">
              {user ? (
                <>
                  <li
                    onClick={() => setView("profile")}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <FiUser /> My Profile
                  </li>
                  

                  <li
                    onClick={() => goTo("/my-orders")}
                    className={linkClass("/my-orders")}
                  >
                    <FiPackage /> My Orders
                  </li>

                  <li
                    onClick={() => goTo("/cart")}
                    className={linkClass("/cart")}
                  >
                    <FiShoppingCart /> Cart
                  </li>
                </>
              ) : (
                <li
                  onClick={() => goTo("/login")}
                  className={linkClass("/login")}
                >
                  <FiUser /> Login
                </li>
              )}
            </ul>
          </div>

          {/* Admin */}
          {isAdmin && (
            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">Admin</p>

              <ul className="space-y-1">
                <li
                  onClick={() => goTo("/admin/add-product")}
                  className={linkClass("/admin/add-product")}
                >
                  <FiGrid /> Add Product
                </li>

                <li
                  onClick={() => goTo("/admin/products")}
                  className={linkClass("/admin/products")}
                >
                  <FiGrid /> Manage Products
                </li>

                <li
                  onClick={() => goTo("/admin/orders")}
                  className={linkClass("/admin/orders")}
                >
                  <FiGrid /> Manage Orders
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t px-6 py-4 space-y-3">
          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/");
                onClose();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              <FiLogOut /> Logout
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Universal Trend
          </p>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;