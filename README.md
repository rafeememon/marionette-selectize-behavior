marionette-selectize-behavior
=============================

[![Build Status](https://travis-ci.org/rafeememon/marionette-selectize-behavior.svg)](https://travis-ci.org/rafeememon/marionette-selectize-behavior)

## Description

This behavior provides two-way value binding with a DOM `<select>` element of a [Backbone.Marionette](http://marionettejs.com/) view using the [Selectize.js](https://brianreavis.github.io/selectize.js/) library. Selection items are synchronized with a [Backbone](http://backbonejs.org/) collection, and the selected item is synchronized with a model attribute.

## Usage

This library is compatible with CommonJS and AMD loaders. If included in a `<script>` tag, the behavior is exported as `CheckboxBehavior`.

See Marionette's [documentation](http://marionettejs.com/docs/marionette.behaviors.html) for including behaviors into views. The options for this behavior are:

- **selector**: (required) A jQuery selector to a `<select>` element within the view
- **modelField**: (required) The model attribute storing the selected item's ID
- **collection**: (required) The collection containing the possible selection items. This can be specified as the collection itself, the name of the field on the view containing the collection, or a function returning the collection. Selection state is represented with the IDs of the collection's items.
- **textAttribute**: (required) The attribute of collection models representing the item's display text. This field will also be used for searching and sorting.
- **renderItem**: (optional) A callback to render the selected item. The function takes the item's data as the first parameter and an HTML escape function as the second parameter, and it returns the HTML for the selected item.
- **renderOption**: (optional) A callback to render the items in the dropdown menu. The function takes the item's data as the first parameter and an HTML escape function as the second parameter, and it returns the HTML for the item.

## Compatibility

- [Backbone.Marionette](http://marionettejs.com/) v2.0.0 and higher
- [Selectize.js](https://brianreavis.github.io/selectize.js/) v0.11.0 and higher

## License

The MIT License (MIT)

Copyright (c) 2015 Rafee Memon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
