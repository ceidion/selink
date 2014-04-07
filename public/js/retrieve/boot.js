require.config({

    baseUrl: '../js',

    paths: {
        // core library
        'jquery': 'lib/jquery-2.0.3.min',
        'jquery-ui': 'lib/jquery-ui-1.10.3.custom.min',
        'bootstrap': 'lib/bootstrap.min',
        'underscore': 'lib/underscore',
        'underscore.string': 'lib/underscore.string.min',
        'backbone': 'lib/backbone',
        'marionette': 'lib/backbone.marionette',
        'backbone.wreqr': 'lib/backbone.wreqr',
        'backbone.babysitter': 'lib/backbone.babysitter',
        'text': 'lib/text',
        // core theme
        'ace': 'lib/uncompressed/ace',
        'ace-extra': 'lib/uncompressed/ace-extra',
        'ace-element': 'lib/uncompressed/ace-elements',
        'app': 'retrieve/retrieve'
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
        'underscore.string': {
            deps: ['underscore']
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
        'app': {
            deps: [
                'jquery-ui',
                'bootstrap',
                'underscore.string',
                'marionette',
                'ace'
            ]
        }
    }
});

require(['app'], function(retrieve) {
    retrieve.start();
});