var express = require('express');

var app = express();
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.render('index.jade');
});

var server = app.listen(3000, function() {
    console.log('ok');
});
