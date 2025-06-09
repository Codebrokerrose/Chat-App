import { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avtar'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
// import Divider from './Divider';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';
import logo from '../assets/images/favicon/ai.avif'

const Sidebar = () => {
    const user = useSelector(state => state?.user)
    const [editUserOpen,setEditUserOpen] = useState(false)
    const [allUser,setAllUser] = useState([])
    const [openSearchUser,setOpenSearchUser] = useState(false)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar',user._id)

            
            
            socketConnection.on('conversation',(data)=>{
                console.log('conversation',data)
                
                const conversationUserData = data.map((conversationUser,index)=>{
                    if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser?.sender
                        }
                    }
                    else if(conversationUser?.receiver?._id !== user?._id){
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.receiver
                        }
                    }else{
                        return{
                            ...conversationUser,
                            userDetails : conversationUser.sender
                        }
                    }
                })

                setAllUser(conversationUserData)
            })
        }
    },[socketConnection,user])

  const handleLogout = ()=>{
        dispatch(logout())
        navigate("/email")
        localStorage.clear()
  };

  return (
    <div
      className="h-100 d-grid bg-white"
      style={{ gridTemplateColumns: "48px 1fr", height: "100vh" }}
    >
      {/* Left Icon Column */}
      <div
        className="bg-light d-flex flex-column justify-content-between align-items-center py-3"
        style={{
          width: "48px",
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          backgroundColor: "#f1f5f9",
          color: "#475569",
        }}
      >
        <div>
          <NavLink
            to="/"
            title="Chat"
            className={({ isActive }) =>
              `d-flex justify-content-center align-items-center w-100 py-2 text-decoration-none ${
                isActive ? "bg-secondary text-white" : "text-dark"
              }`
            }
            style={{ borderRadius: "0.375rem" }}
          >
            <IoChatbubbleEllipses size={22} />
          </NavLink>

          <div
            title="Add Friend"
            className="d-flex justify-content-center align-items-center w-100 py-2"
            onClick={() => setOpenSearchUser(true)}
            style={{ cursor: "pointer", borderRadius: "0.375rem" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e2e8f0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FaUserPlus size={20} />
          </div>

          <div className="d-flex ">
            <img
              src={logo}
              alt="Logo"
              width={30}
              height={40}
              style={{
                borderRadius: "0.375rem",
              }}
            />
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <button
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
            className="btn p-0 mb-2"
            style={{ border: "none", background: "transparent" }}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>

          <button
            title="Logout"
            onClick={handleLogout}
            className="btn p-0"
            style={{
              width: "48px",
              height: "48px",
              cursor: "pointer",
              borderRadius: "0.375rem",
              backgroundColor: "transparent",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#e2e8f0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <BiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* Right Message List */}
      <div className="w-100 ">
        <div className="d-flex align-items-center" style={{ height: "64px" }}>
          <h2 className="fs-4 fw-bold p-4 text-dark">Message</h2>
        </div>

        <div
          className="bg-light "
          style={{ height: "1px", backgroundColor: "#e2e8f0" }}
        ></div>

        <div
          className="overflow-auto px-3"
          style={{ height: "calc(100vh - 65px)", overflowX: "hidden" }}
        >
          {allUser.length === 0 ? (
            <div className="mt-5">
              <div className="d-flex justify-content-center align-items-center my-4 text-secondary">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="fs-5 text-center text-muted">
                Explore users to start a conversation
              </p>
            </div>
          ) : (
            allUser.map((conv) => (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="d-flex align-items-center gap-2 py-3 px-2 border-0 rounded text-decoration-none text-dark"
                style={{ cursor: "pointer" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f8fafc")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Avatar
                  imageUrl={conv?.userDetails?.profile_pic}
                  name={conv?.userDetails?.name}
                  width={40}
                  height={40}
                />

                <div className="flex-grow-1 overflow-hidden ">
                  <h6 className="mb-1 fw-semibold text-dark text-truncate">
                    {conv?.userDetails?.name}
                  </h6>

                  <div
                    className="text-muted small d-flex align-items-center gap-1 text-truncate"
                    style={{ maxWidth: "170px" }}
                  >
                    {conv?.lastMsg?.imageUrl && (
                      <span className="d-flex align-items-center gap-1 me-1">
                        <FaImage />
                        {!conv?.lastMsg?.text && <span>Image</span>}
                      </span>
                    )}
                    {conv?.lastMsg?.videoUrl && (
                      <span className="d-flex align-items-center gap-1 me-1">
                        <FaVideo />
                        {!conv?.lastMsg?.text && <span>Video</span>}
                      </span>
                    )}
                    <span className="text-truncate">{conv?.lastMsg?.text}</span>
                  </div>
                </div>

                {Boolean(conv?.unseenMsg) && (
                  <span
                    className="badge bg-primary text-white rounded-circle d-flex justify-content-center align-items-center ms-auto"
                    style={{
                      width: "24px",
                      height: "24px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                    }}
                  >
                    {conv?.unseenMsg}
                  </span>
                )}
              </NavLink>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
