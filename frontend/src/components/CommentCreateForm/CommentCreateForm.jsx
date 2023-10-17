import styles from './styles.module.css';


import {ReCAPTCHA} from "react-google-recaptcha";
import {useEffect, useRef, useState} from "react";
export const CommentCreateForm = () => {

    const [captcha, setCaptcha] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [fileChosen, setFileChosen] = useState('');
    const [contentInputValue, setContentInputValue] = useState('');


    const [comment, setComment] = useState({
        username: null,
        email: null,
        homepageURL: null,
        content: null,
        file: null,
    });

    const contentInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const allCharacters = [];

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

    useEffect(() => {
        getCaptcha();
    }, []);

    const handleReload = () => {
        setInputValue('');
        getCaptcha();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChooseFile = () => {
        fileInputRef.current.click();
    }

    const resizeImage = (img, fileType) => {

        const maxWidth = 320;
        const maxHeight = 240;

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

        const updatedComment = {...comment};
        updatedComment.file = canvas.toDataURL(fileType);
        setComment(updatedComment);

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
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const text = e.target.result;
                    };

                    setFileChosen(`Selected file: ${file.name}`);

                    reader.readAsText(file);
                } else {
                    alert("The text file is too large. Maximum size: 100 kb.");
                    e.target.value = "";
                    setFileChosen('');
                }
            } else {
                alert("The file format is not supported.");
                e.target.value = ""; // Сбросить input
                setFileChosen('');
            }
        }

    }

    const insertTag = (openingTag, closingTag) => {
        const start = contentInputRef.current.selectionStart;
        const end = contentInputRef.current.selectionEnd;

        const text = contentInputValue;
        const selectedText = text.substring(start, end);

        const newText = text.slice(0, start) + openingTag + selectedText + closingTag + text.slice(end);

        setContentInputValue(newText);

        contentInputRef.current.setSelectionRange(start + openingTag.length, end + openingTag.length);
    };


    return (
        <div className={styles.container}>

            <form className={styles.subcontainer} onSubmit={handleSubmit}>
                <h2>Comment Form</h2>
                <div className={styles.form__group}>
                    <input type="input" className={styles.form__field} placeholder="User Name" name="username" id='name' required />
                    <label htmlFor="username" className={styles.form__label}>User Name</label>
                </div>
                <div className={styles.form__group}>
                    <input type="email" className={styles.form__field} placeholder="Email" name="email" id='email' required />
                    <label htmlFor="email" className={styles.form__label}>Email</label>
                </div>
                <div className={styles.form__group}>
                    <input type="text" className={styles.form__field} placeholder="Home Page URL" name="homepageURL" id='homepageURL' />
                    <label htmlFor="homepageURL" className={styles.form__label}>Home Page URL</label>
                </div>
                <div className={styles.form__content__group}>
                    <div className={styles.form__content__fields}>
                        <label htmlFor="content">Content</label>
                        <textarea
                            name="content"
                            placeholder="Write here your comment"
                            className={styles.form__content__field}
                            ref={contentInputRef}
                            value={contentInputValue}
                            onChange={(e) => setContentInputValue(e.target.value)}
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
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <label className={styles.form__label} htmlFor="captcha">Captcha</label>
                    </div>

                </div>
                <button type="submit" className={styles.submit__btn}>Send comment</button>

            </form>
        </div>
    )
}