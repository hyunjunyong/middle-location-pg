// 인포윈도우를 닫는 클로저를 만드는 함수입니다
export default function makeOutListener(infowindow) {
    return function () {
        infowindow.close();
    };
}