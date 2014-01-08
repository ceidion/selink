require.config({

    baseUrl: "/js/engineer",

    paths: {
        // core library
        jquery: "../lib/jquery-2.0.3.min",
        'jquery-ui': "../lib/jquery-ui-1.10.3.custom.min",
        bootstrap: "../lib/bootstrap.min",
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        marionette: '../lib/backbone.marionette',
        'backbone.wreqr': '../lib/backbone.wreqr',
        'backbone.babysitter': '../lib/backbone.babysitter',
        'deep-model': '../lib/deep-model.min',
        text: '../lib/text',
        templates: 'template',
        // core theme
        ace: "../lib/uncompressed/ace",
        'ace-extra': "../lib/uncompressed/ace-extra",
        'ace-element': "../lib/uncompressed/ace-elements",
        // validator
        'validate-base': '../lib/uncompressed/jquery.validate',
        validate: '../lib/additional-methods.min',
        // pie chart
        'pie-chart': "../lib/jquery.easy-pie-chart.min",
        // calendar
        'full-calendar': "../lib/fullcalendar.min",
        // date time
        'datepicker-locale': "../lib/date-time/locales/bootstrap-datepicker.ja",
        datepicker: "../lib/date-time/bootstrap-datepicker.min",
        spinner: '../lib/fuelux/fuelux.spinner.min',
        moment: "../lib/date-time/moment-with-langs.min",
        // file upload
        'jquery.ui.widget': '../lib/jquery.ui.widget',
        iframetransport: '../lib/jquery.iframe-transport',
        fileupload: '../lib/jquery.fileupload',
        // input mask
        maskedinput: "../lib/jquery.maskedinput.min",
        chosen: '../lib/chosen.jquery.min',
        gritter: '../lib/jquery.gritter.min',
        colorbox: '../lib/jquery.colorbox-min',
        knob: '../lib/jquery.knob.min',
        wysiwyg: '../lib/bootstrap-wysiwyg.min',
        hotkeys: '../lib/jquery.hotkeys.min'
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
        'validate-base': {
            deps: ['jquery']
        },
        'validate': {
            deps: ['validate-base']
        },
        'pie-chart': {
            deps: ['jquery']
        },
        'full-calendar': {
            deps: ['jquery']
        },
        'datepicker': {
            deps: ['jquery']
        },
        'datepicker-locale': {
            deps: ['bootstrap', 'datepicker']
        },
        'spinner': {
            deps: ['jquery']
        },
        'fileupload': {
            deps: ['jquery', 'jquery.ui.widget', 'iframetransport']
        },
        'maskedinput': {
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
        'knob': {
            deps: ['jquery']
        },
        'hotkeys': {
            deps: ['jquery']
        },
        'wysiwyg': {
            deps: ['bootstrap', 'hotkeys']
        },
        'engineer': {
            deps: [
                'jquery-ui',
                'bootstrap',
                'marionette',
                'deep-model',
                'ace',
                'validate',
                'pie-chart',
                'full-calendar',
                'datepicker-locale',
                'spinner',
                'moment',
                'fileupload',
                'maskedinput',
                'chosen',
                'colorbox',
                'gritter',
                'knob',
                'wysiwyg'
            ]
        }
    }
});

require(['engineer'], function(engineer) {
    engineer.start();
});