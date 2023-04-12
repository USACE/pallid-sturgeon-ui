import React from 'react';

import CuiBanner from 'app-components/cui-banner';
import Icon from 'app-components/icon';

import './footer.scss';

const Footer = () => (
  <div className='fixed-bottom'>
    <footer aria-label='Site Footer' className='page-footer'>
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
    <CuiBanner />
  </div>
);

export default Footer;
