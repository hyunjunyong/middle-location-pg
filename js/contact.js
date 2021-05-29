import getCenter from "./getCenter.js";

const centerPosition = getCenter(getPositions());
let markerPosition = new kakao.maps.LatLng(
  centerPosition.lon,
  centerPosition.lat
);
let middlelon = centerPosition.lon;
let middlelat = centerPosition.lat;

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(middlelon, middlelat), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
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
          position: new kakao.maps.LatLng(middlelon, middlelat),
        });
        // 지도에 마커를 표시합니다
        marker.setMap(map);
        var str = result[0].address.address_name
          .fontcolor("red")
          .bold()
          .fontsize(4);
        var message = "중간 거리의 주소는 " + str + " 입니다.";

        var resultDiv = document.getElementById("clickLatlng");
        resultDiv.innerHTML = message;
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }
  getAddr(middlelon, middlelat);
}
function getPositions() {
  return JSON.parse(localStorage.getItem("positions"));
}

bus();
//api 작동
var request = new XMLHttpRequest();
var buslocation = document.querySelector("#bus");
request.open(
  "GET",
  "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e05cbd3503a24fa3a5707b98dff59732&start=126.53854779634501,%2033.4989558825918&end=126.54119874110302,33.4926791525441"
);

request.setRequestHeader(
  "Accept",
  "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
);

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log("Status:", this.status);
    // buslocation.innerHTML = this.responseText;
    // console.log("Headers:", this.getAllResponseHeaders());
    var data = this.responseText;
    console.log(data);
  }
};
request.send();

// 선좌표
var linePath = [
  new kakao.maps.LatLng(33.498882, 126.538467),
  new kakao.maps.LatLng(33.498748, 126.538645),
  new kakao.maps.LatLng(33.498585, 126.538765),
  new kakao.maps.LatLng(33.498727, 126.539058),
  new kakao.maps.LatLng(33.498884, 126.539372),
  new kakao.maps.LatLng(33.498512, 126.539616),
  new kakao.maps.LatLng(33.497645, 126.537901),
  new kakao.maps.LatLng(33.497139, 126.538332),
  new kakao.maps.LatLng(33.496927, 126.538507),
  new kakao.maps.LatLng(33.496681, 126.538721), //10
  new kakao.maps.LatLng(33.496254, 126.539106),
  new kakao.maps.LatLng(33.495943, 126.539365),
  new kakao.maps.LatLng(33.494642, 126.540516),
  new kakao.maps.LatLng(33.494242, 126.540899),
  new kakao.maps.LatLng(33.493535, 126.541575),
  new kakao.maps.LatLng(33.493119, 126.540993),
  new kakao.maps.LatLng(33.492902, 126.541188),
  new kakao.maps.LatLng(33.492754, 126.54132),
];

// 지도에 표시할 선을 생성합니다
var polyline = new kakao.maps.Polyline({
  path: linePath, // 선을 구성하는 좌표배열 입니다
  strokeWeight: 5, // 선의 두께 입니다
  strokeColor: "#FFAE00", // 선의 색깔입니다
  strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
  strokeStyle: "solid", // 선의 스타일입니다
});

// 지도에 선을 표시합니다
polyline.setMap(map);
