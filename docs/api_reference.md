
The Looker Visualization API is a pure-JavaScript API that runs in the browser and will be hosted within the Looker application.

The same visualization code can provide a visualization anywhere in Looker: explore, Looks, Dashboards, embed or in PDF or rendered images.

Each visualization represents a view of a single Looker query. Looker will handle running the query, and will pass it to your visualiation code. You'll also get passed a DOM element that your visualization code can draw into.

### Requirements

- Looker
  - Currently, Looker must be hosted on-premise to use custom visualiations. Depending on your license, our support team may need to enable the custom visualizations feature. Use in-app chat or email support@looker.com if you need help with this.
- Some knowledge of JavaScript and web development

### Environment

Your JavaScript code will run in the same web browser context as your Looker instance. Authors of custom visualizations are responsible for ensuring that the code they write is secure. 

Just like all web development, supporting different web browsers (Chrome, Edge, Firefox) can occasionally be an issue. The Visualization API works on all browsers that Looker supports, but it's up to you to ensure browser support for your custom code.

Since the Visualization API is plain JavaScript, you can use any JavaScript libraries to visualize your data. There are currently a few libraries available in the global scope that you can use:

- D3 (as `d3`)
- Underscore (as `_`)
- jQuery (as `$`)

You're not required to use any of these libraries however.

### Installation

Any files placed in the `looker/plugins/visualizations` directory on your Looker server will be picked up.

----

# API Reference

The entry point into the Visualization API is a call to the `looker.plugins.visualizations.add` function. This function accepts a _visualization object_ which fully defines your custom visualization.

## The Visualization Object

##### Required Properties 

- `id` _string_
 
	A unique string to identify the visualization. This is used to associate objects in Looker with your visualization. It's also used as the `type` when specifying a dashboard element in LookML.
	
	It may not contain the phrase `looker`.
	
	**Example**: `id: "my_great_pie_chart"`

- `label` _string_
 
	A human-readable label shown to users when selecting a visualization.
	
	**Example**: `label: "Super Great Chart (The Best)"`

- `create` _function_
 
	A function called once, when your visualization is first drawn on the page. This function is expected to set up anything that you'd like your visualization to always have available. You could load a library, or create a set of elements and controls you'll use later.
	
	[See details about the `create` function &rarr;]()

- `update` / `updateAsync` _function_
 
	A function that is called every time the state of your visualization may need to change. It will always be called after `create`, and may be called many times, so should be as fast as possible.
	
	This function can be called for many reasons, but usually it's when the query to visualize changes, a configuration option was changed, or the visualization was resized.
	
	There is a synchronous and asynchronous version of this function – you'll only need to specify one. (It's an error to define both).

	[See details about these `update` functions &rarr;]()
	
#### Optional Properties

- `options` _object_

   An object detailing options that users can set on your visulization.

	[See details about exposing a configuration UI &rarr;]()

- `destroy` _function_
 
	A function that is called just before the visualization is removed from the page. This can be used to clean up any event listeners or other state. It may never be called, for example, if the user closes the window.

#### Added Properties

These properties are added to your object automatically by Looker after the visualization is passed to `looker.plugins.visualizations.add`. You can reference them via `this` within the context of the `create`, `update`, `updateAsync`, and `destroy` functions.

- `addError` _function_
 
	A function that your visualization code may call to tell the UI to display an error message instead of the visualization. It takes an error object.
	
	Once an error is added it will remain visible until `clearErrors` is called.
	
	**Example:**
	
	```js
	this.addError({
		title: "Two Dimensions Required",
		message: "This really great visualization requires two dimensions."
	});
	```
	
- `clearErrors` _function_
 
	A function that your visualization code may call to clear any errors that have been added via `addError`.
		
	**Example:**
	
	```js
	this.clearErrors();
	```
	
- `trigger` _function_
 
	A function that can be called to trigger an event outside the visualization.
		
	[See details about events &rarr;]()

	**Example:**
	
	```js
	this.trigger("limit", [20]);
	```
  
## The `create` function

The `create` function will be pased two parameters, `element` and `config`.

