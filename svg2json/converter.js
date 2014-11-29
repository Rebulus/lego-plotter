var parser = require('svg-path-parser');
var jsdom = require('jsdom');
var fs = require("fs");
var vow = require("vow");

function svg2json(svg) {
    return new vow.Promise(function(resolve, reject) {
        jsdom.env(svg, function(errors, window) {
            var result = [];
            var paths = [];

            var node = window.document.getElementsByTagName('svg')[0];

            var nodes = window.document.getElementsByTagName('path');
            for (var i = 0, l = nodes.length; i < l; i++) {
                console.log(nodes[i].getTotalLength());
                paths.push(nodes[i].getAttribute('d'));
            }

            paths.forEach(function(path) {
                path = parser(path);
                var state;
                path.forEach(function(item) {
                    switch (item.code) {
                        case 'M':
                            if (state !== 'up') {
                                result.push('up');
                                state = 'up';
                            }
                            result.push([item.x, item.y]);
                            break;
                        case 'L':
                            if (state !== 'down') {
                                result.push('down');
                                state = 'down';
                            }
                            result.push([item.x, item.y]);
                            break;
                    }
                });
            });

            resolve(result);
        });
    });
}

module.exports = svg2json;

