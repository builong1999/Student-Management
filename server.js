var express = require('express');
var body = require('body-parser');
var sql = require('mssql');
var multer=require('multer');
const expressSession = require('express-session');
var uniqid = require('uniqid');
const Passport = require('passport');
const localstrategy = require('passport-local').Strategy;
var app = express();

//-----------------------------------------------SET CONFIGURATION---------------------------------------------------
//___________________________________----------------------------------------------__________________________________
var config = {
    user: 'sa',
    password: '123456',
    server: 'localhost',
    database: 'studentmanagement'
};

sql.connect(config, function (err) {
    if (err) console.log(err);
})

var request = new sql.Request();

app.use('/views', express.static('views'));

app.set("view engine", "ejs");
app.set("views", "./views");

//-----------------------------------------------SET MIDDLE-WARE-----------------------------------------------------
//___________________________________----------------------------------------------__________________________________
app.use('/views/resources/css', express.static('views/resources/css'));
app.use('/views/resources/js', express.static('views/resources/js'));
app.use(body.urlencoded({ extended: false }));

app.use(expressSession({
    secret: 'mySecretKey',
    cookie: {
        maxAge: 1000 * 60 * 100
    }
}));
app.use(Passport.initialize());
app.use(Passport.session());
//
app.use('/views/resources/css', express.static('views/resources/css'));
app.use('/views/resources/js', express.static('views/resources/js'));
app.use('/views/resources', express.static('views/resources'));
app.use('/uploads', express.static('uploads')); // <-- This right here


//-----------------------------------------------SERVER ACTION------------------------------------------------------
//___________________________________----------------------------------------------_________________________________

var server = app.listen(5000, function () {
    console.log('Server is running..');
})



var tempValue = "";

function convertPos(variable){
    if (variable.trim() == "Giảng viên"){
        return "Teacher";
    }
    else if(variable.trim() == "Sinh viên"){
        return "Student";
    }
    else {
        return "admin";
    }
}

Passport.use(new localstrategy(function (username, password, done) {
    if (username.includes("PDTBK") && username.length < 8) {
        request.query("SELECT * FROM dbo.db_AdminAccount WHERE username = '" + username + "'", function (err, result) {
            if (err) {
                console.log(err)
                return done(null, false);
            }
            else {
                if (result.recordset[0] == undefined) return done(null, false);
                if (password.trim() == result.recordset[0].password) {
                    return done(null, result.recordset[0]);
                }
                else {
                    return done(null, false);
                }
            }
        })
    }
    else {
        request.query("SELECT * FROM dbo.db_ClientAccount WHERE username = N'" + username + "'", function (err, result) {
            if (err) {
                console.log(err);
                return done(null, false);
            }
            else {
                if (result.recordset[0] == undefined) return done(null, false);
                if (password.trim() == result.recordset[0].password) {
                    return done(null, result.recordset[0])
                }
                else {
                    return done(null, false);
                }
            }
        })
    }
}))

Passport.serializeUser(function (user, done) {
    tempValue = user.ID;
    user.position = convertPos(user.position);
    return done(null, user);
})

Passport.deserializeUser(function (cookie, done) {
    if (cookie.ID == tempValue) {
        return done(null, cookie);
    }
    else {
        return done(null, false);
    }
})

//----------------------------------------------------LOGIN-LOGOUT---------------------------------------------------
//___________________________________----------------------------------------------__________________________________

app.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/homepage')
    }
    else {
        res.render('Front_page');
    }
})

app.post('/login-confirm', Passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    var temp = req.user.countLog;
    if (temp == 0) {
        res.redirect('/first-login');
    }
    else {
        request.query("UPDATE dbo.db_ClientAccount SET countLog ='" + (temp + 1) + "' WHERE ID = '" + req.user.ID + "'");
        res.redirect('/homepage');
    }
})


app.get('/', function (req, res) {
    res.redirect('/login');
})

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

//----------------------------------------------------HOME-PAGE---------------------------------------------------
//___________________________________----------------------------------------------__________________________________

app.get('/homepage', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('Home_page');
    }
    else {
        res.redirect('/login');
    }
})

app.post('/homepage/request', function (req, res) {
    res.send(req.user.position);
})

//-------------------------------------------------FIRST-LOGIN-------------------------------------------------------
//___________________________________----------------------------------------------__________________________________
app.get('/first-login', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.countLog < 1) {
            res.render('first_login');
        }
        else {
            res.redirect('/homepage');
        }
    }
    else {
        res.redirect('/login');
    }
})

app.post('/first-login/request', function (req, res) {
    request.query("SELECT * FROM dbo.db_ClientAccount WHERE username = N'" + req.body.user + "'", function (err, result) {
        if (err) console.log(err);
        if (parseInt(result.rowsAffected[0])) {
            res.send('fail');
        }
        else {
            res.send('done');
        }
    })
})

app.post('/first-login/done', function (req, res) {
    var str = "UPDATE dbo.db_ClientAccount SET username = N'" + req.body.username.trim() + "', password = N'" + req.body.password.trim() + "', countLog = 1 WHERE ID = '" + req.user.ID + "'";
    var temp = req.user.position;
    req.user.countLog = 1;
    // if (req.user.position == "Sinh viên") {
    //     temp = "Student";
    // }
    // else {
    //     temp = "Teacher";
    // }
    str += "\nUPDATE dbo.db_" + temp + "Info SET Fname = N'" + req.body.fname + "', Lname =N'" + req.body.lname + "', DOB = '" + req.body.DOB_d + "-" + req.body.DOB_m + "-" + req.body.DOB_y + "', Address = N'" + req.body.Address + "', Sex = '" + req.body.Sex + "', Email = '" + req.body.Email + "', Contact = '" + req.body.Contact + "' WHERE ID = '" + req.user.ID + "'";
    request.query(str, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/homepage');
        }

    })
})

