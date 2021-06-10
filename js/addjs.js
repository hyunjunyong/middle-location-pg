import getCenter from "./getCenter.js";


const $add1 = document.getElementById('add1');
const $add2 = document.getElementById('add2');
const $btn1 = document.getElementById('button-addon1');
const $btn2 = document.getElementById('button-addon2');
const $reset = document.getElementById('restart-btn');
const url = "https://dapi.kakao.com/v2/local/search/address.json";
const headers = { Authorization: " KakaoAK 9434c60fa9c26e7c4f5c81801f763f04" };


$btn1.addEventListener("click", () => searchaddname($add1));
$btn2.addEventListener("click", () => searchaddname($add2));


//지도
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

//주소 검색시 json출력
async function searchaddname($add) {
    const addValue = $add.value;
    if (addValue === '') {
        alert('주소를 입력하세요');
        return false;
    }

    const respone = await fetch(`${url}?query=${addValue}`, { headers });
    const data = await respone.json();
    const json = await data;
    drawMarker(json);
}

function drawMarker(json) {
    console.log(json)
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(json.documents[0].address_name, function (result, status) {

        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {

            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:150px;text-align:center;padding:6px 0;">위치</div>'
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);

            //로컬스토리지에 위도 경도 저장
            savePosition(marker.getPosition());
        }
    });
}

//더보기 버튼 클릭시 주소 검색 폼 추가
const $addressFormBtn = document.querySelector(".address-form-group");
const $moreBtn = document.getElementById("more-button");
$moreBtn.addEventListener("click", makeForm);

function makeForm() {
    const div = document.createElement("div");
    div.setAttribute('class', 'input-group mb-3');
    div.innerHTML = '<input type="text" class="form-control" aria-label="Recipient\'s username"aria-describedby="button-addon2"> <button class="btn btn-outline-secondary" type="button" id="button-addon1">검색</button>'
    $addressFormBtn.appendChild(div);
    const $addedInput = document.querySelector(".input-group:last-child.input-group input");
    const $addedSearchBtn = document.querySelector(".input-group:last-child.input-group button");
    $addedSearchBtn.addEventListener("click", () => searchaddname($addedInput));
}

function savePosition(adrress) {

    let isExist = localStorage.getItem("positions");
    isExist = isExist ? JSON.parse(isExist) : [];

    //address = {위도: 111, 경도: 222}
    // const adrress = {'x': x, 'y': y};
    isExist.push(adrress)

    localStorage.setItem("positions", JSON.stringify(isExist))
}

const $midBtn = document.getElementById("mid-btn");
$midBtn.addEventListener("click", () => {
    const centerPosition = getCenter(getPositions());
    // localStorage.setItem("centerPosition", centerPosition);
    let markerPosition = new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        position: markerPosition
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

    // 인포윈도우로 장소에 대한 설명을 표시합니다
    var infowindow = new kakao.maps.InfoWindow({
        content: '<div style="width:150px;text-align:center;padding:6px 0;">중간위치</div>'
    });
    infowindow.open(map, marker);

    //중간위치 마커로 지도 이동
    map.setCenter(new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat));
});

function getPositions() {
    return JSON.parse(localStorage.getItem('positions'));
}

