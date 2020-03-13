var sfullname = document.getElementById('span-name');
var sstudentID = document.getElementById('span-id');
var DOB = document.getElementById('span-DOB');
var smail = document.getElementById('span-mail');
var saddress = document.getElementById('span-address');
var scontact = document.getElementById('span-contact');

var Address = document.getElementById('address-adjust');var condition6 = false;     
var alert6 = document.getElementById('address-check');
var Email = document.getElementById('mail-adjust');     var condition7 = false;     
var alert7 = document.getElementById('email-check');
var Contact = document.getElementById('contact-adjust');var condition8 = false;     
var alert8 = document.getElementById('contact-check');

var Btn = document.getElementById('change-info');

$(document).ready(function () {
    updateRecentlyInfo();
})

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

document.getElementById('cPass').addEventListener('click', function(event){
    event.preventDefault();
    window.open('/change-pass')
})
