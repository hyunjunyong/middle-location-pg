const $add1 = document.getElementById('add1');
const $add2 = document.getElementById('add2');
const $btn1 = document.getElementById('button-addon1');
const $btn2 = document.getElementById('button-addon2');
const url = "https://dapi.kakao.com/v2/local/search/address.json";
const headers = { Authorization: " KakaoAK 9434c60fa9c26e7c4f5c81801f763f04" };

$btn1.addEventListener("click", searchaddname);

//지도
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

//주소 검색시 json출력
function searchaddname() {
    const addValue  = $add1.value;
    if (addValue === '') {
        alert('주소를 입력하세요');
        return false;
    }

    fetch(`${url}?query=` +  addValue, {headers})
        .then((res) => res.json())
        .then(res => {
            console.log(res);
        })
        // .then(json => getAdd(json))

}



// 주소로 좌표를 검색합니다
function getAdd(data) {


    // console.log(posX);

    var geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(data, function(result, status) {

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
                content: '<div style="width:150px;text-align:center;padding:6px 0;">우리회사</div>'
            });
            infowindow.open(map, marker);
            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });
}


