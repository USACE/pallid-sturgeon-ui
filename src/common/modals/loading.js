import React from 'react';

import './loading.scss';

const LoadingModal = ({ text }) => (
  <div className='custom-modal-backdrop'>
    <div className='spinner'></div>
    {text && <div className='loading-text'>{text}</div>}
  </div>
);

export default LoadingModal;
