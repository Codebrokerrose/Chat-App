import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) return toast.error("Please enter your email.");
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`,
        { email }
      );
      toast.success(data.message);
      setCodeSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return toast.error("Please enter the verification code.");
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/verify-reset-code`,
        { email, code }
      );
      toast.success(data.message);
      setIsVerified(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid verification code."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!isVerified) return toast.error("Please verify the code first.");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match.");
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/reset-password`,
        { email, code, password }
      );
      toast.success(data.message);
      // Reset form
      setEmail("");
      setCode("");
      setPassword("");
      setConfirmPassword("");
      setIsVerified(false);
      setCodeSent(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
      }}
    >
      <motion.div
        className="bg-white p-4 shadow rounded"
        style={{ maxWidth: 400, width: "100%" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h4
          className="text-center mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Forgot Password
        </motion.h4>

        <form onSubmit={handleResetPassword}>
          {/* Email Field */}
          <div className="mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="button"
            className="btn btn-primary w-100 mb-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendCode}
          >
            Send Verification Code
          </motion.button>

          <p className="text-center mt-3">
            Remember?
            <Link to="/email" className="text-primary ms-1">
              Login
            </Link>
          </p>

          {/* Verification Code */}
          {codeSent && (
            <>
              <div className="mb-3">
                <label>Verification Code:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter the code sent to your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="button"
                className="btn btn-success w-100 mb-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVerifyCode}
              >
                Verify Code
              </motion.button>
            </>
          )}

          {/* Password Reset Fields (visible after verification) */}
          {isVerified && (
            <>
              <div className="mb-3">
                <label>New Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary w-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit New Password
              </motion.button>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
// This code is a React component for a "Forgot Password" feature.
// It allows users to reset their password by sending a verification code to their email, verifying that code, and then setting a new password.