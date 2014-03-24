require.config({

    baseUrl: "/js",

    paths: {
        // core library
        'jquery': "lib/jquery-2.0.3.min",
        'jquery-ui': "lib/jquery-ui-1.10.3.custom.min",
        'bootstrap': "lib/uncompressed/bootstrap",
        'underscore': 'lib/underscore',
        'backbone': 'lib/backbone',
        'marionette': 'lib/backbone.marionette',
        'backbone.wreqr': 'lib/backbone.wreqr',
        'backbone.babysitter': 'lib/backbone.babysitter',
        'backbone.validation': 'lib/backbone.validation.min',
        'deep-model': 'lib/deep-model.min',
        'text': 'lib/text',
        // core theme
        'ace': "lib/uncompressed/ace",
        'ace-extra': "lib/uncompressed/ace-extra",
        'ace-element': "lib/uncompressed/ace-elements",
        // pie chart
        'pie-chart': "lib/jquery.easy-pie-chart.min",
        // calendar
        'full-calendar': "lib/fullcalendar.min",
        'google-calendar': "lib/gcal",
        // date time
        'datepicker-locale': "lib/date-time/locales/bootstrap-datepicker.ja",
        'datepicker': "lib/date-time/bootstrap-datepicker",
        'timepicker': "lib/date-time/bootstrap-timepicker.min",
        'moment': "lib/date-time/moment-with-langs.min",
        // file upload
        'jquery.ui.widget': 'lib/jquery.ui.widget',
        'iframetransport': 'lib/jquery.iframe-transport',
        'fileupload': 'lib/jquery.fileupload',
        // input mask
        'maskedinput': "lib/jquery.maskedinput.min",
        'autosize': "lib/jquery.autosize.min",
        'chosen': 'lib/chosen.jquery.min',
        'gritter': 'lib/jquery.gritter.min',
        'colorbox': 'lib/jquery.colorbox-min',
        'flippant': 'lib/flippant.min',
        'knob': 'lib/jquery.knob.min',
        'wysiwyg': 'lib/bootstrap-wysiwyg.min',
        'hotkeys': 'lib/jquery.hotkeys.min',
        'isotope': 'lib/jquery.isotope',
        'slim-scroll': 'lib/jquery.slimscroll.min',
        'infinite-scroll': 'lib/jquery.infinitescroll.min',
        'tag': 'lib/uncompressed/bootstrap-tag',
        'typeahead': 'lib/uncompressed/typeahead.bundle',
        'selink': 'lib/selink',
        // 'socket.io': '../socket.io/socket.io.js',
        'socket.io': 'lib/socket.io',
        'app': 'employer/employer'
    },

    shim: {
        'jquery-ui': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'deep-model': {
            deps: ['backbone']
        },
        'ace-element': {
            deps: ['jquery']
        },
        'ace-extra': {
            deps: ['jquery']
        },
        'ace': {
            deps: ['ace-element', 'ace-extra']
        },
        'pie-chart': {
            deps: ['jquery']
        },
        'full-calendar': {
            deps: ['jquery']
        },
        'google-calendar': {
            deps: ['full-calendar']
        },
        'datepicker': {
            deps: ['jquery']
        },
        'datepicker-locale': {
            deps: ['bootstrap', 'datepicker']
        },
        'timepicker': {
            deps: ['jquery']
        },
        'fileupload': {
            deps: ['jquery', 'jquery.ui.widget', 'iframetransport']
        },
        'maskedinput': {
            deps: ['jquery']
        },
        'autosize': {
            deps: ['jquery']
        },
        'chosen': {
            deps: ['jquery']
        },
        'gritter': {
            deps: ['ace']
        },
        'colorbox': {
            deps: ['jquery']
        },
        'flippant': {
            deps: ['jquery']
        },
        'knob': {
            deps: ['jquery']
        },
        'hotkeys': {
            deps: ['jquery']
        },
        'wysiwyg': {
            deps: ['bootstrap', 'hotkeys']
        },
        'isotope': {
            deps: ['jquery']
        },
        'slim-scroll': {
            deps: ['jquery']
        },
        'infinite-scroll': {
            deps: ['jquery']
        },
        'tag': {
            deps: ['bootstrap']
        },
        'typeahead': {
            deps: ['bootstrap']
        },
        'selink': {
            deps: ['jquery']
        },
        'app': {
            deps: [
                'jquery-ui',
                'bootstrap',
                'marionette',
                'deep-model',
                'backbone.validation',
                'ace',
                'pie-chart',
                'full-calendar',
                'google-calendar',
                'datepicker-locale',
                'timepicker',
                'moment',
                'fileupload',
                'maskedinput',
                'autosize',
                'chosen',
                'colorbox',
                'flippant',
                'gritter',
                'knob',
                'wysiwyg',
                'isotope',
                'slim-scroll',
                'infinite-scroll',
                'tag',
                'typeahead',
                'selink',
                'socket.io'
            ]
        }
    }
});

require([
    'deep-model',
    'marionette',
    'moment',
    'backbone.validation',
    'fileupload',
    'autosize',
    'app'
], function(
    deepModel,
    marionette,
    moment,
    validation,
    fileupload,
    autosize,
    employer
) {
    employer.start();
});