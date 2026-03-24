import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const { clearCart } = useCart();

  const handleLogout = () => {
    clearCart(); // ✅ clear cart
    logout();    // ✅ logout user
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
