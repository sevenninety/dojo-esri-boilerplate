define({
	title: "Esri Viewer",
	httpProxy: "/proxy/proxy.ashx",
	geometryService: {
		url: "//utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
	},
	map: {
		initialExtent: "-122.68,45.53,-122.45,45.60",
		scalebarVisible: true,
		basemaps: [
			{ label: "Streets", type: "tiled", visible: true, url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer" }
		],
		operationalLayers: [
			{ label: "States, Cities, Rivers", type: "dynamic", visible: true, url: "http://server.arcgisonline.com/ArcGIS/rest/services/Demographics/USA_Median_Age/MapServer" }
		]		
	}
});

