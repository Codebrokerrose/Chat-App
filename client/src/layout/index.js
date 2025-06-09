import logo from '../assets/images/favicon/icon.png'

const AuthLayouts = ({children}) => {
  return (
    <>
      <nav
        className="navbar bg-white shadow-sm px-4 "
        style={{ position: "sticky", width: "100%", top: 0, zIndex: 10 }}
      >
        <div className="container-fluid d-flex align-items-center ">
          <a
            className="navbar-brand d-flex align-items-center gap-2 justify-content-center"
            href="#"
          >
            <img src={logo} alt="Logo" width={30} height={30} />
            <span className="fw-bold fs-3 ">Chat App</span>
          </a>
        </div>
      </nav>

      {children}
    </>
  );
}

export default AuthLayouts
