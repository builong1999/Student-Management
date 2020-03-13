$(document).ready(function(){
    $('#submit').click(function(){
        var id = $('#findSubjectID').val();
        var name = $('#findSubjectName').val();
        var credit = $('#credit').val();
        var lesson = $('#lesson').val();
        var des = $('#description').val();
        $.ajax({
            url: "/admin/createSubject/request",
            type: "POST",
            data: {id, name, credit, lesson, des}
        })
        alert("Thêm môn học thành công!")
    })
})