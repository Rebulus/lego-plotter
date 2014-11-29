var CELL_NUMBER = 10;
var CELL_WIDTH = 10;
var MARGIN = 40;

var paper = Raphael(document.getElementsByClassName('grid')[0],
    CELL_WIDTH * CELL_NUMBER + MARGIN * (CELL_NUMBER - 1) - CELL_WIDTH / 2,
    CELL_WIDTH * CELL_NUMBER + MARGIN * (CELL_NUMBER - 1) - CELL_WIDTH / 2);

function getCoords(e) {
    var $target = $(e.target);

    return {
        x: ($target.data('x') - 1) * (CELL_WIDTH + MARGIN),
        y: ($target.data('y') - 1) * (CELL_WIDTH + MARGIN)
    };
}

jQuery(function($) {
    var pathPart = '';
    var isEditing = false;
    var currentPath;

    var coords;

    var offset = $('svg').offset();
    var svgX = offset.left;
    var svgY = offset.top;

    $('.grid').click('.cell', function(e) {
        coords = getCoords(e);

        if (!isEditing) {
            isEditing = true;
            pathPart += 'M' + coords.x + ',' + coords.y;
        } else {
            pathPart += 'L' + coords.x + ',' +  coords.y;
            paper.path(pathPart);
            pathPart = '';
            isEditing = false;

            if (currentPath) {
                $(currentPath.node).remove();
            }
        }

        $(e.target).addClass('selected');
    }).mousemove(function(e) {
        if (!isEditing) {
            return false;
        }

        if (currentPath) {
            $(currentPath.node).remove();
        }

        coords = getCoords(e);
        currentPath = paper.path(pathPart + 'L' + Math.round(e.pageX - svgX) + ',' +  Math.round(e.pageY - svgY));
        currentPath.attr('stroke', '#5C5C5C');

    });

    $('form').submit(function() {
        $('[name="svg"]').val($(paper.canvas).html());
    });
});
