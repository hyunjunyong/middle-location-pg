import getCenter from "./getCenter.js";

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
positions.forEach((position)=>{
    markerPosition.push({title: "시작위치", latlng: new kakao.maps.LatLng(position["Ma"], position["La"])})
})
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
                    position : markerPosition[0].latlng,
                    content : `<div style="padding: 5px;">${markerPosition[0].title}</div>`
                })
                //도착지점 마커 객체 생성
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: markerPosition[0].latlng, // 마커를 표시할 위치
                    title: markerPosition[0].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                });
                //인포윈도우와 마커 그리기
                infowindow.open(map, marker);

                //출발지점 마커 객체 생성
                for (var i = 1; i < markerPosition.length; i++) {
                    // 마커를 생성합니다
                    var startmarker = new kakao.maps.Marker({
                        map: map, // 마커를 표시할 지도
                        position: markerPosition[i].latlng, // 마커를 표시할 위치
                        title: markerPosition[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                    });
                }
                //출발지점 마커 그리기
                startmarker.setMap(map);
                // var marker = new kakao.maps.Marker({
                //   // 지도 중심좌표에 마커를 생성합니다
                //   position: markerPosition,
                // });
                // // 지도에 마커를 표시합니다
                // marker.setMap(map);

                // var infowindow = new kakao.maps.InfoWindow({
                //   content:
                //     '<div style="width:150px;text-align:center;padding:6px 0;">도착위치</div>',
                // });

                // infowindow.open(map, marker);

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


bus();
//api 작동
for (let i=0;i<positions.length;i++){
    const colors = ["#ff0033", "#37ff00", "#00ffea", "#a600ff"];
    let selecetedColor = colors[i];
    var request = new XMLHttpRequest();
    var buslocation = document.querySelector("#bus");

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
                debugger
                let linePath = [];
                for (var i = 0; i < datareverse.length; i++) {
                    linePath.push(
                        new kakao.maps.LatLng(datareverse[i][0], datareverse[i][1])
                    );
                }
                console.log(linePath);
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