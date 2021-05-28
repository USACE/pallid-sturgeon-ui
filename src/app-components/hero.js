import React from 'react';

import Icon from './icon';
import bg1 from '../img/MRIHome.jpg';

const Hero = () => (
  <div
    style={{
      height: '400px',
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'cover',
      backgroundPosition: 'top',
    }}
  >
    <div
      className='d-flex justify-content-center align-items-center flex-column'
      style={{ height: '100%' }}
    >
      <div>
        <p></p>
        <h1 className='text-light'>
          Pallid Sturgeon Population Assessment
        </h1>
      </div>
    </div>
  </div>
);

export default Hero;
