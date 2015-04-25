describe('marionette-selectize-behavior', function() {

  SelectizeView = Marionette.ItemView.extend({
    template: function() {
      return '<select></select>';
    },
    ui: {
      select: '> select'
    },
    behaviors: [
      {
        behaviorClass: SelectizeBehavior,
        selector: '> select',
        modelField: 'selectedId',
        collection: 'collection',
        textAttribute: 'text'
      }
    ],
    getSelectize: function() {
      return this.ui.select[0].selectize;
    }
  });

  OptionCollection = Backbone.Collection.extend({
    model: Backbone.Model.extend({
      defaults: {optionId: null, text: null},
      idAttribute: 'optionId'
    })
  });

  SelectionModel = Backbone.Model.extend({
    defaults: {selectedId: null}
  });

  TEST_OPTION_ID_1 = 'id1';
  TEST_OPTION_ID_2 = 'id2';
  TEST_OPTION_1 = {optionId: TEST_OPTION_ID_1, text: 'Option 1'};
  TEST_OPTION_2 = {optionId: TEST_OPTION_ID_2, text: 'Option 2'};
  TEST_OPTIONS = [TEST_OPTION_1, TEST_OPTION_2];
  TEST_OPTION_ID_EXTRA = 'id3';
  TEST_OPTION_EXTRA = {optionId: TEST_OPTION_ID_EXTRA, text: 'Option 3'};
  TEST_OPTIONS_EXTRA = [TEST_OPTION_1, TEST_OPTION_2, TEST_OPTION_EXTRA];

  before(function() {
    this.region = new Marionette.Region({el: '#fixture'});
    this.setupView = function (model, collection) {
      var view = new SelectizeView({
        model: model,
        collection: collection
      });
      this.region.show(view);
      return view;
    }
  });

  after(function() {
    this.region.reset();
  });

  function getSelectizeOptionsData(view) {
    return _.chain(view.getSelectize().options)
      .values()
      .sortBy('$order')
      .map(function (option) {
        return {
          optionId: option.id,
          text: option.text
        }
      })
      .value();
  }

  describe('initial state', function() {
    it('should set the options from the collection', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      expect(getSelectizeOptionsData(view)).to.deep.equal(TEST_OPTIONS);
    });
    it('should not select an option if the selection is not set', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      expect(view.getSelectize().items).to.be.empty;
    });
    it('should select the option if the selection is set', function() {
      var model = new SelectionModel({selectedId: TEST_OPTION_ID_1});
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      expect(view.getSelectize().items).to.deep.equal([TEST_OPTION_ID_1]);
    });
  });

  describe('changing options', function() {
    it('should add an option', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      collection.add(TEST_OPTION_EXTRA);
      expect(getSelectizeOptionsData(view)).to.deep.equal(TEST_OPTIONS_EXTRA);
    });
    it('should remove an option', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS_EXTRA);
      var view = this.setupView(model, collection);
      collection.remove(TEST_OPTION_ID_EXTRA);
      expect(getSelectizeOptionsData(view)).to.deep.equal(TEST_OPTIONS);
    });
    it('should reset options', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      collection.reset(TEST_OPTIONS_EXTRA);
      expect(getSelectizeOptionsData(view)).to.deep.equal(TEST_OPTIONS_EXTRA);
    });
    it('should change an option', function() {
      var NEW_TEXT = TEST_OPTION_1.text + TEST_OPTION_1.text;
      var NEW_OPTIONS = TEST_OPTIONS.map(function (option) {
        if (option.optionId == TEST_OPTION_ID_1) {
          return {
            optionId: TEST_OPTION_ID_1,
            text: NEW_TEXT
          };
        } else {
          return option;
        }
      });
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      collection.get(TEST_OPTION_ID_1).set('text', NEW_TEXT);
      expect(getSelectizeOptionsData(view)).to.deep.equal(NEW_OPTIONS);
    });
  });

  describe('changing selection from model', function() {
    it('should update when the selection changes', function() {
      var model = new SelectionModel({selectedId: TEST_OPTION_ID_1});
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      model.set('selectedId', TEST_OPTION_ID_2);
      expect(view.getSelectize().items).to.deep.equal([TEST_OPTION_ID_2]);
    });
    it('should update when the selection changes from unset to set', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      model.set('selectedId', TEST_OPTION_ID_1);
      expect(view.getSelectize().items).to.deep.equal([TEST_OPTION_ID_1]);
    });
    it('should update when the selection changes from set to unset', function() {
      var model = new SelectionModel({selectedId: TEST_OPTION_ID_1});
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      model.set('selectedId', null);
      expect(view.getSelectize().items).to.be.empty;
    });
  });

  describe('changing selection from view', function() {
    it('should update when the selection changes', function() {
      var model = new SelectionModel({selectedId: TEST_OPTION_ID_1});
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      view.getSelectize().setValue(TEST_OPTION_ID_2);
      expect(model.get('selectedId')).to.equal(TEST_OPTION_ID_2);
    });
    it('should update when the selection changes from unset to set', function() {
      var model = new SelectionModel();
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      view.getSelectize().setValue(TEST_OPTION_ID_1);
      expect(model.get('selectedId')).to.equal(TEST_OPTION_ID_1);
    });
    it('should update when the selection changes from set to unset', function() {
      var model = new SelectionModel({selectedId: TEST_OPTION_ID_1});
      var collection = new OptionCollection(TEST_OPTIONS);
      var view = this.setupView(model, collection);
      view.getSelectize().clear();
      expect(model.get('selectedId')).to.be.null;
    });
  });

});
