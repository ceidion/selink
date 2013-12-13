var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {

    test: {
        db: 'mongodb://localhost/selink_test',
        root: rootPath,
        app: {
            name: 'Joe\'s Special Offer -- Test'
        }
    },

    development: {
        db: 'mongodb://localhost/selink',
        mail: {
            service: "Gmail",
            auth: {
                user: "joe.19840729.china@gmail.com",
                pass: "19840729"
            }
        },
        root: rootPath,
        app: {
            name: 'Joe\'s Special Offer -- Dev'
        }
    },

    production: {
        db: 'mongodb://localhost/selink',
        mail: {
            port: 587,
            auth: {
                user: "noreply@cvBakery.com",
                pass: "Joe840729"
            }
        },
        root: rootPath,
        app: {
            name: 'Joe\'s Special Offer'
        }
    }
};