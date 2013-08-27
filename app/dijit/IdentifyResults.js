
/***************
 * CSS Includes
 ***************/
// Anonymous function to load CSS files required for this module
(function(){
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    // TODO: We don't want to use the widget path really
    link.href = require.toUrl("app/dijit/css/IdentifyResults.css");
    document.getElementsByTagName("head").item(0).appendChild(link);
})();

// Basemap Widget
define([
	"dojo/_base/declare",
	"dojo/parser", 
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dijit/_WidgetsInTemplateMixin",
	"dijit/registry",
	"dojo/text!./templates/IdentifyResults.html",
	"dojo/dom-style",
	"dojo/data/ObjectStore",
	"dojo/store/Memory",
	"dijit/form/Select"],
    function(declare, parser, ready, lang, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, registry, template, domStyle, ObjectStore, Memory){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        	// The template
        	templateString: template,
        	
        	map: null,
        	
        	// A class to be applied to the root node in our template
            baseClass: "identifyResults",
            
			constructor: function (params, srcNodeRef) {
				params = params || {};
			
			    if (!params.map) {
			      console.error("app.dijit.IdentifyResults: Unable to find the 'map' property in parameters");
			    }
			    
			    this.map = params.map; // REQUIRED
			},
            
            postCreate: function() {
            	// Call the base class methods
            	this.inherited(arguments);     
            	
            	this.layersSelect.on("change", function() {
            		console.log("value: ", this.get("value"));
            	});  
            },
            
            results: function(results) {
            	console.log("setResults");
            	var layerNames = array.map(results, function(result) {
            		return { label: result.layerName, id: result.layerName };
            	});
            	
            	var layerStore = new Memory({
            		data: layerNames
            	}); 
       	
            	
            	this.layersSelect.setStore(new ObjectStore({ objectStore: layerStore }));
            }
        });
        
        ready(function(){
        	parser.parse();
    	});
	}
);