//-----------------------------------------------ROUTER FOR RENEW-----------------------------------------------------
//___________________________________----------------------------------------------_________________________________

app.get('/management/renew', function (req, res) {
    if (req.isAuthenticated()) {
        request.query("SELECT A.username,A.ID, S.Fname, S.Lname, A.position FROM dbo.db_ClientAccount AS A, dbo.db_StudentInfo AS S WHERE A.ID = S.ID", function (err, result1) {
            if (err) console.log(err);
            request.query("SELECT A.username,A.ID, T.Fname, T.Lname, A.position FROM dbo.db_ClientAccount AS A, dbo.db_TeacherInfo AS T WHERE A.ID = T.ID", function (err, result2) {
                if (err) console.log(err);
                var result = result1.recordset.concat(result2.recordset);
                res.render('password_renew', { Result: result, length: result.length });
            })
        })
    }
    else {
        res.redirect('/login');
    }
});


app.post('/management/renew-done', function (req, res) {
    request.query("UPDATE dbo.db_ClientAccount SET password = '" + req.body.Pass.trim() + "' WHERE ID = '" + req.body.ID.trim() + "'", function (err, result) {
        if (err) {
            console.log(err);
            res.send("fail");
        }
        else {
            res.send("done");
        }
    })
})

//-----------------------------------------------ROUTER FOR ADD-----------------------------------------------------
//___________________________________----------------------------------------------_________________________________
app.get('/management/add', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('admin_addAccount');
    }
    else {
        res.redirect('/login');
    }
});


app.post('/management/add/request', function (req, res) {
    insert2Sql(req.body.code, req.body.num, req.body.position, res);
});


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


function insert2Sql(ID, Num, Pos, res) {
    var tempPos;
    if (Pos == "Sinh viên") { tempPos = "Student" }
    else {
        tempPos = "Teacher";
    }
    var insertString = "CREATE TABLE dbo.temp ( username NVARCHAR(20), password NVARCHAR(50), ID VARCHAR(10), position nvarchar(15), countLog int) \n";
    Num = parseInt(Num);
    for (var i = 0; i < Num; i++) {
        var user = ID + stringFormatter(i.toString());
        insertString += "Insert dbo.temp values(N'" + user + "',N'" + user + "','" + user + "',N'" + Pos + "',0)\n";
    }
    insertString += "INSERT INTO dbo.db_ClientAccount SELECT * FROM temp WHERE username NOT IN (SELECT username FROM dbo.db_ClientAccount)\n ";
    insertString += "INSERT INTO dbo.db_" + tempPos + "Info (ID) SELECT ID FROM dbo.temp AS A WHERE A.ID NOT IN (SELECT ID FROM dbo.db_" + tempPos + "Info)\n DROP TABLE dbo.temp";
    request.query(insertString, function (err, result) {
        if (err) console.log(err);
        post2Front(res);
    });
}

function post2Front(res) {
    request.query('SELECT * FROM dbo.db_ClientAccount WHERE countLog = 0', function (err, result) {
        res.send(JSON.stringify(result.recordset));
    });
}



//-----------------------------------------------ROUTER FOR DEL-----------------------------------------------------
//___________________________________----------------------------------------------________________________________

app.get('/management/del', function (req, res) {
    if (req.isAuthenticated()) {
        request.query("SELECT * FROM dbo.db_ClientAccount", function (err, Result) {
            if (err) console.log(err);
            res.render('admin_delAccount', { Result: Result.recordset, length: Result.rowsAffected[0] });
        })
    }
    else {
        res.redirect('/login');
    }
});


app.post("/management/del", function (req, res) {
    var removeArray = req.body.Input.split(', ');
    var removeString = "";
    var length = removeArray.length;
    removeArray[0] = removeArray[0].trim();
    // root
    // > root

    // >> root
    for (var i = 0; i < length; i++) {
        removeString += "DELETE FROM dbo.db_ClientAccount WHERE ID = '" + removeArray[i] + "'\n";
    }
    removeString += "DELETE FROM dbo.db_StudentInfo WHERE ID NOT IN (SELECT ID FROM dbo.db_ClientAccount)";
    removeString += "DELETE FROM dbo.db_TeacherInfo WHERE ID NOT IN (SELECT ID FROM dbo.db_ClientAccount)";
    removeString += "DELETE FROM dbo.db_Class WHERE Teacher_ID NOT IN (SELECT ID FROM dbo.db_ClientAccount)";
    removeString += "DELETE FROM dbo.db_RegisTemp WHERE studentID NOT IN (SELECT ID FROM dbo.db_ClientAccount)";
    removeString += "DELETE FROM dbo.db_StudyAt WHERE MSSV NOT IN (SELECT ID FROM dbo.db_ClientAccount)";
    request.query(removeString, function (err) {
        if (err) console.log(err);
        res.redirect('/management/del');
    })
});



//-----------------------------------------------ROUTER FOR FIND-----------------------------------------------------
//___________________________________----------------------------------------------__________________________________
app.get('/management/find', function (req, res) {
    if (req.isAuthenticated()) {
        request.query("SELECT A.username,A.ID, S.Fname, S.Lname, A.position FROM dbo.db_ClientAccount AS A, dbo.db_StudentInfo AS S WHERE A.ID = S.ID \n SELECT A.username,A.ID, T.Fname, T.Lname, A.position FROM dbo.db_ClientAccount AS A, dbo.db_TeacherInfo AS T WHERE A.ID = T.ID ", function (err, result) {
            if (err) console.log(err);
            var Result = result.recordsets[0].concat(result.recordsets[1]);
            res.render('admin_findAccount', { Result, length: Result.length });
        })
    }
    else {
        res.redirect('/login');
    }
});

