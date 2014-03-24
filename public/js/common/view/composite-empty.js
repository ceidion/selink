define([], function() {

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: '<div class="empty-view text-muted bigger-125 center clearfix"><div>まだ登録していません<br/>ボタンをクリックして追加できます</div></div>'
    });

    return EmptyView;
});