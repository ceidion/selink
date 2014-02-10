(function($){

    $.fn.slFlip = function(color, callback) {
        $(this).slAnimated('flip', color, callback);
    };

    $.fn.slSwing = function(color, callback) {
        $(this).slAnimated('swing', color, callback);
    };

    $.fn.slWobble = function(color, callback) {
        $(this).slAnimated('wobble', color, callback);
    };

    $.fn.slBounceOut = function(color, callback) {
        $(this).slAnimated('bounceOut', color, callback);
    };

    $.fn.slBounceIn = function(color, callback) {
        $(this).slAnimated('bounceIn', color, callback);
    };

    $.fn.slRollOut = function(color, callback) {
        $(this).slAnimated('rollOut', color, callback);
    };

    $.fn.slRollIn = function(color, callback) {
        $(this).slAnimated('rollIn', color, callback);
    };

    $.fn.slFlipOutX = function(color, callback) {
        $(this).slAnimated('flipOutX', color, callback);
    };

    $.fn.slFlipInX = function(color, callback) {
        $(this).slAnimated('flipInX', color, callback);
    };

    $.fn.slPulse = function(color, callback) {
        $(this).slAnimated('pulse', color, callback);
    };

    $.fn.slAnimated = function(effect, color, callback) {

        var effectString = 'animated ' + effect + (color ? ' ' + color : '');

        if (!callback)
            callback = function() {
                $(this).removeClass(effectString);
            };

        $(this).addClass(effectString).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', callback);
    };

})(jQuery);