
//mouseover
export default function makeOverListener(map, marker, infowindow) {
    return function () {
        infowindow.open(map, marker);
    };
}