app.post('/management/find/request', function (req, res) {
    var id = req.body.idR;
    var name = req.body.databaseTableName;
    request.query("SELECT * FROM dbo.db_" + name + "Info WHERE ID ='" + id.trim() + "'", function (err, result) {
        if (err) console.log(err);
        else {
            res.send(JSON.stringify(result.recordset[0]));
        }
    })
})

//-------------------------------------------------------STUDENT-CHANGE-INFO---------------------------------------------------
//___________________________________--------------------------------------------------------__________________________________

app.get('/student/info', function (req, res) {
    if (req.isAuthenticated()) {
        var tempValue = req.user.position;
        // if (tempValue.trim() == "Sinh viên") { tempValue = "Student" }
        // else if (tempValue.trim() == "Giảng viên") { tempValue = "Teacher" };
        request.query("SELECT * FROM dbo.db_" + tempValue + "Info WHERE ID = '" + req.user.ID.trim() + "'", function (err, result) {
            if (err) console.log(err);
            res.render('student_adjust-info', { Result: result.recordset });
        })
    }
    else {
        res.redirect('/login');
    }
})

app.post('/student/info', function (req, res) {
    var tempValue = req.user.position;

    // if (tempValue.trim() == "Sinh viên") { tempValue = "Student" }
    // else if (tempValue.trim() == "Giảng viên") { tempValue = "Teacher" };
    request.query("UPDATE dbo.db_" + tempValue + "Info SET address = N'" + req.body.Address + "', Email = '" + req.body.Email + "', Contact = '" + req.body.Contact + "' WHERE ID = '" + req.user.ID + "'", function (err, result) {
        if (err) console.log(err);
        res.redirect('/student/info');
    })
})

//--------------------------------------------------TEACHER-CHANGE-INFO----------------------------------------------
//___________________________________----------------------------------------------__________________________________

app.get('/teacher/info', function (req, res) {
    if (req.isAuthenticated()) {
        var tempValue = req.user.position;
        // if (tempValue.trim() == "Sinh viên") { tempValue = "Student" }
        // else if (tempValue.trim() == "Giảng viên") { tempValue = "Teacher" };
        request.query("SELECT * FROM dbo.db_" + tempValue + "Info WHERE ID = '" + req.user.ID.trim() + "'", function (err, result) {
            if (err) console.log(err);
            res.render('teacher_adjust-info', { Result: result.recordset });
        })
    }
    else {
        res.redirect('/login');
    }
})

app.post('/teacher/info', function (req, res) {
    var tempValue = req.user.position;
    // if (tempValue.trim() == "Sinh viên") { tempValue = "Student" }
    // else if (tempValue.trim() == "Giảng viên") { tempValue = "Teacher" };
    request.query("UPDATE dbo.db_" + tempValue + "Info SET address = N'" + req.body.Address + "', Email = '" + req.body.Email + "', Contact = '" + req.body.Contact + "' WHERE ID = '" + req.user.ID + "'", function (err, result) {
        if (err) console.log(err);
        res.redirect('/teacher/info');
    })
})
//-----------------------------------------------------CHANGE-PASS---------------------------------------------------
//___________________________________----------------------------------------------__________________________________

app.get('/change-pass', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('all_change-pass');
    }
    else {
        res.redirect('login');
    }
})

app.post('/change-pass/request', function (req, res) {
    if (req.user.position == "admin") {
        request.query("SELECT * FROM dbo.db_AdminAccount WHERE username = N'" + req.user.username + "' AND password = N'" + req.body.pass + "'", function (err, result) {
            if (err) console.log(err)
            else {
                if (result.rowsAffected[0] == 0) {
                    res.send("0");
                }
                else {
                    res.send("1");
                }
            }
        })
    }
    else {
        request.query("SELECT * FROM dbo.db_ClientAccount WHERE ID = N'" + req.user.ID + "' AND password = N'" + req.body.pass + "'", function (err, result) {
            if (err) console.log(err)
            else {
                if (result.rowsAffected[0] == 0) {
                    res.send("0");
                }
                else {
                    res.send("1");
                }
            }
        })
    }
})
app.post("/change-pass/done", function (req, res) {
    if (req.user.position.trim() == "admin") {
        request.query("UPDATE dbo.db_AdminAccount SET password = N'" + req.body.nPass + "' WHERE username = N'" + req.user.username + "'");
    }
    else {
        request.query("UPDATE dbo.db_ClientAccount SET password = N'" + req.body.nPass + "' WHERE ID = '" + req.user.ID + "'");
    }
    res.redirect('/logout');
})

//-----------------------------------------------TEST FUNCTION-----------------------------------------------------

app.get('/testing/id=:id', function (req, res) {
    res.send(req.params.id);
})

//************************************************ SON **********************************************************


app.get("/student/grades", function (req, res) {
    if (req.isAuthenticated()) {
        var MSSV = req.user.ID;
        request.query("select db_StudyAt.ClassCode, db_StudyAt.Semester, db_StudyAt.Mid_Score, db_StudyAt.Assignment, db_StudyAt.Final_Score, db_Subject.courseName, db_StudyAt.TongKet from db_StudyAt, db_Subject WHERE db_StudyAt.ClassCode = db_Subject.courseID AND db_StudyAt.MSSV='"+MSSV+"'", function (err, result) {
            if (err) console.log(err)
        res.render("student_grades", { data: result.recordset, count: result.rowsAffected.toString() });
        });
    }
    else {
        res.redirect('/login');
    }
});

