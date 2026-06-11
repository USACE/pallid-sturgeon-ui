import React, { useCallback } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiAlertCircle, mdiHelpCircle } from '@mdi/js';
import classnames from 'classnames';

import TooltipModal from './TooltipModal';
import Icon from '@components/icon/icon';

import './tooltip.scss';

const iconSizes = {
  small: '14px',
  medium: '16px',
  large: '18px',
  'x-large': '28px',
};

const getContentLength = (content) => {
  if (typeof content === 'string') {
    return content.length;
  } else {
    let length = 0;

    React.Children.forEach(content, (child) => {
      if (typeof child === 'string') {
        length += child.length;
      } else if (React.isValidElement(child) && (child.props.children || child.props.content)) {
        length += getContentLength(child.props.children || child.props.content);
      }
    });
    return length;
  }
};

const DisplayIcon = ({ onClick, iconSize, isError, title }) => {
  const iconPath = isError ? mdiAlertCircle : mdiHelpCircle;
  const className = classnames('info-tooltip-icon', {
    'info-tooltip-error': isError,
  });

  return (
    <span id='help-icon'>
      <Icon
        aria-label={title}
        className={className}
        onClick={onClick}
        path={iconPath}
        size={iconSizes[iconSize] || iconSizes.medium}
        tabIndex={0}
        title={title}
      />
    </span>
  );
};

const Tooltip = connect(
  'doSecondaryModalOpen',
  ({ doSecondaryModalOpen, content, header, iconSize = 'medium', isError, title = 'view more information' }) => {
    const handleTooltipOpen = useCallback(() => {
      const contentLength = getContentLength(content);
      if (!contentLength) return;

      doSecondaryModalOpen(TooltipModal, {
        isError: isError,
        msg: content,
        size: 'md',
        title: header,
      });
    }, [content, header, isError]);

    return <DisplayIcon iconSize={iconSize} isError={isError} onClick={handleTooltipOpen} title={title} />;
  }
);

export default Tooltip;
