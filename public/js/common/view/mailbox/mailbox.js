define([
    'text!common/template/mailbox/mailbox.html',
    'common/collection/messages',
    'common/view/mailbox/write'
], function(
    template,
    MessagesModel,
    WriteView
) {

    // mailbox view
    var MailBoxView = Backbone.Marionette.Layout.extend({

        // template
        template: template,

        className: 'col-xs-12',

        // events
        events: {
            'click': 'closeEditor'
        },

        // regions
        regions: {
            writeRegion: '#write-area',
        },

        // initializer
        initialize: function() {

            // create messages model(collection) from user model
            this.sentsModel = new MessagesModel(this.model.get('messages'), {parse: true});
            this.sentsModel.document = this.model;

            // create component
            this.writeView = new WriteView({
                collection: this.sentsModel
            });
        },

        // after render
        onRender: function() {
            // show every component
            this.writeRegion.show(this.writeView);
        },

        // after show
        onShow: function() {
            this.$el.addClass('animated fadeInRight');
        },

        // profile view handle the click event
        // -- switch component in editor mode to value mode
        // *from x-editable*
        closeEditor: function(e) {
            var $target = $(e.target), i,
                exclude_classes = ['.editable-container',
                                   '.ui-datepicker-header',
                                   '.datepicker', //in inline mode datepicker is rendered into body
                                   '.modal-backdrop',
                                   '.bootstrap-wysihtml5-insert-image-modal',
                                   '.bootstrap-wysihtml5-insert-link-modal'
                                   ];

            //check if element is detached. It occurs when clicking in bootstrap datepicker
            if (!$.contains(document.documentElement, e.target)) {
              return;
            }

            //for some reason FF 20 generates extra event (click) in select2 widget with e.target = document
            //we need to filter it via construction below. See https://github.com/vitalets/x-editable/issues/199
            //Possibly related to http://stackoverflow.com/questions/10119793/why-does-firefox-react-differently-from-webkit-and-ie-to-click-event-on-selec
            if($target.is(document)) {
               return;
            }

            //if click inside one of exclude classes --> no nothing
            for(i=0; i<exclude_classes.length; i++) {
                 if($target.is(exclude_classes[i]) || $target.parents(exclude_classes[i]).length) {
                     return;
                 }
            }

            //close all open containers (except one - target)
            this.closeOthers(e.target);
        },

        // close all open containers (except one - target)
        closeOthers: function(element) {

            $('.sl-editor-open').each(function(i, el){

                var $el = $(el);

                //do nothing with passed element and it's children
                if(el === element || $el.find(element).length) {
                    return;
                }

                if($el.find('.form-group').hasClass('has-error')) {
                    return;
                }

                // slide up the edit panel
                $el.find('.sl-editor').slideUp('fast', function() {
                    // fadeIn view panel
                    $el.find('.sl-value').fadeIn('fast');
                });

                $el.removeClass('sl-editor-open');
            });
        }
    });

    return MailBoxView;
});