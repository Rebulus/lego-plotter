var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function(req, res) {
    res.render('index.jade');
});

app.post('/letter', function(req, res) {
    console.log('BODY', req.body);
    console.log('LETTER', req.param('letter'));
    console.log('SVG', req.param('svg'));

    fs.writeFile(__dirname + '/letters/' + req.param('letter') + '.svg', req.param('svg'), function(err) {
        if (err) {
            throw err;
        }

        console.log('OK');

        res.redirect('/');
    });
});

var server = app.listen(3000, function() {
    console.log('ok');
});

