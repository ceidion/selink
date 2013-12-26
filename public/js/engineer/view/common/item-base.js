define([], function() {

    var BaseItem = Backbone.Marionette.ItemView.extend({

        // placeholder for empty value
        placeholder: '<span class="text-muted">クリックして編集</span>',

        // common events
        events: {
            // Switch to edit-mode when the div was clicked
            'click': 'switchToEditor'
        },

        // common ui
        ui: {
            value: '.sl-value',
            editor: '.sl-editor'
        },

        // Switch sl-editor from view-mode to edit-mode
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

        // subclass call this as needed
        onRender: function(options) {

            var self = this;

            // append validator
            this.$el.find('form').validate(_.extend({}, {

                highlight: function (e) {
                    $(e).addClass('tooltip-error')
                        .closest('.form-group').addClass('has-error')
                        .closest('.sl-editor').addClass('animated-input-error');
                },

                unhighlight: function(e) {
                    $(e).removeClass('tooltip-error').tooltip('destroy')
                        .closest('.form-group').removeClass('has-error')
                        .closest('.sl-editor').removeClass('animated-input-error');
                },

                success: function (e) {
                    $(e).remove();
                },

                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent()).addClass('hidden');
                    element.tooltip({
                        placement: 'bottom',
                        title: error.text()
                    });
                },

                submitHandler: function (form) {
                    self.save();
                }

            }, options));
        },

        // update model
        save: function(event) {

            // when model exists
            if(this.model) {

                var self = this,
                    data = this.getData(event),
                    icon = this.icon ? this.icon : 'icon-ok';

                // save model
                this.model.save(data, _.extend({

                    // success handler
                    success: function(model, response, options) {

                        self.renderValue(data);

                        $.gritter.add({
                            text: '<i class="' + icon + ' icon-2x animated pulse"></i>&nbsp;&nbsp;' + self.successMsg(data),
                            class_name: 'gritter-success'
                        });
                    },

                    // error handler
                    error: function(model, xhr, options) {

                        var error = $.parseJSON(xhr.responseText);

                        $.gritter.add({
                            title: error.title,
                            text: error.msg,
                            sticky: true,
                            class_name: 'gritter-error gritter-center',
                        });
                    },

                    // use patch
                    patch: true

                }, this.saveOpt));
            }
        },

        // subclass should provide these methods
        getData: function() {},

        renderValue: function(data) {},

        successMsg: function(data) {}
    });

    return BaseItem;
});