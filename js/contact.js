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

for (let i in positions) {
  markerPosition.push({
    title: "시작위치" + (parseInt(i) + 1),
    latlng: new kakao.maps.LatLng(positions[i]["Ma"], positions[i]["La"]),
  });
}

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

  getAddr(middlelon, middlelat);
}

bus();


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
&start=${positions[i]["La"]},${positions[i]["Ma"]}&end=${middlelat},${middlelon}`;

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
      const $toggleBtn =
        "<img\n" +
        '                  src="img/down-arrow.png"\n' +
        '                  width="14rem"\n' +
        '                  height="14rem"\n' +
        '                  type="button"\n' +
        '                  data-toggle="collapse"\n' +
        '                  data-target=".stationName"\n' +
        '                  style=" padding-left: 1px"\n' +
        "          >";

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

      let otherbus = document.getElementsByClassName("otherbus");
      let busPathname1 = " "; //string으로 대체 버스번호들 저장
      let stationName1 = " "; //string으로 노선 저장

      if (busPath.result.path[0].subPath[1].lane.length == 1) {
        $(".otherbus").html("대체 버스 정보가 없습니다.");
      } else {
        let subPath = busPath.result.path[0].subPath[1].lane;
        subPath.shift();
        for (let i in subPath) {
          busPathname1 += subPath[i]["busNo"] + ",";
        }
        $(".otherbus").html(busPathname1);
      }
      let stations = busPath.result.path[0].subPath[1].passStopList.stations;
      //출발지 제거
      stations.shift();
      //도착지 제거
      stations.pop();

      const stationNum = stations.length + 1;
      const stationNumNode =
        `<span style="font-size: 1rem; color: rgba(0,0,0,0.71); padding-left: 7px;">${stationNum}개 정류장 이동</span>` +
        $toggleBtn;
      $(".howManyStation").html(stationNumNode);

      console.log(stations);
      for (let i in stations) {
        stationName1 += `<div style="padding-left: 15px;">${stations[i].stationName}</div>`;
      }
      $(".stationName").html(stationName1);

      $(".firstwalkdistance").html(
        "도보" + busPath.result.path[0].subPath[0].distance + "m"
      );
      $(".secondtwalkdistance").html(
        "도보" + busPath.result.path[0].subPath[2].distance + "m"
      );

    }
  };
}

