
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

var login = document.getElementById('regularly-action')



$(document).ready(function () {
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
    }
    else {
        list_left.style.width = "60px";
        span1.style.display = "none";
        span2.style.display = "none";
        span3.style.display = "none";
        span4.style.display = "none";
        work_list.style.display = "none";
        about_list.style.display = "none";
    }
}


list.addEventListener('click', function () {
    this.style.backgroundColor = "#dcdcdc";
    setTimeout(function () {
        list.style.backgroundColor = "#fefefe";
    }, 200)
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

About.addEventListener('click', function () {
    if (about_list.style.display == "inline-block") {
        about_list.style.display = "none";
    }
    else {
        setDisplay('true');
        about_list.style.display = "inline-block";
    }
})

document.getElementById('Cpass').addEventListener('click', function () {
    event.preventDefault();
    window.open('/change-pass')
})