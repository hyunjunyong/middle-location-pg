export default function savePosition(adrress){
    //return String
    let isExist = localStorage.getItem("positions");

    //isExist가 null이면 []로 초기화,
    //아니라면 String인 isExist를 배열로 parse
    isExist = isExist ? JSON.parse(isExist): [];

    //address = {위도: 111, 경도: 222}
    isExist.push(adrress)

    //다시 String으로 parse 하여 localStorage에 저장장
   localStorage.setItem("position", JSON.stringify(isExist))
}