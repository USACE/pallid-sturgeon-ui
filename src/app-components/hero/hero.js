import React from 'react';

import FieldApplication from '../../common/fieldapplication';

import './hero.scss';

const Hero = () => (
  <div className='hero-container'>
    <div className='hero'>
      <h1 className='text-light hero-text'>
        Pallid Sturgeon Population Assessment
      </h1>
    </div>
    <FieldApplication />
  </div>
);

export default Hero;
