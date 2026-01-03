import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
      email,
      password,
    });
    alert(res.data);
    if (res.data === "Login success") {
      sessionStorage.setItem("admin", "true"); 
      navigate("/menu"); 
    } else {
      alert(res.data); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="login-btn" onClick={handleLogin}>Login</button>
        </form>

        
        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;