app.get("/student/coursesinfo", function (req, res) {
    if (req.isAuthenticated()) {
        var MSSV = req.user.ID;
            request.query("SELECT db_Subject.courseName, db_StudyAt.ClassCode, db_StudyAt.ClassGroup, db_StudyAt.Semester, db_TeacherInfo.Fname, db_TeacherInfo.Lname, db_StudyAt.MSSV FROM db_Class,db_StudyAt, db_TeacherInfo, db_Subject WHERE (db_StudyAt.ClassCode=db_Class.ClassCode AND db_StudyAt.ClassGroup=db_Class.ClassGroup AND db_Subject.CourseID=db_Class.ClassCode AND db_Class.Teacher_ID = db_TeacherInfo.ID AND db_StudyAt.Semester = db_Class.Semester AND db_StudyAt.MSSV='"+MSSV+"')",function(err, result){
                if(err)console.log(err);
                res.render("student_coursesinfo", { data: result.recordset, count: result.rowsAffected.toString() });
            })
    }
    else {
        res.redirect('/login');
    }
});

app.post("/student/coursesinfo/request", function(req, res){
    var MSSV = req.user.ID;
    request.query("SELECT db_Subject.courseName, db_StudyAt.ClassCode, db_StudyAt.ClassGroup, db_StudyAt.Semester, db_TeacherInfo.Fname, db_TeacherInfo.Lname, db_StudyAt.MSSV FROM db_Class,db_StudyAt, db_TeacherInfo, db_Subject WHERE (db_StudyAt.ClassCode=db_Class.ClassCode AND db_StudyAt.ClassGroup=db_Class.ClassGroup AND db_Subject.CourseID=db_Class.ClassCode AND db_Class.Teacher_ID = db_TeacherInfo.ID AND db_StudyAt.Semester = db_Class.Semester AND db_StudyAt.MSSV='"+MSSV+"')",function(err, result){
        res.send(result);
    })
})

//************************************************ DUNG **********************************************************

// code
app.get('/student/resis-course', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('student_courseHome');
    }
    else {
        res.redirect('/login');
    }
})
app.get('/student/resis', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('student_resis');
    }
    else {
        res.redirect('/login');
    }
})
app.post('/student/resis-search', function (req, res) {
    var text = req.body.submit;
    var ID = req.user.ID;
    request.query("select * from db_Subject where courseID ='" + text + "' OR courseName LIKE N'%" + text + "%'", function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (!result.rowsAffected[0]) {
                res.render('student_resis_course', { data: "", count: "0" });
            }
            else {
                request.query("select courseID,studentID from db_RegisTemp", function (err, result1) {
                    if (err) { console.log(err); }
                    else {
                        res.render('student_resis_course', { data: result.recordset, count: result.rowsAffected.toString(),dataCheck:result1.recordset,tempID:ID,countCheck:result1.rowsAffected.toString()});
                    }

                });
                //res.render('student_resis_course', { data: result.recordset, count: result.rowsAffected.toString() });
            }
        }

    });
});

app.post('/student/resis-done', function (req, res) {
    var txt = req.body.txt;
    var spt = txt.split(",");
    var spt_space = new Array();
    var j = 0;
    var Semester = 182;
    spt.forEach(i => {
        spt_space[j] = i.trim();
        j++
    });
    request.query("select * from db_RegisTemp", function (err, result) {
        if (err) console.log(err);
        var x = result.recordset;
        var count = 0;
        var insertString = "";
        for (var i = 0; i < spt_space.length - 1; i++) {
            x.forEach(element => {
                if (element.courseID.toString() == spt_space[i] && req.user.ID == element.studentID.toString()) {
                    count++;
                }
            });
            if (count == 0) {
                insertString += "insert into db_RegisTemp (courseID,studentID,Semester) values ('" + spt_space[i] + "','" + req.user.ID + "','" + Semester + "')";
            }
        }

        request.query(insertString, function (err, result) {
            if (err) console.log(err);
        })
        res.redirect('/student/resis');
    });
});
app.get('/student/view-course', function (req, res) {
    if (req.isAuthenticated()) {
        request.query("select * from db_Subject where courseID in ( select courseID from db_RegisTemp where studentID='" + req.user.ID + "') ", function (err, result) {
            if (err) {
                console.log(err)
            } else {
                if (!result.rowsAffected[0]) {
                    res.render('student_view_course', { data: "", count: "0" });
                }
                else {
                    res.render('student_view_course', { data: result.recordset, count: result.rowsAffected[0].toString() });
                }
            }

        });
    }
    else {
        res.redirect('/login');
    }
});
app.post('/student/delete-course', function (req, res) {
    var txt = req.body.txt;
    var spt = txt.split(",");
    var spt_space = new Array();
    var j = 0;
    var insertString = "";
    spt.forEach(i => {
        spt_space[j] = i.trim();
        j++
    });
    for (var i = 0; i < spt_space.length; i++) {
        insertString += "delete from db_RegisTemp where courseID in ('" + spt_space[i] + "') and studentID='" + req.user.ID + "'";
    }
    request.query(insertString, function (err, result) {
        if (err) console.log(err);
    });
    res.redirect('/student/view-course');
});


//************************************************ BAO **********************************************************

