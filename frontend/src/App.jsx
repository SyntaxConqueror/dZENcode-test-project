import {useState} from 'react'
import './App.module.css'
import {CommentCreateForm} from "./components/CommentCreateForm/CommentCreateForm.jsx";
import {CommentsThread} from "./components/CommentsThread/CommentsThread.jsx";
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
function App() {
    const [replyId, setReplyId] = useState(null);


    return (
        <div className={styles.main__container}>
            <CommentCreateForm replyId={replyId}></CommentCreateForm>
            <CommentsThread pushReplyCommentId={setReplyId}></CommentsThread>
        </div>
    )
}

export default App
