import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMsg("");
    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Registered! You can now login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input className="border p-2 w-full mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {msg && <div className="text-green-600 mb-2">{msg}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
    </form>
  );
};

export default Register;