define([], function() {

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: '<div class="text-muted bigger-125 center">登録していません</div>'
    });

    return EmptyView;
});