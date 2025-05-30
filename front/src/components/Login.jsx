import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username, password }),
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        navigate("/summary");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input className="border p-2 w-full mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
    </form>
  );
};

export default Login;