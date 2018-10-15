var path  = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var aucklandBankController = require('./aucklandBankController.js');
var aucklandBankDb = require('./aucklandBankDb.js');
var app = express();

//create in-memory db to save person requests and load them in admin area when a person will visit any bank branch
aucklandBankDb.createDb();


app.use(session({secret: 'auckland bank', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views', 'auckland-bank'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', aucklandBankController.index);
app.get('/request', aucklandBankController.verifyIdentity);
app.post('/request', aucklandBankController.thanks);
app.get('/admin', aucklandBankController.adminDashboard);
app.get('/admin/dashboard', aucklandBankController.adminDashboard);
app.get('/admin/login', aucklandBankController.enterLogin);
app.post('/admin/login', aucklandBankController.checkLogin);
app.get('/admin/account', aucklandBankController.enterIdentityData);
app.get('/admin/account/:accountId', aucklandBankController.enterIdentityData);
// app.get('/admin/account/:accountId/checkuportid', aucklandBankController.checkUportId);
app.post('/admin/account/:accountId/attest/passport', aucklandBankController.attestPassport);
app.post('/admin/account/:accountId/attest/creditcardlimit', aucklandBankController.attestCreditCardLimit);
app.get('/admin/account/:accountId/registry', aucklandBankController.checkVerifiedData);

app.get('/admin/requestdata', aucklandBankController.createRequestToShareData);//using client UportId to get verified data from smart contracts
app.post('/admin/requestdata', aucklandBankController.sendRequestToShareData);//using client UportId to get verified data from smart contracts
// app.post('/cbrequestdata', aucklandBankController.cbRequestToShareData);//using client UportId to get verified data from smart contracts
// app.post('/cbcheckuportid', aucklandBankController.cbCheckUportId);//request client UportId to get jwt to send push notification later

app.get('/admin/request', aucklandBankController.viewRequests);//view all requests created by users to attest data
app.get('/admin/logout', aucklandBankController.logout);
app.post('/cbattestdata', aucklandBankController.cbAttestData);
app.use("*", function(req, res){
    res.send("404 Error");
    console.log("URL: "+req.baseUrl);
    //res.sendFile("404.html");
});

var server = app.listen(8081, function () {
  console.log("Auckland Bank running...")
})
