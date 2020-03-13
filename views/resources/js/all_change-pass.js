// --------------------------------TEMPLATE--------------------------

var list = document.getElementById('label-click');
var work = document.getElementById('func-click');
var work_list = document.getElementById('showFunction');
var work_list_student = document.getElementById('function-student');
var work_list_teacher = document.getElementById('function-teacher');
var work_list_admin = document.getElementById('function-admin');
var About = document.getElementById('pAbout');
var about_list = document.getElementById('aboutShow');
var about_list_student = document.getElementById('student-about');
var about_list_teacher = document.getElementById('teacher-about');
var about_list_admin = document.getElementById('admin-about');
var posName = document.getElementById('posName');

var span1 = document.getElementById('span1');
var span2 = document.getElementById('span2');
var span3 = document.getElementById('span3');
var span4 = document.getElementById('span4');
var list_left = document.getElementById('Left');

var disable = document.getElementById('disable');
var body = document.getElementById('body');

$(document).ready(function(){
    $.ajax({
        url: '/homepage/request',
        type: "POST"
    }).done(function (position) {
        if (position == "Student") {
            work_list_student.style.display = 'inline-block';
            about_list_student.style.display = 'inline-block';
            posName.textContent = "Sinh viên"
        }
        else if (position == "Teacher") {
            work_list_teacher.style.display = 'inline-block';
            about_list_teacher.style.display = 'inline-block';
            posName.textContent = "Giảng viên"
        }
        else {
            work_list_admin.style.display = 'inline-block';
            about_list_admin.style.display = 'inline-block';
            posName.textContent = "Phòng đào tạo"
        }
    })
})

function setDisplay(condition) {
        if (condition) {
            list_left.style.width = "260px";
            span1.style.display = "inline-block";
            span2.style.display = "inline-block";
            span3.style.display = "inline-block";
            span4.style.display = "inline-block";
            // add form style
            disable.style.display = "inline-block";
            body.style.overflow = "hidden";
        }
        else {
            list_left.style.width = "60px";
            span1.style.display = "none";
            span2.style.display = "none";
            span3.style.display = "none";
            span4.style.display = "none";
            work_list.style.display = "none";
            about_list.style.display = "none";
            
            disable.style.display = "none";
            body.style.overflow = "auto";
            // add form style

        }
}

setDisplay(false);

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

work.addEventListener('click', function () {
    if (work_list.style.display == "none") {
        work_list.style.display = "inline-block";
        setDisplay(true);
    }
    else {
        work_list.style.display = "none";
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
//-----------------------------------ENDTEMP---------------------------------
var oldPass = document.getElementById('oldPass');
var newPass = document.getElementById('newPass'); var condition1 = false;
var validate = document.getElementById('btnSubmit'); var condition2 = false;
var rePass = document.getElementById('rePass'); var condition3 = false;

var alert1 = document.getElementById('AlertShow1'); 
var alert2 = document.getElementById('AlertShow2');
var alert3 = document.getElementById('AlertShow3');

oldPass.addEventListener('keyup', function(){
    $.ajax({
        url: '/change-pass/request',
        type: 'POST',
        data: {pass: oldPass.value}
    }).done(function(result){
        console.log('result back: ' + result);
        if (result == "0"){
            alert1.style.color = 'red';
            alert1.style.display = 'inline-block';
            alert1.textContent = "Mật khẩu không trùng khớp"
            condition1 = false;
        }
        else {
            alert1.style.color = 'green';
            alert1.textContent = "Mật khẩu cũ trùng khớp"
            condition1 = true;
        }
    })
})

newPass.addEventListener('keyup',function(){
    if (!condition3){
        rePass.value = null;
        alert3.style.display = "none";
    }
    if(this.value.length < 8){
        alert2.style.display = 'inline-block';
        alert2.textContent = "Mật khẩu mới phải lớn hơn 7 ký tự";
        condition2 = false;
    }
    else {
        alert2.style.display = 'none';
        condition2 = true;
    }
})

rePass.addEventListener('keyup', function(){
    if (this.value != newPass.value){
        alert3.style.display = "inline-block";
        condition3 = false;
    }
    else {
        alert3.style.display = "none";
        condition3 = true;
    }
})



validate.addEventListener('click', function(event){
    if(!oldPass.value.length){
        alert1.style.display= 'inline-block';
        alert1.style.color = 'red';
        alert1.textContent = 'Bạn chưa nhập mật khẩu cũ';
    }
    else {
        alert1.style.display= 'none';
    }

    if(!newPass.value.length){
        alert2.style.display= 'inline-block';
        alert2.style.color = 'red';
        alert2.textContent = "Bạn chưa nhập mật khẩu mới";
    }
    if (!(condition1 && condition2 && condition3)){
        event.preventDefault();
    }
})

var icn_check = false;

document.getElementById('new_icn').addEventListener('click', function(){
    if (icn_check){
        icn_check = !icn_check;
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
        newPass.type = "text";
    }
    else {
        icn_check = !icn_check;
        this.innerHTML = '<i class="far fa-eye"></i>';
        newPass.type = "password";
    }
})