var express = require('express');
const empModel = require('../models/emplyee');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  empModel.find({}, function(err, data){
    if(err) throw err;
    res.render('index', { title: 'Express App', records: data});
  });
});
// Add employee details
router.post('/', function(req, res, next) {
  empModel(req.body).save( function(err, res1){
    if(err) throw err;
    empModel.find({}, function(err, data){
      if(err) throw err;
      res.render('index', { title: 'Express App', records: data});
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
      res.render('index', {title: 'Express App', records: data});
  });
  
});

module.exports = router;
