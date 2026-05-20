import { useState, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { toast } from "sonner";
import customFetch from "../utils/customFetch";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300&family=Outfit:wght@200;300;400;500;600&display=swap');

  .font-cormorant { font-family: 'Cormorant Garamond', serif; }
  .font-outfit    { font-family: 'Outfit', sans-serif; }

  .auth-input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid rgba(212,175,55,0.18);
    background: rgba(250,247,242,0.6);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: #1a1a1a;
    letter-spacing: 0.03em;
    outline: none;
    transition: border-color .3s, background .3s;
  }

  .auth-input:focus {
    border-color: rgba(212,175,55,0.55);
    background: #fff;
  }

  .auth-input::placeholder {
    color: rgba(26,26,26,0.3);
  }

  .auth-btn {
    width: 100%;
    padding: 14px;
    background: #0a0a0a;
    color: #d4af37;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: opacity .3s;
  }

  .auth-btn:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .auth-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    color: #d4af37;
  }

  .otp-box {
    width: 48px;
    height: 56px;
    border: 1px solid rgba(212,175,55,0.2);
    background: rgba(250,247,242,0.6);
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    color: #1a1a1a;
    text-align: center;
    outline: none;
    transition: border-color .3s, background .3s;
    caret-color: #d4af37;
  }

  .otp-box:focus {
    border-color: rgba(212,175,55,0.65);
    background: #fff;
  }
