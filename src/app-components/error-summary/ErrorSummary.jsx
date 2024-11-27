import { useState, useEffect, useCallback } from 'react';

import LinkButton from '@components/link-button/linkButton';
import Icon from '../icon';

import { getLabelTextById } from '@src/utils/helpers';

import './errorSummary.scss';

const cleanAndTruncateLabels = (input, maxLength) => {
  if (typeof input === 'undefined') {
    return '';
  }

  let cleanedString = input
    ?.replace(/\*/g, '')
    ?.replace(/\s*\([^)]{2,}\)\s*/g, '') // Remove anything with more than one character in parentheses
    ?.replace(/([^\w\s()/+'-])+/g, ''); // Remove punctuation but keep single characters in parentheses and slashes

  let truncated = false;

  if (cleanedString?.length > maxLength) {
    const truncatedString = cleanedString.substring(0, maxLength);
    const lastSpaceIndex = truncatedString.lastIndexOf(' ');

    if (lastSpaceIndex > -1) {
      cleanedString = truncatedString.substring(0, lastSpaceIndex);
    } else {
      cleanedString = truncatedString;
    }

    cleanedString += '...';
    truncated = true;
  }

  return cleanedString + (truncated ? ' : ' : ': ');
};

const ErrorSummary = ({ errors, type = 'base', modalID, sectionNo = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const genericErrorArray = [];

  for (const [key, value] of Object.entries(errors)) {
    if (value.message) {
      genericErrorArray.push({
        id: key,
        message: value.message,
        ref: value.ref,
      });
    }
  }

  const genericErrorCount = genericErrorArray?.length;

  const calculateSuffix = (type) => {
    switch (type) {
      case 'modal':
        return '_modal';
      case 'form':
        return 'form';
      default:
        return `${sectionNo}`;
    }
  };

  const typeSuffix = calculateSuffix(type);

  const scrollById = (errorID, modalID) => {
    if (modalID) {
      const modal = document.getElementById(modalID);
      modal.querySelector(`#${errorID}`).scrollIntoView({ behavior: 'smooth', block: 'center' });
      modal.querySelector(`#${errorID}`).focus();
    } else {
      const targetID = `${errorID}_li${typeSuffix}`;
      document.getElementById(errorID).scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById(targetID).style.fontWeight = 'bold';
      document.getElementById(errorID).focus();
    }
  };

  const boldError = useCallback(
    (e) => {
      const targetID = `${e?.target?.id}_li${typeSuffix}`;

      const target = document?.getElementById(`error_list_summary${typeSuffix}`)?.children;
      const elements = target && Array?.from(target);

      elements?.forEach((element) => {
        if (element?.id === targetID) {
          document.getElementById(element.id).style.fontWeight = 'bold';
        } else if (document.getElementById(element?.id)?.getAttribute('style')) {
          document.getElementById(element.id).style.fontWeight = 'normal';
        }
      });
    },
    [typeSuffix]
  );

  const generateErrorHeader = (genericErrorCount, isExpanded, type) => {
    switch (type) {
      case 'modal':
        if (genericErrorCount > 0 && isExpanded) {
          return `Resolve the following issues (${genericErrorCount})`;
        } else if (genericErrorCount > 0 && !isExpanded) {
          return `This modal contains issues (${genericErrorCount}), expand to view issue list`;
        } else {
          return 'This modal is complete';
        }
      default:
        if (genericErrorCount > 0 && isExpanded) {
          return `Resolve the following issues (${genericErrorCount})`;
        } else if (genericErrorCount > 0 && !isExpanded) {
          return `This data entry contains issues (${genericErrorCount}), expand to view issue list`;
        } else {
          return 'This data entry is complete';
        }
    }
  };

  useEffect(() => {
    const handleBlur = (e) => {
      boldError(e);
    };

    // Attach the event listener
    document.addEventListener('focus', handleBlur, true);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('focus', handleBlur, true);
    };
  }, [boldError]);

  const genericErrors = genericErrorArray?.map((error, id) => (
    <li key={id} id={`${error?.id}_li${typeSuffix}`}>
      <LinkButton
        onClick={() => {
          error?.id && scrollById(error?.id, modalID);
        }}
        content={(cleanAndTruncateLabels(getLabelTextById(error?.id), 40) ?? '') + error?.message}
      />
    </li>
  ));

  return (
    (type !== 'modal' || (type === 'modal' && genericErrorCount > 0)) && (
      <div className={`${type !== 'modal' && 'margin-top-2'} errorSummary`}>
        <div
          className={`usa-alert usa-alert${genericErrorCount > 0 ? '--error' : '--success'}`}
          id='error_list'
          role='alert'
        >
          {genericErrorCount >= 1 && (
            <div
              tabIndex={0}
              className='errorSummaryChevron'
              onClick={() => setIsExpanded((prev) => !prev)}
              onKeyUp={(e) => {
                e.key === 'Enter' && setIsExpanded((prev) => !prev);
              }}
            >
              <Icon
                aria-label={`${isExpanded ? 'close' : 'open'} error summary`}
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                style={{ fontSize: '36px', marginBottom: '8px' }}
              />
            </div>
          )}
          <div className='usa-alert__body'>
            <div className='usa-alert__heading'>{generateErrorHeader(genericErrorCount, isExpanded, type)}</div>
            {genericErrorCount > 0 && isExpanded && (
              <div className='usa-alert__text error-list-container'>
                <ol id={`error_list_summary${typeSuffix}`}>{genericErrors}</ol>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ErrorSummary;
