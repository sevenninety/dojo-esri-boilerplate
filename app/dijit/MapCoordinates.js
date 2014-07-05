// http://dojotoolkit.org/documentation/tutorials/1.9/recipes/custom_widget/
// http://dojotoolkit.org/documentation/tutorials/1.9/templated/
// http://dojotoolkit.org/reference-guide/1.9/dijit/form/DropDownButton.html

// Basemap Widget
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/MapCoordinates.html",
	"dojo/dom-style",
	"xstyle/css!./css/MapCoordinates.css"],
    function(declare, lang, array, _WidgetBase, _TemplatedMixin, template, domStyle){
        return declare([_WidgetBase, _TemplatedMixin], {
        	// The template
        	templateString: template,
        	
        	map: null,
        	
        	// A class to be applied to the root node in our template
            baseClass: "mapCoordinates",
            
			constructor: function (params, srcNodeRef) {
				params = params || {};
			
			    if (!params.map) {
			      console.error("app.dijit.MapCoordinates: Unable to find the 'map' property in parameters");
			    }
			    
			    this.map = params.map; // REQUIRED
			},
            
            postCreate: function() {
            	// Call the base class methods
            	this.inherited(arguments);            				    
			    
			    // Add event handlers
				this.map.on("mouse-move", lang.hitch(this, this._setCoords)); 
				this.map.on("mouse-drag", lang.hitch(this, this._setCoords));  		
            },
            
            _setCoords: function(evt) {
            	var mp = evt.mapPoint;
        		// Display mouse coordinates
        		this.coords.innerHTML = mp.x + ", " + mp.y;
            }
        });
	}
);