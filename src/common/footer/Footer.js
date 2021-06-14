import React from 'react';

import Icon from 'app-components/icon';

import './footer.scss';

const Footer = () => (
  <footer aria-label='Site Footer'>
    <div className='footer'>
      <div className='text-center'>
        <p>
          <strong>
            <Icon icon='copyright' />
          </strong>{' '}
            U.S. Army Corps of Engineers {new Date().getFullYear()}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
