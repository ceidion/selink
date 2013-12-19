require.config({

    baseUrl: '/js/landing',

    paths: {
        // core library
        jquery: '../lib/jquery-2.0.3.min',
        'jquery-ui': '../lib/jquery-ui-1.10.3.custom.min',
        bootstrap: '../lib/bootstrap.min',
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        marionette: '../lib/backbone.marionette',
        'backbone.wreqr': '../lib/backbone.wreqr',
        'backbone.babysitter': '../lib/backbone.babysitter',
        text: '../lib/text',
        templates: 'template',
        // core theme
        ace: '../lib/uncompressed/ace',
        'ace-extra': '../lib/uncompressed/ace-extra',
        'ace-element': '../lib/uncompressed/ace-elements',
        // validator
        validate: '../lib/jquery.validate.min',
        gritter: '../lib/jquery.gritter.min'
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
        'validate': {
            deps: ['jquery']
        },
        'gritter': {
            deps: ['ace']
        },
        'landing': {
            deps: [
                'jquery-ui',
                'bootstrap',
                'marionette',
                'ace',
                'validate',
                'gritter'
            ]
        }
    }
});

require(['landing'], function(landing) {
    landing.start();
});