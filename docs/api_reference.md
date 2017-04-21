
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
	
	[See details about the `create` function &rarr;](#the-create-function)

- `update` / `updateAsync` _function_
 
	A function that is called every time the state of your visualization may need to change. It will always be called after `create`, and may be called many times, so should be as fast as possible.
	
	This function can be called for many reasons, but usually it's when the query to visualize changes, a configuration option was changed, or the visualization was resized.
	
	There is a synchronous and asynchronous version of this function – you'll only need to specify one. (It's an error to define both).

	[See details about these `update` functions &rarr;](#the-update-and-updateasync-functions)
	
#### Optional Properties

- `options` _object_

   An object detailing options that users can set on your visulization.

	[See details about exposing a configuration UI &rarr;](#presenting-configuration-ui)

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
		
	[See details about events &rarr;](#events)

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
 
	An object representing the values of any configuration [options](#presenting-configuration-ui) that the user has set for this chart. 
	
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

The `options` parameter is an object where the keys are an arbitrary identifier for an option name, and the value is an object describing information about the option.

Here's an example:

```js
options: {
    color_range: {
      type: "array",
      label: "Color Range",
      display: "colors"
    },
   top_label: {
      type: "string",
      label: "Label (for top)",
      placeholder: "My Great Chart"
    },
    transport_mode: {
      type: "string",
      label: "Mode of Transport",
      display: "select",
      values: [
      	 {"Airplane", "airplane"}, 
      	 {"Car", "car"}, 
      	 {"Unicycle", "unicycle"}
      ],
      default: "unicycle"
    }
}
```

### Option Object Parameters

##### Basic Parameters

- `type` _string_
 
	The data type of the option.
	
	**Allowed Values:** `string` (default), `number`, `boolean`, `array`
	
- `label` _string_
 
	The human-readable label of the option that will be displayed to the user.
		
- `default`
 
	The default value of the option. When unspecified, the value of the option is `null`. This should be a value of the same type as `type`.
		
- `display` _string_
 
	Certain `type`s can be presented in the UI in different ways.
	
	- when `type` is `string`:
	   
	   	**Allowed Values:** `text` (default), `select`, `radio`
	
	- when `type` is `number`:
	   
	   	**Allowed Values:** `number` (default), `range`
	
	- when `type` is `array`:
	   
	   	**Allowed Values:** `text` (default), `color`, `colors`
		
- `placeholder` _string_
 
	For `display` values that support it, an example value or explanation to give the user a hint about what to type. 
	
##### Display-specific properties
	
- `values` _array_ of _objects_
 
	When `display` is `radio` or `select`, an array containing labels and values that will be listed in the interface.
	
	Each item in the array should be an object with a single key value pair, representing the label and the value of the option. The label will only be presented in the UI, at render time you'll only receive the value.
	
	**Example:**
	
	```js
	values: [
		{"Center": "c"}, 
		{"Left": "l"}, 
		{"Right": "r"}
	]
	```
	
	If `display` is `radio`, each option can additionally be given a `description`:
	
	```js
	values: [
		{"Cool": "c"}, 
		{"Uncool": {
				value: "unc", 
				description: "Only choose this if the data is very uncool."
			}
		}
	]
	```

- `max` _number_
 
	When `display` is `range`, the maximum number allowed to be selected by the range slider.
	
- `min` _number_
 
	When `display` is `range`, the minimum number allowed to be selected by the range slider.
	
- `step` _number_
 
	When `display` is `range`, the amount each tick of the range slider represents.
	
##### Organizing options

- `section` _string_
 
	For charts with many options, a label for which section an option should appear in. The UI will group the options by their `section` values. If there is only one section, the section UI will not be shown.
	
	If you're using `section` then it should be set on every option.
	
- `order` _number_
	
	A number representing the order of options for presentation in the UI. If specified, the options will be sorted according to this order.
	
- `display_size` _string_
	
	A size class representing the width of the option in the UI. For example, if you wanted to show a "Minumum" and a "Maximum" option next to each other, you could set each of their `display_size`s to `half`.

	**Allowed Values:** `normal` (default), `half`, `third`

- `hidden` _function_

	A function that will be called to determine whether the option should be displayed in the UI at a given time.
	
	The function must return a boolean. If `true`, the option will be hidden, otherwise the option will be shown.
	
	The function will be passed two parameters: `config` and `queryResponse`. The format of these parameters is the same as in `update`. `config` is the current values of all the other options, and `queryResponse` is the metadata of the current query being displayed in the visualization editor. `queryResponse` may be null in the case no query has been run.

	**Example:**
	
	```js
	// If the user has selected "line" for "other_option", hide this option.
	hidden: function(config, queryResponse) {
		return config.other_option === "line";
	}
	```


## Events

Events can be triggered by the chart (usually in response to user interaction) that can update properties of the visualization or query.

They can be triggered by calling the `trigger` function on the visualization object. The first parameter is always the _event name_ and the second parameter is an array of _arguments_.

```js
this.trigger("limit", [20]);
```

#### Available Events

- `updateConfig` 
	
	Update the current configuration settings of the chart.
	
	**Argument:** an object containing config keys to update. Unspecified keys are not changed.
	
	**Example:**
	
	```js
	var vis = this;
	$(element).find(".axis").click(function(){
		vis.trigger("updateConfig", [{axis_hidden: true}]
	});
	```

- `limit` 

	Update the limit of the underlying query:
	
	**Argument:** an integer representing a new limit for the query.

	```js
	var vis = this;
	$(element).find(".show-all").click(function(){
		vis.trigger("limit", [500]);
	});
	```

- `filter` 

	Update the value of a filter on the underlying query:
	
	```js
	var vis = this;
	$(element).find(".show-all-tommys").click(function(){
		vis.trigger("filter", [{
			field: "users.name", // the name of the field to filter
			value: "%tommy%", // the "advanced syntax" for the filter
			run: true, // whether to re-run the query with the new filter
		}]);
	});
	```

- `loadingStart` 

	Mark the visualization as loading. Most of the time this isn't neccessary, but if your visualization loads an object from a remote location or performs a long calculation you can use this to continue to display the loading indicator.
	
	It will appear loading until `loadingEnd` is triggered.

- `loadingEnd`

	Mark the visualization as no longer loading.
