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
            this.events = _.extend({}, this.events, {
                'click .btn': 'save'
            });
        },

        // after render
        onRender: function() {
            this.$el.find('.knob').knob({
                'draw': function() {

                    $(this.i).val(this.cv + 'pt');

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

                    var c = this.g,                 // context
                        a = this.angle(this.cv)    // Angle
                        , sat = this.startAngle     // Start angle
                        , eat = sat + a;             // End angle

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
                }
            });

            // enable chosen
            this.$el.find('select').chosen({
                width: "95%",
                no_results_text: "該当国名は存在しません"
            });
        },

        getData: function(event) {

            $target = $(event.target);

            // TODO: this is not right
            if ($target.prop('tagName') == "I")
                return {
                    marriage: $target.closest('.btn').find('input').val()
                };
            else
                return {
                    marriage: $target.find('input').val()
                };
        },

        renderValue: function(data) {
            this.ui.value.text(data.marriage);
        },

        successMsg: function(data) {
            return "婚姻状況は「" +　data.marriage + "」に更新しました。";
        }
    });

    return LanguageItem;
});