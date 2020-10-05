var mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost:27017/employeedb", function(err){
    if(err) throw err;
    console.log("Database Connected");
});

var empSchema = new mongoose.Schema({
    name: String,
    email: String,
    salary: Number
});

var empModel = mongoose.model("employees", empSchema);

module.exports = empModel;