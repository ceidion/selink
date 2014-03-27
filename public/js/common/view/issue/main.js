define([
    'text!common/template/issue/main.html',
], function(
    template
) {

    var IssueModel = Backbone.DeepModel.extend({

        idAttribute: "_id",

        urlRoot: '/issues'
    });

    return Backbone.Marionette.ItemView.extend({

        // template
        template: template,

        // this view is a modal dialog
        className: 'modal-dialog',

        // ui
        ui: {
            issue: '.wysiwyg-editor'
        },

        // events
        events: {
            'click .btn-save': 'onSave'
        },

        // initializer
        initialize: function() {

            this.model = new IssueModel();
        },

        onRender: function() {

            // enable wysiwyg editor
            this.ui.issue.ace_wysiwyg({
                toolbar:
                [
                    'font',
                    null,
                    'fontSize',
                    null,
                    {name:'bold', className:'btn-info'},
                    {name:'italic', className:'btn-info'},
                    {name:'strikethrough', className:'btn-info'},
                    {name:'underline', className:'btn-info'},
                    null,
                    {name:'insertunorderedlist', className:'btn-success'},
                    {name:'insertorderedlist', className:'btn-success'},
                    {name:'outdent', className:'btn-purple'},
                    {name:'indent', className:'btn-purple'},
                    null,
                    {name:'justifyleft', className:'btn-primary'},
                    {name:'justifycenter', className:'btn-primary'},
                    {name:'justifyright', className:'btn-primary'},
                    {name:'justifyfull', className:'btn-inverse'},
                    null,
                    {name:'createLink', className:'btn-pink'},
                    {name:'unlink', className:'btn-pink'},
                    null,
                    {name:'insertImage', className:'btn-success'},
                    null,
                    'foreColor',
                    null,
                    {name:'undo', className:'btn-grey'},
                    {name:'redo', className:'btn-grey'}
                ],
                'wysiwyg': {
                    // fileUploadError: showErrorAlert
                }
            }).prev().addClass('wysiwyg-style3');
        },

        onSave: function() {

            this.model.save('content', this.ui.issue.html(), {
                success: function() {
                    selink.modalArea.$el.modal('hide');
                },
                silent: true,
                patch: true,
                wait: true
            });
        }

    });
});