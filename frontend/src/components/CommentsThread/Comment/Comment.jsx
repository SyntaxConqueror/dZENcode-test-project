import styles from './styles.module.css';
import TextFileModal from "./TextFileModal/TextFileModal.jsx";
import {format} from "date-fns";
import {useEffect, useRef, useState} from "react";
/* eslint-disable react/prop-types */
export const Comment = ({comment, marginLeft, id, setReplyId, setUserNameReplyTo, userReplyTo}) => {

    const [marginVariable, setMarginVariable] = useState(20);
    const commentContainer = useRef(null);

    const handleReplyClick = () => {
        setReplyId(id);
        setUserNameReplyTo(comment.username);
    }

    useEffect(()=>{
        if (marginLeft > 0) {
            setMarginVariable(0);
        }

    }, [marginLeft])

    useEffect(() => {
        if(userReplyTo) {
            commentContainer.current.classList.add('reply');
        }
    }, [userReplyTo]);


    return (
        <div className={styles.comment__container} ref={commentContainer} style={{ marginLeft: `${marginLeft}px` }}>
            <div className={styles.comment__header}>
                <div className={styles.user__avatar}>
                    <i className="material-icons">account_circle</i>
                </div>
                <div className={styles.user__name}>
                    <span>{comment.username}</span>
                </div>
                <div className={styles.publication__date}>
                    <span>{format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm')}</span>
                </div>
                <div className={styles.comment__functions}>
                    <i className="material-icons" onClick={handleReplyClick}>reply</i>
                </div>
            </div>
            <div className={styles.comment__content}>
                {userReplyTo && <div style={{fontSize: '.8em'}}>Reply to: {userReplyTo}</div>}
                <div className={styles.content__file}>

                    {
                        comment.file_url !== '' && (
                            comment.file_url.match(/\.(.{1,4})$/)?.[1] === 'txt' ? (
                                <div>
                                    <TextFileModal link={comment.file_url} />
                                </div>
                            ) : (
                                <div>
                                    <a className={styles.popup__image} href={comment.file_url} data-lightbox={id}>
                                        <img src={comment.file_url} width={'100'} height={'75'} alt="Image" />
                                        <i className="material-icons">open_in_new</i>
                                    </a>
                                </div>
                            )
                        )
                    }


                </div>
                <div
                    className={styles.comment__text}

                    dangerouslySetInnerHTML={{ __html: comment.text_content.replace(/\n/g, '<br />') }}>
                </div>

            </div>
            <div className={styles.replies}>
                {comment.replies.map((reply, index) =>
                    <Comment
                        key={index}
                        userReplyTo={comment.username}
                        comment={reply}
                        marginLeft={marginLeft + marginVariable}
                        id={reply.id}
                        setReplyId={setReplyId}
                        setUserNameReplyTo={setUserNameReplyTo}
                    />
                )}
            </div>
        </div>
    )
}