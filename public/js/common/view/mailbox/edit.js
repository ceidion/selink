define([
    'common/view/item-base',
    'text!common/template/mailbox/write.html',
    'common/model/message'
], function(
    BaseView,
    template,
    MessageModel) {

    var WriteMailView = BaseView.extend({

        // template
        template: template,

        // this view is a modal dialog
        // className: 'row',

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'recipient': 'input[name="recipient"]',
                'subject': 'input[name="subject"]',
                'message': '.wysiwyg-editor'
            });

            this.events = _.extend({}, this.events, {
                'click .btn-send': 'sendMessage',
                'click .btn-remove': 'removeEvent'
            });

            // create an empty message object
            this.model = new MessageModel();
        },

        // after render
        onRender: function() {

            // initiate wysiwyg eidtor for memo
            this.ui.message.ace_wysiwyg({
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

            // bind validation on it
            Backbone.Validation.bind(this);

        },

        onShow: function() {
            this.$el.find('input[type=file]').ace_file_input({
                no_file:'添付ファイルありません',
                btn_choose:'クリックして選択',
                btn_change:'クリックして変更',
            });

            // instantiate the bloodhound suggestion engine
            var numbers = new Bloodhound({
              datumTokenizer: function(d) {
                if (d.firstName) {
                    return Bloodhound.tokenizers.whitespace(d.firstName);
                }
                else return ''
                },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote: '/suggestUser?initial=%QUERY'
            });

            // initialize the bloodhound suggestion engine
            numbers.initialize();

            this.$el.find('input[name="recipient"]').tag({
                placeholder: "宛先の氏名をご入力してください",
                source: numbers.ttAdapter()
            });
        },

        sendMessage: function() {

            // console.log(this.getData());

            // var errors = this.model.preValidate(this.getData());

            // if (!_.isEmpty(errors)) {
            //     this.showError(errors);
            // } else {
            //     console.log(errors);
            //     this.collection.create();
            // }

            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/selink/mobile/api/employee.htm',
                data: {
                    pageAction: 'getEmployeeList'
                },
                timeout: 50000,
                // use json format
                dataType: 'jsonp',

                jsonp: 'jsonp',
                success: function(data) {
                    $.ajax({
                        type: 'POST',
                        url: '/import',
                        data: {engineers : data},
                        // use json format
                        dataType: 'json',
                        success: function(data) {

                        },
                        error: function() {
                            console.log('suck');
                        }
                    });
                },
                error: function() {
                    console.log('suck');
                }
            });
        },

        getData: function() {
            return {
                recipients: this.ui.recipient.val(),
                subject: this.ui.subject.val(),
                message: this.ui.message.html()
            };
        }

        // // save event
        // saveEvent: function() {

        //     // if input value checking ok
        //     if (this.inputValid()) {

        //         // produce start/end datetime
        //         var startDate = new Date(this.ui.startDate.val()),
        //             endDate = new Date(this.ui.endDate.val()),
        //             startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
        //             endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

        //         startDate.setHours(Number(startTime[0]));
        //         startDate.setMinutes(Number(startTime[1]));
        //         endDate.setHours(Number(endTime[0]));
        //         endDate.setMinutes(Number(endTime[1]));

        //         // produce allDay value
        //         var allDay = this.ui.allDay.is(':checked') ? true : false;

        //         // set value to model
        //         this.model.set({
        //             title: this.ui.title.val(),
        //             className: this.$el.find('input[name="label"]:checked').val(),
        //             allDay: allDay,
        //             start: startDate,
        //             end: endDate,
        //             memo: this.ui.memo.html()
        //         });

        //         // if this model is a new event
        //         if (this.model.isNew()) {
        //             // add it to eventcollection
        //             this.collection.add(this.model.toJSON());
        //         }
        //     }
        // },

        // remove event
        // removeEvent: function() {
        //     this.collection.remove(this.model);
        // },

        // // checking input value
        // inputValid: function() {

        //     // remove all error
        //     this.$el.find('input')
        //         .removeClass('tooltip-error').tooltip('destroy')
        //         .closest('.form-group').removeClass('has-error')
        //         .find('i').removeClass('animated-input-error');

        //     // check input
        //     var errors = this.model.preValidate({
        //         title: this.ui.title.val(),
        //         startDate: this.ui.startDate.val(),
        //         endDate: this.ui.endDate.val(),
        //     }) || {};

        //     // check wheter end date is after start date
        //     if (this.ui.startDate.val() && this.ui.endDate.val()) {

        //         // looks very bad, but work
        //         var startDate = new Date(this.ui.startDate.val()),
        //             endDate = new Date(this.ui.endDate.val()),
        //             startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
        //             endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

        //         startDate.setHours(Number(startTime[0]));
        //         startDate.setMinutes(Number(startTime[1]));
        //         endDate.setHours(Number(endTime[0]));
        //         endDate.setMinutes(Number(endTime[1]));

        //         if (moment(startDate).isAfter(endDate))
        //             errors.endDate = errors.endTime = "開始日より後の時間をご入力ください";
        //     }

        //     // if got input error
        //     if (!_.isEmpty(errors)) {

        //         // append error message for every input
        //         for(var key in errors) {
        //             this.$el.find('input[name="' + key + '"]')
        //             .addClass('tooltip-error').tooltip({
        //                 placement: 'bottom',
        //                 title: errors[key]
        //             })
        //             .closest('.form-group').addClass('has-error')
        //             .find('i').addClass('animated-input-error');
        //         }

        //         // return not valid
        //         return false;
        //     } else {
        //         // return valid
        //         return true;
        //     }
        // }
    });

    return WriteMailView;
});