define([
    'view/common/item-base',
    'text!template/resume/address.html'
], function(
    BaseView,
    template) {

    var AddressItem = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend(this.ui, {
                'zipCodeArea': '#zipCodeArea',
                'zipCode': '#zipCode',
                'address': '#address'
            });

            this.events = _.extend(this.events, {
                'change #zipCode': 'getAddress',
                'change #address': 'submitForm'
            });
        },

        // after render
        onRender: function() {

            var self = this;

            console.log(this.ui);
            console.log(this.events);

            // enable mask input
            this.$el.find('#zipCode').mask('999-9999');

            // call super class method append validator
            BaseView.prototype.onRender.call(this, {

                onfocusout: false,

                onkeyup: false,

                rules: {
                    address: {
                        maxlength: 80
                    }
                },

                messages: {
                    address: {
                        maxlength: "ご住所は80文字以内でご入力ください"
                    }
                }
            });
        },

        getAddress: function() {

            var self = this;

            $.ajax({

                // page url
                url: '/address/' + self.ui.zipCode.val().replace("-", ""),

                // method is get
                type: 'GET',

                // use json format
                dataType: 'json',

                // wait for 3 seconds
                timeout: 3000,

                // spin an icon
                beforeSend: function() {
                    self.ui.zipCodeArea.find('.input-group-addon')
                        .empty().append('<i class="icon-refresh icon-spin"><i>');
                },

                // success handler
                success: function(data) {
                    self.ui.address.val(data.state + " " + data.city + " " + data.street);
                    self.ui.address.trigger("change");
                },

                // remove spin icon
                complete: function() {
                    self.ui.zipCodeArea.find('.input-group-addon').empty().append("〒");
                }
            });
        },

        submitForm: function() {
            this.$el.find('form').submit();
        },

        getData: function() {
            return {
                zipCode: this.ui.zipCode.val(),
                address: this.ui.address.val()
            };
        },

        renderValue: function(data) {
            this.ui.value.text(this.ui.zipCode.val() + " " + this.ui.address.val());
        },

        successMsg: function(data) {
            return "住所は「" +　this.ui.zipCode.val() + " " + this.ui.address.val() + "」に更新しました。";
        }

    });

    return AddressItem;
});