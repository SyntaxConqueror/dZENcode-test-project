import styles from './styles.module.css';
import ReactPaginate from "react-paginate";
import {useEffect, useRef, useState} from "react";
import {Comment} from "./Comment/Comment.jsx";

// eslint-disable-next-line react/prop-types
export const CommentsThread = ({pushReplyCommentId}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [comments, setComments] = useState([]);
    const [replyCommentId, setReplyCommentId] = useState();
    const [paginateData, setPaginateData] = useState({
        itemsPerPage: 25,
        totalItems: 0,
        totalPages: 0
    });
    const commentsContainerRef = useRef();


    useEffect(() => {
        pushReplyCommentId(replyCommentId);
    }, [replyCommentId]);

    const generateCommentsArray = (numComments) => {
        const comments = [];

        for (let i = 1; i <= numComments; i++) {
            const comment = {
                id: i,
                text: `Комментарий ${i}`,
                replies: [],
            };

            comment.replies.push({
                id: i + 1,
                text: `Ответ на Комментарий ${i}`,
                replies: [
                    {
                        id: i + 2,
                        text: `Ответ на ответ на Комментарий ${i}`,
                        replies: [
                            {
                                id: i + 3,
                                text: `Ответ на ответ на ответ на Комментарий ${i}`,
                                replies: [],
                            },
                        ],
                    },
                    {
                        id: i + 4,
                        text: `Ещё один ответ на Комментарий ${i}`,
                        replies: [],
                    },
                ],
            });

            comments.push(comment);
        }

        return comments;
    }

    useEffect(() => {
        setComments(generateCommentsArray(150));
        paginateData.totalItems = comments.length;
        paginateData.totalPages = Math.ceil(comments.length / 25);
    }, [comments.length, paginateData]);


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };


    const startIndex = (currentPage - 1) * paginateData.itemsPerPage;
    const endIndex = startIndex + paginateData.itemsPerPage;
    const currentData = comments.slice(startIndex, endIndex);


    return (
        <div className={styles.container}>
            <div className={styles.comments__sort}>

                <div className="dropdown">
                    <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                        Sort by
                    </a>
                    <ul className="dropdown-menu">

                        <li className="dropstart">
                            <a className="dropdown-item dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Publication date
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Descending</a></li>
                                <li><a className="dropdown-item" href="#">Ascending</a></li>
                            </ul>
                        </li>
                        <li><a className="dropdown-item" href="#">User Name</a></li>
                        <li><a className="dropdown-item" href="#">Email</a></li>
                    </ul>
                </div>

            </div>
            <div className={styles.comments__container} ref={commentsContainerRef}>
                {currentData.map((comment) =>
                    {
                        return <Comment comment={comment} setReplyCommentId={setReplyCommentId} marginLeft={0} key={comment.id} id={comment.id}/>
                    }
                )}
            </div>

            <div>
                <ReactPaginate
                    className={styles.react__paginate}
                    pageCount={paginateData.totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={(selected) => {
                        // Scroll to the top of the page
                        if (commentsContainerRef.current) {
                            commentsContainerRef.current.scrollTop = 0;
                        }

                        handlePageChange(selected.selected + 1);
                    }}
                />
            </div>
        </div>
    )
}