import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://codetracker-production-abf7.up.railway.app";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        { username, password }
      );

      // 🔥 FIXED
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ redirect
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Invalid login");
    }
  };

  const register = async () => {
    try {
      await axios.post(
        `${API}/api/auth/register`,
        { username, password }
      );

      alert("Registered! Now login.");

    } catch (err) {
      console.error(err);
      alert("User exists");
    }
  };

  return (
    <div className="center">
      <h1>CodeTracker 🚀</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Login;
