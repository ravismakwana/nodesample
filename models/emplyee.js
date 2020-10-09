var mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/employeedb", function(err){
    if(err) throw err;
    console.log("Database Connected");
});
// This is created mongodb schema
var empSchema = new mongoose.Schema({
    name: String,
    email: String,
    salary: Number,
    profile_photo: String
});

var empModel = mongoose.model("employees", empSchema);

module.exports = empModel;