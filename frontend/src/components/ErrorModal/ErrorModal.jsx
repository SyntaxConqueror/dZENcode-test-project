import Modal from 'react-bootstrap/Modal';
import { CSSTransition } from 'react-transition-group';

/* eslint-disable react/prop-types */
const ErrorModal = ({show, setShow, error, setErrorMessage}) => {
    const handleClose = () => {
        setShow(false);
        setErrorMessage(null);
    }

    return (
        <div>

            <CSSTransition in={show} timeout={300} classNames="modal-fade" unmountOnExit>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error message</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            Error: {error}
                        </div>
                    </Modal.Body>
                </Modal>
            </CSSTransition>
        </div>
    );
};

export default ErrorModal;