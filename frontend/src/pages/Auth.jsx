import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    // SAVE USER + TOKEN
    login({
      token: data.token,
      user: data.user,
    });
    toast.success("Login Successful 🎉");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 border rounded-lg w-full max-w-md">

        <h1 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="border w-full px-3 py-2"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="border w-full px-3 py-2"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          {/* Password with Show Button */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border w-full px-3 py-2 pr-12"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <button
              type="button"
              className="absolute right-3 top-2 text-sm text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Forgot Password (Only Login) */}
          {isLogin && (
            <p className="text-right text-sm text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

        </form>

        <p className="text-sm text-center mt-6">
          {isLogin ? "New user?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 underline"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>

      </div>
    </section>
  );
};

export default Auth;