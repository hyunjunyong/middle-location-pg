import getCenter from "./component/getCenter.js";
import getPositions from "./component/getPosition.js";

const positions = getPositions();//positions의 중간위치 반환
const centerPosition = getCenter(positions);

let n = 0;
//버스 api 테스트
export default function searchBusLaneAJAX() {
    let xhr = new XMLHttpRequest();

    let url = `https://api.odsay.com/v1/api/searchPubTransPath?SX=${positions[n]["La"]}&SY=${positions[n]["Ma"]}&EX=${centerPosition.lat}&EY=${centerPosition.lon}&OPT=1&apiKey=LRP8InDDBglP/04OezKdyA`;

    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.responseText;
            const busPath = JSON.parse(data);

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