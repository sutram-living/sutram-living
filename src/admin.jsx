import { useState } from "react";
import "./index.css";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Wrong username or password");
    }
  };

  if (!loggedIn) {
    return (
      <div className="admin-login-page">

        <div className="admin-login-box">

          <div className="admin-logo">
            🏠
          </div>

          <h1>SUTRAM LIVING</h1>

          <p>Admin Login</p>

          <form onSubmit={login}>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button type="submit">
              Login →
            </button>

          </form>

        </div>

      </div>
    );
  }

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <h1>SUTRAM LIVING</h1>
          <p>Admin Dashboard</p>
        </div>

        <button
          className="admin-logout"
          onClick={() => setLoggedIn(false)}
        >
          Logout
        </button>

      </header>


      <div className="admin-dashboard">

        <div className="admin-card">
          <span>🕯️</span>
          <h3>Candles</h3>
          <p>Manage Candle Products</p>
          <button>Manage Products</button>
        </div>


        <div className="admin-card">
          <span>🍯</span>
          <h3>ಶುದ್ಧವಾದ ಜೇನು</h3>
          <p>Manage Honey Products</p>
          <button>Manage Products</button>
        </div>


        <div className="admin-card">
          <span>🍫</span>
          <h3>ಚಾಕೊಲೇಟ್</h3>
          <p>Manage Chocolate Products</p>
          <button>Manage Products</button>
        </div>


        <div className="admin-card">
          <span>☕</span>
          <h3>ಕಾಫಿ ಪೌಡರ್</h3>
          <p>Manage Coffee Products</p>
          <button>Manage Products</button>
        </div>


        <div className="admin-card orders-card">
          <span>📦</span>
          <h3>Orders</h3>
          <p>View Customer Orders</p>
          <button>View Orders</button>
        </div>


        <div className="admin-card">
          <span>📸</span>
          <h3>Product Photos</h3>
          <p>Add or change product photos</p>
          <button>Manage Photos</button>
        </div>

      </div>

    </div>
  );
}

export default Admin;