var classcode=''
  var semester=''
  var classgroup=''
  var coursename=''
  app.get('/CourseMember',function(req,res){
      if (req.isAuthenticated()) {
        request.query("SELECT Fname, Lname FROM db_Class C, db_TeacherInfo S WHERE ClassCode='"+classcode+"'AND ClassGroup='"+classgroup+"' AND Semester='"+semester+"' AND S.ID= C.Teacher_ID", function (err, result1) {
          request.query("SELECT S.ID,Fname,Lname,Email FROM db_StudentInfo S, db_StudyAt A, db_Class C WHERE C.ClassCode='"+classcode+"' AND C.ClassGroup='"+classgroup+"' AND C.Semester='"+semester+"' AND S.ID=A.MSSV AND A.ClassCode=C.ClassCode", function (err, result2) {
            res.render('CourseMember', { rows : result1.recordset, rows2: result2.recordset ,count: result2.rowsAffected,position: req.user.position,Classname: coursename });
          });
        });
          }
          else {
              res.redirect('/login');
          }
    });
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      var array=file.originalname.split('.');
    //  console.log(array);
      var realtype=array[1];
    //  console.log(realtype);
      var fileName=array[0];
      //var newName=classcode+'-'+semester+'-'+classgroup+'-'+fileName +'-'+uniqid('-')+'.'+realtype;
      var newName=file.originalname+uniqid('-')+'.'+realtype;
      var RealDestination='uploads/'+newName;
    //  console.log("filename"+fileName)
    //  console.log("newname:" +newName);
    //  console.log("destination: " +RealDestination);
      request.query("INSERT INTO db_Material VALUES ('"+classcode+"','"+semester+"','"+classgroup+"',N'"+file.originalname+"',N'"+RealDestination+"',CAST(GETDATE() AS DATETIME))", function (err, result) {
      if (err) console.log(err);
      else console.log('Success upload to Database');
    });
      cb(null, newName);
    }
  })
  var upload=multer({storage:storage}).array('myFile',10);

  app.post('/UploadFile',function(req,res){
    upload(req,res,function(err){
      if(err)
      {
        return res.end("Error uploading file.");
      }
      console.log(req.file);
      res.end("File is uploaded");
    })
    console.log('temper');
    console.log(req.file);
    res.redirect('Course_view');
  });

  app.post('/DeleteFile',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT ID FROM db_Material M WHERE M.ClassCode='"+classcode+"'AND M.Semester='"+semester+"' AND M.ClassGroup='"+classgroup+"' ",function(err,result){
        if(err) console.log(err);
        var count=result.rowsAffected;
        var data= result.recordset;
        // console.log("count:"+count);
        for(var i =0;i<count;i++)
        {
          var Walker="deleteFile"+data[i].ID;
          //console.log(Walker);
          let checked = req.body[Walker];
          //console.log(checked);
          if(checked)
          {
            request.query("DELETE FROM  db_Material WHERE ID="+Number(data[i].ID)+" AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'",function(error,result1){
              if(error) console.log(err);
              else
              console.log('Something gots deleted');
            });
          }
        }
      });
      res.redirect('/Course_View');
    }
    else {
      res.redirect('/login');
    }
  });
  app.post("/Course_View/request", function(req,res){
    classcode = req.body.ClassCode;
    semester = req.body.Semester;
    classgroup = req.body.ClassGroup;
    coursename= req.body.courseName;
    res.redirect("/Course_view");

  });
  app.get('/Course_View',function(req,res){
    if(req.isAuthenticated())
    {
        // console.log(classcode, semester, classgroup)
      request.query("SELECT FileName,Destination,ID FROM db_Material WHERE ClassCode='"+classcode+"'AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"' ORDER BY FileName",function(err,result){
        if(err) console.log("Error occur");
        res.render('Course_View',{Data : result.recordset ,count: result.rowsAffected,position: req.user.position,Classname: coursename});
      });
    }
    else {
      res.redirect('/login');
    }
  });

  app.get('/InputScore',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT S.ID,Fname,Lname, Mid_Score FROM db_StudentInfo S, db_StudyAt A WHERE ClassCode='"+classcode+"'AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"' AND S.ID=A.MSSV",function(err,result){
        if(err) console.log(err);
        res.render('InputScore',{Data : result.recordset ,count: result.rowsAffected,position: req.user.position,Classname: coursename});
      });
    }
    else {
      res.redirect('/login');
    }
  });
  app.post('/SaveNewScore',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT MSSV FROM db_StudyAt WHERE ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(err,Data){
        if(err) console.log("result1: " + err);
        else {
          var getData= Data.recordset;
          var count= Data.rowsAffected;
        //   console.log("getData: "+getData[0].MSSV);
            for(var i=0;i<count;i++){
              var Walker=getData[i].MSSV;
              let input_score=req.body[Walker];
            //   console.log("Walker: "+Walker);
            //   console.log("input_score: "+input_score +"\n");
              if(input_score!="")
              {
                if(input_score>=0 && input_score<=10)
                {
                    // console.log("inside");
            // "DECLARE @number decimal(4,2); DECLARE @lower decimal(4,2); DECLARE @upper int; set @number="+Number(input_score)+"; SET @upper = @number; SET @lower = @number- @upper; --select @lower; if(@lower <0.25 AND @lower>=0.00) SET @lower=0; else if(@lower <0.75) SET @lower=0.5; else begin set @lower=0; set @upper=@upper+1; end SET @number=@upper+ @lower;UPDATE db_StudyAt SET Mid_Score=@number WHERE MSSV='"+getData[i].MSSV+"' AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'"
                request.query("UPDATE db_StudyAt SET Mid_Score="+Number(input_score)+"WHERE MSSV='"+getData[i].MSSV+"' AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(error,result2){
                // request.query("DECLARE @number decimal(4,2); DECLARE @lower decimal(4,2); DECLARE @upper int; set @number="+Number(input_score)+"; SET @upper = @number; SET @lower = @number- @upper; if(@lower <0.25 AND @lower>=0.00) SET @lower=0; else if(@lower <0.75) SET @lower=0.5; else begin set @lower=0; set @upper=@upper+1; end SET @number=@upper+ @lower;UPDATE db_StudyAt SET Mid_Score=@number WHERE MSSV='"+getData[i].MSSV+"' AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(error,result2){
                if(err) console.log(err);
              });
            }
            }
            }
        }
      });
      res.redirect('/InputScore');
    }
    else {
      res.redirect('/login');
    }
  });
  app.get('/Camthi',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT S.ID, S.Fname, S.Lname, A.Mid_Score, A.Assignment FROM db_StudentInfo S join db_StudyAt A on S.ID = A.MSSV WHERE A.Disqualified=1 AND A.ClassCode='"+classcode+"' AND A.Semester= '"+semester+"' AND ClassGroup='"+classgroup+"'",function(err,result){
        if(err) console.log(err);
        res.render('Camthi',{Data : result.recordset ,count: result.rowsAffected,position: req.user.position,Classname: coursename});
      });
    }
    else{
      res.redirect("login");
    }
  });

  app.get('/Input_Ass',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT S.ID,Fname,Lname, Assignment FROM db_StudentInfo S, db_StudyAt A WHERE ClassCode='"+classcode+"'AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"' AND S.ID=A.MSSV",function(err,result){
        if(err) console.log(err);
        res.render('Input_Ass',{Data : result.recordset ,count: result.rowsAffected,position: req.user.position,Classname: coursename});
      });
    }
    else {
      res.redirect('/login');
    }
  });
  app.post('/SaveNewAss',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT MSSV FROM db_StudyAt WHERE ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(err,Data){
        if(err) console.log("result1: " + err);
        else {
          var getData= Data.recordset;
          var count= Data.rowsAffected;
        //   console.log("getData: "+getData[0].MSSV);
        //   console.log(count);
            for(var i=0;i<count;i++){
              // name="<%="input"+Data[i].MSSV%>"
            //   console.log("getData[i].MSSV: "+getData[i].MSSV);
              var Walker=getData[i].MSSV;
              let input_score=req.body[Walker];
            //   console.log("Walker: "+Walker);
            //   console.log("input_score: "+input_score +"\n");
              if(input_score!="")
              {
                if(input_score>=0 && input_score<=10)
                {
                    // console.log("inside");
                request.query("UPDATE db_StudyAt SET Assignment="+Number(input_score)+"WHERE MSSV='"+getData[i].MSSV+"' AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(error,result2){
                if(err) console.log(err);
                else {
                  console.log("Finish Update");
                }
              });}
            }
            }
        }
        //res.render('InputScore',{Data : result.recordset ,count: result.rowsAffected});
      });
      res.redirect('/Input_ass');
    }
    else {
      res.redirect('/login');
    }
  });
  app.get('/Input_Fin',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT S.ID,Fname,Lname, Final_score FROM db_StudentInfo S, db_StudyAt A WHERE ClassCode='"+classcode+"'AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"' AND S.ID=A.MSSV",function(err,result){
        if(err) console.log(err);
        res.render('Input_Fin',{Data : result.recordset ,count: result.rowsAffected,position: req.user.position,Classname: coursename});
      });
    }
    else {
      res.redirect('/login');
    }
  });
  app.post('/SaveNewFin',function(req,res){
    if(req.isAuthenticated())
    {
      request.query("SELECT MSSV FROM db_StudyAt WHERE ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(err,Data){
        if(err) console.log("result1: " + err);
        else {
          var getData= Data.recordset;
          var count= Data.rowsAffected;
        //   console.log("getData: "+getData[0].MSSV);
        //   console.log(count);
            for(var i=0;i<count;i++){
              // name="<%="input"+Data[i].MSSV%>"
            //   console.log("getData[i].MSSV: "+getData[i].MSSV);
              var Walker=getData[i].MSSV;
              let input_score=req.body[Walker];
            //   console.log("Walker: "+Walker);
            //   console.log("input_score: "+input_score +"\n");
              if(input_score!="")
              {
                if(input_score>=0 && input_score<=10)
                {
                    // console.log("inside");
                request.query("UPDATE db_StudyAt SET Final_score="+Number(input_score)+"WHERE MSSV='"+getData[i].MSSV+"' AND ClassCode='"+classcode+"' AND Semester='"+semester+"' AND ClassGroup='"+classgroup+"'", function(error,result2){
                if(err) console.log(err);
                else {
                  console.log("Finish Update");
                }
              });}
            }
            }

        }
        //res.render('InputScore',{Data : result.recordset ,count: result.rowsAffected});
      });
      res.redirect('/Input_Fin');
    }
    else {
      res.redirect('/login');
    }
  });
  app.get('/SortByName/:character',function(req,res){ // sắp xếp theo tên trong danh sách thành viên lớp coursemember
    var choice= req.params.character;
    if (req.isAuthenticated()) {
      request.query("SELECT Fname, Lname FROM db_Class C, db_TeacherInfo S WHERE ClassCode='"+classcode+"'AND ClassGroup='"+classgroup+"' AND Semester='"+semester+"' AND S.ID= C.Teacher_ID", function (err, result1) {
        request.query("SELECT S.ID,Fname,Lname,Email FROM db_StudentInfo S, db_StudyAt A, db_Class C WHERE Lname LIKE '"+choice+"%' AND C.ClassCode='"+classcode+"' AND C.ClassGroup='"+classgroup+"' AND C.Semester='"+semester+"' AND S.ID=A.MSSV AND A.ClassCode=C.ClassCode", function (err, result2) {
          //console.log(result1.recordset[0].Fname);
          res.render('CourseMember', { rows : result1.recordset, rows2: result2.recordset ,count: result2.rowsAffected,position: req.user.position,Classname: coursename });
        });
      });
        }
        else {
            res.redirect('/login');
        }
  });

