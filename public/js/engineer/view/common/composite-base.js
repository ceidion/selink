define([], function() {

    var BaseView = Backbone.Marionette.CompositeView.extend({

        // Empty View
        // emptyView: EmptyView,

        // common events
        events: {

            // Add a new item when add button clicked
            'click .btn-add': 'addItem',

            // Remove the item when remove button clicked
            'click .btn-remove': 'removeItem'
        },

        // common UI
        ui: {
            addBtn: '.btn-add',
        },

        // Common events may happend on Collection
        collectionEvents: {
            'remove': 'updateModel',
            'change': 'updateModel'
        },

        // SubView append behavior
        appendHtml: function(collectionView, itemView, index) {

            // get subview's model
            var model = itemView.model;

            // this happend on composite initialzation.
            // if the subview's model has _id attribute, it is a existing model
            if (model.get('_id')) {

                // just append the subview
                this.$el.find(this.itemViewContainer).append(itemView.el);

                // let the subview listen to univeral click event
                // itemView.listenTo(vent, 'click:universal', itemView.switchToValue);
            }
            // this happend on user click add button
            // subview's model don't have _id attribute, so it's a new model
            else {

                // hide subview for slide down effect later
                // itemView.$el.hide();

                // hide subview's value panel
                if (itemView.ui && itemView.ui.value) itemView.ui.value.hide();

                // show subview's editor panel
                if (itemView.ui && itemView.ui.editor) itemView.ui.editor.show();

                // append the subview
                this.$el.find(this.itemViewContainer).append(itemView.el);

                itemView.$el.addClass('animated bounceIn');

                // slide down the subview editor panel, the order is important
                // itemView.$el.show(function() {
                //     // let the subview listen to univeral click event
                //     // itemView.listenTo(vent, 'click:universal', itemView.switchToValue);
                // });
            }

            // let composite listen to the new subview's delete event
            this.listenTo(itemView, 'item:delete', this.deleteItem);
        },

        // Add new composite item
        addItem: function() {
            // add a new model to composite's collection
            this.collection.add(new Backbone.Model());
            // if the number of items exceed the limitation
            if (this.collection.length >= this.itemNumber)
            // hide the add button
                this.ui.addBtn.fadeOut('fast');
        },

        // Delete composite item
        deleteItem: function(model) {
            // remove the specified model from collection
            this.collection.remove(model);
            // if the number of items fewer than limitation
            if (this.collection.length < this.itemNumber)
            // show the add button
                this.ui.addBtn.fadeIn('fast');
        },

        // Hide composite
        removeItem: function(option) {

            var self = this;

            // if silence is true
            if (option && option.silence === true) {
                // just singnal item remove
                vent.trigger('resume:itemRemoved', {
                    item: self.item,
                    itemName: self.itemName,
                    itemIcon: self.itemIcon
                });
                return;
            }

            var data = this.model.get('setting');
            data[this.item] = false;

            // save the model
            this.model.save({
                setting: data
            }, {

                // if save success
                success: function() {

                    vent.trigger('resume:itemRemoved', {
                        item: self.item,
                        itemName: self.itemName,
                        itemIcon: self.itemIcon
                    });
                    // slide up editor
                    self.$el.slideUp('fast', function() {
                        // dispose the view
                        self.close();
                    });
                },
                // use patch
                patch: true
            });
        },

        // Update model
        updateModel: function() {

            var self = this;

            // Prepare the date for model update
            var data = {};
            data[this.item] = _.reject(this.collection.toJSON(), function(item) {
                // reject emtpy input
                return _.isEmpty(item);
            });

            // Save the model
            this.model.save(data, {

                // if save success
                success: function() {
                    // Switch to view panel
                    self.switchToValue();
                },
                // handle some error status
                statusCode: {
                    // unauthorized
                    401: function(xhr, status) {
                        noty({
                            type: 'error',
                            timeout: 5000,
                            text: xhr.responseText,
                            layout: 'bottomRight'
                        })
                        // singnal logout, main page will capture this
                        vent.trigger('logout:sessionTimeOut');
                    }
                },
                // if other errors happend
                error: function(xhr, status) {
                },
                // use patch
                patch: true
            });
        }

    });

    return BaseView;
});