import React from 'react';
import ReactTooltip from 'react-tooltip';

import Icon from 'app-components/icon';
import Select from 'app-components/select/select';
import FilterSelect from 'app-components/filter-select/filter-select';

import '../../../dataentry.scss';

export const Row = ({ children, className }) => {
  const classNameString = className ? className : '';
  return (
    <div className={`row d-flex align-items-center w-100 mt-1 pb-1 ${classNameString}`}>
      {children}
    </div>
  );
};

export const Input = ({ name, label, className, helperText, helperDirection = 'column', value, step, onChange, type = 'text', placeholder, isDisabled, isRequired }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <input className={`form-control w-100 mt-1${showRequired ? ' is-invalid' : ''}`} id={name} name={name} disabled={isDisabled} value={value} onChange={onChange} type={type} step={step} placeholder={placeholder} />
          <p className={helperDirection === 'row' ? 'm-0 ml-2' : 'm-0'} style={{ fontSize: 'smaller' }} ><i>{helperText}</i></p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <input className={`form-control w-100${showRequired ? ' is-invalid' : ''}`} id={name} name={name} disabled={isDisabled} value={value} onChange={onChange} type={type} step={step} placeholder={placeholder} />
      </>
    );
  }
};

export const TextArea = ({ value, name, label, onChange, rowCount = 3, className = '', isRequired, isDisabled }) => {
  const isDataGap = value === 'Data Gap';
  const displayValue = isDataGap ? '' : value;
  const showRequired = isRequired && !value;

  return (
    <>
      {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
      <textarea rows={rowCount} className={`form-control w-100${showRequired ? ' is-invalid' : ''}`} id={name} name={name} onChange={onChange} value={displayValue} disabled={isDisabled} />
    </>
  );
};

export const SelectCustomLabel = ({ name, label, options, value, onChange, helperText, helperDirection, hasHelperIcon, helperIconId, helperContent, className, defaultValue, isRequired, isDisabled = false, isLoading = false }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        {hasHelperIcon && (
          <>
            <Icon
              icon='help-circle-outline'
              data-tip
              data-for={helperIconId}
              style={{ fontSize: '15px', marginBottom: '8px' }}
            />
            <ReactTooltip id={helperIconId} effect='solid' place='bottom'>
              <span>
                {helperContent}
              </span>
            </ReactTooltip>
          </>
        )}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <Select id={name} name={name} options={options} value={value} onChange={onChange} className={showRequired ? 'is-invalid' : ''} defaultOption={defaultValue} isDisabled={isDisabled} />
          <p className={helperDirection === 'row' ? 'm-0 ml-2' : 'm-0'}><i>{helperText}</i></p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        {hasHelperIcon && (
          <>
            <Icon
              icon='help-circle-outline'
              data-tip
              data-for={helperIconId}
              style={{ fontSize: '15px', marginBottom: '8px' }}
            />
            <ReactTooltip id={helperIconId} effect='solid' place='bottom'>
              <span>
                {helperContent}
              </span>
            </ReactTooltip>
          </>
        )}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <Select id={name} name={name} options={options} value={value} onChange={onChange} className={showRequired ? 'is-invalid' : ''} defaultOption={defaultValue} isDisabled={isDisabled} />
          {isLoading && <div className='loader m-0 ml-2'></div>}
        </div>
      </>
    );
  }
};

export const FilterSelectCustomLabel = ({ name, label, items, value, onChange, handleInputChange, placeholder, helperText, helperDirection, className, ref, isRequired, isDisabled = false }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <FilterSelect ref={ref} id={name} name={name} items={items} value={value} onChange={onChange} handleInputChange={handleInputChange} className={showRequired ? 'is-invalid' : ''} placeholder={placeholder} isDisabled={isDisabled} />
          <p className={helperDirection === 'row' ? 'm-0 ml-2' : 'm-0'}><i>{helperText}</i></p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <FilterSelect ref={ref} id={name} name={name} items={items} value={value} onChange={onChange} handleInputChange={handleInputChange} className={showRequired ? 'is-invalid' : ''} placeholder={placeholder} isDisabled={isDisabled} />
      </>
    );
  }
};