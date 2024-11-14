import React, { useState } from "react";
import './navbar.css';
import { Link ,useNavigate} from "react-router-dom";
import { FaSearch } from "react-icons/fa";


<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
</style>
export default function Navbar() {

  const handlelogout = () => {
    localStorage.removeItem("authToken");
  }
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search?q=${searchTerm}`);
    }
  };
  return (
    <div>
      <nav className="navbar fixedtop navbar-expand-lg" >
        <div className="container-fluid">
          <Link className="navbar-brand fs-4" to="/" style={{ fontFamily: "Caveat,cursive" }}>
            carhub
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {(localStorage.getItem("authToken")) ? (
                <>
                  <li className="nav-item fs-5">
                    <Link className="nav-link active" aria-current="page" to="/createcar">Create car</Link>
                  </li>
                  <div className="search-container">
                    <form className="d-flex" style={{ width: "100%" }} onSubmit={handleSearch}>
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Search here...."
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-light" type="submit">
                        <FaSearch />
                      </button>
                    </form>
                  </div>



                </>
              ) : (" ")}

            </ul>
            {(!localStorage.getItem("authToken"))
              ? (
                <div>
                  <div className="nav-item d-flex me-3">
                    <Link className="btn btn-light fs-5 me-3" to="/signup">signup</Link>
                    <Link className="btn btn-light fs-5 " to="/login">Login</Link>
                  </div>
                </div>
              ) : (
                <div className="nav-item d-flex">

                  
                  <Link className="btn btn-light fs-5 me-3" to="/login" onClick={handlelogout}>Logout</Link>
                </div>
              )}
          </div>
        </div>
      </nav>
    </div>
  );
}
