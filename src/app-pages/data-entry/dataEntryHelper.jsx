import React from 'react';

export const CreateComboboxOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      label: `${code} - ${description}`,
    };
  });
};

export const createDropdownOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      text: description,
    };
  });
};

export const fmtTimeHHMMSS = (val) => {
  const date = val ? new Date(val) : new Date();

  if (Number.isNaN(date.getTime())) {
    console.error('Invalid date:', val);
    return '';
  }

  const hh = String(date).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const generateFieldId = (queueLength = 0) => {
  const now = new Date();

  const date =
    now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');

  const time =
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0') +
    String(now.getMilliseconds()).padStart(3, '0');

  const sequence = String(queueLength + 1).padStart(3, '0');

  return `${date}-${time}-${sequence}`;
};

export const isEmpty = (obj) => Object.keys(obj).length === 0;

export const removeDuplicates = (arr) => {
  const serializedArray = arr?.map(JSON.stringify) ?? [];
  if (serializedArray?.length > 0) {
    const uniqueSet = new Set(serializedArray);
    const uniqueArray = Array.from(uniqueSet)?.map(JSON.parse);
    return uniqueArray?.sort((a, b) => a.code - b.code) ?? [];
  }
  return [];
};

export const currentDate = new Date().toISOString().split('T')[0];

export const normalize = (val) => (val ? String(val) : '');

export const formatGpsCoordinate = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Number(number.toFixed(5));
};

const createBlankRow = () => ({
  _isPlaceholderRow: true,
  _isTouched: false,
});

export const isUntouchedPlaceholderRow = (row) => row?._isPlaceholderRow === true && row?._isTouched !== true;

export const ensureTrailingBlankRow = (rows) => {
  const normalizedRows = rows ?? [];

  if (normalizedRows.length === 0) {
    return [createBlankRow()];
  }

  const lastRow = normalizedRows[normalizedRows.length - 1];
  if (isUntouchedPlaceholderRow(lastRow)) {
    return normalizedRows;
  }

  return [...normalizedRows, createBlankRow()];
};

export const displayValidationTableErrors = (rowError) => {
  if (rowError?.errors?.length === 1) {
    return rowError?.errors?.map((errorItem, index) => (
      <React.Fragment key={`row-${rowError.rowNumber}-${errorItem.columnName}-${errorItem.message}-${index}`}>
        <u>{errorItem.columnName}</u>: {errorItem.message}
      </React.Fragment>
    ));
  } else if (rowError?.errors?.length > 1) {
    return (
      <ul>
        {rowError?.errors?.map((errorItem, index) => (
          <li key={`row-${rowError.rowNumber}-${errorItem.columnName}-${errorItem.message}-${index}`}>
            <u>{errorItem.columnName}</u>: {errorItem.message}
          </li>
        ))}
      </ul>
    );
  } else {
    return 'Validation error';
  }
};
