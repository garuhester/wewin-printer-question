var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SendtelSchema = new Schema({
    tel: String,
    createTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Sendtel", SendtelSchema);