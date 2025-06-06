// src/pages/ResetPassword.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/reset-password/${id}/${token}`,
        { password }
      );
      toast.success(response.data.message || "Password reset successfully!");
      navigate("/email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 shadow rounded" style={{ maxWidth: 400 }}>
        <h4>Reset Your Password</h4>
        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label>New Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-success w-100">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
