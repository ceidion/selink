define([
    'common/view/item-base',
    'text!admin/template/data/skill/skill.html'
], function(
    BaseView,
    template) {

    var SkillItem = BaseView.extend({

        // template
        template: template,

        className: 'widget-container-span col-sm-3',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {});

            this.events = _.extend({}, this.events, {
                'click .widget-body': 'getWikis'
            });

        },

        onRender: function() {
        },

        getWikis: function() {

            var self = this;
            $.ajax({
                type: 'GET',
                url: 'http://api.stackexchange.com/2.1/tags/' + encodeURIComponent(self.model.get('name')) + '/wikis',
                data: {
                    site: 'stackoverflow'
                },
                // use json format
                dataType: 'jsonp',

                jsonp: 'jsonp',
                success: function(data) {
                    self.model.set('wikis', data.items[0].excerpt);
                    self.render();
                },
                error: function() {
                    console.log('suck');
                }
            });

        },

        updateModel: function() {

            var skill = this.ui.input.val();

            this.model.set('skill', skill);
            if (skill)
                this.$el.find('.pull-left').empty().text(skill);
        },

        removeModel: function() {

            var self = this;

            this.$el.slBounceOut('', function(){
                $(this).removeClass('animated bounceOut');
                self.model.collection.remove(self.model);
            });
        }

    });

    return SkillItem;
});