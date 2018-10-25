var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    deviceId: String,
    deviceName: String,
    tel: String,
    selectContent: String,
    textareaContent: String,
    createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Question", QuestionSchema);