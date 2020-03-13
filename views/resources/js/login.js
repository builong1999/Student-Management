var username = document.getElementById('uname');
var password = document.getElementById('pass');

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