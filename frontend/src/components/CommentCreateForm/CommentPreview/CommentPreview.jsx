import styles from "../../CommentsThread/Comment/styles.module.css";
import {CSSTransition} from "react-transition-group";
import Modal from "react-bootstrap/Modal";
import {format} from "date-fns";
import TextFileModal from "../../CommentsThread/Comment/TextFileModal/TextFileModal.jsx";

/* eslint-disable react/prop-types */
const CommentPreview = ({commentData, show, setShowPreview}) => {

    const handleClose = () => setShowPreview(false);

    return (
        <div>
            <CSSTransition in={show} timeout={300} classNames="modal-fade" unmountOnExit>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Comment preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={styles.comment__container}>
                            <div className={styles.comment__header}>
                                <div className={styles.user__avatar}>
                                    <i className="material-icons">account_circle</i>
                                </div>
                                <div className={styles.user__name}>
                                    <span>{commentData.username}</span>
                                </div>
                                <div className={styles.publication__date}>
                                    <span>{format(new Date(parseInt(commentData.created_at)), 'yyyy-MM-dd HH:mm')}</span>
                                </div>
                                <div className={styles.comment__functions}>
                                    <i className="material-icons">reply</i>
                                </div>
                            </div>
                            <div className={styles.comment__content}>
                                <div className={styles.content__file}>

                                    {
                                        commentData.file && (
                                            commentData.file_type === 'text/plain' ? (
                                                <div><TextFileModal link={commentData.file} /></div>
                                            ) : (
                                                <div>
                                                    <a className={styles.popup__image} href={commentData.file} data-lightbox={commentData.id}>
                                                        <img src={commentData.file} width={'100'} height={'75'} alt="Image" />
                                                        <i className="material-icons">open_in_new</i>
                                                    </a>
                                                </div>
                                            )
                                        )
                                    }


                                </div>
                                <div
                                    className={styles.comment__text}
                                    dangerouslySetInnerHTML={{ __html: commentData.text_content.replace(/\n/g, '<br />') }}>
                                </div>

                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </CSSTransition>
        </div>
    );
};

export default CommentPreview;