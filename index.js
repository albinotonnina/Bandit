'use strict';

var express = require('express');

var app = express();
var path = require('path');
app.set('port', (process.env.PORT || 5000));

var router = express.Router();

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/', router);
app.use(express.static(__dirname + '/'));
app.listen(app.get('port'));
