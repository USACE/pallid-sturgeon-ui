import React, { useState } from 'react';
import './tabs.scss';

const Tabs = ({ tabData, activeIndex, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  const currentIndex = activeIndex !== undefined ? activeIndex : activeTab;

  const handleTabClick = (index) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setActiveTab(index);
    }
  };

  return (
    <div className='tabs-container'>
      <div className='tab-controls' role='tablist'>
        {tabData?.map((tab, index) => (
          <React.Fragment key={tab.title + tab.subtitle + index}>
            <button
              className={currentIndex === index ? 'active' : ''}
              key={index}
              onClick={() => handleTabClick(index)}
              role='tab'
              type='button'
            >
              <div className='tab-title'>{tab.title}</div>
              {tab.subtitle && <div className='tab-subtitle'>{tab.subtitle}</div>}
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className='tab-content'>{tabData?.[currentIndex]?.content}</div>
    </div>
  );
};
export default Tabs;
