define([
    'view/common/item-base',
    'text!template/case/create.html'
], function(
    BaseView,
    template) {

    var CaseCreateView = BaseView.extend({

        // template
        template: template,

        // initializer
        initialize: function() {

            this.ui = _.extend({}, this.ui, {
                'title': 'input[name="title"]',
                'allDay': 'input[name="allDay"]',
                'startDate': 'input[name="startDate"]',
                'startTime': 'input[name="startTime"]',
                'endDate': 'input[name="endDate"]',
                'endTime': 'input[name="endTime"]',
                'memo': '.wysiwyg-editor',
                'removeBtn': '.btn-remove',
                'saveBtn': '.btn-save'
            });

            this.events = _.extend({}, this.events, {
                'change input[name="allDay"]': 'setAllDay',
                'click .btn-save': 'saveEvent',
                'click .btn-remove': 'removeEvent'
            });
        },

        // after render
        onRender: function() {

            this.ui.memo.ace_wysiwyg({
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

            // append data picker
            this.$el.find('input[name="startDate"],input[name="endDate"]').datepicker({
                // autoclose: true,
                format: 'yyyy/mm/dd',
                clearBtn: true,
                todayBtn: 'linked',
                language: 'ja'
            });

            this.$el.find('input[name="startTime"],input[name="endTime"]').timepicker({
                minuteStep: 1,
                showMeridian: false,
                defaultTime: false
            });

            // enable mask input
            this.$el.find('input[name="startDate"],input[name="endDate"]').mask('9999/99/99');
            this.$el.find('input[name="startTime"],input[name="endTime"]').mask('99:99');

        },

        saveEvent: function() {

            var startDate = new Date(this.ui.startDate.val()),
                endDate = new Date(this.ui.endDate.val()),
                startTime = this.ui.startTime.val() ? this.ui.startTime.val().split(':') : ["0","0"],
                endTime = this.ui.endTime.val() ? this.ui.endTime.val().split(':') : ["0","0"];

            var allDay = this.ui.allDay.is(':checked') ? true : false;

            startDate.setHours(Number(startTime[0]) + 9);
            startDate.setMinutes(Number(startTime[1]));
            endDate.setHours(Number(endTime[0]) + 9);
            endDate.setMinutes(Number(endTime[1]));

            this.model.set({
                title: this.ui.title.val(),
                className: this.$el.find('input[name="label"]:checked').val(),
                allDay: allDay,
                start: startDate,
                end: endDate,
                memo: this.ui.memo.html()
            });

            if (this.model.isNew()) {
                this.collection.add(this.model.toJSON());
            }
        },

        removeEvent: function() {
            this.collection.remove(this.model);
        }
    });

    return CaseCreateView;
});