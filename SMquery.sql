CREATE DATABASE studentmanagement
GO
USE studentmanagement

CREATE TABLE db_ClientAccount(
	username NVARCHAR(20),
	password NVARCHAR(50),
	ID VARCHAR(10) PRIMARY KEY,
	position NVARCHAR(15),
	countLog int DEFAULT 0
)
GO
CREATE TABLE db_StudentInfo(
	ID varchar(10) PRIMARY KEY,
	Fname nvarchar(30),
	Lname nvarchar(10),	
	DOB varchar(10),	
	Address Nvarchar(200),	
	Sex BIT,	
	Email varchar(30),
	Contact varchar(13),	
	Faculty nvarchar(200)
)
GO
CREATE TABLE db_TeacherInfo(
	ID varchar(10) PRIMARY KEY,	
	Fname nvarchar(30)	,
	Lname nvarchar(10)	,
	DOB varchar(10)	,
	Address Nvarchar(200),	
	Sex BIT	,
	Email varchar(30)	,
	Contact varchar(13)	,
	Faculty nvarchar(200)	,
	Subject varchar(50)

)
GO


CREATE TABLE db_AdminAccount(
	username NVARCHAR(20) PRIMARY KEY,
	password NVARCHAR(50),
	position NVARCHAR(15),
	countLog int default 0
)
GO


CREATE TABLE db_Subject(
	courseID varchar(10) PRIMARY KEY	,
	courseName nvarchar(70)	,
	courseCredit tinyint	,
	courseLesson tinyint	,
	courseDescription nvarchar(500)
)
GO
CREATE TABLE db_Class(
	ClassCode varchar(10),	
	Semester varchar(20)	,
	ClassGroup varchar(20)	,
	Teacher_ID varchar(10),
	Day varchar(10),
	ClassHour varchar(20),
	PRIMARY KEY(ClassCode,Semester,ClassGroup)
)
GO

CREATE TABLE db_RegisTemp(
	courseID varchar(10),	
	studentID varchar(10)	,
	Semester varchar(20),
	PRIMARY KEY(courseID, studentID)
)
GO
CREATE TABLE db_StudyAt(
	ClassCode varchar(10)	,
	Semester varchar(20)	,
	ClassGroup varchar(20)	,
	MSSV varchar(10)	,
	Mid_Score decimal(4,2)	,
	Final_score decimal(4,2),	
	Assignment decimal(4,2)
	PRIMARY KEY(ClassCode,Semester,ClassGroup,MSSV)
)
GO
GO
CREATE TABLE db_Material(
	ID int identity(1,1)	,
	ClassCode varchar(10),	
	Semester varchar(20)	,
	ClassGroup varchar(20)	,
	FileName Nvarchar(1000)	,
	Destination Nvarchar(1000),	
	UploadTime datetime,
	PRIMARY KEY(ID,ClassCode,Semester,ClassGroup)
)
GO

INSERT INTO dbo.db_AdminAccount VALUES  ( N'PDTBK01' ,  N'PDTBK01' ,  N'admin' ,  1  )
INSERT INTO dbo.db_AdminAccount VALUES  ( N'PDTBK02' ,  N'PDTBK02' ,  N'admin' ,  1  )
INSERT INTO dbo.db_AdminAccount VALUES  ( N'PDTBK03' ,  N'PDTBK03' ,  N'admin' ,  1  )
INSERT INTO dbo.db_AdminAccount VALUES  ( N'PDTBK04' ,  N'PDTBK04' ,  N'admin' ,  1  )