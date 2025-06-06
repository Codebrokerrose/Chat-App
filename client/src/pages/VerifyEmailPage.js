// src/pages/VerifyEmailPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";


const VerifyEmailPage = () => {
  const { id, token } = useParams();
  const [validUrl, setValidUrl] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/registerUser/${id}/verify/${token}`
        );
        setValidUrl(true);
        toast.success(response.data.message || "Email verified successfully!");
      } catch (error) {
        setValidUrl(false);
        toast.error(
          error.response?.data?.message || "Invalid or expired link."
        );
      }
    };

    verifyEmail();
  }, [id, token]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow text-center">
        {validUrl === null ? (
          <p>Verifying...</p>
        ) : validUrl ? (
          <>
            <h4>Email Verified Successfully!</h4>
            <Link to="/email" className="btn btn-primary mt-3">
              Login
            </Link>
          </>
        ) : (
          <h4 className="text-danger">Invalid or Expired Link</h4>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
