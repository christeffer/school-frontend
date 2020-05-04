import React from 'react';
import { FaHome, FaSignInAlt, FaUserAlt, FaPowerOff } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import * as actions from '../../store/modules/auth/actions';
import history from '../../services/history';
import { Nav } from './styles';

export default function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Created as a const to be alternative a function
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(actions.loginFailure());
    history.push('/');
  };

  return (
    <Nav>
      <Link to="/" title="Home">
        <FaHome size={24} />
      </Link>
      <Link to="/register" title="Register">
        <FaUserAlt size={24} />
      </Link>
      {isLoggedIn ? (
        <Link onClick={handleLogout} to="/login" title="Logout">
          <FaPowerOff size={24} />
        </Link>
      ) : (
        <Link to="/login" title="Login">
          <FaSignInAlt size={24} />
        </Link>
      )}
    </Nav>
  );
}
