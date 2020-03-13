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
//-----------------------------------ENDTEMP---------------------------------
var tblAccount = document.getElementById('tbl')
var tblRemove = document.getElementById('delTbl')


document.getElementById('lSubmit').addEventListener('click', function () {
    var a = document.getElementById('sInput');
    a.value = tblRemove.rows.item(0).cells[1].innerHTML;
    for (var i = 1; i < tblRemove.rows.length; i++) {
        a.value += "," + tblRemove.rows.item(i).cells[1].innerHTML;
    }
})

document.getElementById('Cpass').addEventListener('click', function(event){
    event.preventDefault();
    window.open('/change-pass')
})

for (var i = 0; i < tblAccount.rows.length; i++) {
    tblAccount.rows[i].onclick = function () {
        if (tblRemove.rows.length == 0)
            setDisplay2(true);
        var comStyles = window.getComputedStyle(this);
        var string = comStyles.getPropertyValue('background-color');
        if (string == 'rgb(255, 255, 255)') {
            this.style.backgroundColor = 'black';
            this.style.color = 'white';
            add2List(this.cells[1].textContent);
        }
        else {
            this.style.backgroundColor = 'white';
            this.style.color = 'black';
            rmFList(this.cells[1].textContent);
        }
    }
}

function add2List(ID) {
    var td1 = document.createElement('td'); td1.className = "col1";
    var td2 = document.createElement('td'); td2.className = "col2";
    var tr = document.createElement('tr');
    td1.textContent = tblRemove.rows.length + 1;
    td2.textContent = ID;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tblRemove.appendChild(tr);
}


function rmFList(ID) {
    var text = document.getElementById('sInput').value;
    var a;

    var length = tblRemove.rows.length;
    var i = 0;
    for (; i < length; i++) {
        if (ID == tblRemove.rows.item(i).cells[1].textContent) {
            tblRemove.deleteRow(i);
            break;
        }
    }
    for (; i < length - 1; i++) {
        tblRemove.rows.item(i).cells[0].textContent--;
    }
    console.log(tblRemove.rows.length);
    if (tblRemove.rows.length == 0) {
        setDisplay2(false);
    }
}


function setDisplay2(config) {
    if (config) {
        document.getElementById('listAccount').style.marginLeft = '-200px';
        document.getElementById('listDel').style.display = 'inline-block';
    }
    else {
        document.getElementById('listAccount').style.marginLeft = '40px';
        document.getElementById('listDel').style.display = 'none';
    }
}



document.getElementById('valueText').addEventListener('keyup', function () {
    var length = tblAccount.rows.length;
    var tempText = this.value;
    for (var i = 0; i < length; i++) {
        var object = tblAccount.rows;
        if (!object.item(i).cells[1].textContent.includes(tempText)) {
            object.item(i).style.display = "none";
        }
        else {
            object.item(i).style.display = "table-row";
        }
    }
});


document.getElementById('Cpass').addEventListener('click', function () {
    event.preventDefault();
    window.open('/change-pass')
})