```js
update: function(element, config){
  // Your update code here.
},
```

### Parameters

- `element` _DOMElement_
 
	A DOM Element representing a container to render your visualization into.
	
- `config` _object_
 
	An object representing the values of any configuration [options]() that the user has set for this chart. 
	
	**Example**: `{my_configuration_option: "User Value"}`
	
### Example


## The `update` and `updateAsync` functions

The `create` function will be pased five parameters:

```js
update: function(data, element, config, queryResponse, details){
  // Your update code here.
}
```

If your rendering code needs to perform an asynchronous action, such as loading a file or sending a web request, there's an asynchronous version of the function that can be passed in as `updateAsync`. 

This version of the function has an additional parameter which is a callback to be called when rendering is complete:

```js
updateAsync: function(data, element, config, queryResponse, details, done){
	// An example of an asynchronous update, fetching a file.
	d3.request("https://example.com/fun-file.docx").response(function(xhr) {
		// Your update code here that uses this file.
		done(); 
	});
}
```

Properly letting Looker know when the visualization is done rendering lets Looker optimize rendering and ensures images of visualizations can be properly captured.

### Parameters

- `data` _array_
 
	An array of rows representing the current data in the query. May be `null`.

- `element` _DOMElement_
 
	A DOM Element representing a container to render your visualization into.
	
- `config` _object_
 
	An object representing the values of any configuration [options]() that the user has set for this chart. 
	
	**Example**: `{my_configuration_option: "User Value"}`
	
- `queryResponse` _object_
 
	An object representing metadata about the current query, such as meatadata about fields. May be `null`.
	
- `details` _object_
 
	Details about the current rendering context. Contains information about why the chart is rendering and what has changed. Usually this information is only used in advanced cases.
	

## Presenting Configuration UI

## Events


###Requirements:

- Visualizations must be written in JavaScript. They can leverage the D3 library, the underscore (_) library and the jQuery library.
- Visualizations must be located in the `looker/plugins/visualizations` directory.
- Visualization files must start with the following line in order to be registered in our visualization system: `looker.plugins.visualizations.add({<YOUR VIS CODE GOES HERE>});`
- Visualizations require the following properties to be set:
    - `id:` A unique id in your system relying on. Ideally, you could prefix it with your company name like *looker-bar-chart*; however IDs cannot contain the word 'looker.'
    - `label:` The display label shown in the drop down list of additional visualizations, shown above.
    - `create:` Must be a function. The function receives the following arguments:        `element`, which is the element referenced in the visualization; and `settings`, which refer to the visualization's settings.
    - `update:` Must be a function. It is expected to do the repetitive rendering work, and receives the following arguments: `data`, which is the data returned from a query; `element`, same as above; `settings`, same as above; `response.data`, which contains metadata about a data request, like the field list for the data, etc.
- Visualizations have the following methods to assist with error propagation: `addError` and `clearError`.
  - `addError` expects to receive an object with the following properties: `group`, `message` and `title`.
  - `clearError`, when called with no arguments, clears all the errors. When called with a group name, it clears all the errors in that group.
- Generally, visualizations should be stateless and should only render onto the element passed in.

##Preliminaries:
- Make sure that custom visualizations are enabled on your license (feel free to reach out to support@looker.com to confirm this).
- Once this is confirmed, refresh the license key in Looker's admin panel.
- Restart your Looker.
- On the machine hosting your instance of Looker run `mv ~/looker/plugins/visualizations/examples/looker-heatmap-example.js ~/looker/plugins/visualizations/heatmap.js`
- Remove the examples directory (optional).
- Uncomment the code in `heatmap.js`.

##Example:
Users with this license feature enabled can find an example to follow in `plugins/visualizations/heatmap-example.js`

In the first section of the code, a unique id and label are registered, and (optional) style defaults are set:

```javascript
(function() {
looker.plugins.visualizations.add({
    id: 'heatmap',
    label: 'Heatmap',
    options: {
      colorRange: {
        type: 'array',
        label: 'Color Ranges',
        section: 'Style',
        placeholder: '#fff, red, etc...'
      }
    },
```

