import nowPosition from "./nowPosition.js";
import makeForm from "./makeForm.js";
import searchaddname from "./searchaddname.js";

const $add1 = document.getElementById('add1');
const $add2 = document.getElementById('add2');
const $btn1 = document.getElementById('button-addon1');
const $btn2 = document.getElementById('button-addon2');

$btn1.addEventListener("click", ()=>searchaddname($add1));
$btn2.addEventListener("click", ()=>searchaddname($add2));

const $moreBtn = document.getElementById("more-button");
$moreBtn.addEventListener("click", ()=>makeForm($addressFormBtn));

const $nowposition = document.getElementById('nowposition');
$nowposition.addEventListener("click", nowPosition());

//지도
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);