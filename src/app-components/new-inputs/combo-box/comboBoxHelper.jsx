// To make multi select look like other elements
export const baseStyle = {
  container: (provided) => ({ ...provided }),
  control: (base, state) => ({
    ...base,
    border: '1px solid #000000',
    borderColor: state.isFocused ? '#000000' : '#000000',
    boxShadow: state.isFocused ? '0 0 0 2px rgb(36,145,255)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#ccc' : '#000000',
    },
  }),
};

export const customSelectStyles = {
  container: (provided) => ({ ...provided }),
  control: (base, state) => ({
    ...base,
    border: '1px solid #e74c3c',
    paddingRight: '0.80rem',
    backgroundImage:
      'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23e74c3c%27 viewBox=%270 0 12 12%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23e74c3c%27 stroke=%27none%27/%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.375rem center',
    backgroundSize: '1rem 1rem',
    borderColor: state.isFocused ? '#ccc' : '#e74c3c',
    boxShadow: state.isFocused ? '0 0 0 2px #e74c3c' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#ccc' : '#e74c3c',
    },
  }),
};

export const customSelectStylesNonRequired = {
  container: (provided) => ({ ...provided }),
  control: (base) => ({
    ...base,
  }),
};
