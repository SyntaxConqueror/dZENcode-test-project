import styles from './styles.module.css';
import TextFileModal from "./TextFileModal/TextFileModal.jsx";
// eslint-disable-next-line react/prop-types
export const Comment = ({comment, marginLeft, id, setReplyCommentId}) => {

    const handleReplyClick = () => {
        setReplyCommentId(id);
    }

    return (
        <div className={styles.comment__container} style={{ marginLeft: `${marginLeft}px` }}>
            <div className={styles.comment__header}>
                <div className={styles.user__avatar}>
                    <i className="material-icons">account_circle</i>
                </div>
                <div className={styles.user__name}>
                    <span>UserName</span>
                </div>
                <div className={styles.publication__date}>
                    <span>22.10.23 в 12:33</span>
                </div>
                <div className={styles.comment__functions}>
                    <i className="material-icons" onClick={handleReplyClick}>reply</i>
                </div>
            </div>
            <div className={styles.comment__content}>
                <div className={styles.content__file}>
                    <div>
                        <TextFileModal link={'https://sometestlarbucket.s3.eu-central-1.amazonaws.com/postPreviews/1.txt'}/>
                    </div>
                    {/*<div>*/}
                    {/*    <a className={styles.popup__image} href="/images/pinned__img.jpg" data-lightbox={id}>*/}
                    {/*        <img src="/images/pinned__img.jpg" width={'100'} height={'75'} alt="Image"/>*/}
                    {/*        <i className="material-icons">open_in_new</i>*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </div>
                <div className={styles.comment__text}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Non odio euismod lacinia at quis risus sed vulputate odio.
                    Mattis nunc sed blandit libero volutpat sed cras ornare arcu.
                    <br/><code>
                    Diam phasellus vestibulum lorem sed risus ultricies.
                    Neque convallis a cras semper auctor neque vitae tempus.
                    Enim neque volutpat ac tincidunt vitae semper.
                    Dui ut ornare lectus sit amet. Diam ut venenatis tellus in.
                </code><br/><br/>
                </div>

            </div>
            <div className="replies">
                {/* eslint-disable-next-line react/prop-types */}
                {comment.replies.map((reply, index) =>
                    <Comment key={index} comment={reply} marginLeft={marginLeft + 20} id={reply.id} setReplyCommentId={setReplyCommentId} />
                )}
            </div>
        </div>
    )
}