require.config({

    baseUrl: "/js/admin",

    paths: {
        jquery: "../lib/jquery.min",
        bootstrap: "../lib/bootstrap.min",
        underscore: '../lib/underscore',
        backbone: '../lib/backbone',
        marionette: '../lib/backbone.marionette',
        'backbone.wreqr': '../lib/backbone.wreqr',
        'backbone.babysitter': '../lib/backbone.babysitter',
        ace: "../lib/uncompressed/ace",
        "ace-extra": "../lib/uncompressed/ace-extra",
        "ace-element": "../lib/uncompressed/ace-elements",
        text: '../lib/text',
        templates: 'template'
    },

    shim: {
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
        'admin': {
            deps: [
                'bootstrap',
                'marionette',
                'ace'
            ]
        }
    }
});

require(['admin'], function(admin) {
    admin.start();
});