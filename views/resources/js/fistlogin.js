


var username = document.getElementById('user-adjust'); var condition1 = false; var alert1 = document.getElementById('user-check');
var password = document.getElementById('pass-adjust'); var condition2 = false; var alert2 = document.getElementById('pass-check');
var fname = document.getElementById('Fname-adjust'); var condition3 = false; var alert3 = document.getElementById('fname-check');
var lname = document.getElementById('Lname-adjust'); var condition4 = false; var alert4 = document.getElementById('lname-check');
var DOB_y = document.getElementById('year-select');
var DOB_m = document.getElementById('month-select');
var DOB_d = document.getElementById('day-select'); var condition5 = false; var alert5 = document.getElementById('d-check');
var Sex = document.getElementById('sex-select');
var Address = document.getElementById('address-adjust'); var condition6 = false; var alert6 = document.getElementById('address-check');
var Email = document.getElementById('mail-adjust'); var condition7 = false; var alert7 = document.getElementById('email-check');
var Contact = document.getElementById('contact-adjust'); var condition8 = false; var alert8 = document.getElementById('contact-check');

var Btn = document.getElementById('change-info');


$(document).ready(function () {
    updateDOB();
})

Btn.addEventListener('click', function (event) {
    if (Condition()) {
        $.ajax({
            url: "/first-login/done",
            type: "POST",
            data: {
                username: username.value,
                password: password.value,
                fname: fname.value,
                lname: lname.value,
                DOB_d: DOB_d.value,
                DOB_m: DOB_m.value,
                DOB_y: DOB_y.value,
                Sex: Sex.value,
                Address: Address.value,
                Email: Email.value,
                Contact: Contact.value
            }
        }).done(function (result) {
            var body = document.getElementById('main-nav');
            body.innerHTML = null;
            var html = document.createElement('h1');
            window.scrollTo(0, 0);
            let seccond = 5;
            html.innerHTML = "BẠN ĐÃ HOÀN THÀNH CÔNG VIỆC CHO LẦN ĐĂNG NHẬP ĐẦU TIÊN <br> VUI LÒNG ĐỢI " + seccond-- + " GIÂY ĐỂ CHUYỂN TRANG";
            body.appendChild(html);
            const intervalId = setInterval(() => { 
                html.innerHTML = "BẠN ĐÃ HOÀN THÀNH CÔNG VIỆC CHO LẦN ĐĂNG NHẬP ĐẦU TIÊN <br> VUI LÒNG ĐỢI " + seccond + " GIÂY ĐỂ CHUYỂN TRANG";
                seccond -=1;
                if (seccond == -1) {
                    clearInterval(intervalId);
                    window.location.replace('/homepage');
                }
            }, 1000);
        })
    }
    else {
        event.preventDefault();
    }
})

password.onkeyup = function () { alert2.style.display = "none"; }
fname.onkeyup = function () { alert3.style.display = "none"; }
lname.onkeyup = function () { alert4.style.display = "none"; }
DOB_d.onchange = function () { alert5.style.display = "none"; }
DOB_m.onchange = function () { alert5.style.display = "none"; }
Address.onkeyup = function () { alert6.style.display = "none"; }
Email.onkeyup = function () { alert7.style.display = "none"; }
Contact.onkeyup = function () { alert8.style.display = "none"; }


username.addEventListener('keyup', function () {
    var temp = username.value;
    if (temp.length < 7) {
        condition1 = false;
        alert1.style.color = "Red";
        alert1.innerText = "Tên đăng nhập phải dài hơn 6 kí tự";
        alert1.style.display = "inline-block";
        return;
    }

    if (temp.length < 16) {
        $.ajax({
            url: "/first-login/request",
            type: "POST",
            data: { user: temp }
        }).done(function (result) {
            if (result == "fail") {
                condition1 = false;
                alert1.innerText = "Tên đăng nhập đã được sử dụng";
            }
            else {
                condition1 = true;
                alert1.innerText = "Tên đăng nhập có thể sử dụng";
                alert1.style.color = "Green";
            }
        })

    }
})


function updateDOB() {
    // Update year
    var nowYear = 2019;
    var lengthYear = nowYear - 100;
    for (var i = nowYear; i > lengthYear; i--) {
        var options = document.createElement('option');
        options.value = i; options.innerHTML = i;
        DOB_y.add(options);
    }
    //Update month
    for (var i = 1; i < 13; i++) {
        var options = document.createElement('option');
        options.value = i; options.innerHTML = i;
        DOB_m.add(options);
    }
    // Update day
    for (var i = 1; i < 32; i++) {
        var options = document.createElement('option');
        options.value = i; options.innerHTML = i;
        DOB_d.add(options);
    }
}


function Condition() {

    if (username.value.length) {
        condition1 = true;
        alert1.style.display = "none";
    }
    else {
        condition1 = false;
        alert1.style.display = "inline-block";
        alert1.innerHTML = "Bạn chưa nhập tên tài khoản";
    }

    if(username.value.toString().includes("PDTBK")){
        alert1.textContent = "Tài khoản đã tồn tại"
        condition1 = false;
        alert1.style.display = "inline-block";
    }
    else{
        condition1 = true;
        alert1.style.display = "none";
    }

    if (password.value.length) {
        condition2 = true;
        alert2.style.display = "none";
    }
    else {
        condition2 = false;
        alert2.style.display = "inline-block";

    }


    if (!fname.value.length) {
        condition3 = false;
        alert3.style.display = "inline-block";
    }
    else {
        condition3 = true;
        alert3.style.display = "none";
    }

    if (lname.value.length == 0) {
        condition4 = false;
        alert4.style.display = "inline-block";
    }
    else {
        condition4 = true;
        alert4.style.display = "none";
    }

    var tempBool = true;
    var tempM = DOB_m.value;
    var tempD = DOB_d.value;
    if (tempM == 2 && tempD > 29) {
        tempBool = false;
    }
    else {
        if (tempM < 8) {
            if (!(tempM % 2) && tempD > 30)
                tempBool = false;
        }
        else {
            if (tempM % 2 && tempD > 30) {
                tempBool = false;
            }
        }
    }
    if (tempBool) {
        condition5 = true;
        alert5.style.display = "none";
    }
    else {
        condition5 = false;
        alert5.style.display = "inline-block";
    }

    if (Address.value.length) {
        alert6.style.display = "none";
        condition6 = true;
    }
    else {
        alert6.style.display = "inline-block";
        condition6 = false;
    }


    if (Email.value.length) {
        alert7.style.display = "none";
        condition7 = true;
    }
    else {
        alert7.style.display = "inline-block";
        condition7 = false;
    }


    if (Contact.value.length) {
        alert8.style.display = "none";
        condition8 = true;
    }
    else {
        alert8.style.display = "inline-block";
        condition8 = false;
    }
    return (condition1 && condition2 && condition3 && condition4 && condition5 && condition6 && condition7 && condition8);
}