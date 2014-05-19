define([], function() {

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: '<div class="empty-view text-muted bigger-125 center clearfix"><div>登録していません<br/>「<i class="ace-icon fa fa-plus"></i>」をクリックして追加します</div></div>'
    });

    return EmptyView;
});