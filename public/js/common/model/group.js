define([
    'common/model/base',
    'common/collection/base',
    'common/model/event'
], function(
    BaseModel,
    BaseCollection,
    EventModel
) {

    return BaseModel.extend({

        // Url root
        urlRoot: '/groups',

        // Parse data
        parse: function(response, options) {

            // if the group owner's id is user id
            if (response._owner._id === selink.user.id)
                // mark as my group
                response.isMine = true;
            else
                response.isMine = false;

            // if user's id exists in group's participants list
            if (_.indexOf(response.participants, selink.user.id) >= 0)
                // mark as participated
                response.isParticipated = true;
            else
                response.isParticipated = false;

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