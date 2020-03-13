document.getElementById('cPass').addEventListener('click', function (event) {
    event.preventDefault();
    window.open('/change-pass')
})

$(document).ready(function(){
    $.ajax({
        url: '/homepage/request',
        type: "POST"
    }).done(function(position){
        if (position == "Sinh viên"){
            document.getElementById('student-field').style.display = "inline-block";
        }
        else if (position == "Giảng viên"){
            document.getElementById('teacher-field').style.display = "inline-block";
        }
        else {
            document.getElementById('admin-field').style.display = "inline-block";
        }   
    })
})