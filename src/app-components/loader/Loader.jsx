import Spinner from './Spinner';

const Loader = ({ variant, showLoader = true, loaderText }) => {
  if (!showLoader) {
    return null;
  }

  return (
    <div className={`${variant}-loader-container`}>
      <Spinner className={`${variant}-loader`} />
      {loaderText && <div className={`${variant}-loader-text`}>{loaderText}</div>}
    </div>
  );
};

export default Loader;
