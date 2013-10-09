define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/on",
	"dojo/_base/Color",
	"app/dijit/IdentifyResults",
	"esri/tasks/IdentifyTask",
	"esri/tasks/IdentifyParameters",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleLineSymbol"],
    function(declare, lang, dom, domConstruct, on, Color, IdentifyResults, IdentifyTask, 
    	IdentifyParameters, SimpleFillSymbol, SimpleLineSymbol){
        return declare([], {
        	handle: null,
        	map: null,
        	url: null,
        	content: null,
        	
        	constructor: function (params) {
				params = params || {};
				
			    if (!params.map) {
			      console.error("app.dijit.Identify: Unable to find the 'map' property in parameters");
			    }

			    if (!params.url) {
			      console.error("app.dijit.Identify: Unable to find the 'url' property in parameters");
			    }			    
			    			    
			    this.map = params.map; // REQUIRED
			   	this.url = params.url; // REQUIRED		
			   	
			   	this._init();
			},			
						
			activate: function() {
				console.log("activate");
				this.handle = on(this.map, "click", lang.hitch(this, "_doIdentify"));
			},
			
			deactivate: function() {
				if (this.handle) {
					this.handle.remove();
				}				
			},
			
			_init: function() {
				console.log("_init");
				this.identifyTask = new IdentifyTask(this.url);

		        this.identifyParams = new IdentifyParameters();
		        this.identifyParams.tolerance = 3;
		        this.identifyParams.returnGeometry = true;
		        this.identifyParams.layerIds = [3];
		        this.identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_ALL;
		       	this.identifyParams.width  = this.map.width;
		        this.identifyParams.height = this.map.height;
		        
		        this.map.infoWindow.resize(415, 200);
		        this.map.infoWindow.setTitle("Identify Results");		
		        this.symbol = new esri.symbol.SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
		        				
				this.identifyResults = new IdentifyResults({
					map: this.map	
				}, domConstruct.create("div"));
				
				this.identifyResults.startup();				
				this.map.infoWindow.setContent(this.identifyResults.domNode);
			},
			
			_doIdentify: function(evt) {
				console.log("_doIdentify");
				
				this.map.graphics.clear();
		        this.identifyParams.geometry = evt.mapPoint;
		        this.identifyParams.mapExtent = this.map.extent;
		        
		        this.identifyTask.execute(this.identifyParams, lang.hitch(this, function(results) { 		        	
		        	this._addToMap(results, evt); 
		        }));
			},
			
			_addToMap: function(results, evt) {
				console.log("_addToMap");
				
				this.identifyResults.setResults(results);	
				console.log("show infoWindow");
				this.map.infoWindow.show(evt.screenPoint, this.map.getInfoWindowAnchor(evt.screenPoint));	
			},
			
			_showFeature: function(feature) {
		        this.map.graphics.clear();
		        feature.setSymbol(this.symbol);
		        this.map.graphics.add(feature);
	      	}   
        });
    }
);
	