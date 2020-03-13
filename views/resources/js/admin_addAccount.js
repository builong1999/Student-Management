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
//-----------------------------------ENDTEMP---------------------------------




document.getElementById('Cpass').addEventListener('click', function(event){
    event.preventDefault();
    window.open('/change-pass')
})



document.getElementById('btnValidate').addEventListener('click', function (event) {
    event.preventDefault();
    if (condition()) {
        var table = document.getElementById('tbl');
        table.innerHTML = null;
        //  Setting layout
        document.getElementById('addInfo').style.marginLeft = '-220px';
        document.getElementById('alert').style.marginLeft = '-300px';
        document.getElementById('showInfo').style.display = 'inline-block';
        setDisplay(false);
        // Request to server
        // -------------------------------------------
        // Get Input Data
        var code = document.getElementById('addID').value;
        var num = document.getElementById('addNum').value;
        var position = document.getElementById('posId').value;
        // Send request
        $.ajax({
            url: "/management/add/request",
            type: "POST",
            data: {code, num, position}
        }).done(function(result){
            result = JSON.parse(result);
            var length = result.length;
            for (var i = 0; i < length; i ++){
                var tr = document.createElement('tr');
                var td1 = document.createElement('td'); td1.textContent = result[i].username;
                var td2 = document.createElement('td'); td2.textContent = result[i].ID;
                var td3 = document.createElement('td'); td3.textContent = result[i].position
                var td4 = document.createElement('td'); td4.textContent = result[i].countLog;
                tr.appendChild(td1);tr.appendChild(td2);tr.appendChild(td3);tr.appendChild(td4);
                table.appendChild(tr);
            }
        })
    }
})

function stringFormatter(string) {
    var length = string.length;
    if (length == 4) {
        return string;
    }
    else if (length == 3) {
        return '0' + string;
    }
    else if (length == 2) {
        return '00' + string;
    }
    else if (length == 1) {
        return '000' + string;
    }
}

function showAction(variable) {
    document.getElementById('aL').style.display = variable;
    document.getElementById('reClick').style.display = variable;
}

function condition() {
    var code = document.getElementById('addID').value;
    var num = document.getElementById('addNum').value;
    var p1 = document.getElementById('alertText');
    p1.innerHTML = null;
    var c1 = true, c2 = true;
    if (code.length == 0) {
        p1.innerText = "Bạn chưa nhập mã tạo tài khoản\n";
        c1 = false;
    }
    if (num.length == 0) {
        p1.innerText += "Bạn chưa nhập số lượng\n";
        c2 = false;
    }
    else if (isNaN(num)) {
        p1.innerText += "Số lượng phải là số nguyên";
        c2 = false;
    }
    return (c1 && c2);
}



document.getElementById('Cpass').addEventListener('click', function () {
    event.preventDefault();
    window.open('/change-pass')
})