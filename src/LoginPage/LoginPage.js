import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from '../Footer/Footer'; // Adjust the import path as needed

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Input validation
      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      const response = await fetch("http://155.138.223.29:3002/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.accessToken) {
          handleToken(userData.accessToken);

          const decodedToken = decodeToken(userData.accessToken);

          if (decodedToken && decodedToken.userId) {
            const { userId } = decodedToken;
            const { firstname } = userData;

            localStorage.setItem("userId", userId);
            localStorage.setItem("firstname", firstname);

            navigate("/Dashboard");
          } else {
            console.error("User ID not found in decoded token:", decodedToken);
          }
        } else {
          console.error("Access token not found in server response:", userData);
        }
      } else {
        alert("Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToken = (token) => {
    localStorage.setItem("token", token);

    const expirationTime = new Date().getTime() + 60 * 1000;
    localStorage.setItem("tokenExpiration", expirationTime);
  };

  const decodeToken = (token) => {
    try {
      const decodedString = atob(token.split(".")[1]);
      const decodedObject = JSON.parse(decodedString);
      return decodedObject;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const styles = {
    container: {
      position: "relative",
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      boxShadow: "0 5px 10px rgba(0,0,0,0.2)",
      backgroundColor: "#fff",
      borderRadius: "8px",
      textAlign: "center",
      overflow: "hidden",
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url("${process.env.PUBLIC_URL}/background.png")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(8px)",
      zIndex: -1,
      transition: "filter 0.5s ease",
    },
    heading: {
      fontSize: "32px",
      fontWeight: "700",
      color: "#3498db",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
    },
    label: {
      fontSize: "16px",
      fontWeight: "500",
      color: "#333",
      marginBottom: "10px",
      textAlign: "left",
    },
    input: {
      height: "40px",
      width: "100%",
      outline: "none",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "0 10px",
      fontSize: "16px",
      marginBottom: "16px",
      transition: "border-color 0.3s ease",
    },
    button: {
      color: "#fff",
      backgroundColor: loading ? "#95a5a6" : "#3498db",
      borderRadius: "6px",
      padding: "12px",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.4s ease",
      border: "none",
      outline: "none",
      fontSize: "16px",
      fontWeight: "600",
      letterSpacing: "1px",
    },
    registerLink: {
      color: "#e74c3c",
      textDecoration: "none",
      fontSize: "14px",
      marginTop: "12px",
      transition: "color 0.4s ease",
      fontWeight: "500",
    },
    footer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      color: "#333", // Darker grey text color
      padding: "10px",
      textAlign: "center",
    },
  };

  return (
    <div>
      <div style={styles.container} role="main">
        <div style={styles.backgroundImage}></div>
        <h2 style={styles.heading}>Welcome back, Money Maestro!💰</h2>
        <form style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              aria-label="Username" // Added aria-label for accessibility
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={styles.input}
              aria-label="Password" // Added aria-label for accessibility
            />
          </label>
          <button type="button" onClick={handleLogin} style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <Link to="/register" style={styles.registerLink}>
          Ready to join the budget party? Be a money maestro! REGISTER HERE!
          <span style={styles.loginIcon}>🔑</span>
        </Link>
      </div>
      <div style={styles.footer} role="contentinfo">
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
