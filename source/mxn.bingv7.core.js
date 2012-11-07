mxn.register('bingv7', {

    Mapstraction: {

       
        init: function (element, api) {
            //console.log(key);
            var me = this;

            if (Microsoft === undefined) {
                throw api + ' map script not imported';
            }

            this.maps[api] = new Microsoft.Maps.Map(element, {
                showDashboard: false,
                credentials: mxn.mapKey,
                enableSearchLogo: false,
                enableClickableLogo: false
            });

            var map = this.maps[this.api];
            Microsoft.Maps.Events.addHandler(map, 'viewchangestart', function () {
                me.zoom = map.getZoom();
                me.center = map.getCenter();
            });

            Microsoft.Maps.Events.addHandler(map, 'viewchange', function () {
                if (me.zoom) {
                    if (me.zoom != map.getZoom()) {
                        me.changeZoom.fire();
                    }
                }
            });

            Microsoft.Maps.Events.addHandler(map, 'viewchangeend', function () {
                me.endPan.fire();
                //			if(me.center){
                //				var newCenter = map.getCenter();
                //
                //				if(me.center.latitude != newCenter.latitude || me.longitude != newCenter.longitude){
                //					me.endPan.fire();
                //				}
                //			}
            });
        },

        log: function (msg) {
            $('#debug-msg3').append(msg);
        },

        applyOptions: function () {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },

        resizeTo: function (width, height) {
            var map = this.maps[this.api];
            map.setOptions({
                width: width,
                height: height
            });
        },
        addControls: function (args) {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },

        addSmallControls: function () {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },
        addLargeControls: function () {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },
        addMapTypeControls: function () {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },
        setCenterAndZoom: function (point, zoom) {
            var map = this.maps[this.api];
            var pt = point.toProprietary(this.api);
            var options = {
                center: pt,
                zoom: zoom
            };
            map.setView(options);
        },
        addMarker: function (marker, old) {
            var map = this.maps[this.api];
            var pin = marker.toProprietary(this.api);
            map.entities.push(pin);
            return pin;
        },
        removeMarker: function (marker) {
            var map = this.maps[this.api];
            //map.entities.pop(marker);
            map.entities.remove(marker);
        },
        declutterMarkers: function (opts) {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },
        removeAllMarkers: function () {
            var map = this.maps[this.api];
            map.entities.clear();
        },
        addPolyline: function (polyline, old) {
            var map = this.maps[this.api];
            var pl = polyline.toProprietary(this.api);
            // TODO: Add provider code			
            return pl;
        },
        removePolyline: function (polyline) {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },
        getCenter: function () {
            var point;
            var map = this.maps[this.api];
            point = map.getCenter();
            return point;
        },
        setCenter: function (point, options, offset) {
            var map = this.maps[this.api];
            var pt = point.toProprietary(this.api);
            if (options && options.pan) {
                map.setView({
                    center: pt,
                    animate: true
                });
            } else {

                map.setView({
                    center: pt
                });
            }
        },
        setCenterWithOffset: function (offset) {
            var map = this.maps[this.api];
            center = map.getCenter();
            map.setView({
                center: center,
                animate: true,
                centerOffset: offset
            });
        },
        setZoom: function (zoom) {
            var map = this.maps[this.api];
            map.setView({
                zoom: zoom
            });
        },
        getZoom: function () {
            var map = this.maps[this.api];
            var zoom;
            zoom = map.getZoom();
            return zoom;
        },
        getZoomLevelForBoundingBox: function (bbox) {
            var map = this.maps[this.api];
            // NE and SW points from the bounding box.
            var ne = bbox.getNorthEast();
            var sw = bbox.getSouthWest();
            var zoom;
            // TODO: Add provider code			
            return zoom;
        },
        setMapType: function (type) {
            var map = this.maps[this.api];
            var providerType;
            switch (type) {
                case mxn.Mapstraction.ROAD:
                    providerType = Microsoft.Maps.MapTypeId.road; // .ordnanceSurvey;
                    break;
                case mxn.Mapstraction.SATELLITE:
                    providerType = Microsoft.Maps.MapTypeId.aerial;
                    break;
                case mxn.Mapstraction.HYBRID:
                    providerType = Microsoft.Maps.MapTypeId.birdseye;
                    break;
                default:
                    providerType = Microsoft.Maps.MapTypeId.auto;
            }
            map.setMapType(providerType);
        },

        getMapType: function () {
            var map = this.maps[this.api];
            switch (map.getMapTypeId()) {
                case 'road':
                    return mxn.Mapstraction.ROAD;
                case 'birdseye':
                    return mxn.Mapstraction.SATELLITE;
                case 'aerial':
                    return mxn.Mapstraction.HYBRID;
                default:
                    return mxn.Mapstraction.HYBRID;
            }
        },
        getBounds: function () {
            var map = this.maps[this.api];
            var rect = map.getBounds();
            return new mxn.BoundingBox(rect.getSouth(), rect.getWest(), rect.getNorth(), rect.getEast());
        },
        setBounds: function (bounds) {
            var map = this.maps[this.api];
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            map.setView({
                bounds: Microsoft.Maps.LocationRect.fromLocations([new Microsoft.Maps.Location(ne.lat, ne.lon), new Microsoft.Maps.Location(sw.lat, sw.lon)])
            });
        },
        addImageOverlay: function (id, src, opacity, west, south, east, north, oContext) {
            throw 'addImageOverlay cannot be implemented in the bing maps api';
        },
        setImagePosition: function (id, oContext) {
            throw 'setImagePosition cannot be implemented in the bing maps api';
        },
        addOverlay: function (url, autoCenterAndZoom) {
            throw 'addOverlay cannot be implemented in the bing maps api';
        },

        addTileLayer: function (tile_url, opacity, copyright_text, min_zoom, max_zoom, map_type) {
            var map = this.maps[this.api];
            var options = {
                uriConstructor: tile_url,
                width: 256,
                height: 256
            };
            var tileSource = new Microsoft.Maps.TileSource(options);
            var tilelayer = new Microsoft.Maps.TileLayer({
                mercator: tileSource
            });
            map.entities.push(tilelayer);
        },
        toggleTileLayer: function (tile_url) {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },

        getPixelRatio: function () {
            var map = this.maps[this.api];
            // TODO: Add provider code
        },

        mousePosition: function (element) {
            var map = this.maps[this.api];
            // TODO: Add provider code
        }
    },

    LatLonPoint: {

        toProprietary: function () {
            return new Microsoft.Maps.Location(this.lat, this.lng);
        },

        fromProprietary: function (bingPoint) {
            this.lat = bingPoint.latitude;
            this.lng = bingPoint.longitude;
        }
    },

    Marker: {

        toProprietary: function () {

            var mmarker = new Microsoft.Maps.Pushpin(this.location.toProprietary('bingv7'));

            var options = {
                anchor: this.iconAnchor ? new Microsoft.Maps.Point(this.iconAnchor[0], this.iconAnchor[1]) : undefined,
                draggable: this.draggable,
                textOffset: this.labelAnchor ? new Microsoft.Maps.Point(this.labelAnchor[0], this.labelAnchor[1]) : undefined,
                icon: this.iconUrl,
                height: this.iconSize ? this.iconSize[1] : undefined,
                text: this.labelText,
                width: this.iconSize ? this.iconSize[0] : undefined,
                typeName: 'bingMapPin hidden Pin' + this.attributes.model.id
            };

            mmarker.setOptions(options);

            Microsoft.Maps.Events.addHandler(mmarker, 'click', function () {

                mmarker.mapstraction_marker.click.fire();
            });

            return mmarker;
        },

        openBubble: function () {
            // TODO: Add provider code
        },

        hide: function () {
            // TODO: Add provider code
        },

        show: function () {
            // TODO: Add provider code
        },

        update: function () {
            // TODO: Add provider code
        }

    },

    Polyline: {

        toProprietary: function () {
            // TODO: Add provider code
        },

        show: function () {
            // TODO: Add provider code
        },

        hide: function () {
            // TODO: Add provider code
        }
    }
});
