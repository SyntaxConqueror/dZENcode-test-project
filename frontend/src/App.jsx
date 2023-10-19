import {useEffect, useState} from 'react'
import './App.module.css'
import {CommentCreateForm} from "./components/CommentCreateForm/CommentCreateForm.jsx";
import {CommentsThread} from "./components/CommentsThread/CommentsThread.jsx";
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from "axios";
function App() {
    const [replyId, setReplyId] = useState(null);
    const [userNameReplyTo, setUserNameReplyTo] = useState(null);
    const [comments, setComments] = useState([]);


    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/getComments')
            .then((response)=>{
                if(response.data.message){
                    return response(response.data);
                }
                setComments(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    return (
        <div className={styles.main__container}>
            <CommentCreateForm
                setReplyId={setReplyId}
                userNameReplyTo={userNameReplyTo}
                setUserNameReplyTo={setUserNameReplyTo}
                setComments={setComments}
                replyId={replyId} />

            <CommentsThread
                setUserNameReplyTo={setUserNameReplyTo}
                comments={comments}
                setComments={setComments}
                setReplyId={setReplyId} />
        </div>
    )
}

export default App
