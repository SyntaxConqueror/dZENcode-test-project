import styles from './styles.module.css';
import ReactPaginate from "react-paginate";
import {useState} from "react";
import {Comment} from "./Comment/Comment.jsx";

export const CommentsThread = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [paginateData, setPaginateData] = useState({
        itemsPerPage: 25,
        totalItems: 200,
        totalPages: Math.ceil(200 / 25)
    })


    // Function to handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    // Calculate which portion of the data to display on the current page
    const startIndex = (currentPage - 1) * paginateData.itemsPerPage;
    const endIndex = startIndex + paginateData.itemsPerPage;
    const currentData = (Array.from({ length: 200 }, () => Math.random())).slice(startIndex, endIndex);


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
            <div className={styles.comments__container}>
                {currentData.map((item) =>
                    {
                        return <Comment id={item}/>
                    }
                )}
            </div>

            <div>
                <ReactPaginate
                    className={styles.react__paginate}
                    pageCount={paginateData.totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={(selected) => handlePageChange(selected.selected + 1)}
                />
            </div>
        </div>
    )
}