import getCenter from "./component/getCenter.js";
import getPositions from "./component/getPosition.js";
import searchBusLaneAJAX from "./component/searchbusAJAX.js";
import makeOverListener from "./component/makeOverListener.js";
import makeOutListener from "./component/makeOutListener.js";

//n값으로 시작위치와 중간지점의 교통정보 파악


const positions = getPositions();
//positions의 중간위치 반환
const centerPosition = getCenter(positions);

let markerPosition = [
  {
    title: "도착위치",
    latlng: new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat),
  },
];

for (let i in positions) {
  markerPosition.push({
    title: "시작위치" + (parseInt(i) + 1),
    latlng: new kakao.maps.LatLng(positions[i]["Ma"], positions[i]["La"]),
  });
}

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat), // 지도의 중심좌표
    level: 6, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

function getAddr(lon, lat) {
  let geocoder = new kakao.maps.services.Geocoder();
  let coord = new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat);
  let callback = function (result, status) {
    if (status === kakao.maps.services.Status.OK) {
      // console.log(result);

      // 지도를 클릭한 위치에 표출할 마커입니다
      var infowindow = new kakao.maps.InfoWindow({
        position: markerPosition[0].latlng,
        content: `<div style="padding: 5px;">${markerPosition[0].title}</div>`,
      });
      var imageSrc =
          "https://github.com/hyunjunyong/middle-location-pg/blob/main/img/placeholder.png?raw=true", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(40, 40); // 마커이미지의 크기입니다

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize
        // imageOption
      );

      //도착지점 마커 객체 생성
      var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: markerPosition[0].latlng, // 마커를 표시할 위치
        title: markerPosition[0].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커이미지 설정
      });
      marker.setMap(map);
      //인포윈도우와 마커 그리기
      kakao.maps.event.addListener(
        marker,
        "mouseover",
        makeOverListener(map, marker, infowindow)
      );
      kakao.maps.event.addListener(
        marker,
        "mouseout",
        makeOutListener(infowindow)
      );

      //출발지점 마커 객체 생성
      for (let i = 1; i < markerPosition.length; i++) {
        // 마커를 생성합니다
        var startmarker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: markerPosition[i].latlng, // 마커를 표시할 위치
          title: markerPosition[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
        });
        var infowindow1 = new kakao.maps.InfoWindow({
          position: markerPosition[i].latlng,
          content: `<div style="padding: 5px;">${markerPosition[i].title}</div>`,
        });

        kakao.maps.event.addListener(
          startmarker,
          "mouseover",
          makeOverListener(map, startmarker, infowindow1)
        );
        kakao.maps.event.addListener(
          startmarker,
          "mouseout",
          makeOutListener(infowindow1)
        );
        kakao.maps.event.addListener(startmarker, "click", function () {
          n = i - 1;
          console.log(n);
          searchBusLaneAJAX();
          // busPathTest();
        });
      }
      //출발지점 마커 그리기
      startmarker.setMap(map);

      var str = result[0].address.address_name
        .fontcolor("navy")
        .bold()
        .fontsize(3);
      var message = "중간위치는 " + str + " 입니다.";

      var resultDiv = document.getElementById("clickLatlng");
      resultDiv.innerHTML = message;
    }
  };
  geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
}

getAddr(centerPosition.lon, centerPosition.lat);

//길찾기
for (let i = 0; i < positions.length; i++) {
  const colors = [
    "#FF7F00",
    "#d42424",
    "#30ffe7",
    "#80FF00",
    "#00FFFF",
    "#0000FF",
    "#8000FF",
    "#FF00FF",
  ];
  let selecetedColor = colors[i];
  var request = new XMLHttpRequest();

  let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e05cbd3503a24fa3a5707b98dff59732
&start=${positions[i]["La"]},${positions[i]["Ma"]}&end=${centerPosition.lat},${centerPosition.lon}`;

  request.open("GET", url);

  request.setRequestHeader(
    "Accept",
    "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
  );

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      var data = this.responseText;
      var dataparse = JSON.parse(data);
      var datareverse = [];
      for (
        var i = 0;
        i < dataparse["features"][0]["geometry"]["coordinates"].length;
        i++
      ) {
        datareverse[i] = [
          parseFloat(dataparse["features"][0]["geometry"]["coordinates"][i][0]),
          parseFloat(dataparse["features"][0]["geometry"]["coordinates"][i][1]),
        ].reverse();
      }

      // 선좌표
      function getLinePath() {
        let linePath = [];
        for (var i = 0; i < datareverse.length; i++) {
          linePath.push(
            new kakao.maps.LatLng(datareverse[i][0], datareverse[i][1])
          );
        }

        return linePath;
      }

      // 지도에 표시할 선을 생성합니다
      var polyline = new kakao.maps.Polyline({
        path: getLinePath(), // 선을 구성하는 좌표배열 입니다
        strokeWeight: 5, // 선의 두께 입니다
        strokeColor: selecetedColor, // 선의 색깔입니다
        strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
      });

      // 지도에 선을 표시합니다
      polyline.setMap(map);
    }
  };
  request.send();
}





