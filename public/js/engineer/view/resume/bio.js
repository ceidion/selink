define([
    'view/common/item-base',
    'text!template/resume/bio.html'
], function(
    BaseView,
    template) {

    var BioItem = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-quote-left',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            this.events = _.extend({}, this.events, {
                'change input': 'save'
            });
        },

        // after render
        onRender: function() {
            this.$el.find('.wysiwyg-editor').ace_wysiwyg({
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

        getData: function() {
            return {
                telNo: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.telNo) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.telNo);
        },

        successMsg: function(data) {

            if (!data.telNo)
                return "電話番号はクリアしました。";

            return "電話番号は「" +　data.telNo + "」に更新しました。";
        }

    });

    return BioItem;
});