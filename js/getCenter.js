export default function getCenter(markers) {
    if (!markers) {
        console.log("positions가 비었어요");
        return;
    }
    const count = markers.length;
    const centerLon = markers.reduce(((p, c) => p + c.Ma), 0) / count;
    const centerLat = markers.reduce(((p, c) => p + c.La), 0) / count;
    console.log(centerLon, centerLat);
    return {
        lon: centerLon,
        lat: centerLat,
    };
};