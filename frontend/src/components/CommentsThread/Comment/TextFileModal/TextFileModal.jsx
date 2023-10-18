import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import styles from './styles.module.css';
import { CSSTransition } from 'react-transition-group';

// eslint-disable-next-line react/prop-types
const TextFileModal = ({link}) => {
    const [show, setShow] = useState(false);
    const [textFileContent, setTextFileContent] = useState('');

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    fetch(link).then((response) => response.text())
        .then((data) => {
            const fileLines = data.replace(/\n/g, '<br>');
            setTextFileContent(fileLines);
        }
    )
    return (
        <div>

            <div className={styles.open__btn} onClick={handleShow}>
                <img src="/images/textfile.png" width={85} height={85} alt="textfile.png"/>
                <i className="material-icons">open_in_new</i>
            </div>

            <CSSTransition in={show} timeout={300} classNames="modal-fade" unmountOnExit>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Text file</Modal.Title>
                    </Modal.Header>
                    <Modal.Body dangerouslySetInnerHTML={{ __html: textFileContent }}></Modal.Body>
                </Modal>
            </CSSTransition>
        </div>
    );
};

export default TextFileModal;