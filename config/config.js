var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {

    test: {
        db: 'mongodb://localhost/selink_test',
        solr: {
            host: 'localhost',
            port: '8080',
            core : 'selink_test',
        },
        mail: {
            service: "Gmail",
            auth: {
                user: "joe.19840729.china@gmail.com",
                pass: "19840729"
            }
        },
        root: rootPath,
        app: {
            name: 'SELink [TEST]'
        }
    },

    development: {
        db: 'mongodb://localhost/selink',
        solr: {
            host: 'localhost',
            port: '8080',
            core : 'selink',
        },
        mail: {
            service: "Gmail",
            auth: {
                user: "joe.19840729.china@gmail.com",
                pass: "19840729"
            }
        },
        root: rootPath,
        app: {
            name: 'SELink [DEV]'
        }
    },

    staging: {
        db: 'mongodb://localhost/selink',
        solr: {
            host: 'localhost',
            port: '8080',
            core : 'selink',
        },
        mail: {
            port: 587,
            auth: {
                user: "administrator@selink.jp",
                pass: "ZSkikuD2O5"
            }
        },
        root: rootPath,
        app: {
            name: 'SELink [STG]'
        }
    },

    production: {
        db: 'mongodb://localhost/selink',
        solr: {
            host: 'localhost',
            port: '8080',
            core : 'selink',
        },
        mail: {
            port: 587,
            auth: {
                user: "administrator@selink.jp",
                pass: "ZSkikuD2O5"
            }
        },
        root: rootPath,
        app: {
            name: 'SELink'
        }
    }
};