`;

const SCREEN = {
  LOGIN: "login",
  REGISTER_FORM: "register_form",
  REGISTER_OTP: "register_otp",
  FORGOT_EMAIL: "forgot_email",
  FORGOT_OTP: "forgot_otp",
  FORGOT_DONE: "forgot_done",
};

if (!document.getElementById("auth-global-style")) {
  const style = document.createElement("style");
  style.id = "auth-global-style";
  style.innerHTML = styles;
  document.head.appendChild(style);
}

/* =========================================================
   OTP INPUT COMPONENT
========================================================= */

const OTPInputs = memo(
  ({ otpDigits, setOtpDigits }) => {
    const otpRefs = useRef([]);

    const handleChange = (value, index) => {
      if (!/^\d?$/.test(value)) return;

      const updated = [...otpDigits];
      updated[index] = value;

      setOtpDigits(updated);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (e, index) => {
      if (
        e.key === "Backspace" &&
        !otpDigits[index] &&
        index > 0
      ) {
        otpRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e) => {
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

      if (pasted.length === 6) {
        setOtpDigits(pasted.split(""));
        otpRefs.current[5]?.focus();
      }
    };

    return (
      <div
        className="flex gap-2.5 justify-center"
        onPaste={handlePaste}
      >
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (otpRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            className="otp-box"
            onChange={(e) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
          />
        ))}
      </div>
    );
  }
);

/* =========================================================
   CARD WRAPPER
========================================================= */

const Card = ({ title, subtitle, children }) => (
  <div
    className="bg-white w-full max-w-[420px] mx-auto"
    style={{
      border: "1px solid rgba(212,175,55,0.18)",
    }}
  >
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(90deg,transparent,rgba(212,175,55,0.5),transparent)",
      }}
    />

    <div className="px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="font-cormorant text-[26px] font-light text-[#1a1a1a]">
          Universal{" "}
          <em className="italic text-[#d4af37]">
            Trend
          </em>
        </h1>
      </div>

      <div className="mb-7">
        <h2 className="font-cormorant text-[22px] font-light text-[#1a1a1a]">
          {title}
        </h2>

        {subtitle && (
          <p className="font-outfit text-[12px] text-[rgba(26,26,26,0.45)]">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  </div>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [screen, setScreen] = useState(SCREEN.LOGIN);

  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
 
  const [resendTimer, setResendTimer] = useState(0);

  const [otpDigits, setOtpDigits] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const otpValue = otpDigits.join("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [resetEmail, setResetEmail] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(60);
  };

  /* =========================================================
     REGISTER SEND OTP
  ========================================================= */

  const handleSendRegisterOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await customFetch.post(
        "/api/auth/send-otp",
        form
      );

      toast.success("OTP sent");

      setOtpDigits(["", "", "", "", "", ""]);

      setScreen(SCREEN.REGISTER_OTP);

      startResendTimer();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     VERIFY REGISTER OTP
  ========================================================= */

  const handleVerifyRegisterOTP = async (e) => {
    e.preventDefault();

    if (otpValue.length < 6) {
      return toast.warning("Enter all digits");
    }

    try {
      setLoading(true);

      const res = await customFetch.post(
        "/api/auth/verify-otp",
        {
          ...form,
          otp: otpValue,
        }
      );

      login({
        token: res.data.token,
        user: res.data.user,
      });

      toast.success("Account created");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await customFetch.post(
        "/api/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      login({
        token: res.data.token,
        user: res.data.user,
      });

      toast.success("Welcome back");

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SEND RESET OTP
  ========================================================= */

  const handleSendResetOTP = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await customFetch.post(
        "/api/auth/forgot-password",
        {
          email: resetEmail,
        }
      );

      toast.success("OTP sent");

      setOtpDigits(["", "", "", "", "", ""]);

      setScreen(SCREEN.FORGOT_OTP);

      startResendTimer();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET PASSWORD
  ========================================================= */

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (otpValue.length < 6) {
      return toast.warning("Enter OTP");
    }

    if (newPassword.length < 6) {
      return toast.warning(
        "Password must be 6 characters"
      );
    }

    try {
      setLoading(true);

      await customFetch.post(
        "/api/auth/reset-password",
        {
          email: resetEmail,
          otp: otpValue,
          newPassword,
        }
      );

      setScreen(SCREEN.FORGOT_DONE);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESEND
  ========================================================= */

  const handleResend = async (type) => {
    const email =
      type === "verify"
        ? form.email
        : resetEmail;

    try {
      await customFetch.post(
        "/api/auth/resend-otp",
        {
          email,
          type,
        }
      );

      toast.success("OTP resent");

      setOtpDigits(["", "", "", "", "", ""]);

      startResendTimer();
    } catch {
      toast.error("Failed to resend");
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
  <section className="font-outfit min-h-screen flex items-center justify-center bg-[#faf7f2] px-5 py-10">
    <div className="w-full max-w-[420px]">

      {/* LOGIN */}

      {screen === SCREEN.LOGIN && (
        <Card
          title="Welcome back"
          subtitle="Sign in to your account"
        >
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4"
          >
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <div className="relative">
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                onClick={() =>
                  setShowPass(!showPass)
                }
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  setScreen(SCREEN.FORGOT_EMAIL)
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

            <button
              type="button"
              className="auth-link"
              onClick={() =>
                setScreen(SCREEN.REGISTER_FORM)
              }
            >
              Create account
            </button>
          </form>
        </Card>
      )}

      {/* FORGOT EMAIL */}

      {screen === SCREEN.FORGOT_EMAIL && (
        <Card
          title="Reset password"
          subtitle="Enter your email"
        >
          <form
            onSubmit={handleSendResetOTP}
            className="flex flex-col gap-4"
          >
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) =>
                setResetEmail(e.target.value)
              }
            />

            <button
              type="submit"
              className="auth-btn"
            >
              Send Reset OTP
            </button>

            <button
              type="button"
              className="auth-link"
              onClick={() =>
                setScreen(SCREEN.LOGIN)
              }
            >
              Back to login
            </button>
          </form>
        </Card>
      )}

      {/* FORGOT OTP */}

      {screen === SCREEN.FORGOT_OTP && (
        <Card
          title="Reset Password"
          subtitle={`Code sent to ${resetEmail}`}
        >
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-5"
          >
            <OTPInputs
              otpDigits={otpDigits}
              setOtpDigits={setOtpDigits}
            />
            <div className="relative">
            <input
              className="auth-input"
              type={showPass ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                onClick={() =>
                  setShowPass(!showPass)
                }
              >
                {showPass ? "Hide" : "Show"}
              </button>
              </div>

            <button
              type="submit"
              className="auth-btn"
            >
              Reset Password
            </button>

            {resendTimer > 0 ? (
              <p className="text-center text-sm">
                Resend in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  handleResend("reset")
                }
              >
                Resend OTP
              </button>
            )}
          </form>
        </Card>
      )}

      {/* FORGOT DONE */}

      {screen === SCREEN.FORGOT_DONE && (
        <Card
          title="Password Updated"
          subtitle="You can now login with your new password"
        >
          <div className="flex flex-col gap-4">
            <button
              className="auth-btn"
              onClick={() =>
                setScreen(SCREEN.LOGIN)
              }
            >
              Back To Login
            </button>
          </div>
        </Card>
      )}

      {/* REGISTER */}

      {screen === SCREEN.REGISTER_FORM && (
        <Card
          title="Create account"
          subtitle="Get started"
        >
          <form
            onSubmit={handleSendRegisterOTP}
            className="flex flex-col gap-4"
          >
            <input
              className="auth-input"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
            <div className="relative">
            <input
              className="auth-input"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                onClick={() =>
                  setShowPass(!showPass)
                }
              >
                {showPass ? "Hide" : "Show"}
              </button>
              </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-btn"
            >
              Send OTP
            </button>

            <button
              type="button"
              className="auth-link"
              onClick={() =>
                setScreen(SCREEN.LOGIN)
              }
            >
              Already have an account?
            </button>
          </form>
        </Card>
      )}

      {/* REGISTER OTP */}

      {screen === SCREEN.REGISTER_OTP && (
        <Card
          title="Verify OTP"
          subtitle={`Code sent to ${form.email}`}
        >
          <form
            onSubmit={
              handleVerifyRegisterOTP
            }
            className="flex flex-col gap-6"
          >
            <OTPInputs
              otpDigits={otpDigits}
              setOtpDigits={setOtpDigits}
            />

            <button
              type="submit"
              className="auth-btn"
            >
              Verify Account
            </button>

            {resendTimer > 0 ? (
              <p className="text-center text-sm">
                Resend in {resendTimer}s
              </p>
            ) : (
              <button
                type="button"
                className="auth-link"
                onClick={() =>
                  handleResend("verify")
                }
              >
                Resend OTP
              </button>
            )}
          </form>
        </Card>
      )}

    </div>
  </section>
);
};

export default Auth;