//************************************************ TRINH **********************************************************

app.get("/teacher/coursesinfo", function (req, res) {
    if (req.isAuthenticated()) {
        var TeacherID = req.user.ID;
            request.query("SELECT db_Class.Teacher_ID, db_Class.ClassGroup, db_Class.Semester, db_Class.ClassCode, db_Subject.courseName FROM db_Class, db_Subject WHERE (db_Subject.CourseID=db_Class.ClassCode AND db_Class.Teacher_ID = '"+TeacherID+"')",function(err, result){
                res.render("teacher_coursesinfo", { data: result.recordset, count: result.rowsAffected.toString() });
            })
    }
    else {
        res.redirect('/login');
    }
});

app.post("/teacher/coursesinfo/request", function(req, res){
    var MSSV = req.user.ID;
    request.query("SELECT db_Subject.courseName, db_StudyAt.ClassCode, db_StudyAt.ClassGroup, db_StudyAt.Semester, db_TeacherInfo.Fname, db_TeacherInfo.Lname, db_StudyAt.MSSV FROM db_Class,db_StudyAt, db_TeacherInfo, db_Subject WHERE (db_StudyAt.ClassCode=db_Class.ClassCode AND db_StudyAt.ClassGroup=db_Class.ClassGroup AND db_Subject.CourseID=db_Class.ClassCode AND db_Class.Teacher_ID = db_TeacherInfo.ID AND db_StudyAt.Semester = db_Class.Semester AND db_StudyAt.MSSV='"+MSSV+"')",function(err, result){
        res.send(result);
    })
})