In the next section, error handling is set up to ensure that users are guided to the correct configuration of dimensions, measures, and pivots:

```javascript
    handleErrors: function(data, resp) {
      if (!resp || !resp.fields) return null;
      if (resp.fields.dimensions.length != 1) {
        this.addError({
          group: 'dimension-req',
          title: 'Incompatible Data',
          message: 'One dimension is required'
        });
        return false;
      } else {
       [...]
    },
```

We then use the `create` function to introduce the visualization element (in our example, a table):
```javascript
    create: function(element, settings) {
      var $el = $(element);
      var table = d3.select(element)
        .append('table')
        .attr('class', 'heatmap')
        .attr('width', '100%')
        .attr('height', '100%');
      this.update(data, element, settings, resp);
    },
```

We then use the `update` function to bind the data to a DOM. We start out with error handling, data prep, and then go through to actually create the visuals elements:

```javascript
    update: function(data, element, settings, resp) {

      // handle errors
      if (!this.handleErrors(data, resp)) return;

      this.clearErrors('color-error');
      var colorSettings = settings.colorRange || ['white', 'purple', 'red'];

      if (colorSettings.length <= 1) {
        this.addError({
          group: 'color-error',
          title: 'Invalid Setting',
          message: 'Colors must have two or more values. Each value is separated by a comma. For example "red, blue, green".'
        });
      }

    // from data object, extract the first and only dimension, the first and only measure, and a single pivot.
      var dimension = resp.fields.dimensions[0];
      var measure = resp.fields.measures[0];
      var pivot = resp.pivots;

     [...]

    // build table and tinker with aesthetics
      var table = d3.select(element)
        .select('table');

      var tds = trs.selectAll('td')
        .data(function(datum) {
          var tdData = [];
          tdData.push({type: 'dimension', data: datum[dimension.name]});
          datum[dimension.name];
          var measureData = datum[measure.name];
          pivot.forEach(function(pivot) {
            tdData.push({type: 'measure', data: measureData[pivot.key]});
          });
          return tdData;
        });
}
```
## Options:

### Example:

    options: {
        colorRange: {
          type: 'array',
          label: 'Color Ranges',
          section: 'Style',
          placeholder: '#fff, red, etc...'
        },
        transportModePicker: {
          type: 'string',
          display: 'select',
          values: [{'Airplane', 'airplane'}, {'Car', 'car'}, {'Unicycle', 'unicycle'}],
          default: 'unicycle'
        }
    }

## Requirements:

 1. Options are defined in an “options” block.
 1. Options require a key name, in the example above the key name is “colorRange”.
 1. Each key maps to a set of configuration values for the option.
 1. You must define an option type. Each type maps to a kind of input field.

## Settings:
**type** (REQUIRED)
The type of the option.
Values: *string, number, array, boolean, object*

**default**
The default value for the option.

**label**
The label displayed in the visualization configuration panel.

**section**
The section the option should appear in, within the visualization configuration panel.

**order**
The order in which to display the option in the visualization configuration panel section. Must be an integer.

## Settings that depend on other settings’ values:

**display**
__Requires *type* value of: *string, number*__
Accepted values when *type* is *string*: *radio, select*
Accepted values when *type* is *number*: *range*

**values**
__Requires *type* value of: *string*__
__Requires *display* value of: *radio, select*__
A list of key/value pairs to use for radio and select types.
Example: [{"Line": "line"}, {"Range": "range"}, {"Line with Margins": "margins"}]
Each key (e.g. “Line”) will be used as the display label, and each value, as the selected value.

**placeholder**
__Requires *type* value of: *string, number, or array*__
The placeholder value to display in the input form.

**min, max, step**
__Requires *type* value of: *number*__
The min, max or step to allow for a given numeric input.

## Usage in visualization:
Option values (aka settings) are passed into the *update* function as the 3rd argument. In the included heatmap example you can see the _colorRange_ option being accessed like so:

    ...
    update: function(data, elements, settings, resp) {
      ...
      var colorSettings = settings.colorRange || ['white', 'purple', 'red'];
      ...
    }
