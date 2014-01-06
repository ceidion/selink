define([
    'view/common/item-base',
    'text!template/resume/skill.html'
], function(
    BaseView,
    template) {

    var SkillItem = BaseView.extend({

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

        // after show
        onShow: function() {
            this.$el.find('.knob').knob();
            // $('.easy-pie-chart.percentage').each(function(){
            // var barColor = $(this).data('color') || '#555';
            // var trackColor = '#E2E2E2';
            // var size = parseInt($(this).data('size')) || 72;
            // $(this).easyPieChart({
            //     barColor: barColor,
            //     trackColor: trackColor,
            //     scaleColor: false,
            //     lineCap: 'butt',
            //     lineWidth: parseInt(size/10),
            //     animate:1000,
            //     size: size
            // }).css('color', barColor);
            // });
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

    return SkillItem;
});