app.get('/admin/createSubject', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('createSubject');
    }
    else {
        res.redirect('/login');
    }
})

app.post('/admin/createSubject/request', function (req, res) {
    var sql = `INSERT INTO db_Subject VALUES ('${req.body.id}', N'${req.body.name}', '${req.body.credit}', '${req.body.lesson}', N'${req.body.des}')`;
    // console.log(sql);
    request.query(sql, function (err, result) {
        if (err) throw err;
    });
});

app.get('/admin/regsubafter', function (req, res){
    if (req.isAuthenticated()) {
        res.render('regsubafter');
    }
    else {
        res.redirect('/login');
    }
})

app.post('/admin/regsubafter/request', function (req, res) {
  var sql = `INSERT INTO db_RegisTemp (courseID, studentID, Semester) VALUES ('${req.body.SubjectID}', '${req.body.StudentID}', '182')`;
  request.query(sql, function (err, result) {
    if (err) throw err;
  });
});


app.get('/admin/deleteSubject', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('deleteSubject')
    }
    else {
        res.redirect('/login');
    }
})

app.get('/viewSubjectData', function (req, res) {
    if (req.isAuthenticated()) {
        request.query('SELECT * FROM db_Subject', function (err, recordset) {
            res.send((recordset));
        });
    }
    else {
        res.redirect('/login');
    }
})

app.post('/admin/deleteSubject/request', function (req, res) {
    var sql = `DELETE FROM db_Subject WHERE courseID in('${req.body.id}')`;
    request.query(sql, function (err, result) {
        if (err) throw err;
    });
});

app.get('/teacher/editTeacherInfo', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('editTeacherInfo')
    }
    else {
        res.redirect('/login');
    }
})


app.post('/teacher/teacherInfo', function (req, res) {
    request.query(`SELECT * FROM db_TeacherInfo WHERE ID = '${req.user.ID}'`, function (err, recordset) {
        if(recordset.rowsAffected != 0){
            if(recordset.recordset[0].Subject != null){
            arr = recordset.recordset[0].Subject.split(',')
          var SubjectList = `'${arr[0]}'`
          if(arr.length > 1)
            for (var i = 1; i <= arr.length; i++){
                SubjectList += `,'${arr[i]}'`
            }
        }
        else{
            SubjectList = '';
        }
        }
        request.query(`SELECT * FROM db_Subject WHERE courseID in(${SubjectList})`, function (err, result) {
            res.send({recordset: recordset, result: result});
        })
    })
})


app.post('/teacher/editTeacherInfo/request', function (req, res) {
    var sql = `UPDATE db_TeacherInfo SET DOB = '${req.body.dob}', Subject = '${req.body.subjectID}', Address = N'${req.body.address}', Email = '${req.body.mail}', Contact = '${req.body.contact}' WHERE ID = '${req.user.ID}'`;
    request.query(sql, function (err, result) {
        if (err) throw err;
    });
});
app.get('/student/editStudentInfo', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('editStudentInfo')
    }
    else {
        res.redirect('/login');
    }
})


app.post('/student/studentInfo', function (req, res) {
    request.query(`SELECT * FROM db_StudentInfo WHERE ID = '${req.user.ID}'`, function (err, recordset) {
        res.send((recordset));
    })
})


