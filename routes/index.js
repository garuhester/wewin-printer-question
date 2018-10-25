var question = require("./question");
var moment = require("moment");
var yunpian = require("./yunpian");

module.exports = function (app) {

    app.locals.dateFormat = function (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    };

    app.get("/", function (req, res) {
        var deviceid = req.query.deviceid;
        var devicename = req.query.devicename;
        var tel = req.query.tel;
        res.render("index", {
            deviceid,
            devicename,
            tel
        });
    });

    app.get("/admin", function (req, res) {
        var currentPage = req.query.page || 1;
        var query = {
            deviceName: req.query.devicename || "",
            deviceId: req.query.deviceid || "",
            beginDate: req.query.begindate || "",
            endDate: req.query.enddate || "",
        }
        if (req.query.devicename != undefined) {
            query.gotoUrl = `/admin/?devicename=${query.deviceName}&deviceid=${query.deviceId}&begindate=${query.beginDate}&enddate=${query.endDate}&page=`;
        } else {
            query.gotoUrl = "/admin/?page=";
        }
        question.getAdminQuestion(currentPage, query).then(function (data) {
            res.render("admin", {
                data,
            });
        });
    });

    app.post("/submitquestion", question.submitQuestion);

    app.post("/getSendtel", question.getSendtel);

    app.post("/addSendtel", question.addSendtel);

    app.post("/delSendtel", question.delSendtel);

    app.post("/sendInfo", yunpian.sendInfo);

}