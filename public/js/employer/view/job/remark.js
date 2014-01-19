define([
    'common/view/item-base',
    'text!employer/template/job/remark.html'
], function(
    BaseView,
    template) {

    var RemarkItem = BaseView.extend({

        // template
        template: template,

        // for dnd add class here
        className: 'widget-box transparent',

        // icon
        icon: 'icon-briefcase',

        placeholder: '<div class="text-muted bigger-125 center">登録していません</div>',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            this.events = _.extend({}, this.events, {
                'mouseover .widget-header': 'attention',
                'focusout .sl-editor': 'save'
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

        attention: function(event) {
            $(event.target).find('i').addClass('animated swing');
            $(event.target).find('i').one('webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd', function() {
                $(this).removeClass('animated swing');
            });
        },

        getData: function() {
            return {
                remark: this.$el.find('.wysiwyg-editor').html()
            };
        },

        renderValue: function(data) {

            if (!data.remark) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.empty().html(data.remark);
        },

        successMsg: function(data) {

            if (!data.remark)
                return "自己紹介はクリアしました。";

            return "自己紹介は更新しました。";
        }

    });

    return RemarkItem;
});