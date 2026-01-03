import { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
   const res = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
      email,
      password,
    });
    alert(res.data);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign Up</h2>
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
          <button className="login-btn" onClick={handleSignup}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;