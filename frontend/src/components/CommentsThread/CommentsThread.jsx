import styles from './styles.module.css';
import ReactPaginate from "react-paginate";
import {useEffect, useRef, useState} from "react";
import {Comment} from "./Comment/Comment.jsx";
import axios from "axios";
/* eslint-disable react/prop-types */

export const CommentsThread = ({setReplyId, comments, setComments, setUserNameReplyTo}) => {

    const [currentPage, setCurrentPage] = useState(1);

    const [currentData, setCurrentData] = useState(null);
    const [paginateData, setPaginateData] = useState({
        itemsPerPage: 25,
        totalItems: 0,
        totalPages: 0
    });

    const commentsContainerRef = useRef();


    useEffect(() => {

        const startIndex = (currentPage - 1) * paginateData.itemsPerPage;
        const endIndex = startIndex + paginateData.itemsPerPage;
        const data = comments && comments.original ? comments.original : comments;

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / 25);

        paginateData.totalItems = totalItems;
        paginateData.totalPages = totalPages;
        setCurrentData(data.slice(startIndex, endIndex));

    }, [comments, currentPage, paginateData]);


    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    const handleOptionSelect = (option) => {
        const sortEndpoints = {
            'ascending': 'http://127.0.0.1:8000/api/sort/dateAscendingSort',
            'descending': 'http://127.0.0.1:8000/api/sort/dateDescendingSort',
            'username': 'http://127.0.0.1:8000/api/sort/usernameSort',
            'email': 'http://127.0.0.1:8000/api/sort/emailSort',
        }
        setComments([]);
        axios.get(sortEndpoints[option])
            .then((response)=> {
                setComments(response.data);
            })
            .catch((error)=>{console.log(error)})
    };




    return (
        (comments.original || comments.length > 0)
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
                {currentData && currentData.map((comment) =>
                    {
                        return <Comment
                            userReplyTo={null}
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
                    pageCount={parseInt(paginateData.totalPages)}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
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