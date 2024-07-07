export default function CloseButton({onClose}) {
    return (
        <button className="btn close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
        </button>
    );
};