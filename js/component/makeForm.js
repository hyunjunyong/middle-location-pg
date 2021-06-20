export default function makeForm() {
    const $addressFormBtn = document.querySelector(".address-form-group");
    const div = document.createElement("div");
    div.setAttribute('class', 'input-group mb-3');
    div.innerHTML = '<input type="text" class="form-control" aria-label="Recipient\'s username"aria-describedby="button-addon2"> <button class="btn btn-outline-secondary" type="button" id="button-addon1">검색</button>'
    $addressFormBtn.appendChild(div);
    const $addedInput = document.querySelector(".input-group:last-child.input-group input");
    const $addedSearchBtn = document.querySelector(".input-group:last-child.input-group button");
    $addedSearchBtn.addEventListener("click", () => searchaddname($addedInput));
}