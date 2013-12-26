define([
    'view/common/item-base',
    'text!template/resume/website.html'
], function(
    BaseView,
    template) {

    var WebSiteItem = BaseView.extend({

        // template
        template: template,

        // icon
        icon: 'icon-globe',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'input': 'input'
            });

            this.events = _.extend({}, this.events, {
                'change input': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    webSite: {
                        url: true
                    }
                },

                messages: {
                    webSite: {
                        url: "ウェブサイトは正しいURLフォーマットでご入力ください"
                    }
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                webSite: this.ui.input.val()
            };
        },

        renderValue: function(data) {

            if (!data.webSite) {
                this.ui.value.html(this.placeholder);
                return;
            }

            this.ui.value.text(data.webSite);
        },

        successMsg: function(data) {

            if (!data.webSite)
                return "個人サイトはクリアしました。";

            return "個人サイトは「" +　data.webSite + "」に更新しました。";
        }

    });

    return WebSiteItem;
});