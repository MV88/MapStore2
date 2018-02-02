var markerIcon = require('./img/marker-icon.png');
var markerShadow = require('./img/marker-shadow.png');
const {DEFAULT_ANNOTATIONS_STYLES} = require('../../../utils/AnnotationsUtils');
var ol = require('openlayers');
const {reprojectGeoJson} = require('../../../utils/CoordinatesUtils');

const assign = require('object-assign');

const image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

const Icons = require('../../../utils/openlayers/Icons');
const {hexToRgb} = require('../../../utils/ColorUtils');

const defaultStyles = {
  'Point': () => [new ol.style.Style({
      image: image
  })],
  'LineString': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiLineString': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiPoint': () => [new ol.style.Style({
    image: image
  })],
  'MultiPolygon': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'Polygon': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'GeometryCollection': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  })],
  'Circle': () => [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
})],
  'marker': (options) => [new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [14, 41],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: markerShadow
    })
}), new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: markerIcon
    }),
    text: new ol.style.Text({
        text: options.label,
        scale: 1.25,
    offsetY: 8,
        fill: new ol.style.Fill({color: '#000000'}),
        stroke: new ol.style.Stroke({color: '#FFFFFF', width: 2})
    })
    })]
};

var styleFunction = function(feature, options) {
    return defaultStyles[feature.getGeometry().getType()](options);
};

function getMarkerStyle(options) {
    if (options.style.iconUrl) {
        return Icons.standard.getIcon(options);
    }
    const iconLibrary = options.style.iconLibrary || 'extra';
    if (Icons[iconLibrary]) {
        return Icons[iconLibrary].getIcon(options);
    }
    return null;
}

const getValidStyle = (geomType, options = { style: DEFAULT_ANNOTATIONS_STYLES} ) => {
    let style;
    if (geomType === "MultiLineString" || geomType === "LineString") {
        style = options.style[geomType] ? {
            stroke: new ol.style.Stroke( options.style[geomType] && options.style[geomType].stroke ? options.style[geomType].stroke : {
                color: hexToRgb(options.style && options.style[geomType].color || "#0000FF").concat([options.style[geomType].opacity || 1]),
                lineDash: options.style.highlight ? [10] : [0],
                width: options.style[geomType].weight || 1
            }) } : {
                stroke: new ol.style.Stroke( DEFAULT_ANNOTATIONS_STYLES[geomType] && DEFAULT_ANNOTATIONS_STYLES[geomType].stroke ? DEFAULT_ANNOTATIONS_STYLES[geomType].stroke : {
                    color: hexToRgb(options.style && DEFAULT_ANNOTATIONS_STYLES[geomType].color || "#0000FF").concat([DEFAULT_ANNOTATIONS_STYLES[geomType].opacity || 1]),
                    lineDash: options.style.highlight ? [10] : [0],
                    width: DEFAULT_ANNOTATIONS_STYLES[geomType].weight || 1
                }) };
        return new ol.style.Style(style);
    }

    if ((geomType === "MultiPoint" || geomType === "Point") && options.style[geomType].iconUrl || options.style[geomType].iconGlyph) {
        return getMarkerStyle({style: {...options.style[geomType], highlight: options.style.highlight}});

    }
    if (geomType === "MultiPolygon" || geomType === "Polygon") {
        style = {
            stroke: new ol.style.Stroke( options.style[geomType].stroke ? options.style[geomType].stroke : {
                color: hexToRgb(options.style && options.style[geomType].color || "#0000FF").concat([options.style[geomType].opacity || 1]),
                lineDash: options.style.highlight ? [10] : [0],
                width: options.style[geomType].weight || 1
            }),
            fill: new ol.style.Fill(options.style[geomType].fill ? options.style[geomType].fill : {
                color: hexToRgb(options.style && options.style[geomType].fillColor || "#0000FF").concat([options.style[geomType].fillOpacity || 1])
            })
        };
        return new ol.style.Style(style);
    }
};

function getStyle(options) {

    let style = options.nativeStyle;
    const geomType = (options.style && options.style.type) || (options.features && options.features[0] ? options.features[0].geometry.type : undefined);
    if (!style && options.style) {
        style = {
            stroke: new ol.style.Stroke( options.style.stroke ? options.style.stroke : {
                color: hexToRgb(options.style && options.style.color || "#0000FF").concat([options.style.opacity || 1]),
                lineDash: options.style.highlight ? [10] : [0],
                width: options.style.weight || 1
            }),
            fill: new ol.style.Fill(options.style.fill ? options.style.fill : {
                color: hexToRgb(options.style && options.style.fillColor || "#0000FF").concat([options.style.fillOpacity || 1])
            })
        };

        if (geomType === "Point") {
            style = {
                image: new ol.style.Circle(assign({}, style, {radius: options.style.radius || 5}))
            };
        }
        if (options.style.iconUrl || options.style.iconGlyph) {
            const markerStyle = getMarkerStyle(options);

            style = function(f) {
                var feature = this || f;
                const type = feature.getGeometry().getType();
                switch (type) {
                    case "Point":
                    case "MultiPoint":
                        return markerStyle;
                    default:
                        return styleFunction(feature);
                }
            };
        } else {
            style = new ol.style.Style(style);
        }

        /*
        ***********************************************************************
        managing new style structure
        */
        if (geomType === "GeometryCollection") {
            style = function(f) {
                var feature = this || f;
                let markerStyles;
                /*const geojsonFormat = new ol.format.GeoJSON();
                let newFeature = reprojectGeoJson(geojsonFormat.writeFeatureObject(feature.clone()), "EPSG:3857", "EPSG:4326");*/

                let type = feature.getGeometry().getType();
                if (feature.getGeometry().getType() === "GeometryCollection") {
                    let geometries = feature.getGeometry().getGeometries();
                    let styles = geometries.reduce((p, c) => {
                        type = c.getType();
                        if (type === "Point" || type === "MultiPoint") {
                            markerStyles = getMarkerStyle({style: {...options.style[type], highlight: options.style.highlight}});
                            return p.concat(markerStyles.map(m => {
                                m.setGeometry(c);
                                return m;
                            }));
                        }
                        let gStyle = getValidStyle(type, options);
                        gStyle.setGeometry(c);
                        return p.concat([gStyle]);
                    }, []);
                    return styles;
                }
                if (type === "Point" || type === "MultiPoint") {
                    // markerStyles = getMarkerStyle({style: {...options.style[type], highlight: options.style.highlight}});
                    return new ol.style.Style({
                      image: image,
                      geometry: feature.getGeometry()
                  });/* markerStyles.map(m => {
                        m.setGeometry(feature.getGeometry());
                        return m;
                    });*/
                }
                return getValidStyle(type, options);
            };
            return style;
        }
        return getValidStyle(geomType, options);
    }
    /*
    ***********************************************************************
    */
    return (options.styleName && !options.overrideOLStyle) ? (feature) => {
        if (options.styleName === "marker") {
            const type = feature.getGeometry().getType();
            switch (type) {
                case "Point":
                case "MultiPoint":
                    return defaultStyles.marker(options);
                default:
                    break;
            }
        }
        return defaultStyles[options.styleName](options);
    } : style || styleFunction;
}


module.exports = {
    getStyle,
    getMarkerStyle,
    styleFunction
};
