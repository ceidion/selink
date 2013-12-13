define([
    'view/common/item-base',
    'text!template/resume/name.html'
], function(
    BaseView,
    template) {

    var NameEditor = BaseView.extend({

        className: 'sl-editable',

        item: 'name',

        itemName: "Name",

        template: template,

        /*Initializer*/
        initialize: function() {

            this.ui = _.extend({}, this.commonUI, {
                inputFirstName: 'input[name="firstName"]',
                inputLastName: 'input[name="lastName"]',
                areaName: '#nameArea'
            });

            this.events = _.extend({}, this.commonEvents, {
                // Update model when input's value was chenaged
                'change input[name="firstName"]': 'updateFirstName',
                'change input[name="lastName"]': 'updateLastName'
            });
        },

        /*After Render*/
        onRender: function() {

            // Listen to the universal-click, switch to view-mode when input lost focus
            // this.listenTo(vent, 'click:universal', this.switchToValue);

            // Attach popover for input control in edit panel
            this._appendInfoOnInput();
        },

        /*Validate user input value*/
        validate: function() {

            var firstName = this.ui.inputFirstName.val();
            var lastName = this.ui.inputLastName.val();
            var errors = [];

            if (firstName.length > 20)
                errors.push({
                    target: this.ui.inputFirstName,
                    title: "First Name",
                    message: 'Please input your first name in 20 characters.'
                });

            if (lastName.length > 20)
                errors.push({
                    target: this.ui.inputLastName,
                    title: "Last Name",
                    message: 'Please input your last name in 20 characters.'
                });

            return errors;
        },

        updateFirstName: function() {

            var errors = this.validate();
            if (errors.length) {
                this.showError(errors);

                if (_.contains(_.pluck(errors, 'target'), this.ui.inputFirstName))
                    return;
            } else {
                this.clearError();
                // append normal info help on editor
                this._appendInfoOnInput();
            }

            // Get input value
            var newVal = this.ui.inputFirstName.val();
            this.updateModel({
                firstName: newVal
            });
        },

        updateLastName: function() {

            var errors = this.validate();
            if (errors.length) {
                this.showError(errors);

                if (_.contains(_.pluck(errors, 'target'), this.ui.inputLastName))
                    return;
            } else {
                this.clearError();
                // append normal info help on editor
                this._appendInfoOnInput();
            }

            // Get input value
            var newVal = this.ui.inputLastName.val();
            this.updateModel({
                lastName: newVal
            });
        },

        /*Update model when edit finished*/
        updateModel: function(data) {

            var self = this;

            // Save the model
            this.model.save(data, {

                // If save success
                success: function() {
                    // Update the view panel
                    self._renderValue();
                    // Switch to view panel
                    self.switchToValue();
                },
                // use patch
                patch: true
            });
        },

        _renderValue: function() {

            var firstName = this.ui.inputFirstName.val();
            var lastName = this.ui.inputLastName.val();

            this.ui.value.empty();

            if (!firstName && !lastName) {

                this.ui.value.append('<h2 class="sl-placeholder">Your Name</h2>');

            } else {

                this.ui.value.append('<h2>' + firstName + '&nbsp;' + lastName + '</h2>');
            }
        },

        _appendInfoOnInput: function() {
            this._appendInfoOn(this.ui.inputFirstName, {
                title: "First Name",
                content: "Please input your first name."
            });
            this._appendInfoOn(this.ui.inputLastName, {
                title: "Last Name",
                content: "Please input your last name."
            });
        }

    });

    return NameEditor;
});