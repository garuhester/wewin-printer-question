var Question = require('../schemas/question');
var moment = require("moment");

var submitQuestion = function (req, res) {
    var deviceId = req.body.deviceId;
    var deviceName = req.body.deviceName;
    var selectContent = req.body.selectContent;
    var textareaContent = req.body.textareaContent;

    var question = new Question({
        deviceId,
        deviceName,
        selectContent,
        textareaContent,
    });

    question.save(function (err, ques) {
        res.json({ result: 1 });
    });
}

var getAdminQuestion = function (currentPage, query) {
    return new Promise(function (resolve, reject) {
        //一页最大条数
        var pageSize = 50;
        var skipNum = (currentPage - 1) * pageSize;
        var data = {};
        //页面跳转字符
        data.goto = query.gotoUrl;
        data.query = query;
        //当前页码
        data.currentPage = currentPage;
        var searchStr = {}
        if (query.gotoUrl == "/admin/?page=") {
            searchStr = {};
        } else {
            var nextDate = "";
            if (query.endDate != "") {
                var nowdate = new Date(query.endDate);
                nextDate = new Date(nowdate.getTime() + 24 * 60 * 60 * 1000); //后一天
                nextDate = moment(nextDate).format("YYYY-MM-DD").toString();
            }
            if (query.beginDate == "" && nextDate == "") {
                searchStr = {
                    'deviceId': { '$regex': query.deviceId },
                    'deviceName': { '$regex': query.deviceName },
                }
            } else if (query.beginDate != "" && nextDate == "") {
                searchStr = {
                    'deviceId': { '$regex': query.deviceId },
                    'deviceName': { '$regex': query.deviceName },
                    "createTime": {
                        "$gt": query.beginDate
                    }
                }
            } else if (query.beginDate == "" && nextDate != "") {
                searchStr = {
                    'deviceId': { '$regex': query.deviceId },
                    'deviceName': { '$regex': query.deviceName },
                    "createTime": {
                        "$lt": nextDate
                    }
                }
            } else if (query.beginDate != "" && nextDate != "") {
                searchStr = {
                    'deviceId': { '$regex': query.deviceId },
                    'deviceName': { '$regex': query.deviceName },
                    "$and": [{
                        "createTime": {
                            "$gte": query.beginDate
                        }
                    }, {
                        "createTime": {
                            "$lte": nextDate
                        }
                    }]
                }
            }

        }
        Question.find(searchStr).skip(skipNum).limit(pageSize).sort({ 'createTime': -1 }).exec(function (err, ques) {
            data.ques = ques;
            Question.count(searchStr, function (err, q) {
                data.allPage = (q % pageSize == 0) ? ~~(q / pageSize) : ~~((q / pageSize) + 1);
                if (data.allPage == 0) {
                    data.allPage = 1;
                }
                resolve(data);
            });
        });
    });
}

module.exports = {
    submitQuestion,
    getAdminQuestion,
}