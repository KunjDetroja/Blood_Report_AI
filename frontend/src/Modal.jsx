import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import './modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    const [isActive, setIsActive] = useState(false);
  
    useEffect(() => {
      if (isOpen) {
        setIsActive(true);
      }
    }, [isOpen]);
  
    const handleClose = () => {
      setIsActive(false);
      setTimeout(onClose, 300); // Wait for animation to finish
    };
  
    if (!isOpen) return null;
  
    return ReactDOM.createPortal(
      <div className={`modal-overlay ${isActive ? 'active' : ''}`} onClick={handleClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose}>&times;</button>
          {children}
        </div>
      </div>,
      document.body
    );
  };

  export default Modal;