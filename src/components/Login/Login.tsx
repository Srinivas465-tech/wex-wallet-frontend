import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import { login } from "../../service/service";
import { setId } from "../../utils/storage";
import type { SubmitEvent } from "react";

export default function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!userName || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (userName.length < 4 || password.length < 4) {
      setError("Username and password must be at least 4 char");
      setLoading(false);
      return;
    }
    handleLogin();
  };

  const handleLogin = async () => {
    try {
      const response = await login(userName, password);
      setId(response.data.id);
      navigate("/home");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <aside className="login-brand">
          <div className="login-brand-logo">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M21 7H5a1 1 0 0 1 0-2h13a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-4 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
            </svg>
            <span>WexWallets</span>
          </div>
          <h1 className="login-brand-title">Welcome back</h1>
          <p className="login-brand-text">
            Manage your money, track spending, and stay in control — all in one
            secure wallet.
          </p>
        </aside>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p className="login-subtitle">Enter your details to continue</p>

          {error && <p className="login-error">{error}</p>}

          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
