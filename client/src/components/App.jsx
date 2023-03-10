import '../stylesheets/App.css';
import axios from 'axios';
import Map from './Map';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Login from './Login';
import { UserContext } from './UserContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {

    const checkSession = async () => {
      try {
        const userInfo = await axios.get('/api/sessions');

        if (userInfo.data.loggedIn === true) {
          setUser({
            name: userInfo.data.name,
            email: userInfo.data.email,
            picture: userInfo.data.picture,
            // for later: refactor to be userID instead of id
            id: userInfo.data.id,
          });
          navigate('/map');
        } else navigate('login');
      } catch (e) {
        console.log('Error in checkSession: ', e.message);
      }
    };
    if (user === null) {
      checkSession();
    } else {
      navigate('/map');
    }
  }, [user]);

  const logout = async () => {
    // make server request to logout / destroy session + cookie
    try {
      const response = await axios.delete('/api/sessions');
      console.log('successful logout');
      setUser(null);
    } catch (e) {
      console.log('error logging out: ', e.message);
    }
  };

  return (
    <>
      <nav className="navbar">
        <span className="brand-container">
          <h1 className="brand-heading">Poppin</h1>
          <img
            className="brand-logo"
            src="https://i.pinimg.com/originals/2f/c1/b8/2fc1b8f82e14172e3bcae39ca8c8ab33.gif"
          ></img>
        </span>
        {user && (
          <ul className="nav-list">
            <li>
              {' '}
              <a onClick={logout}> Logout </a>
            </li>
            <li>
              <img src={user.picture} alt="User profile pic" />
            </li>
            <li>{user.name}</li>
          </ul>
        )}
      </nav>

      <UserContext.Provider value={{ user }}>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                setUser={(u) => setUser(u)}
                setUserJWT={(jwt) => setUserJWT(jwt)}
              ></Login>
            }
          />
          <Route path="/" element={<p>you are on path= /</p>} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
