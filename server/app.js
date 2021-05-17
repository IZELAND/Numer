var express = require('express');
var app = express();
var fs = require("fs"); //อ่านไฟล์ user.json
//GET Method ดึงข้อมูลของ user มาทั้งหมด

app.get('/getapi', function (req, res) {
    fs.readFile( __dirname + "/" + "api.json", 'utf8', function (err, data) {
        console.log(data); // data ก้อนข้อมูลของ user
        res.end(data);
    });
});

// แบบมีเงื่อนไข
app.get('/getapi/:id', function (req, res) {
    fs.readFile( __dirname + "/" + "api.json", 'utf8', function(err,data) {
        var users = JSON.parse(data); // แปลงข้อมูล ให้เป็นก้อน ผู้ใช้ทั้งหมด
        var user = users["user" + req.params.id]; // เพิ่มเงื่อนไข
        console.log(user);
        res.end(JSON.stringify(user));
    });
});

app.delete('/delapi/:index', function (req, res) {
    fs.readFile( __dirname + "/" + "api.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        delete data["user" + req.params.index];
        res.end(JSON.stringify(data));//อัพเดทข้อมูลล่าสุด
    });
});

app.post('/addapi', function (req, res) {
    fs.readFile( __dirname + "/" + "api.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        data["user4"] = user["user4"];// เพิ่มข้อมูลใหม่เข้าไปต่อข้อมูลเดิม
        res.end(JSON.stringify(data));
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Application Run At http://%s:%s", host, port)
});

