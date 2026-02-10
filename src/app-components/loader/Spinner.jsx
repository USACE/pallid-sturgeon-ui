import './loader.scss';

const Spinner = ({ className }) => (
  <div className={`${className} loading-spinner`}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);

export default Spinner;
