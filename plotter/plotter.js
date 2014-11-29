/* global module */
/**
 * Plotter
 *
 *   1     c     2
 * ________________ x
 * | \          /
 * |  \        /
 * |   \      /
 * | a  \    /  b
 * |     \  /
 * |      \/
 *
 * y
 *
 * 1 - firstDrive
 * 2 - secondDrive
 *
 * @param {Object} [options] опции
 * @param {Number} [options.a] сторона a треугольника
 * @param {Number} [options.b] сторона b треугольника
 * @param {Number} [options.c] сторона c треугольника
 * @params {Number} [options.stepX] шаг X в метрической системе
 * @params {Number} [options.stepY] шаг Y в метрической системе
 * @param {Number} [options.radius] радиус вала вращения
 * @param {Number} [options.gage] толщина ленты
 * @param {Number} [options.maxSpeed] максимальная угловая скорость (градусы в секунду)
 * @constructor
 */
var Plotter = function(options) {
    this.options = options;
};

/**
 * Формирует данные для запрашиваемой точки
 * @param {number} x координата по оси X
 * @param {number} y координата по оси Y
 * @returns {{angleA: {angle: *, speed: number, clockwise: boolean}, angleB: {angle: *, speed: number, clockwise: boolean}}}
 */
Plotter.prototype.getPointData = function(x, y) {
    var dimensionX = x * this.options.stepX;
    var dimensionY = y * this.options.stepY;
    var a = Math.sqrt(Math.pow(dimensionX, 2) + Math.pow(dimensionY, 2));
    var b = Math.sqrt(Math.pow(this.options.c - dimensionX, 2) + Math.pow(dimensionY, 2));

    var aDiff = this.options.a - a;
    var bDiff = this.options.b - b;

    var aAngle = this._getAngle(Math.abs(aDiff));
    var bAngle = this._getAngle(Math.abs(bDiff));

    var maxAngle = Math.max(aAngle, bAngle);
    var time = maxAngle / this.options.maxSpeed;
    var aAngleSpeed = Math.round(aAngle / time);
    var bAngleSpeed = Math.round(bAngle / time);

    return {
        angleA: {
            angle: aAngle,
            speed: Math.min(aAngleSpeed, this.options.maxSpeed),
            clockwise: (aDiff > 0)
        }, // первый привод вращается по часовой стрелки
        angleB: {
            angle: bAngle,
            speed: Math.min(bAngleSpeed, this.options.maxSpeed),
            clockwise: (bDiff < 0)
        } // второй привод вращается попротив часовой стрелки
    };
};

/**
 * Получает угол поворота привода для достижения нужной длины
 * @private
 */
Plotter.prototype._getAngle = function(lineDiff) {
    var startLineDiff = lineDiff;
    var radiusOfFirstDrive = this.options.radius;
    var angle = 0;
    var maxIteration = 0;

    do {
        var circleLength = 2 * Math.PI * radiusOfFirstDrive;

        if (lineDiff / circleLength > 0) {
            angle += 360;
            lineDiff -= circleLength;
            radiusOfFirstDrive += this.options.gage;
        } else {
            angle += 360 * lineDiff / circleLength;
            break;
        }

        maxIteration++;

        if (maxIteration > 10000) {
            var error = 'Exceeded the allowed number of iterations in determining the angle. Line diff: ' + startLineDiff;
            throw new Error(error);
            break;
        }

    } while(true);

    return Math.round(angle);
};

/**
 * Подготовливает данные для плоттера по JSON
 * @param json
 */
Plotter.prototype.parse = function(json){

};

module.exports = Plotter;
