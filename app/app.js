var Plotter = require('./plotter.js');
var plotter = new Plotter({
    a: 100,
    b: 100,
    c: 130,
    stepX: 12,
    stepY: 10,
    radius: 5,
    gage: 0.1,
    maxSpeed: 990
});

// Тестовый вывод данных о переходе в точку
console.log(plotter.getPointData(4, 4));
