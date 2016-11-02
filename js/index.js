function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var baseAPI = "http://crossorigin.me/http://www.colourlovers.com/api/palettes/top?format=json&numResults=20&resultOffset=",
    pageOffset = getRandomInt(1, 70),
    colorsObj = [],
    counter = 0,
    deg = 3;

$(function() {

    var jqxhr = $.getJSON(baseAPI + pageOffset, function(data) {
            console.log('Data Fetching...');
        })
        .done(function(data) {
            console.log('Data Received');
            for (var colourCounter = 0; colourCounter < data.length; colourCounter++) {
                colorsObj.push({
                    'title': data[colourCounter].title,
                    'colors': data[colourCounter].colors,
                    'url': data[colourCounter].url
                });
            }
        })
        .fail(function() {
            alert('There has been a problem loading data from ColorLovers. Please refresh this tab');
        })
        .always(function() {
            $('body').addClass('data-loaded');
            drawGrad();
        });
});

function drawGrad() {
    $('body').css('background-color', '#' + colorsObj[counter].colors[0]);
    $('div[class^="canvas"]').removeClass('active');
    $('.title-block').removeClass('active');
    setTimeout(function() {
        for (var i = 0; i < colorsObj[counter].colors.length; i++) {
            populate(
                $('.canvas-' + i),
                colorsObj[counter].title,
                colorsObj[counter].url,
                colorsObj[counter].colors[0],
                colorsObj[counter].colors[i]
            );
        }
        $('.canvas-' + deg).addClass('active');
        $('.title-block').addClass('active');
        updateColorLabels();
    }, 400);
}

function updateCounter(next) {
    if (next) {
        if ((counter + 1) < colorsObj.length) {
            counter++;
        } else {
            counter = 0;
        }
    } else {
        if ((counter - 1) < 0) {
            counter = colorsObj.length;
        } else {
            counter--;
        }
    }
    drawGrad();
    updateColorLabels();
}

function updateDeg(next) {
    $('div[class^="canvas"]').removeClass('active');
    if (next) {
        if ((deg + 1) < colorsObj[counter].colors.length) {
            deg++;
        } else {
            deg = 1;
        }
    } else {
        if ((deg - 1) < 1) {
            deg = (colorsObj[counter].colors.length - 1);
        } else {
            deg--;
        }
    }
    $('.canvas-' + deg).addClass('active');
    updateColorLabels();
}

function updateColorLabels() {
    $('#colour-1').text('#' + colorsObj[counter].colors[0]);
    $('#colour-2').text('#' + colorsObj[counter].colors[deg]);
}

function populate(elem, title, url, color1, color2) {
    elem.css('background', 'linear-gradient(90deg,#' + color1 + ' 0%, #' + color2 + ' 100%)');
    $('#title').text(title);
    $('#title').attr('href', url);
}

$(document).keydown(function(e) {
    $('.hint-container').addClass('used');
    switch (e.which) {
        case 37: // left
            updateCounter(false);
            $('.left').addClass('move');
            break;
        case 38: // up
            updateDeg(true);
            $('.up').addClass('move');
            break;
        case 39: // right
            updateCounter(true);
            $('.right').addClass('move');
            break;
        case 40: // down
            updateDeg(false);
            $('.down').addClass('move');
            break;
        default:
            return;
    }
    e.preventDefault();
});

$(document).keyup(function(e) {
    switch (e.which) {
        case 37: // left
            $('.left').removeClass('move');
            break;
        case 38: // up
            $('.up').removeClass('move');
            break;
        case 39: // right
            $('.right').removeClass('move');
            break;
        case 40: // down
            $('.down').removeClass('move');
            break;
        default:
            return;
    }
    e.preventDefault();
});

$('.up').click(function(e) {
    e.preventDefault();
    updateDeg(true);
});

$('.down').click(function(e) {
    e.preventDefault();
    updateDeg(false);
});

$('.left').click(function(e) {
    e.preventDefault();
    updateCounter(false);
});

$('.right').click(function(e) {
    e.preventDefault();
    updateCounter(true);
});