define([
    'text!common/template/people/detail/language.html'
], function(
    template
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // class name
        className: 'grid3 center',

        // after render
        onRender: function() {

            var self = this;

            // set up knob
            this.$el.find('.knob').knob({

                // custom draw
                'draw': function() {

                    // change label
                    $(this.i).val(this.cv + 'pt');

                    // change color by value
                    if (this.cv > 85)
                        this.fgColor = '#59a84b';
                    else if (this.cv > 70)
                        this.fgColor = '#2a91d8';
                    else if (this.cv > 50)
                        this.fgColor = '#f2bb46';
                    else if (this.cv > 30)
                        this.fgColor = '#ca5952';
                    else
                        this.fgColor = '#9585bf';

                    // below are copied from default knob
                    var c = this.g,                 // context
                        a = this.angle(this.cv),    // Angle
                        sat = this.startAngle,     // Start angle
                        eat = sat + a;             // End angle

                    c.lineWidth = 10;//this.lineWidth;

                    this.o.cursor
                        && (sat = eat - this.cursorExt)
                        && (eat = eat + this.cursorExt);

                    c.beginPath();
                        c.strokeStyle = this.o.bgColor;
                        c.arc(this.xy, this.xy, this.radius, this.endAngle, this.startAngle, true);
                    c.stroke();

                    c.beginPath();
                        c.strokeStyle = this.fgColor ;
                        c.arc(this.xy, this.xy, this.radius, sat, eat, false);
                    c.stroke();

                    this.i.css('color', this.fgColor);

                    return false;
                }
            });

        },

    });
});