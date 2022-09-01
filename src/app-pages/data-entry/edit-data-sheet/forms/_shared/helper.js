import React from 'react';
import Select from 'app-components/select/select';
import FilterSelect from 'app-components/filter-select';

export const Row = ({ children, className }) => (
  <div className={`d-flex align-items-center w-100 mt-3 pb-3 ${className}`}>
    {children}
  </div>
);

export const Input = ({ name, label, className, helperText, helperDirection = 'column', value, onChange, type = 'text', isDisabled, isRequired }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <input className={`form-control w-100 mt-1${showRequired ? ' is-invalid' : ''}`} id={name} name={name} disabled={isDisabled} value={value} onChange={onChange} type={type} />
          <p className={helperDirection === 'row' ? 'm-0 ml-2' : 'm-0'}><i>{helperText}</i></p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <input className={`form-control w-100${showRequired ? ' is-invalid' : ''}`} id={name} name={name} disabled={isDisabled} value={value} onChange={onChange} type={type} />
      </>
    );
  }
};

export const TextArea = ({ value, name, label, onChange, rowCount = 3, className = '', isRequired }) => {
  const isDataGap = value === 'Data Gap';
  const displayValue = isDataGap ? '' : value;
  const showRequired = isRequired && !value;

  return (
    <>
      {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
      <textarea rows={rowCount} className={`form-control w-100${showRequired ? ' is-invalid' : ''}`} id={name} name={name} onChange={onChange} value={displayValue} />
    </>
  );
};

export const SelectCustomLabel = ({ name, label, options, value, onChange, helperText, helperDirection, className, defaultValue, isRequired, isDisabled = false }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
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
        <Select id={name} name={name} options={options} value={value} onChange={onChange} className={showRequired ? 'is-invalid' : ''} defaultOption={defaultValue} isDisabled={isDisabled} />
      </>
    );
  }
};

export const FilterSelectCustomLabel = ({ name, label, items, value, onChange, placeholder, helperText, helperDirection, className, isRequired, isDisabled = false }) => {
  const showRequired = isRequired && !value;

  if (helperText) {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <div className={`d-flex flex-${helperDirection} w-100`}>
          <FilterSelect id={name} name={name} items={items} value={value} onChange={onChange} className={showRequired ? 'is-invalid' : ''} placeholder={placeholder} isDisabled={isDisabled} />
          <p className={helperDirection === 'row' ? 'm-0 ml-2' : 'm-0'}><i>{helperText}</i></p>
        </div>
      </>
    );
  } else {
    return (
      <>
        {label && <label htmlFor={name} className={`mr-2 mb-0 w-25${className}`}><small>{label}</small></label>}
        <FilterSelect id={name} name={name} items={items} value={value} onChange={onChange} className={showRequired ? 'is-invalid' : ''} placeholder={placeholder} isDisabled={isDisabled} />
      </>
    );
  }
};