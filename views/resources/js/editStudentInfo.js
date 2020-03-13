$(document).ready(function(){
    $.ajax({
        url: "/student/studentInfo",
        type: "POST",
        success: data=> {
            result = data.recordset[0];
            var recentlyInfo = `
            <div class="body">
                <div class="content-acc">
                <div class="title-info-acc">Thông tin sinh viên </div>
                <div id="old-info" class="old-info" style="display: block">
                <table>
                    <tr><th class="info-form-title" colspan="2">THÔNG TIN CÁ NHÂN</th></tr>
                <tr>
                    <td class="fullname"> Họ và tên: </td>
                    <td id="span-name" class="span-name">${result.Fname} ${result.Lname}</td>
                </tr>                    
                <tr>
                    <td class="faculty"> MSSV: </td>
                    <td id="span-faculty">${result.ID}</td>
                </tr>
                    <tr>
                        <td class="dob">Ngày sinh: </td>
                        <td id="span-DOB">${result.DOB}</td>
                    </tr>
                    <tr>
                        <td class="mail">Email: </td>
                        <td id="span-mail">${result.Email}</td>
                    </tr>
                    <tr>
                        <td class="recently-address">Địa chỉ hiện tại: </td>
                        <td id="span-address">${result.Address}</td>
                    </tr>
                    <tr>
                        <td class="contact">Liên lạc: </td>
                        <td id="span-contact">${result.Contact}</td>
                    </tr>
                    
                </table>
                </br>
                        <input id="change-info" class="change-info" type = "button" value = "Thay Đổi">
                </div>
                <div class="setInfo" id="setInfo" style="display: none">
                    <p class="full-name"> Họ và tên: <span id="span-name" class="span-name">${result.Fname} ${result.Lname}</span></p>
                    </br>
                    <p class="Faculty"> MSSV: <span id="span-faculty">${result.ID}</span></p>
                    </br>
                <table>
                    <tr><th class="info-form-title">Chỉnh sửa thông tin cá nhân</th></tr>
                <tr>
                    <td>
                <div class="DOB">
                    <p>Ngày sinh:<input type="date" id="dob-adjust" class="dob-adjust" value="${result.DOB}"></p>
                </div>
                <div class="Address">
                    <p>Địa chỉ:<input type="text" id="address-adjust" class="add-adjust" maxlength="200" value="${result.Address}"></p>
                </div>
                <div class="Email">
                    <p>Email: <input type="text" id="mail-adjust" class="mail-adjust" maxlength="30" value="${result.Email}"></p>
                </div>
                <div class="Contact">
                    <p>Liên lạc: <input type="text" id="contact-adjust" class="contact-adjust" maxlength="13" value="${result.Contact}"></p>
                </div>
                </br>
                </td>
                </tr>
                </table>
                <div class="Validate">
                    <input type="Submit" class="save-info" id="save-info" value="Lưu thông tin">
                    <input id="cancel" class="cancel" type = "button" value = "Huỷ">
                </div>
            </div>
            </div>
        </div>
            `;
            $(recentlyInfo).insertBefore('.recently-info');
            $(document).ready(function(){
                $("#change-info").click(function() {
                    $('#setInfo').each(function(){
                        this.style.display = 'block'
                    })
                    $('#old-info').each(function(){
                        this.style.display = 'none'
                    })
                })
                $('#cancel').click(function(){
                    $('#setInfo').each(function(){
                        this.style.display = 'none'
                    })
                    $('#old-info').each(function(){
                        this.style.display = 'block'
                    })
                })
            $('#save-info').click(function(){
                var dob = ($('#dob-adjust').val())? $('#dob-adjust').val(): result.DOB;
                var address= ($('#address-adjust').val())? $('#address-adjust').val(): result.Address;
                var mail= ($('#mail-adjust').val())? $('#mail-adjust').val(): result.Email;
                var contact= ($('#contact-adjust').val())? $('#contact-adjust').val(): result.Contact;
                $.ajax({
                    url: "/student/editStudentInfo/request",
                    type: "POST",
                    data: {dob, address, mail, contact}
                })
                alert('Lưu thông tin thành công')
            })
        })
        },
        error: data => {
            console.log(error);
        } 
    })
})