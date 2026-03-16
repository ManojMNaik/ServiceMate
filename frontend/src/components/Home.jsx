import "./home.css";

export default function Home() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">ServiceMate</div>

        <ul className="nav-links">
          <li>About Us</li>
          <li>Contact Us</li>
          <li>FAQ</li>
          <button
            className="login-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </ul>
      </nav>

      <div className="hero">
        <h1>WELCOME</h1>

        <p>
          Welcome to ServiceMate — Your trusted platform for booking local
          services quickly and easily.
        </p>

        <button className="learn-btn">Learn More</button>
      </div>
    </div>
  );
}
