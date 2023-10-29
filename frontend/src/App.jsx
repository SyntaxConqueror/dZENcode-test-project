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

    const [cacheStatus, setCacheStatus] = useState(false);


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

    useEffect(()=>{
        if(!cacheStatus){
            const sortEndpoints = [
                'http://127.0.0.1:8000/api/sort/dateDescendingSort',
                'http://127.0.0.1:8000/api/sort/dateAscendingSort',
                'http://127.0.0.1:8000/api/sort/usernameSort',
                'http://127.0.0.1:8000/api/sort/emailSort',
            ]
            sortEndpoints.forEach((item)=>{
                axios.get(item)
                    .then(()=> {
                        console.log("Download successfully: " + item);
                    })
                    .catch((error)=>{console.log(error)})
            })
            setCacheStatus(true);
        }
    }, [cacheStatus])


    return (
        <div className={styles.main__container}>
            <CommentCreateForm
                comments={comments}
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
