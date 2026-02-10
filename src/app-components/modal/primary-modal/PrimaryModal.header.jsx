import './modal.scss';

const ModalHeader = ({ title = '', ...customProps }) => (
  <header aria-describedby='primary-modal-header' className='primary-modal-header' {...customProps}>
    <h2 className='modal-title'>{title}</h2>
  </header>
);

export default ModalHeader;
