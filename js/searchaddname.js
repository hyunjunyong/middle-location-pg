import drawMarker from "./drawMarker.js";

//주소 검색시 json출력
export default async function searchaddname($add) {
    const url = "https://dapi.kakao.com/v2/local/search/address.json";
    const headers = { Authorization: " KakaoAK 9434c60fa9c26e7c4f5c81801f763f04" };
    const addValue = $add.value;
    if (addValue === '') {
        alert('주소를 입력하세요');
        return false;
    }

    const respone = await fetch(`${url}?query=${addValue}`, {headers});
    const data = await respone.json();
    const json = await data;
    drawMarker(json);
}