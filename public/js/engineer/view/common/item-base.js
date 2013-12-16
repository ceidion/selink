define([], function() {

    var BaseItem = Backbone.Marionette.ItemView.extend({

        /*
            Common events may happend
        */
        commonEvents: {
            // Switch to edit-mode when the div was clicked
            'click': 'switchToEditor'
        },

        commonUI: {
            value: '.sl-value',
            editor: '.sl-editor'
        },

        /*
            Switch sl-editor from view-mode to edit-mode
        */
        switchToEditor: function() {

            var self = this;

            // fadeOut view panel
            this.ui.value.fadeOut('fast', function() {
                // slideDown edit panel
                self.ui.editor.slideDown('fast');
                // mark this editor as opened
                self.$el.addClass('sl-editor-open');
            });
        },

        /*========================= remove button part =================================*/
        /*
            Remove item
            SubClass should override this method to define how to remove item.
        */
        removeItem: function() {

            var self = this;

            var data = this.model.get('setting');
            data[this.item] = false;

            // save the model
            this.model.save({
                setting: data
            }, {

                // if save success
                success: function() {
                    // slide up editor
                    self.$el.slideUp('fast', function() {

                        vent.trigger('resume:itemRemoved', {
                            item: self.item,
                            itemName: self.itemName,
                            itemIcon: self.itemIcon
                        });

                        // dispose the view
                        self.close();
                    });
                },
                // use patch
                patch: true
            });
        },

        /*========================= delete button part =================================*/
        /*
            Show a confirm dialog when user click delete button
        */
        deleteConfirm: function() {
            // append confirm dialog on delete buttom
            this._appendConfOnDeleteBtn();
            // show it up
            this.ui.deleteBtn.popover('show');
        },

        /*
            Delete item when user click OK
            SubClass should override this method to define how to delete item.
        */
        deleteItem: function() {},

        /*
            Do nothing but switch helper info when user click NO
        */
        deleteCancel: function() {
            // append normal info helper on delete button
            this._appendInfoOnDeleteBtn();
        },

        /*
            Display error info for editor
        */
        showError: function(errors) {

            var self = this;

            // clear previous errors
            this.clearError();

            // setup error flag
            this.err = true;

            _.each(errors, function(error) {
                // highlight the input
                error.target.closest('.sl-input').addClass('control-group error');
                // attach popover for specified control
                self._appendErrOn(error.target, {
                    title: error.title,
                    content: error.message
                });
            });
        },

        /*
            Clear error flag and style
        */
        clearError: function() {
            // clear error flag
            this.err = false;
            // clear error style on the input
            this.$el.find('.sl-input').removeClass('control-group error');
        },

        /*
            Generic function for append popover on specific element
        */
        _appendInfoOn: function(target, options) {

            // do nothing if target is not exists
            if (!target) return;

            // destroy previous popover
            target.popover('destroy');

            // default option
            var defaultOpt = {
                placement: 'bottom',
                trigger: 'hover',
                html: true
            };

            // attach a new popover
            target.popover(_.extend(defaultOpt, options));
        },

        /**/
        _appendErrOn: function(target, options) {

            if (options.title)
                options.title = '<div class="text-error">"' + options.title + '" is incorrect.</div>';

            if (options.content)
                options.content += '<br/><small class="text-error">This item is not saved.</small>';

            this._appendInfoOn(target, options);
        },

        /**/
        _appendInfoOnRemoveBtn: function() {

            this._appendInfoOn(this.ui.removeBtn, {
                title: 'Hide "' + this.itemName + '" from my resume',
                content: '"' + this.itemName + '" will not be shown on resume.'
            });
        },

        /**/
        _appendInfoOnDeleteBtn: function() {

            this._appendInfoOn(this.ui.deleteBtn, {
                title: 'Delete this "' + this.itemName + '" item',
                content: 'This item of "' + this.itemName + '" will be delete permanently.'
            });
        },

        /**/
        _appendConfOnDeleteBtn: function() {

            this._appendInfoOn(this.ui.deleteBtn, {
                title: 'Are you sure to delete "' + this.itemName + '" ?',
                content: 'Your input will be deleted permanently.<br>\
                        <button class="btn btn-small btn-danger btn-confirm">Yes</button>  \
                        <button class="btn btn-small btn-warning btn-cancel">No</button>',
                trigger: 'click'
            });
        },

        _appendDatePicker: function(traget, options) {

            var self = this;

            // default option
            var defaultOpt = {
                format: 'yyyy/mm/dd',
                language: 'en',
                startView: 2,
                forceParse: false,
                todayHighlight: true
            };

            traget.datepicker(_.extend(defaultOpt, options))
                .on('changeDate', function(e) {
                traget.datepicker('hide');
            });
        },
    });

    return BaseItem;
});