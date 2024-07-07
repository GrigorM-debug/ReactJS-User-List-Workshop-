import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <span className={styles.course}>React Workshop - September 2023</span>
            </div>
        </header>
    );
};