export default function  (inputDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const parsedDate = new Date(inputDate);
    return parsedDate.toLocaleDateString(undefined, options);
}