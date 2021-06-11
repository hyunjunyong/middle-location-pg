import getCenter from "./getCenter.js";
let n = 0;
//n값으로 시작위치와 중간지점의 교통정보 파악

//각자의 위치 값 배열
const positions = getPositions();

function getPositions() {
  return JSON.parse(localStorage.getItem("positions"));
}
//positions의 중간위치 반환
const centerPosition = getCenter(positions);
let markerPosition = [
  {
    title: "도착위치",
    latlng: new kakao.maps.LatLng(centerPosition.lon, centerPosition.lat),
  },
];
// console.log(markerPosition);
// positions.forEach((position) => {
//   markerPosition.push({
//     title: "시작위치",
//     latlng: new kakao.maps.LatLng(position["Ma"], position["La"]),
//   });
// });

for (let i in positions) {
  markerPosition.push({
    title: "시작위치" + (parseInt(i) + 1),
    latlng: new kakao.maps.LatLng(positions[i]["Ma"], positions[i]["La"]),
  });
}
// console.log(positions[0]["Ma"], positions[0]["La"]);
let middlelon = centerPosition.lon;
let middlelat = centerPosition.lat;

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(middlelon, middlelat), // 지도의 중심좌표
    level: 6, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

function bus() {
  function getAddr(lon, lat) {
    let geocoder = new kakao.maps.services.Geocoder();
    let coord = new kakao.maps.LatLng(middlelon, middlelat);
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        // console.log(result);

        // 지도를 클릭한 위치에 표출할 마커입니다
        var infowindow = new kakao.maps.InfoWindow({
          position: markerPosition[0].latlng,
          content: `<div style="padding: 5px;">${markerPosition[0].title}</div>`,
        });
        //도착지점 마커 객체 생성
        var marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: markerPosition[0].latlng, // 마커를 표시할 위치
          title: markerPosition[0].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        });
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
          });
        }
        //출발지점 마커 그리기
        startmarker.setMap(map);

        var str = result[0].address.address_name
          .fontcolor("navy")
          .bold()
          .fontsize(2);
        var message = "중간위치는 " + str + " 입니다.";

        var resultDiv = document.getElementById("clickLatlng");
        resultDiv.innerHTML = message;
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  getAddr(middlelon, middlelat);
}

bus();
//api 작동
for (let i = 0; i < positions.length; i++) {
  const colors = ["#ff0033", "#37ff00", "#00ffea", "#a600ff"];
  let selecetedColor = colors[i];
  var request = new XMLHttpRequest();

  let url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e05cbd3503a24fa3a5707b98dff59732
&start=${positions[i]["La"]},${positions[i]["Ma"]}&end=${middlelat},${middlelon}`;
  // console.log(url);
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
          // ...dataparse["features"][0]["geometry"]["coordinates"][i],
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
        //console.log(linePath);
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

//mouseover
function makeOverListener(map, marker, infowindow) {
  return function () {
    infowindow.open(map, marker);
  };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다
function makeOutListener(infowindow) {
  return function () {
    infowindow.close();
  };
}

//버스 api 테스트
function searchBusLaneAJAX() {
  let xhr = new XMLHttpRequest();

  let url = `https://api.odsay.com/v1/api/searchPubTransPath?SX=${positions[n]["La"]}&SY=${positions[n]["Ma"]}&EX=${middlelat}&EY=${middlelon}&OPT=1&apiKey=LRP8InDDBglP/04OezKdyA`;

  xhr.open("GET", url, true);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = xhr.responseText;
      const busPath = JSON.parse(data);

      console.log(busPath);
      let busPathname_array = [];
      let busPathID_array = [];

      //가는 버스들 번호 -> 버스id로 버스마다 가는 경로들 가져오기
      for (let i = 0; i < busPath.result.path[0].subPath[1].lane.length; i++) {
        const busPathname = busPath.result.path[0].subPath[1].lane[i]["busNo"];
        const busPathId = busPath.result.path[0].subPath[1].lane[i]["busID"];
        busPathname_array.push(busPathname);
        busPathID_array.push(busPathId);
      }

      let $totalTime = document.getElementsByClassName("totalTime");
      let $totalWalk = document.getElementsByClassName("totalWalk");
      let $payment = document.getElementsByClassName("payment");
      let $totalDistance = document.getElementsByClassName("totalDistance");
      let $firstStartStation =
        document.getElementsByClassName("firstStartStation");
      let $lastEndStation = document.getElementsByClassName("lastEndStation");
      let $busNo = document.getElementsByClassName("busNo");
      // let otherbus = document.getElementsByClassName('otherbus');
      let firstwalkdistance =
        document.getElementsByClassName("firstwalkdistance");
      let stationName = document.getElementsByClassName("stationName");
      let secondtwalkdistance = document.getElementsByClassName(
        "secondtwalkdistance"
      );

      $(".totalTime").html(busPath.result.path[0].info.totalTime + "분");
      $(".totalWalk").html(
        "도보" + busPath.result.path[0].info.totalWalk + "m"
      );
      $(".payment").html(busPath.result.path[0].info.payment + "원");
      $(".totalDistance").html(busPath.result.path[0].info.totalDistance + "m");

      //버스 번호 가져올때 노선 같은 버스 다 표기하기
      $(".busNo").html(
        busPath.result.path[0].subPath[1].lane[0]["busNo"] + "번 버스"
      );
      $(".firstStartStation").html(
        busPath.result.path[0].info.firstStartStation
      );
      $(".lastEndStation").html(busPath.result.path[0].info.lastEndStation);

      // $('.otherbus').html(busPath.result.path[0].subPath[1].lane[i].busNo+",");
      for (let i = 1; i < busPath.result.path[0].subPath[1].lane.length; i++) {
        let otherbus = document.getElementsByClassName("otherbus");
        $(".otherbus").html(busPath.result.path[0].subPath[1].lane[i]["busNo"] + " ");
      }
      //console.log(otherbus1);

      // for (let i = 0; i < busPath.result.path[0].subPath[1].passStopList.stations.length ; i++) {
      //   $('.stationName').html(busPath.result.path[0].subPath[1].passStopList.stations[i].stationName+",");
      // }

      $(".firstwalkdistance").html(
        "도보" + busPath.result.path[0].subPath[0].distance + "m"
      );
      $(".secondtwalkdistance").html(
        "도보" + busPath.result.path[0].subPath[2].distance + "m"
      );

      //노선에 넣을 정류장 이름,       //
    }
  };
}