app.post('/student/editStudentInfo/request', function (req, res) {
    var sql = `UPDATE db_StudentInfo SET DOB = '${req.body.dob}', Address = N'${req.body.address}', Email = '${req.body.mail}', Contact = '${req.body.contact}' WHERE ID = '${req.user.ID}'`;
    request.query(sql, function (err, result) {
        if (err) throw err;
    });
    res.redirect('/student/editStudentInfo');
});

app.get('/admin/stopRegSubject', function(req, res){
    if (req.isAuthenticated()) {
        res.render('stopRegSubject')
    }
    else {
        res.redirect('/login');
    }
})
app.post('/regTemp', function(req, res){
    request.query(`SELECT courseID, COUNT(*) FROM db_RegisTemp GROUP BY courseID`, function (err, recordset) {
        res.send((recordset));
    })
})

app.post('/sortClass', function(req, res){
    var studentperclass = 2;
    var lastClassHour = 12;
    request.query('SELECT courseID FROM db_RegisTemp GROUP BY courseID', function(err, check1){
        if(check1.rowsAffected != 0){
            var courseid = `'${check1.recordset[0].courseID}'`;
            if (check1.rowsAffected>1)
            for (var a = 1; a < check1.rowsAffected; a++){
                courseid += `,'${check1.recordset[a].courseID}'`;
            }
        }
        request.query(`SELECT * FROM db_Class WHERE (ClassCode in(${courseid}) AND Semester = '182')`, function (err, check2) {
            if(check2.rowsAffected == 0)
            request.query(`SELECT courseID, COUNT(*) FROM db_RegisTemp GROUP BY courseID`, function (err, regResult) {
                var count = 1;
                for(var i = 0; i < regResult.rowsAffected; i++){
                request.query(`SELECT * FROM db_RegisTemp WHERE courseID = '${regResult.recordset[i].courseID}'`, function (err, result) {
                    var classnumber = Math.ceil(result.rowsAffected/studentperclass);
                    var semester = `${result.recordset[0].Semester}`;
                    var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    request.query(`SELECT ID FROM db_TeacherInfo WHERE Subject LIKE '%${result.recordset[0].courseID}%'`, function (err, teacherID) {
                            if(teacherID.rowsAffected!=0){
                                var countStudent = 0;
                                    if(classnumber>teacherID.rowsAffected)
                                classnumber = teacherID.rowsAffected;
                                var classcode = `${result.recordset[0].courseID}`;
                                for (var j = 0; j < classnumber; j++){
                                    var classgroup = 'L0'+(j+1);
                                    request.query(`INSERT INTO db_Class (ClassCode, Semester, ClassGroup, Teacher_ID) VALUES ('${classcode}','${semester}','${classgroup}','${teacherID.recordset[j].ID}')`)
                                    request.query(`SELECT * FROM db_Class WHERE (Teacher_ID = '${teacherID.recordset[j].ID}' AND Semester = '${semester}')`, function (err, ClassHour) {
                                        var day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        loop: {
                                            for (var x = 0; x < 6; x++){
                                                for (var y = 0; y < ClassHour.rowsAffected; y++){
                                                    var classcode = `${ClassHour.recordset[y].ClassCode}`;
                                                    var randomDay = Math.floor((Math.random() * 6) + 0);
                                                    var classhournumber = Math.floor((Math.random() * 5) + 1);
                                                    var classhour = '';
                                                    var schedule = '';
                                                    var scheduleArr;
                                                    if(day[x] == ClassHour.recordset[y].Day)
                                                        schedule += ',' + ClassHour.recordset[y].ClassHour;
                                                        if(schedule == '') {
                                                            classhour += 1;
                                                        for (var z = 1; z < classhournumber; z++)
                                                            classhour += ',' + (1 + z);
                                                            if(ClassHour.recordset[y].Day == null)
                                                            request.query(`UPDATE db_Class SET Day = '${day[randomDay]}', ClassHour = '${classhour}' WHERE (ClassGroup = '${ClassHour.recordset[y].ClassGroup}' AND Teacher_ID = '${ClassHour.recordset[y].Teacher_ID}' AND ClassCode = '${ClassHour.recordset[y].ClassCode}')`)
                                                            classhour = '';
                                                            if(y == ClassHour.rowsAffected - 1)
                                                                break loop;
                                                        }
                                                        else{
                                                            scheduleArr = schedule.split(',');
                                                            if (Math.max(scheduleArr) <= lastClassHour - classhournumber){
                                                                classhour += Math.max(scheduleArr) +1;
                                                                for (var z = 1; z < classhournumber; z++)
                                                                    classhour += ',' + (Math.max(scheduleArr) + 1 + z);
                                                                    if(ClassHour.recordset[y].Day == null)
                                                                    request.query(`UPDATE db_Class SET Day = '${day[randomDay]}', ClassHour = '${classhour}' WHERE (ClassGroup = '${ClassHour.recordset[y].ClassGroup}' AND Teacher_ID = '${ClassHour.recordset[y].Teacher_ID}' AND ClassCode = '${ClassHour.recordset[y].ClassCode}')`)
                                                                classhour = '';
                                                                if(y == ClassHour.rowsAffected - 1)
                                                                    break loop;
                                                            }
                                                        }
                                                }
                                            }
                                        }
                                })

                                    for( var k = 0; k < Math.ceil(result.rowsAffected/classnumber); k++)
                                    {
                                        if(countStudent < result.rowsAffected){
                                            request.query(`INSERT INTO db_StudyAt (ClassCode, Semester, ClassGroup, MSSV) VALUES ('${classcode}','${semester}','${classgroup}', '${result.recordset[countStudent].studentID}')`)
                                            countStudent++;
                                        }
                                    }
                                }
                            }


                        })
                })
                }
            })

        })
    })
})
