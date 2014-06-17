define([
    'common/model/base',
    'common/collection/base',
    'common/model/comment'
], function(
    BaseModel,
    BaseCollection,
    CommentModel
) {

    var Participants = BaseCollection.extend({

        url: function() {
            return this.document.url() + '/participants';
        }
    });

    var Invited = BaseCollection.extend({

        url: function() {
            return this.document.url() + '/invited';
        }
    });

    return BaseModel.extend({

        // Url root
        urlRoot: '/groups',

        // Constructor
        constructor: function() {

            // create participants collection inside model
            this.participants = new Participants(null, {document: this});

            // create invited collection inside model
            this.invited = new Invited(null, {document: this});

            // call super constructor
            Backbone.Model.apply(this, arguments);
        },

        // Parse data
        parse: function(response, options) {

            // if the group owner's id is user id
            if (response._owner._id === selink.userModel.id)
                // mark as my group
                response.isMine = true;
            else
                response.isMine = false;

            // if user's id exists in group's participants list
            // if (_.indexOf(response.participants, selink.userModel.id) >= 0)
            if (_.findWhere(response.participants, {_id: selink.userModel.id}))
                // mark as participated
                response.isParticipated = true;
            else
                response.isParticipated = false;

            // populate participants collection
            this.participants.set(response.participants, {parse: true, remove: false});
            // set participants number, for display in the profile of group
            response.memberNum = response.participants.length;
            delete response.participants;

            // populate invited collection
            this.invited.set(response.invited, {parse: true, remove: false});
            // set invitation number, for display in the profile of group
            response.invitationNum = response.invited.length;
            delete response.invited;

            return response;
        },

        validation: {
            name: {
                required: true,
                msg: "グループの名称を入力しよう！"
            }
        }

    });
});