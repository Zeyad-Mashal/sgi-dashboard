import React from "react";
import "./Login.css";
import { useState } from "react";
import logo from "../../assets/logo-black.png";
import Auth from "../../API/Auth/Auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const LoginApi = () => {
    const data = {
      email: email,
      password: password,
    };
    Auth(data, setError, setLoading);
  };
  return (
    <div className="login">
      <div className="login_container">
        <div className="login_form">
          <img src={logo} alt="sgi logo" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={LoginApi}>{loading ? "Loading..." : "Login"}</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
