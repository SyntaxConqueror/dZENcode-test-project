import styles from './styles.module.css';
import {useEffect, useRef, useState} from "react";
import axios from 'axios';
// eslint-disable-next-line react/prop-types
export const CommentCreateForm = ({replyId}) => {

    const [captcha, setCaptcha] = useState('');
    const [isCaptchaCorrect, setIsCaptchaCorrect] = useState(null);
    const [fileChosen, setFileChosen] = useState('');
    const [contentInputValue, setContentInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [comment, setComment] = useState({
        username: null,
        email: null,
        homepageURL: null,
        content: null,
        parentId: null,
        file: null,
    });

    const contentInputRef = useRef(null);
    const fileInputRef = useRef(null);
    const allCharacters = [];

    useEffect(()=>{
        errorMessage && alert(errorMessage);
        setErrorMessage(null);
    }, [errorMessage]);

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
        replyId = null;
        const updatedComment = {...comment};
        updatedComment.parentId = replyId;
        setComment(updatedComment);
    }


    /* -------------------------
        Functions for creating
        and checking captchas
    */
    for (let i = 0; i <= 127; i++) {
        const character = String.fromCharCode(i);
        if (/[A-Za-z0-9]/.test(character)) {
            allCharacters.push(character);
        }
    }

    const getCaptcha = () => {
        let newCaptcha = '';
        for (let i = 0; i < 6; i++) {
            let randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];
            newCaptcha += ` ${randomCharacter}`;
        }
        setCaptcha(newCaptcha);
    };

    const checkCaptcha = (e) => {
        if(captcha.replace(/\s/g, "") !== e.target.value) {
            setIsCaptchaCorrect(false);
        } else setIsCaptchaCorrect(true);
    }
    useEffect(() => {
        getCaptcha();
    }, []);

    const handleReload = () => {
        getCaptcha();
    };


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

                console.log(comment.file);
                axios.post('http://127.0.0.1:8000/api/createComment', commentData)
                .then((response)=>{
                    console.log(response.data);
                    // eslint-disable-next-line no-prototype-builtins
                    response.data.message && setErrorMessage(response.data.message);
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        } catch (err) {
            console.log(err);
        }
    };


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
        Filtering tags
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

            <form className={styles.subcontainer} onSubmit={handleSubmit}>
                <div className={styles.form__header}>
                    <h2>Comment Form</h2>
                    {comment.parentId &&
                        <>
                            <i className="material-icons">reply</i>
                            <span>reply to user: {replyId}</span>
                            <i className="material-icons close" onClick={clearReplyId}>close</i>
                        </>
                    }

                </div>

                <div className={styles.form__group}>
                    <input type="input" className={styles.form__field} placeholder="User Name" name="username" id='name' required />
                    <label htmlFor="username" className={styles.form__label}>User Name</label>
                </div>
                <div className={styles.form__group}>
                    <input type="email" className={styles.form__field} placeholder="Email" name="email" id='email' required />
                    <label htmlFor="email" className={styles.form__label}>Email</label>
                </div>
                <div className={styles.form__group}>
                    <input type="input" className={styles.form__field} placeholder="Home Page URL" name="homepageURL" id='homepageURL' />
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
                            onClick={() => insertTag('<strong>', '<strong>')}
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
                            <div className={styles.captcha}>{captcha}</div>
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
                            required
                            onChange={(e) => checkCaptcha(e)}
                        />
                        {isCaptchaCorrect === false && <p style={{ color: 'red' }}>Captcha is not correct.</p>}
                        <label className={styles.form__label} htmlFor="captcha">Captcha</label>
                    </div>

                </div>
                <button type="submit" className={styles.submit__btn}>Send comment</button>

            </form>
        </div>
    )
}