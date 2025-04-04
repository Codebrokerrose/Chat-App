import React, {useEffect, useState } from "react";
// import { PiUserCircle } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Avtar from "../components/Avtar";
import { useLocation } from "react-router-dom"; // Import useLocation
import { useDispatch } from "react-redux"; // Import useDispatch
import { setToken } from "../redux/userSlice";


const CheckPasswordPage = () => {
  

  // const navigate = useNavigate();
  // const location = useLocation();

  // const [data, setData] = useState({
  //   userId: "", // Initially empty, will be set in useEffect
  //   password: ""
  // });

  // // Set userId once location.state is available
  // useEffect(() => {
  //   if (location.state) {
  //     setData((prev) => ({ ...prev, userId: location.state._id || "" }));
  //   } else {
  //     toast.error("Please enter your email first!");
  //     navigate("/email");
  //   }
  // }, [location.state, navigate]); // Depend on `location.state`

  // const handleOnChange = (e) => {
  //   setData({ ...data, [e.target.name]: e.target.value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
  //   const requestData = {
  //   userId: data.userId,  //  Ensure userId is sent
  //   password: data.password
  // };
  
  //   console.log("API URL:", URL);
  //   console.log("Request Data:", requestData); 

  //   try {
  //     const response = await axios.post(URL, requestData);
  //     if (response.data.success) {
  //       toast.success("Login successful!");
  //       setData({ password: "" });
  //       navigate("/");
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Something went wrong!");
  //   }
  // };

  const [data, setData] = useState({ password: "" });
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the location object
  const dispatch = useDispatch(); // Get the dispatch function

  console.log("Location state:", location.state); // Debugging

  useEffect(() => {
  if (!location?.state?.name) {
    navigate("/email");
    toast.error("Please enter your email first!");
  }
}, [location?.state, navigate]); // Ensure this only runs when location.state changes

  // Check if location.state is available, if not redirect to email page


  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
    // console.log("API URL:", URL); // Debugging

    

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId : location?.state?._id, // Use the userId from location state
          password: data.password
        },
        withCredentials: true
      });
      toast.success(response.data.message || "Registration successful!");

     

      if (response.data.success) {
        dispatch(setToken(response.data.token)); // Set the token in Redux store
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        setData({ password: "" });
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-90 bg-light"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        height: "100vh",
      }}
    >
      

      <div
        className="bg-white w-100"
        style={{
          maxWidth: "400px",
          borderRadius: "10px",
          padding: "20px",
          margin: "20px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div className="d-flex flex-column mx-auto mb-2 justify-content-center align-items-center  ">
        {/* <PiUserCircle 
          size={80}
        /> */}
        <Avtar 
          width={70}
          height={70}
          name={location?.state?.name} // Use the name from location state
          imageUrl={location?.state?.profile_pic} // Use the imageUrl from location state
        />
        <h2 className="fw-semibold fs-4 mt-1">{location?.state?.name || "user"}</h2>
      </div>
        {/* <h3 className="mb-4 text-center">Welcome to Chat App!</h3> */}

        <form className="mx-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={data.password}
              onChange={handleOnChange}
              required
              style={{ backgroundColor: "whitesmoke" }}
            />
          </div>

          <button className="btn btn-primary w-100 py-2 fw-bold" type="submit">
            Login
          </button>

          <p className="text-center mt-3">
            
            <Link to="/forgot-password" className="text-primary text-decoration-none ms-1">
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
