var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});
var cors = require('cors');

var backendserv = require('./backendservice');
var bodyParser = require('body-parser');
var axios = require('axios');

const formidable = require('express-formidable');
app.use(bodyParser.urlencoded({ extended: true ,limit: '50mb'}));
app.use(bodyParser.json());
app.use(formidable());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

    next();
});

var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/submitcrime',backendserv.submitCrime);
router.post('/viewImage',backendserv.viewImage);
router.get('/getcrime',backendserv.getcrime);

//router.post('/login',login.login)
app.use('/', router);

app.listen(3007, function () {
  console.log('Example app listening on port 3000!');
});
