require.config({
	baseUrl: "js",
	paths: {
		"jquery": "lib/jquery-1.9.1.min",
        "jqueryUI": "lib/jquery-ui",
		"backbone": "lib/backbone",
		"underscore": "lib/underscore",
		"json2": "lib/json2",
        "bootstrap": "lib/bootstrap.min"
	},
	shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "jqueryUI":{
            deps:['jquery']
        }
     }

});

// Start the main app logic.
requirejs(['app'])