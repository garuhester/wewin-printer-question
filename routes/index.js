var question = require("./question");
var moment = require("moment");

module.exports = function (app) {

    app.locals.dateFormat = function (date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    };

    app.get("/", function (req, res) {
        var deviceid = req.query.deviceid;
        var devicename = req.query.devicename;
        res.render("index", {
            deviceid,
            devicename,
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

}