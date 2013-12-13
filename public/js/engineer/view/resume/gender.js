define([
    'view/common/item-base',
    'text!template/resume/gender.html'
], function(
    BaseView,
    template) {

    var GenderEditor = BaseView.extend({

        className: 'sl-editable',

        item: 'gender',

        itemName: 'Gender',

        itemIcon: 'icon-leaf',

        template: template,

        /*Initializer*/
        initialize: function() {

            this.ui = _.extend({}, this.commonUI);

            this.events = _.extend({}, this.commonEvents, {
                // Update model when input's value was chenaged
                'click .btn-value': 'updateModel',
            });
        },

        /*After Render*/
        onRender: function() {

            // Listen to the universal-click, switch to view-mode when input lost focus
            // this.listenTo(vent, 'click:universal', this.switchToValue);

            // var gender = this.model.get(this.item);

            // this.$el.find(".btn-value").each(function() {
            //     if (gender == $.trim($(this).text()))
            //         $(this).button('toggle');
            // });

            // // Attach popover for remove button in edit panel
            // this._appendInfoOnRemoveBtn();
        },

        /*Update model when edit finished*/
        updateModel: function(event) {

            var self = this;

            // Get input value
            var newVal = $.trim($(event.target).text());

            // Prepare the date for model update
            var data = {};
            data[this.item] = newVal;

            // Save the model
            this.model.save(data, {
                // If save success
                success: function() {
                    // Update the view panel
                    self.ui.value.text(newVal);
                    // Switch to view panel
                    self.switchToValue();
                },
                // use patch
                patch: true
            });
        }

    });

    return GenderEditor;
});