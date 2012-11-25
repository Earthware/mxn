mxn.register('openspace', {

Mapstraction: {

	init: function(element, api) {
		//FIX STUPID OPENSPACE BUG IN openspace Version 1.2 - is triggered by Mapstraction Core Tests when adding a marker with label text
		if (typeof (OpenLayers.Marker.prototype.setDragMode) == "undefined")
		{
			OpenLayers.Marker.prototype.setDragMode = function(mode) 
			{
				if (this.eventObj) {
					if (mode) {
						this.events.unregister("mousedown", this.eventObj, this.eventFunc);
					} 
					else {
						if (this.events.listeners.mousedown.length == 0) {
							this.events.register("mousedown", this.eventObj, this.eventFunc);
						}
					}
				}
			};
		}
	
		var me = this;
		// create the map with no controls and don't centre popup info window
		this.maps[api] = new OpenSpace.Map(element,{
				controls: [],
				centreInfoWindow: false
		});
		// note that these three controls are always there and the fact that 
		// there are three resident controls is used in addControls()
		// enable map drag with mouse and keyboard
		this.maps[api].addControl(new OpenLayers.Control.Navigation());
		this.maps[api].addControl(new OpenLayers.Control.KeyboardDefaults());
		// include copyright statement
		this.maps[api].addControl(new OpenSpace.Control.CopyrightCollection());
		this.maps[api].addControl(new OpenSpace.Control.PoweredBy());
		
		this.maps[api].events.register(
			"click", 
			this.maps[api],
			function(evt) {
				var point = this.getLonLatFromViewPortPx( evt.xy );
				// convert to LatLonPoint
				var llPoint = new mxn.LatLonPoint();
				llPoint.fromProprietary(this.api, point);
				me.clickHandler( llPoint.lat, llPoint.lon );
				return false;
			}
		);
		this.loaded[api] = true;
	},
	
	applyOptions: function(){
		var map = this.maps[this.api];
	
		// TODO: Add provider code
	},
	
	resizeTo: function(width, height){
		this.currentElement.style.width = width;
		this.currentElement.style.height = height;
		this.maps[this.api].updateSize();
	},
	
	addControls: function( args ) {
		var map = this.maps[this.api];
		// remove existing controls but leave the basic navigation,	keyboard 
		// and copyright controls in place these were added in addAPI and not 
		// normally be removed
		for (var i = map.controls.length; i>3; i--) {
			map.controls[i-1].deactivate();
			map.removeControl(map.controls[i-1]);
		}
		// pan and zoom controls not available separately
		if ( args.zoom == 'large') {
			map.addControl(new OpenSpace.Control.LargeMapControl());
		}
		else if ( args.zoom == 'small' || args.pan ) {
			map.addControl(new OpenSpace.Control.SmallMapControl());
		}
		if ( args.overview ) {
			// this should work but as of OpenSpace 0.7.2 generates an error
			// unless done before setCenterAndZoom
			var osOverviewControl = new OpenSpace.Control.OverviewMap();
			map.addControl(osOverviewControl);
			osOverviewControl.maximizeControl();
		}
		if ( args.map_type ) {
			// this is all you get with openspace, a control to switch on or
			// off the layers and markers
			// probably not much use to anybody
			map.addControl(new OpenLayers.Control.LayerSwitcher());
		}
	},
	
	addSmallControls: function() {
		var map = this.maps[this.api];
		map.addControl(new OpenSpace.Control.SmallMapControl());
	},
	
	addLargeControls: function() {
		var map = this.maps[this.api];
		map.addControl(new OpenSpace.Control.LargeMapControl());
	},
	
	addMapTypeControls: function() {
		var map = this.maps[this.api];
	
		// TODO: Add provider code
	},
	
	setCenterAndZoom: function(point, zoom) {
		var map = this.maps[this.api];
		var pt = point.toProprietary(this.api);
	
		var oszoom = zoom-6;
		if (oszoom<0) {
			oszoom = 0;
		}
		else if (oszoom>10) {
			oszoom = 10;
		}
		map.setCenter(pt, oszoom, false, false);
	},
	
	addMarker: function(marker, old) {
		var map = this.maps[this.api];
		var loc = marker.location.toProprietary(this.api);
		var OSMarker = map.createMarker(loc, null, marker.labelText);	
		return OSMarker;
	},

	removeMarker: function(marker) {
		var map = this.maps[this.api];
		map.removeMarker(marker.toProprietary(this.api))
	},
	
	declutterMarkers: function(opts) {
		var map = this.maps[this.api];
	
		// TODO: Add provider code
	},
	
	addPolyline: function(polyline, old) {
		var map = this.maps[this.api];
		var pl = polyline.toProprietary(this.api);

		map.addFeatures([pl]);

		return pl;
	},

	removePolyline: function(polyline) {
		var map = this.maps[this.api];
	
		var pl = polyline.toProprietary(this.api);

		map.removeFeatures([pl]);
	},
	
	getCenter: function() {
		var map = this.maps[this.api];
		var pt = map.getCenter(); // an OpenSpace.MapPoint, UK National Grid
		var gridProjection = new OpenSpace.GridProjection();
		var center = gridProjection.getLonLatFromMapPoint(pt);
		return new mxn.LatLonPoint(center.lat, center.lon);
	},

	setCenter: function(point, options) {
		var map = this.maps[this.api];
		var pt = point.toProprietary(this.api);
		map.setCenter(pt);
	},
	
	setZoom: function(zoom) {
		var map = this.maps[this.api];
	
		var oszoom = zoom-6;
		if (oszoom<0) {
			oszoom = 0;
	}
	else if (oszoom>10) {
			oszoom = 10;
	}
	map.zoomTo(oszoom);
	
	},
	
	getZoom: function() {
		var map = this.maps[this.api];
		var zoom;
	
		zoom = map.zoom + 6;  // convert to equivalent google zoom
	
		return zoom;
	},

	getZoomLevelForBoundingBox: function( bbox ) {
		var map = this.maps[this.api];
		// NE and SW points from the bounding box.
		var ne = bbox.getNorthEast();
		var sw = bbox.getSouthWest();
		var zoom;
	
		var obounds = new OpenSpace.MapBounds();
		obounds.extend(new mxn.LatLonPoint(sw.lat,sw.lon).toProprietary(this.api));
		obounds.extend(new mxn.LatLonPoint(ne.lat,ne.lon).toProprietary(this.api));
		zoom = map.getZoomForExtent(obounds) + 6; // get it and adjust to equivalent google zoom
	
		return zoom;
	},

	setMapType: function(type) {
		//Road Only 
	},

	getMapType: function() {
		//Road Only
		return mxn.Mapstraction.ROAD;
	},

	getBounds: function () {
		var map = this.maps[this.api];

		// array of openspace coords	
		// left, bottom, right, top
		var olbox = map.calculateBounds().toArray(); 
		var ossw = new OpenSpace.MapPoint( olbox[0], olbox[1] );
		var osne = new OpenSpace.MapPoint( olbox[2], olbox[3] );
		// convert to LatLonPoints
		var gridProjection = new OpenSpace.GridProjection();
		var sw = gridProjection.getLonLatFromMapPoint(ossw); 
		var ne = gridProjection.getLonLatFromMapPoint(osne); 
		return new mxn.BoundingBox(sw.lat, sw.lon, ne.lat, ne.lon);
	},

	setBounds: function(bounds){
		var map = this.maps[this.api];
		var sw = bounds.getSouthWest();
		var ne = bounds.getNorthEast();
	
		var obounds = new OpenSpace.MapBounds();
		obounds.extend(new mxn.LatLonPoint(sw.lat,sw.lon).toProprietary(this.api));
		obounds.extend(new mxn.LatLonPoint(ne.lat,ne.lon).toProprietary(this.api));
		map.zoomToExtent(obounds);	
	},

	addImageOverlay: function(id, src, opacity, west, south, east,
				  north, oContext) {
		var map = this.maps[this.api];
	
		// TODO: Add provider code
	},

	setImagePosition: function(id, oContext) {
		var map = this.maps[this.api];
		var topLeftPoint; var bottomRightPoint;
	
		// TODO: Add provider code
	
		//oContext.pixels.top = ...;
		//oContext.pixels.left = ...;
		//oContext.pixels.bottom = ...;
		//oContext.pixels.right = ...;
	},

	addOverlay: function(url, autoCenterAndZoom) {
		var map = this.maps[this.api];
	
		// TODO: Add provider code
	},

	addTileLayer: function(tile_url, opacity, copyright_text, min_zoom, max_zoom) {
		var map = this.maps[this.api];
		// TODO: Add provider code
	},

	toggleTileLayer: function(tile_url) {
		var map = this.maps[this.api];
		// TODO: Add provider code
	},

	getPixelRatio: function() {
		var map = this.maps[this.api];
		// TODO: Add provider code
	},

	mousePosition: function(element) {
		var map = this.maps[this.api];

		try {
			map.events.register('mousemove', map, function (e) {
				var lonLat = map.getLonLatFromViewPortPx(e.xy);
				var lon = lonLat.lon * (180.0 / 20037508.34);
				var lat = lonLat.lat * (180.0 / 20037508.34);
				lat = (180/Math.PI)*(2*Math.atan(Math.exp(lat*Math.PI/180))-(Math.PI/2));
				var loc = numFormatFloat(lat,4) + ' / ' + numFormatFloat(lon,4);
				   // numFormatFloat(X,4) simply formats floating point 'X' to
				   // 4 dec places
				locDisp.innerHTML = loc;
			});
			locDisp.innerHTML = '0.0000 / 0.0000';
		} catch (x) {
				alert("Error: " + x);
		}
	
		// TODO: Add provider code
	}
},

LatLonPoint: {
	
	toProprietary: function() {
		var lonlat = new OpenLayers.LonLat(this.lon, this.lat);
		// need to convert to UK national grid
		var gridProjection = new OpenSpace.GridProjection();
		return gridProjection.getMapPointFromLonLat(lonlat); //can we just pass this instead and not need lonlat?
	},
	
	fromProprietary: function(osPoint) {
		var gridProjection = new OpenSpace.GridProjection();
		var olpt = gridProjection.getLonLatFromMapPoint(osPoint); 
		// an OpenLayers.LonLat
		this.lon = olpt.lon;
		this.lat = olpt.lat;
	}
	
},

Marker: {
	
	toProprietary: function() {
		var size, anchor, icon;
		if(this.iconSize) {
			size = new OpenLayers.Size(this.iconSize[0],
					   this.iconSize[1]);
		}
		else {
			size = new OpenLayers.Size(20,25);
		}
	
		if(this.iconAnchor) {
			anchor = new OpenLayers.Pixel(this.iconAnchor[0],
					  this.iconAnchor[1]);
		}
		else {
			// FIXME: hard-coding the anchor point
			anchor = new OpenLayers.Pixel(-(size.w/2), -size.h);
		}
	
		if(this.iconUrl) {
			icon = new OpenSpace.Icon(this.iconUrl, size, anchor);
		}
		else { // leave at default OpenSpace icon
		}
		
		marker = new OpenLayers.Marker(this.location.toProprietary(this.api), icon, this.labelText);
		return marker;
	},

	openBubble: function() {
		//this.map.openInfoWindow(this.proprietary_marker.icon, this.location.toProprietary(this.api), this.labelText, new OpenLayers.Size(300,200));
	},

	closeBubble: function() {
		this.map.closeInfoWindow();
	},

	
	hide: function() {
		// TODO: Add provider code
	},
	
	show: function() {
		// TODO: Add provider code
	},
	
	update: function() {
		// TODO: Add provider code
	}
},

Polyline: {

	toProprietary: function() {
		var ospolyline;
		var ospoints = [];
		for (var i = 0, length = this.points.length ; i< length; i++){
			// convert each point to OpenSpace.MapPoint
			var ospoint = this.points[i].toProprietary(this.api);
			var olgpoint = new OpenLayers.Geometry.Point(ospoint.getEasting(),ospoint.getNorthing());
			ospoints.push(olgpoint);
		}
		if (this.closed) {
			ospolyline = new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.LinearRing(ospoints), 
				null,
				{
					fillColor: this.color,
					strokeColor: this.color,
					strokeOpacity: this.opacity,
					fillOpacity: this.opacity,
					strokeWidth: this.width
				}
			);
		}
		else {
			ospolyline = new OpenLayers.Feature.Vector(
				new	OpenLayers.Geometry.LineString(ospoints),
				null, 
				{
				   fillColor: 0,
				   strokeColor: this.color,
				   strokeOpacity: this.opacity,
				   fillOpacity: 0,
				   strokeWidth: this.width
				}
			);
		}
		return ospolyline;
	},
	
	show: function() {
		// TODO: Add provider code
	},
	
	hide: function() {
		// TODO: Add provider code
	}
	
}
	
});