import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal">
            <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <X size={16} />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export default Modal;
