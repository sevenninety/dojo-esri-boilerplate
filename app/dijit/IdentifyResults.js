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
    "dijit/form/Select",
    "xstyle/css!./css/IdentifyResults.css"],
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
				
				this.resultsGrid.on(".dgrid-row:click", lang.hitch(this, function(event){
				    var row = this.resultsGrid.row(event);
				    console.log("Row clicked:", row.id);
				}));
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
		            
		            data.push({ field: "URL", value: "http://maps.google.co.uk"});
		            
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