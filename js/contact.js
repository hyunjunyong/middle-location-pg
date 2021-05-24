import getCenter from "./getCenter.js";

const centerPosition = getCenter(getPositions());
let markerPosition = new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat);
let middlelon = centerPosition.lon;
let middlelat = centerPosition.lat;

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(middlelon, middlelat), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

function bus() {
    function getAddr(lon, lat) {
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(middlelon, middlelat);
        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                console.log(result);
                // 지도를 클릭한 위치에 표출할 마커입니다
                var marker = new kakao.maps.Marker({
                    // 지도 중심좌표에 마커를 생성합니다 
                    position: new kakao.maps.LatLng(middlelon, middlelat)
                });
                // 지도에 마커를 표시합니다
                marker.setMap(map);
                var str = result[0].address.address_name.fontcolor("red").bold().fontsize(4);
                var message = "중간 거리의 주소는 " + str + " 입니다.";

                var resultDiv = document.getElementById('clickLatlng');
                resultDiv.innerHTML = message;
            }
        };
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);


    }
    getAddr(middlelon, middlelat);
}
function getPositions() {
    return JSON.parse(localStorage.getItem('positions'));
}

bus();


$.getJSON("../json/bus_station.json", function(data) {
    for(var key in data){
        if(middlelon == data[key].위도 && middlelat == data[key].경도)
        {
            console.log(data[key].정류소명);
        }
    }
    
});
