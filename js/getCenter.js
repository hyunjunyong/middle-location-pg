export default function getCenter(markers) {
    //중간위치 입력안되면 alert창 띄우기
    if (markers === null) {
        alert("중간거리가 없거나 주소를 입력하지 않으셨습니다. \n중간위치를 먼저 입력해주세요!");
        window.location.href = 'https://hyunjunyong.github.io/middle-location-pg/about.html';
    }else {
        const count = markers.length;
        const centerLon = markers.reduce(((p, c) => p + c.Ma), 0) / count;
        const centerLat = markers.reduce(((p, c) => p + c.La), 0) / count;
        console.log(centerLon, centerLat);
        return {
            lon: centerLon,
            lat: centerLat,
        };
    }
};