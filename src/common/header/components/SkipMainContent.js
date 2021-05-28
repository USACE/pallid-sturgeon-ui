import React from 'react';

// allows users to skip to main content of the web page for 508 compliance
const SkipMainContent = () => (
  <div className='row'>
    <div className='col-xs-12'>
      <a href='#skipToContent' className='skip-content' aria-label='skip to main content'>
        <div className='content-tab'>
          <p>Skip to main content</p>
        </div>
      </a>
    </div>
  </div>
);

export default SkipMainContent;
