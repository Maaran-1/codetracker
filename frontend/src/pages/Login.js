import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      localStorage.setItem("user", res.data.user.username);

      navigate("/dashboard");
    } catch (err) {
      alert("Invalid login");
    }
  };

  const register = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, password }
      );

      alert("Registered! Now login.");
    } catch (err) {
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