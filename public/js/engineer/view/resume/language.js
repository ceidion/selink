define([
    'view/common/item-base',
    'text!template/resume/language.html'
], function(
    BaseView,
    template) {

    var LanguageItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-heart',

        // initializer
        initialize: function() {
            this.events = _.extend({}, this.events);
        },

        // after render
        onRender: function() {

            var self = this;

            // enable knob
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

                    c.lineWidth = this.lineWidth;

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
                },
                'release': function(value) {
                    // self.save();
                    self.model.set('weight', value);
                }
            });

            // enable chosen
            this.$el.find('select').chosen({
                width: "95%",
                disable_search_threshold: 10
            });

        },

        // getData: function() {
        //     return {
        //         language: this.$el.find('select').val(),
        //         weigth: this.$el.find('input').val()
        //     };
        // },

        // renderValue: function(data) {
        //     this.ui.value.text(data.language);
        // },

        // successMsg: function(data) {
        //     return "婚姻状況は「" +　data.marriage + "」に更新しました。";
        // }
    });

    return LanguageItem;
});