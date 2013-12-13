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
        text: '../lib/text',
        templates: 'template',
        // core theme
        ace: "../lib/uncompressed/ace",
        "ace-extra": "../lib/uncompressed/ace-extra",
        "ace-element": "../lib/uncompressed/ace-elements",
        // x-editable
        "bootstrap-editable": "../lib/x-editable/bootstrap-editable.min",
        "ace-editable": "../lib/x-editable/ace-editable.min",
        "pie-chart": "../lib/jquery.easy-pie-chart.min",
        "full-calendar": "../lib/fullcalendar.min"
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
        'ace-element': {
            deps: ['jquery']
        },
        'ace-extra': {
            deps: ['jquery']
        },
        'ace': {
            deps: ['ace-element', 'ace-extra']
        },
        'bootstrap-editable': {
            deps: ['bootstrap']
        },
        'ace-editable': {
            deps: ['bootstrap-editable']
        },
        'pie-chart': {
            deps: ['jquery']
        },
        'full-calendar': {
            deps: ['jquery']
        },
        'engineer': {
            deps: [
                'jquery-ui',
                'bootstrap',
                'marionette',
                'ace',
                'ace-editable',
                'pie-chart',
                "full-calendar"
            ]
        }
    }
});

require(['engineer'], function(engineer) {
    engineer.start();
});