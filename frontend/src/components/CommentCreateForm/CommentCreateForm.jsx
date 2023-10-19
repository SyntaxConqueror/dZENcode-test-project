import styles from './styles.module.css';
import {useEffect, useRef, useState} from "react";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import axios from 'axios';
import CommentPreview from "./CommentPreview/CommentPreview.jsx";
import ErrorModal from "../ErrorModal/ErrorModal.jsx";
/* eslint-disable react/prop-types */
export const CommentCreateForm = ({replyId, setReplyId, setComments, userNameReplyTo, setUserNameReplyTo}) => {

    const [isCaptchaCorrect, setIsCaptchaCorrect] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(null);

    const [fileChosen, setFileChosen] = useState('');
    const [contentInputValue, setContentInputValue] = useState('');

    const [showReplyElements, setShowReplyElements] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [comment, setComment] = useState({
        username: null,
        email: null,
        homepageURL: null,
        content: null,
        parentId: null,
        file: null,
    });
    const [previewComment, setPreviewComment] = useState();

    const contentInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const captchaInputRef = useRef(null);
    const formRef = useRef(null);
    const reloadCaptchaBtn = document.getElementById('reload_href');


    /* -------------------------------------

        useEffects for tracking errors and
        make loading effect to reply element

    */
    useEffect(()=>{
        errorMessage && setShowErrorModal(true);
    }, [errorMessage]);
    useEffect(() => {
        if (comment.parentId) {
            setTimeout(() => {
                setShowReplyElements(true);
            }, 150);
        }
    }, [comment.parentId]);


    /* -------------------------

        Functions for tracking
        and clearing reply id

    */
    useEffect(() => {
        const updatedComment = {...comment};
        updatedComment.parentId = replyId;
        setComment(updatedComment);
    }, [replyId]);
    const clearReplyId = () => {
        setReplyId(null);
        const updatedComment = {...comment};
        updatedComment.parentId = replyId;
        setComment(updatedComment);
        setUserNameReplyTo(null);
        setShowReplyElements(false);
    }


    /* -------------------------

        Functions for creating
        and checking captcha

    */
    useEffect(() => {
        loadCaptchaEnginge(6, '#CCCCCC00', 'rgb(168,168,168)');
    }, []);
    const handleReload = () => {
        if (reloadCaptchaBtn) {
            reloadCaptchaBtn.display = 'none';
            reloadCaptchaBtn.click();
            captchaInputRef.current.value = null;
        } else {
            console.error('Element with id "myButton" not found.');
        }
    };
    const checkCaptcha = (e) => {
        if(validateCaptcha(e.target.value, false)===true){
            setIsCaptchaCorrect(true);
        } else {
            setIsCaptchaCorrect(false);
        }
    }


    /* -------------------------

        Function for making a request
        Submitting a data of comment

    */
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);

            if(isCaptchaCorrect) {
                const commentData = new FormData();
                commentData.append('username', formData.get('username'));
                commentData.append('email', formData.get('email'));
                commentData.append('homepageURL', formData.get('homepageURL'));
                commentData.append('text_content', formData.get('content'));
                commentData.append('parentId', comment.parentId ?? null);
                commentData.append('file', comment.file);

                axios.post('http://127.0.0.1:8000/api/createComment', commentData)
                    .then((response)=>{
                        if(response.data.message){
                            setErrorMessage(response.data.message);
                            return response(response.data);
                        }
                        setComments(response.data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                handleReload();
            }
        } catch (err) {
            console.log(err);
        }
    };


    /* -------------------------

        Function for making a request
        Creating a preview of comment

    */
    const handlePreview = () => {
        const formData = new FormData(formRef.current);
        const date = Date.now();

        const commentPreviewData = new FormData();
        commentPreviewData.append('id', '1');
        commentPreviewData.append('username', formData.get('username'));
        commentPreviewData.append('email', formData.get('email'));
        commentPreviewData.append('text_content', formData.get('content'));
        commentPreviewData.append('file', comment.file && URL.createObjectURL(comment.file));
        commentPreviewData.append('file_type', comment.file && comment.file.type);
        commentPreviewData.append('created_at', date.toString());


        axios.post('http://127.0.0.1:8000/api/createPreviewComment', commentPreviewData)
            .then((response)=>{
                if(response.data.message){
                    setErrorMessage(response.data.message);
                    return response.data;
                }
                console.log(response.data);
                setPreviewComment(response.data);
                setShowPreview(true);
            })
            .catch((error)=> {console.log(error)})

    }


    /* -------------------------

        Functions for handling file's changes in comment

    */
    const handleChooseFile = () => {
        fileInputRef.current.click();
    }
    const clearChosenFile = () => {
        fileInputRef.current.value = null;
        setFileChosen(null);
        const updatedComment = {...comment};
        updatedComment.file = null;
        setComment(updatedComment);
    }
    const resizeImage = (img, fileType) => {

        const maxWidth = 320;
        const maxHeight = 240;

        const exactFileType = fileType.slice(fileType.lastIndexOf('/') + 1);
        console.log(exactFileType);

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
            if (width / maxWidth > height / maxHeight) {
                width = maxWidth;
                height = (maxWidth * img.height) / img.width;
            } else {
                height = maxHeight;
                width = (maxHeight * img.width) / img.height;
            }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
            if (blob) {

                const file = new File([blob], `resized-image.${exactFileType}`, { type: `${fileType}` });
                const updatedComment = { ...comment };
                updatedComment.file = file;
                setComment(updatedComment);

            }
        }, `${fileType}`);
    }

    const handleFileInputChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            const fileType = file.type;

            if (fileType.startsWith("image/")) {

                const img = new Image();
                const reader = new FileReader();

                reader.onload = function (e) {
                    img.src = e.target.result;
                    img.onload = function () {
                        resizeImage(img, fileType);
                    }
                    setFileChosen(`Selected file: ${file.name}`);
                };

                reader.readAsDataURL(file);
            } else if (fileType === "text/plain") {
                if (file.size <= 102400) {

                    const updatedComment = {...comment};
                    updatedComment.file = file;
                    setComment(updatedComment);
                    setFileChosen(`Selected file: ${file.name}`);

                } else {
                    alert("The text file is too large. Maximum size: 100 kb.");
                    e.target.value = "";
                    setFileChosen('');
                }
            }
        }

    }


    /* -------------------------

        Function for inserting
        tags to users comment text

    */
    const insertTag = (openingTag, closingTag) => {
        const start = contentInputRef.current.selectionStart;
        const end = contentInputRef.current.selectionEnd;

        const text = contentInputValue;
        const selectedText = text.substring(start, end);

        const newText = text.slice(0, start) + openingTag + selectedText + closingTag + text.slice(end);

        setContentInputValue(newText);

        contentInputRef.current.setSelectionRange(start + openingTag.length, end + openingTag.length);
    };


    /* -------------------------

        Function for handling the content of comment
        filtering tags

    */
    const handleContentInputChange =(e)=>{
        const inputValue = e.target.value;

        // Функция для разрешения только определенных HTML-тегов и проверки на закрытие
        function sanitizeInput(input) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(input, 'text/html');

            function checkClosingTags(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    const allowedTags = ['a', 'i', 'strong', 'code'];

                    if (allowedTags.includes(tagName)) {
                        const newNode = document.createElement(tagName);
                        node.childNodes.forEach(checkClosingTags);
                        newNode.innerHTML = node.innerHTML;
                        node.replaceWith(newNode);
                    }
                }
            }

            doc.body.childNodes.forEach(checkClosingTags);
            return doc.body.innerHTML;
        }

        const sanitizedValue = sanitizeInput(inputValue);
        setContentInputValue(sanitizedValue);
    }


    return (
        <div className={styles.container}>

            <form className={styles.subcontainer} onSubmit={handleSubmit} ref={formRef}>
                <div className={styles.form__header}>
                    <h2>Comment Form</h2>
                    {showReplyElements && comment.parentId &&
                        <div>
                            <i className="material-icons">reply</i>
                            <span>reply to: {userNameReplyTo}</span>
                            <i className="material-icons close" onClick={clearReplyId}>close</i>
                        </div>
                    }
                </div>

                <div className={styles.form__group}>
                    <input
                        type="input"
                        className={styles.form__field}
                        placeholder="User Name"
                        name="username"
                        id='name'
                        minLength="3"
                        maxLength="25"
                        required />
                    <label htmlFor="username" className={styles.form__label}>User Name</label>
                </div>
                <div className={styles.form__group}>
                    <input type="email" className={styles.form__field} placeholder="Email" name="email" id='email' required />
                    <label htmlFor="email" className={styles.form__label}>Email</label>
                </div>
                <div className={styles.form__group}>
                    <input type="url" className={styles.form__field} placeholder="Home Page URL" name="homepageURL" id='homepageURL' />
                    <label htmlFor="homepageURL" className={styles.form__label}>Home Page URL</label>

                </div>
                <div className={styles.form__content__group}>
                    <div className={styles.form__content__fields}>
                        <label htmlFor="content">Content</label>
                        <textarea
                            required
                            name="content"
                            placeholder="Write here your comment"
                            className={styles.form__content__field}
                            ref={contentInputRef}
                            value={contentInputValue}
                            maxLength="2000"
                            onChange={handleContentInputChange}
                        ></textarea>
                    </div>
                    <div className={styles.form__content__buttons}>
                        <span
                            className={styles.tag__btn}
                            onClick={() => insertTag("<i>", '</i>')}
                        >&lt;i&gt;</span>
                        <span
                            className={styles.tag__btn}
                            onClick={() => insertTag('<a href="" target="_blank">', '</a>')}
                        >&lt;a&gt;</span>
                        <span
                            className={styles.tag__btn}
                            onClick={() => insertTag('<strong>', '</strong>')}
                        >&lt;strong&gt;</span>
                        <span
                            className={styles.tag__btn}
                            onClick={() => insertTag('<code>', '</code>')}
                        >&lt;code&gt;</span>
                    </div>
                </div>
                
                <div className={styles.form__file__group}>
                    <label
                        htmlFor="comment__file"
                        className={styles.submit__btn}
                        onClick={handleChooseFile}
                    >Choose file</label>
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .gif, .txt"
                        name="comment__file" ref={fileInputRef}
                        onChange={handleFileInputChange}/>
                    <span>{fileChosen}</span>
                    {fileChosen && <i className='material-icons close' onClick={clearChosenFile}>close</i>}

                </div>

                <div className={styles.form__group}>
                    <div className={styles.captcha__area}>
                        <div className={styles.captcha__img}>
                            <div>
                                <LoadCanvasTemplateNoReload/>
                            </div>
                            <button type="button" className={styles.reload__btn} onClick={handleReload}>
                                <i className="material-icons">refresh</i>
                            </button>
                        </div>

                    </div>

                    <div className={styles.form__group}>
                        <input
                            className={styles.form__field}
                            placeholder="captcha" type="text"
                            maxLength="6" spellCheck="false"
                            ref={captchaInputRef}
                            required
                            onChange={(e) => checkCaptcha(e)}
                        />
                        {isCaptchaCorrect === false && <p style={{ color: 'red' }}>Captcha is not correct.</p>}
                        <label className={styles.form__label} htmlFor="captcha">Captcha</label>

                    </div>

                </div>
                <div className={styles.form__buttons}>
                    <button type="button" onClick={handlePreview} className={styles.submit__btn}>Preview</button>
                    <button type="submit" className={styles.submit__btn}>Send comment</button>
                </div>
            </form>
            {showPreview && <CommentPreview show={showPreview} setShowPreview={setShowPreview} commentData={previewComment}/>}
            {
                showErrorModal
                &&
                <ErrorModal
                    show={showErrorModal}
                    setShow={setShowErrorModal}
                    error={errorMessage}
                    setErrorMessage={setErrorMessage}
                />}
        </div>
    )
}