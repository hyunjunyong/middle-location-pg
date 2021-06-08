export default function searchBusLaneAJAX() {
    var xhr = new XMLHttpRequest();
    var url = "https://api.odsay.com/v1/api/searchBusLane?busNo=10&CID=1000&apiKey={LRP8InDDBglP/04OezKdyA}";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log( xhr.responseText ); // <- xhr.responseText 로 결과를 가져올 수 있음
        }
    }
}