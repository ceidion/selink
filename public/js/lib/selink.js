(function($){

    $.fn.slFlip = function(color, callback) {
        return $(this).slAnimated('flip', color, callback);
    };

    $.fn.slSwing = function(color, callback) {
        return $(this).slAnimated('swing', color, callback);
    };

    $.fn.slWobble = function(color, callback) {
        return $(this).slAnimated('wobble', color, callback);
    };

    $.fn.slBounceOut = function(color, callback) {
        return $(this).slAnimated('bounceOut', color, callback);
    };

    $.fn.slBounceIn = function(color, callback) {
        return $(this).slAnimated('bounceIn', color, callback);
    };

    $.fn.slRollOut = function(color, callback) {
        return $(this).slAnimated('rollOut', color, callback);
    };

    $.fn.slRollIn = function(color, callback) {
        return $(this).slAnimated('rollIn', color, callback);
    };

    $.fn.slFlipOutX = function(color, callback) {
        return $(this).slAnimated('flipOutX', color, callback);
    };

    $.fn.slFlipInX = function(color, callback) {
        return $(this).slAnimated('flipInX', color, callback);
    };

    $.fn.slFlipOutY = function(color, callback) {
        return $(this).slAnimated('flipOutY', color, callback);
    };

    $.fn.slFlipInY = function(color, callback) {
        return $(this).slAnimated('flipInY', color, callback);
    };

    $.fn.slPulse = function(color, callback) {
        return $(this).slAnimated('pulse', color, callback);
    };

    $.fn.slAnimated = function(effect, color, callback) {

        var effectString = 'animated ' + effect + (color ? ' ' + color : '');

        if (!callback)
            callback = function() {
                $(this).removeClass(effectString);
            };

        $(this).addClass(effectString).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', callback);

        return $(this);
    };

})(jQuery);