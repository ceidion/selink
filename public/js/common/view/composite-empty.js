define([], function() {

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: '<div class="empty-view text-muted bigger-125 center clearfix"><div class="col-xs-2"><i class="icon-plus icon-3x"></i></div><div class="col-xs-10">まだ登録していません<br/>ボタンをクリックして追加できます</div></div>'
    });

    return EmptyView;
});