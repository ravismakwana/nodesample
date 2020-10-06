var express = require('express');
var multer = require('multer');
var path = require('path');
const empModel = require('../models/emplyee');
var router = express.Router();


// file uploaded local storage 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
  }
});
 
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  empModel.find({}, function(err, data){
    if(err) throw err;
    res.render('index', { title: 'Express App', records: data, message: ''});
  });
});
router.get('/delete/:id', function(req, res, next) {
  var delId = req.params.id;
  empModel.findByIdAndDelete(delId, function(err){
    if(err) throw err;
    empModel.find({}, function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: 'Records Deleted Successfully'});
    });
  });
});
router.get('/edit/:id', function(req, res, next) {
  var editId = req.params.id;
  empModel.findById(editId, function(err, data){
    if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: ''});
    });
});
// Add employee details
router.post('/', upload.single('profile_photo'), function(req, res, next) {
  empModel(req.body).save( function(err, res1){
    if(err) throw err;
    empModel.find({}, function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: 'Record Inserted Sucessfully!!!'});
    });
  });
});
router.post('/update/', function(req, res, next) {
    empModel.findByIdAndUpdate(req.body.id, req.body ,function(err, data){
      if(err) throw err;
      console.log(data);
      empModel.find({}, function(err, data){
        res.render('index', { title: 'Express App', records: data, message: 'Record Updated Sucessfully!!!'});
      });
      
    });
});

// Search employee details
router.post('/search', function(req, res, next) {
  var filterName = req.body.filterName;
  var filterEmail = req.body.filterEmail;
  var filterSalary = req.body.filterSalary;

  if(filterName != '' && filterEmail != '' && filterSalary != '') {
    var filterParameter = {
      $and: [
        {name: filterName},
        {email: filterEmail},
        {salary: filterSalary}
      ]
    }
  } else if(filterName == '' && filterEmail != '' && filterSalary != '') {
    var filterParameter = {
      $and: [
        {email: filterEmail},
        {salary: filterSalary}
      ]
    }
  } else if (filterName == '' && filterEmail == '' && filterSalary != '') {
    var filterParameter = {
      $and: [
        {salary: filterSalary}
      ]
    }
  } else if (filterName != '' && filterEmail == '' && filterSalary != '') {
    var filterParameter = {
      $and: [
        {name: filterName},
        {salary: filterSalary}
      ]
    }
  } else if (filterName != '' && filterEmail != '' && filterSalary == '') {
    var filterParameter = {
      $and: [
        {name: filterName},
        {email: filterEmail}
      ]
    }
  } else if (filterName != '' && filterEmail == '' && filterSalary != '') {
    var filterParameter = {
      $and: [
        {email: filterEmail},
        {salary: filterSalary},
      ]
    }
  } else if (filterName != '' && filterEmail == '' && filterSalary == '') {
    var filterParameter = {
      $and: [
        {name: filterName}
      ]
    }
  } else if (filterName == '' && filterEmail != '' && filterSalary == '') {
    var filterParameter = {
      $and: [
        {email: filterEmail}
      ]
    }
  } else {
    var filterParameter = {}
  }

  console.log(filterParameter);
  empModel.find(filterParameter, function(err, data){
      if(err) throw err;
      res.render('index', {title: 'Express App', records: data, message: ''});
  });
  
});

module.exports = router;
