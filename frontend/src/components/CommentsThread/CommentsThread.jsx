import styles from './styles.module.css';
import ReactPaginate from "react-paginate";
import {useEffect, useRef, useState} from "react";
import {Comment} from "./Comment/Comment.jsx";
import axios from "axios";
/* eslint-disable react/prop-types */

export const CommentsThread = ({setReplyId, comments, setComments, setUserNameReplyTo}) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [showContent, setShowContent] = useState(false);

    const [paginateData, setPaginateData] = useState({
        itemsPerPage: 25,
        totalItems: 0,
        totalPages: 0
    });

    const commentsContainerRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            setShowContent(true);
        }, 500);
    }, [showContent]);

    useEffect(() => {
        paginateData.totalItems = comments.length;
        paginateData.totalPages = Math.ceil(comments.length / 25);
    }, [comments.length, paginateData]);


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    const handleOptionSelect = (option) => {
        const sortEndpoints = {
            'ascending': 'http://127.0.0.1:8000/api/dateAscendingSort',
            'descending': 'http://127.0.0.1:8000/api/dateDescendingSort',
            'username': 'http://127.0.0.1:8000/api/usernameSort',
            'email': 'http://127.0.0.1:8000/api/emailSort',
        }

        axios.get(sortEndpoints[option])
            .then((response)=> {
                setShowContent(false);
                setComments(response.data);
            })
            .catch((error)=>{console.log(error)})
    };


    const startIndex = (currentPage - 1) * paginateData.itemsPerPage;
    const endIndex = startIndex + paginateData.itemsPerPage;
    const currentData = comments.slice(startIndex, endIndex);


    return (
        showContent
        ?
        <div className={styles.container}>
            <div className={styles.comments__sort}>

                <div className="dropdown">
                    <a
                        className="btn btn-secondary dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                        aria-expanded="false"
                    >
                        Sort by
                    </a>
                    <ul className="dropdown-menu">
                        <li className="dropstart">
                            <a
                                className="dropdown-item dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Publication date
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleOptionSelect('descending')}
                                    >
                                        Descending
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => handleOptionSelect('ascending')}
                                    >
                                        Ascending
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleOptionSelect('username')}
                            >
                                User Name
                            </a>
                        </li>
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => handleOptionSelect('email')}
                            >
                                Email
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
            <div className={styles.comments__container} ref={commentsContainerRef}>
                {currentData.map((comment) =>
                    {
                        return <Comment
                            comment={comment}
                            setReplyId={setReplyId}
                            setUserNameReplyTo={setUserNameReplyTo}
                            marginLeft={0}
                            key={comment.id}
                            id={comment.id}/>
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
        :
        <div className={styles.loading__gif}>
            <span>Loading</span>
            <img src="/images/lightbox/images/loading.gif" width={20} height={20} alt="Loading..." />
        </div>
    )
}