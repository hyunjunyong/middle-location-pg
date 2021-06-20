export default function getPositions() {
    return JSON.parse(localStorage.getItem('positions'));
}