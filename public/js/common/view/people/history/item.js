define([
    'text!common/template/people/history/item/employment.html',
    'text!common/template/people/history/item/education.html',
    'text!common/template/people/history/item/qualification.html',
], function(
    employmentTemplate,
    educationTemplate,
    qualificationTemplate
) {

    return Backbone.Marionette.ItemView.extend({

        // template
        getTemplate: function(){

            if (this.model.has('company'))
                return employmentTemplate;
            else if (this.model.has('school'))
                return educationTemplate;
            else
                return qualificationTemplate;
        },

        className: 'timeline-item clearfix',

        // initializer
        initialize: function() {
        },

        onRender: function() {
        }
    });

});