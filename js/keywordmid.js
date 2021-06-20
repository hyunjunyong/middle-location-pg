import getCenter from "./component/getCenter.js";

//각자의 위치 값 배열
const positions = getPositions();

function getPositions() {
  return JSON.parse(localStorage.getItem("positions"));
}

//positions의 중간위치 반환
const centerPosition = getCenter(positions);

function getAddr(lon, lat) {
  let geocoder = new kakao.maps.services.Geocoder();
  let coord = new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat);
  let callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      var str = result[0].address.address_name;
      alert("여러분들의 중간위치는 " + str + " 입니다.");
    }
  };
  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}

getAddr(centerPosition.lon, centerPosition.lat);

function searchAddrFromCoords(coords, callback) {
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
  // 좌표로 법정동 상세 주소 정보를 요청합니다
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}
