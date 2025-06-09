import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Avatar from './Avtar';
import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft, FaPlus, FaImage, FaVideo} from 'react-icons/fa';
import uploadFile from '../helper/uploadFile';
import Loading from './Loading';
import backgroundImage from '../assets/images/photo.jpg';
import { IoMdSend } from 'react-icons/io';
import moment from 'moment';

const MessagePage = () => {
  const { userId } = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    _id: '',
    name: '',
    email: '',
    profile_pic: '',
    online: false,
  });

  const [allMessages, setAllMessages] = useState([]);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: '',
    imageUrl: '',
    videoUrl: '',
  });

  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessages]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const uploaded = await uploadFile(file);
      setLoading(false);
      setOpenImageVideoUpload(false);
      setMessage((prev) => ({ ...prev, imageUrl: uploaded?.url }));
    }
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const uploaded = await uploadFile(file);
      setLoading(false);
      setOpenImageVideoUpload(false);
      setMessage((prev) => ({ ...prev, videoUrl: uploaded?.url }));
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({ text: '', imageUrl: '', videoUrl: '' });
      }
    }
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: '' }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (socketConnection && userId) {
      socketConnection.emit('message-page', userId);

      socketConnection.emit('seen', userId);

      const handleMessageUser = (data) => {
        console.log("👤 message-user received:", data);
        setDataUser(data);
      };
      const handleIncomingMessages = (msgs) => {
        setAllMessages(msgs);
        scrollToBottom();
      };

      socketConnection.on('message-user', handleMessageUser);
      socketConnection.on('message', handleIncomingMessages);

      return () => {
        socketConnection.off('message-user', handleMessageUser);
        socketConnection.off('message', handleIncomingMessages);
      };
    }
  }, [socketConnection, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  return (
    <div
        className="d-flex flex-column"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        }}
      >


      {/* Header */}
      <header className="sticky-top bg-white " style={{ height: '4rem', zIndex: 1 }}>
        <div className="d-flex align-items-center gap-3 h-100">
          <Link to="/">
            <FaAngleLeft size={25} className="text-secondary" />
          </Link>

          {!dataUser?._id ? (
            <div className="d-flex align-items-center gap-2 ms-3">
              <div className="rounded-circle bg-secondary" style={{ width: 40, height: 40 }} />
              <div>
                <p className="mb-0 fw-bold">Loading...</p>
                <p className="mb-0 small text-muted">Please wait</p>
              </div>
            </div>
          ) : (
            <>
              <Avatar
                width={50}
                height={50}
                imageUrl={dataUser.profile_pic}
                name={dataUser.name}
                userId={dataUser._id}
                className="m-0"
              />
              <div>
                <h3 className="fw-semibold fs-5 mb-0 text-truncate">{dataUser.name}</h3>
                <p className="mb-0 small mt-1">
                  {dataUser.online ? (
                    <span className="text-primary">online</span>
                  ) : (
                    <span className="text-secondary">offline</span>
                  )}
                </p>
              </div>
            </>
          )}

          <div className="ms-auto me-3">
            <button className="btn btn-transparent p-0">
              <HiDotsVertical size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages Section */}
      <section
        style={{
          height: 'calc(100vh - 128px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        

        <div className="">
          {allMessages.map((msg, index) => {
            const isOwnMessage = msg.msgByUserId?.toString() === user._id;
            return (
              <div
                key={index}
                className={`d-flex m-3 ${isOwnMessage ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  className={`p-2 rounded shadow-sm ${isOwnMessage ? 'text-dark' : 'text-dark '}`}
                  style={{
                    maxWidth: '75%',
                    backgroundColor: isOwnMessage ? '#ccfbf1' : '#ffffff',
                    opacity: 1,
                  }}
                >
                  
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      alt="image"
                      className="img-fluid d-block mx-auto"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl}
                      alt="video"
                      className="img-fluid d-block mx-auto"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                      controls
                    />
                  )}
                  {msg.text && <p className="mb-1">{msg.text}</p>}

               
                  
                  <p className="text-end small text-secondary mt-1 mb-0">
                    {moment(msg.createdAt).format('hh:mm A')}
                  </p>
                </div>
              </div>
            );
          })}
          {message.imageUrl && (
            <div className="position-absolute d-flex justify-content-center align-items-center bg-dark bg-opacity-50 overflow-hidden h-100 top-0 start-0 z-3 w-100" style={{ width: '100vw' }}>

              <button type="button" className="btn-close position-absolute top-0 end-0 m-3" aria-label="Remove Image" onClick={handleClearUploadImage}></button>
                <div className="bg-white  rounded shadow m-3">
                  <img src={message.imageUrl} alt="uploadImage" className="img-fluid rounded" style={{ height: "400px", width: "auto", maxWidth: "100%", objectFit: "contain" }} />
                </div>
            </div>
          )}
                  
          {message.videoUrl && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 z-3"
              
            >
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-3"
                aria-label="Remove Video"
                onClick={handleClearUploadVideo}
              ></button>

              <div className="bg-white p-3 rounded shadow ">
                <video
                  src={message.videoUrl}
                  muted
                  autoPlay
                  controls
                  className="img-fluid rounded"
                  style={{
                    height: '400px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </div>
          )}

          {loading && (
            <div className="position-absolute top-50 start-50 translate-middle z-3">
              <Loading />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Message Input Section */}
      
      <section
        className="bg-white d-flex align-items-center"
        style={{
          height: '64px',
          zIndex: 20,
          ...( message.imageUrl || message.videoUrl
            ? { position: 'fixed', bottom: 0, left: 0, width: '100%' }
            : {}
          )
        }}
      >



        <div
          className="position-relative d-flex justify-content-center align-items-center rounded-circle bg-white mx-3"
          style={{ width: '44px', height: '44px' }}
        >
          <button
            type="button"
            className="btn btn-light p-0 w-100 h-100 rounded-circle shadow-sm"
            onClick={handleUploadImageVideoOpen}
          >
            <FaPlus size={20} className="text-dark " />
          </button>
        </div>

        {openImageVideoUpload && (
          <div
            className="bg-white shadow rounded position-absolute p-2 mx-2"
            style={{
              bottom: '52px',
              width: '144px',
              transition: 'all 0.3s ease-in-out',
              zIndex: 10,
            }}
          >
        <form>
              <label
                htmlFor="uploadImage"
                className="d-flex align-items-center gap-2 p-2 mb-2 text-decoration-none text-dark w-100"
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dee2e6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                <div className="text-primary">
                  <FaImage size={18} />
                </div>
                <p className="mb-0 small">Image</p>
              </label>

              <label
                htmlFor="uploadVideo"
                className="d-flex align-items-center gap-2 p-2 text-decoration-none text-dark w-100"
                style={{
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dee2e6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
              >
                <div className="text-purple">
                  <FaVideo size={18} />
                </div>
                <p className="mb-0 small">Video</p>
              </label>

              <input type="file" id="uploadImage" className="d-none" accept="image/*" onChange={handleUploadImage} />
              <input type="file" id="uploadVideo" className="d-none" accept="video/*" onChange={handleUploadVideo} />
            </form>
          </div>
        )}

        <form className="d-flex w-100 h-100 gap-2 " onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="w-100 h-100 p-3"
            style={{ border: 'none', outline: 'none' }}
            value={message.text}
            onChange={handleOnChange}
            name="text"
          />
          <button
            type="submit"
            className="btn btn-outline-primary d-flex align-items-center justify-content-center m-2"
            style={{ cursor: 'pointer' }}
            disabled={!message.text && !message.imageUrl && !message.videoUrl}
          >
            <IoMdSend size={24} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
