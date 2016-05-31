var appendSlides = function (data, callback) {

    var steps = data;

    var htmltemplate = $('#step-template').html();
    $('#step-template').html('');
    var htmltempl = Handlebars.compile(htmltemplate);
    var count = 0;
    steps.forEach(function (step) {
        var templ = htmltempl;

        $.ajax({
            url: '/steps/' + step + '.html',
            success: function (data) {
                $('.slides').append(templ({
                    file: data
                }));
                count++;

                if (count === steps.length) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            },
            async: false
        });
    });
};


var initReveal = function () {


    Reveal.initialize({
        controls: true,
        progress: false,
        history: true,
        center: false,
        showNotes: false,
        transition: 'fade', // none/fade/slide/convex/concave/zoom
        dependencies: [

            {
                src: 'lib/js/classList.js', condition: function () {
                return !document.body.classList;
            }
            },
            {
                src: 'plugin/highlight/highlight.js', async: true, condition: function () {
                return !!document.querySelector('pre code');
            }, callback: function () {
                hljs.initHighlightingOnLoad();
                hljs.initHighlighting();
            }
            },
            {
                src: 'plugin/live-coding/live-coding.js', async: true, condition: function () {
                return !!document.body.classList;
            }
            },
            //{src: 'plugin/zoom-js/zoom.js', async: true},
            {src: 'plugin/notes/notes.js', async: true}
        ],
        width: 1280,
        height: 900,
        margin: 0.1,
        minScale: 0.2,
        maxScale: 1.5
    });

};


var preloadPictures = function (pictureUrls, callback) {
    var i,
        j,
        loaded = 0;

    for (i = 0, j = pictureUrls.length; i < j; i++) {
        (function (img, src) {
            img.onload = function () {
                if (++loaded == pictureUrls.length && callback) {
                    callback();
                }
            };

            // Use the following callback methods to debug
            // in case of an unexpected behavior.
            img.onerror = function () {
            };
            img.onabort = function () {
            };

            img.src = src;
        }(new Image(), pictureUrls[i]));
    }
};


function init(slidesDir) {
    var slidesDir = slidesDir || '';
    $.getJSON('/steps' + slidesDir + '/list.json', function (data) {

        appendSlides(data, function () {
            if ($('img').length === 0) {
                initReveal();
            } else {
                var imgsrc = [];
                $('img').each(function () {
                    imgsrc.push(this.src);
                });
                preloadPictures(imgsrc, function () {
                    initReveal();
                });
            }

        });

    });
}
