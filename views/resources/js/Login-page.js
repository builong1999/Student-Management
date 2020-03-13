
var list = document.getElementById('label-click');
var work = document.getElementById('func-click');
var work_list = document.getElementById('function-inside');
var About = document.getElementById('pAbout');
var about_list = document.getElementById('hideOrShow');


var span1 = document.getElementById('span1');
var span2 = document.getElementById('span2');
var span3 = document.getElementById('span3');
var list_left = document.getElementById('Left');

var login = document.getElementById('regularly-action')
var form = document.getElementById('formLogin');

var username = document.getElementById('uname');
var password = document.getElementById('pass');
var eyes = document.getElementById('eyes');


function setDisplay(condition) {
        if (condition) {
            list_left.style.width = "250px";
            span1.style.display = "inline-block";
            span3.style.display = "inline-block";
        }
        else {
            list_left.style.width = "60px";
            span1.style.display = "none";
            span3.style.display = "none";
            about_list.style.display = "none";
        }
}


list.addEventListener('click', function () {
    this.style.backgroundColor = "#dcdcdc";
    setTimeout(function(){
        list.style.backgroundColor = "#fefefe";
    },200)
    if (list_left.style.width == "60px") {
        setDisplay(true)
    }
    else {
        setDisplay(false)
    }
})


var loginStatus = true;

login.addEventListener('click', function(){
    if (loginStatus){
        loginStatus = false;
        form.style.display = "none";
    }
    else {
        loginStatus = true;
        form.style.display = "inline-block";
    }
})


eyes.addEventListener('click', function(){
    if (eyes.textContent[0] == "H"){
        password.type = "text";
        eyes.innerHTML = '<i class="fas fa-eye-slash"></i> Ẩn mật khẩu'
    }
    else {
        password.type = "password";
        eyes.innerHTML = '<i class="fas fa-eye"></i>Hiển thị mật khẩu'
    }
})

About.addEventListener('click', function(){
    if (about_list.style.display == "inline-block"){
        about_list.style.display = "none";
    }
    else {
        setDisplay('true');
        about_list.style.display = "inline-block";
    }
})


var pAlert=  document.getElementById('pAlert');
var submit = document.getElementById('submitBtn');

submit.addEventListener('click', function(event){
    var bool1 = true; bool2 = true;
    var txt = "Bạn chưa nhập ";
    if (!username.value.length){
        txt += "tên đăng nhập";
        bool1 = false;
    }
    if (!password.value.length){
        bool2 = false;
        if(txt.indexOf("tên") > 0){
            txt += ",";
        }
        txt += "mật khẩu";
    }
    pAlert.textContent = txt;
    pAlert.style.display = 'inline-block';
    if (!(bool1 && bool2)){
        event.preventDefault();
    }
    else {
        pAlert.textContent = "";
        pAlert.style.display = "none";
    }
})