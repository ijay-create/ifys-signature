import React, { useState } from "react";
import { LockKeyhole, Mail, ArrowRight, ChefHat, ShieldCheck } from "lucide-react";
import "../styles/AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email.trim().toLowerCase() === "admin@ifysfriedrice.com" && password === "admin123") {
      setError("");
      onLogin();
      return;
    }

    setError("Invalid admin email or password.");
  };

  return (
    <div className="admin-login">
      <div className="admin-login__glow admin-login__glow--one" />
      <div className="admin-login__glow admin-login__glow--two" />

      <div className="admin-login__card">
        <div className="admin-login__brand">
          <div className="admin-login__logo">
            <ChefHat size={25} />
          </div>
          <div>
            <span>Ify&apos;s Signature</span>
            <strong>Admin Portal</strong>
          </div>
        </div>

        <div className="admin-login__heading">
          <span className="admin-eyebrow">
            <ShieldCheck size={15} />
            Secure access
          </span>
          <h1>Welcome back, Ify.</h1>
          <p>Manage orders, catering requests, menu pricing and customer activity from one place.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <label>
            Email address
            <div className="admin-input">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@ifysfriedrice.com"
                required
              />
            </div>
          </label>

          <label>
            Password
            <div className="admin-input">
              <LockKeyhole size={18} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          {error && <div className="admin-login__error">{error}</div>}

          <button className="admin-login__button" type="submit">
            Sign in to dashboard
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="admin-login__demo">
          <strong>Demo access</strong>
          <span>admin@ifysfriedrice.com</span>
          <span>admin123</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
