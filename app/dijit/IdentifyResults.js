
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
	"dgrid/Grid",
    "dgrid/Selection",
    "dijit/form/Select"],
    function(declare, parser, ready, lang, array, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, registry, template, 
    	domStyle, ObjectStore, Memory, Grid, Selection){
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
            					
				// Create the result grid
				this.resultsGrid = new Grid({ 
					columns: { field: "Field", value: "Value" },
					cellNavigation: false
				}, this.resultsNode);
            },
            
            setResults: function(results) {
            	console.log("setResults");
            	this.results = [], layerNames = [];
            	
            	array.forEach(results, function(result, index) {
            		var featureAttributes = result.feature.attributes,
            			data = [];            			
            			
		            for (att in featureAttributes) {
		            	if (att !== "Shape" && att !== "OBJECTID") {
		            		data.push({ field: att, value: featureAttributes[att] });
		            	}
		            }
		            
		            layerNames.push({
		            	label: result.layerName + " - " + result.value, id: result.layerId
		            });
		            
		            this.results.push({
		            	layerName: result.layerName,
		            	data: data
		            });
            	}, this);
            	            	           	
            	var layerStore = new Memory({
            		data: layerNames
            	});        	
            	
            	this.layersSelect.setStore(new ObjectStore({ objectStore: layerStore }));
            	this._renderGrid(0);
            },
            
	      	_renderGrid: function(index) {
	      		console.log("_renderGrid");
	      		this.resultsGrid.refresh(); // https://github.com/SitePen/dgrid/issues/170
	      		this.resultsGrid.renderArray(this.results[index].data);
	      	}	
        });
        
        ready(function(){
        	parser.parse();
    	});
	}
);