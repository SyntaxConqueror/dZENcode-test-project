import styles from './styles.module.css';
export const Comment = ({id}) => {
    return (
        <div className={styles.comment__container}>
            <div className={styles.comment__header}>
                <div className={styles.user__avatar}>
                    <i className="material-icons">account_circle</i>
                </div>
                <div className={styles.user__name}>
                    <span>UserName</span>
                </div>
                <div className={styles.publication__date}>
                    <span>22.10.23 в 12:33</span>
                </div>
                <div className={styles.comment__functions}>
                    <i className="material-icons">reply</i>
                </div>
            </div>
            <div className={styles.comment__content}>
                <div className={styles.content__file}>
                    <div>

                    </div>
                    <div>
                        <a className={styles.popup__image} href="/images/captcha-bg.png" data-lightbox={id}>
                            <img src="/images/captcha-bg.png" width={'100'} height={'50'} alt="Image"/>
                            <i className="material-icons">open_in_new</i>
                        </a>
                    </div>
                </div>

                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Non odio euismod lacinia at quis risus sed vulputate odio.
                Mattis nunc sed blandit libero volutpat sed cras ornare arcu.
                <br/><code>
                    Diam phasellus vestibulum lorem sed risus ultricies.
                Neque convallis a cras semper auctor neque vitae tempus.
                Enim neque volutpat ac tincidunt vitae semper.
                Dui ut ornare lectus sit amet. Diam ut venenatis tellus in.
                </code><br/><br/>
                Euismod in pellentesque massa placerat duis ultricies.
                Commodo ullamcorper a lacus vestibulum sed. A scelerisque purus
                semper eget duis at tellus at. In hac habitasse platea dictumst
                vestibulum rhoncus est pellentesque. Amet consectetur adipiscing
                elit duis tristique. Sed viverra tellus in hac habitasse. Dictum sit amet justo donec enim.
            </div>
        </div>
    )
}