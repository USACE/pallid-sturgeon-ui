import React from 'react';
import { Link } from 'react-router-dom';
import './404.scss';

const NotFound = () => (
  <div className="container not-found">
    <span className="not-found-title">404</span>
    <p>The page you are looking for does not exist.</p>
    <p>
      Check the URL for typos or return to the <Link to="/">homepage.</Link>
    </p>
  </div>
);

export default NotFound;
