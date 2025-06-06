import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import uploadFile from "../helper/uploadFile";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadedData = await uploadFile(file);
      const fileName = file.name;
      const uploadedFileUrl = uploadedData?.secure_url || "";
      setUploadPhoto(fileName);
      setData((prev) => ({ ...prev, profile_pic: uploadedFileUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setUploading(false);
  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto(null);
    setData((prev) => ({ ...prev, profile_pic: "" }));
  };

  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/send-verification-code`,
        { email: data.email }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setShowVerification(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error sending verification code."
      );
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/register`,
        { ...data, verificationCode }
      );
      if (response.data.success) {
        toast.success("Registration successful.");
        navigate("/email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')",
        // backgroundSize: "cover",
        backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="bg-white w-100"
        style={{ maxWidth: "400px", borderRadius: "10px", padding: "20px" }}
      >
        <h3 className="mb-4 text-center">Welcome to Chat App!</h3>

        {!showVerification ? (
          <form className="mx-2" onSubmit={handleSendVerificationCode}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={data.name}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={data.email}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={data.password}
                onChange={handleOnChange}
                required
              />
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              <label htmlFor="profile_pic" className="form-label">
                Photo:
              </label>
              <div
                className="border rounded d-flex justify-content-center align-items-center p-3 bg-light hover-border-primary"
                style={{
                  height: "56px",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => document.getElementById("profile_pic").click()}
              >
                <p className="small mb-0">
                  {uploading
                    ? "Uploading..."
                    : uploadPhoto
                    ? `Uploaded: ${uploadPhoto}`
                    : "Upload profile photo"}
                </p>
                {uploadPhoto && (
                  <button
                    className="btn btn-light ms-2"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="form-control"
                hidden
                onChange={handleUploadPhoto}
              />
            </div>

            <button className="btn btn-primary w-100">
              Send Verification Code
            </button>

            <p className="text-center mt-3">
              Already have an account?
              <Link to="/email" className="text-primary ms-1">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form className="mx-2" onSubmit={handleVerifyCode}>
            <div className="mb-3">
              <label htmlFor="code" className="form-label">
                Enter Verification Code:
              </label>
              <input
                type="text"
                id="code"
                className="form-control"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-success w-100">Verify Code</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
