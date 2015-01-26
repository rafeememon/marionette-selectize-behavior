(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['backbone.marionette'], factory);
  } else {
    root.SelectizeBehavior = factory(root.Marionette);
  }
})(this, function (Marionette) {

  return Marionette.Behavior.extend({

    defaults: {
      selector: null,
      modelField: null,
      collection: null,
      textAttribute: null
    },

    modelEvents: function() {
      var modelEvents = {};
      modelEvents['change:' + this.getOption('modelField')] = '_updateSelection';
      return modelEvents;
    },

    ui: function() {
      return {el: this.getOption('selector')};
    },

    initialize: function() {
      if (!this.getOption('selector')) {
        throw new Error('Must specify selector in SelectizeBehavior');
      }
      if (!this.getOption('modelField')) {
        throw new Error('Must specify modelField in SelectizeBehavior');
      }
      if (!this.getOption('textAttribute')) {
        throw new Error('Must specify textAttribute in SelectizeBehavior');
      }
    },

    onRender: function() {
      var model = this.view.model;
      var modelField = this.getOption('modelField');

      this.ui.el.selectize({
        options: this._getOptions(),
        valueField: 'id',
        labelField: 'text',
        sortField: 'text',
        onChange: function (value) {
          model.set(modelField, value || null);
        }
      });

      this._updateSelection();
      this._bindEvents();
    },

    _updateSelection: function() {
      var selectize = this._getSelectize();
      if (selectize) {
        var modelField = this.getOption('modelField');
        var value = this.view.model.get(modelField);
        selectize.setValue(value);
      }
    },

    _bindEvents: function() {
      if (this._eventsBound) {
        return;
      }
      var collection = this._getCollection();
      this.listenTo(collection, {
        add: this._addOption,
        remove: this._removeOption,
        change: this._changeOption,
        reset: this._resetOptions
      });
      this._eventsBound = true;
    },

    _addOption: function (model) {
      var selectize = this._getSelectize();
      if (selectize) {
        selectize.addOption(this._getOption(model));
        this._updateSelection();
      }
    },

    _removeOption: function (model) {
      var selectize = this._getSelectize();
      if (selectize) {
        selectize.removeOption(model.id);
        this._updateSelection();
      }
    },

    _changeOption: function (model) {
      var selectize = this._getSelectize();
      if (selectize) {
        selectize.updateOption(model.id, this._getOption(model));
      }
    },

    _resetOptions: function (collection) {
      var selectize = this._getSelectize();
      if (selectize) {
        selectize.clearOptions();
        selectize.addOption(this._getOptions());
        this._updateSelection();
      }
    },

    _getOptions: function() {
      var that = this;
      return this._getCollection().map(function (model) {
        return that._getOption(model);
      });
    },

    _getOption: function (model) {
      return {
        id: model.id,
        text: model.get(this.getOption('textAttribute'))
      };
    },

    _getCollection: function() {
      var collection = null;
      var option = this.getOption('collection');
      if (option) {
        if (typeof option === 'string') {
          collection = this.view[option];
        } else if (typeof option === 'function') {
          collection = option.apply(this.view);
        } else {
          collection = option;
        }
      } else {
        collection = this.view.collection;
      }
      if (!collection) {
        throw new Error('Collection not found in SelectizeBehavior')
      }
      return collection;
    },

    _getSelectize: function() {
      return this.ui.el[0].selectize;
    }

  });

});
