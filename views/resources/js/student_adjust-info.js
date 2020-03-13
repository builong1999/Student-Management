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



document.getElementById('Cpass').addEventListener('click', function () {
    event.preventDefault();
    window.open('/change-pass')
})
//-----------------------------------ENDTEMP---------------------------------

var sfullname = document.getElementById('span-name');
var sstudentID = document.getElementById('span-id');
var DOB = document.getElementById('span-DOB');

var Address = document.getElementById('address-adjust');var condition6 = false;     
var alert6 = document.getElementById('address-check');
var Email = document.getElementById('mail-adjust');     var condition7 = false;     
var alert7 = document.getElementById('email-check');
var Contact = document.getElementById('contact-adjust');var condition8 = false;     
var alert8 = document.getElementById('contact-check');

var Btn = document.getElementById('change-info');


Address.onkeyup = function(){ alert6.style.display = "none"; }
Email.onkeyup = function(){ alert7.style.display = "none"; }
Contact.onkeyup = function(){ alert8.style.display = "none"; }


Btn.addEventListener('click',function(event){
    if (!Condition()){
        event.preventDefault();
    }
});

function Condition() {
    if (Address.value.length){
        alert6.style.display = "none";
        condition6 = true;
    }
    else {
        alert6.style.display = "inline-block";
        condition6 = false;
    }

    
    if (Email.value.length){
        alert7.style.display = "none";
        condition7 = true;
    }
    else {
        alert7.style.display = "inline-block";
        condition7 = false;
    }

    
    if (Contact.value.length){
        alert8.style.display = "none";
        condition8 = true;
    }
    else {
        alert8.style.display = "inline-block";
        condition8 = false;
    }
    return (condition6 && condition7 && condition8);
}
