var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send('Hello World!');
});

var backendserv = require('./backendservice');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
 router.post('/retreivedataToday',backendserv.retreivedataToday);
router.post('/retreiveDataRange',backendserv.retreivedatarange);



router.post('/signupuser',backendserv.signupuser);
router.post('/loginuser',backendserv.loginuser);
router.post('/resetpassword',backendserv.resetpassword);
router.post('/changepassword',backendserv.changepassword);
router.post('/updategroup',backendserv.updategroup);
router.post('/retreivegroups',backendserv.retreivegroups);

router.post('/search',backendserv.search);




//router.post('/login',login.login)
app.use('/api', router);

app.listen(3001, function () {
  console.log('Example app listening on port 3000!');
});
