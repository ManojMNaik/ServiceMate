import { useState } from "react";
import "../styles.css";

export default function AuthForm() {

  const [activeTab, setActiveTab] = useState("login");

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState(null);

  const validate = () => {
    // basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (activeTab === "signup") {
      if (!confirmPassword) {
        setError("Please confirm your password");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    // clear any previous error
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) {
      return;
    }

    const url =
      activeTab === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

    const payload = { email, password };
    if (activeTab === "signup") {
      payload.confirmPassword = confirmPassword;
    }

    const response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.token){
      localStorage.setItem("token",data.token);
      window.location.href="/home";
    } else {
      // display server-side errors if present
      if (data.errors && data.errors.length) {
        setError(data.errors[0].msg);
      } else {
        setError(data.message || "Something went wrong");
      }
    }

  };

  return (
    <div className="auth-container">

      <div className="card">

        <h2>{activeTab === "login" ? "Login Form" : "Signup Form"}</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="tabs">

          <button
            type="button"
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          {activeTab === "signup" && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
              required
            />
          )}

          {activeTab === "login" && (
            <p className="forgot">Forgot password?</p>
          )}

          <button className="submit">
            {activeTab === "login" ? "Login" : "Signup"}
          </button>

        </form>

      </div>

    </div>
  );
}