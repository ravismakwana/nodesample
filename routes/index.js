var express = require('express');
var multer = require('multer');
var path = require('path');
const empModel = require('../models/emplyee');
var router = express.Router();
var fs = require('fs');
const {check, validationResult} = require('express-validator');
var UPLOAD_DIR = __dirname + '/../public/uploads/';
console.log(UPLOAD_DIR);

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

//Delete record 
router.get('/delete/:id', function(req, res, next) {
  var delId = req.params.id;
  if(delId) {
  empModel.findByIdAndDelete(delId, function(err, deletedRecord){
    if(err) throw err;
    console.log(deletedRecord);

    if(deletedRecord.profile_photo) {
      fs.unlink(UPLOAD_DIR + deletedRecord.profile_photo, function(err){
        if(err) throw err;
        console.log( deletedRecord.profile_photo + ' Deleted!!!');
      });
    }
    empModel.find({}, function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: 'Records Deleted Successfully'});
    });
  });
} else {
  res.render('index', { title: 'Express App', records: data, message: ''});
}
});


// Add employee details
router.post('/', upload.single('profile_photo'), [

  check('name')
      .isEmpty().withMessage('Name should not be empty')
      .isLength({ min:3 }).withMessage('Name should be 3 charaters'),
  check('email')
      .isEmpty().withMessage('Email should not be empty')

], function(req, res, next) {

  const errs = validationResult(req);

  if(!errs.isEmpty()) {
    console.log(errs.array());
  }

  if(req.file) {
    var newempModel = new empModel({
      name: req.body.name,
      email: req.body.email,
      salary: req.body.salary,
      profile_photo: req.file.filename
    });
  } else {
    var newempModel = new empModel({
      name: req.body.name,
      email: req.body.email,
      salary: req.body.salary,
      profile_photo: 'blank-user.jpeg'
    });
  }
  
  empModel(newempModel).save( function(err, res1){
    if(err) throw err;
    empModel.find({}, function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: 'Record Inserted Sucessfully!!!'});
    });
  });
});

// Edit records
router.get('/edit/:id', function(req, res, next) {
  var editId = req.params.id;
  empModel.findById(editId, function(err, data){
    if(err) throw err;
      res.render('index', { title: 'Express App', records: data, message: ''});
    });
});

// Update Record
router.post('/update/', upload.single('profile_photo'), function(req, res, next) {
  if(req.file) {  // check If new file uploaded by the user or not
      // 1. search old record by id
      empModel.findById(req.body.id, function(err, data){
        if(err) throw err;
          if(!data.profile_photo) {  // Check if the file not be blank, it will gives an error while delete file with blank
            fs.unlink(UPLOAD_DIR + data.profile_photo, function(err){
              if(err) throw err;
              console.log( data.profile_photo + ' Deleted!!!');
            });
          }        
      });
    // 2. collection updated data with newly uploaded file
    var updateDataWithFile = {
      name: req.body.name,
      email: req.body.email,
      salary: req.body.salary,
      profile_photo: req.file.filename
    };
  } else {
    var updateDataWithFile = {
      name: req.body.name,
      email: req.body.email,
      salary: req.body.salary
    };
  }
    // 3. Then find record and update the record with new updated data
    empModel.findByIdAndUpdate(req.body.id, updateDataWithFile ,function(err, data){
      if(err) throw err;
      empModel.find({}, function(err, data){
        if(err) throw err;
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
