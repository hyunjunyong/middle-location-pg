export default function savePosition(adrress) {

    let isExist = localStorage.getItem("positions");
    isExist = isExist ? JSON.parse(isExist) : [];

    //address = {위도: 111, 경도: 222}
    // const adrress = {'x': x, 'y': y};
    isExist.push(adrress)

    localStorage.setItem("positions", JSON.stringify(isExist))
}