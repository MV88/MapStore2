/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { onLocationChanged } from 'connected-react-router';
import expect from 'expect';
import { isEmpty, isNil } from 'lodash';
import assign from 'object-assign';

import { RESET_CONTROLS, SET_CONTROL_PROPERTY, toggleControl } from '../../actions/controls';
import { CHANGE_DRAWING_STATUS, geometryChanged } from '../../actions/draw';
import {
    CLEAR_CHANGES,
    CLOSE_FEATURE_GRID,
    DELETE_GEOMETRY_FEATURE,
    GEOMETRY_CHANGED,
    GRID_QUERY_RESULT,
    MODES,
    OPEN_FEATURE_GRID,
    SET_LAYER,
    START_SYNC_WMS,
    STOP_SYNC_WMS,
    TOGGLE_MODE,
    TOGGLE_TOOL,
    changePage,
    clearChangeConfirmed,
    closeFeatureGrid,
    closeFeatureGridConfirm,
    closeFeatureGridConfirmed,
    createNewFeatures,
    deleteGeometry,
    moreFeatures,
    openAdvancedSearch,
    openFeatureGrid,
    setTimeSync,
    sort,
    startDrawingFeature,
    startEditingFeature,
    toggleEditMode,
    toggleViewMode,
    zoomAll
} from '../../actions/featuregrid';
import { SET_HIGHLIGHT_FEATURES_PATH } from '../../actions/highlight';
import { CHANGE_LAYER_PROPERTIES, browseData, changeLayerParams } from '../../actions/layers';
import { ZOOM_TO_EXTENT } from '../../actions/map';
import { CLOSE_IDENTIFY, featureInfoClick, hideMapinfoMarker } from '../../actions/mapInfo';
import { SHOW_NOTIFICATION } from '../../actions/notifications';
import { LOAD_FILTER, QUERY_FORM_RESET } from '../../actions/queryform';
import {
    FEATURE_TYPE_SELECTED,
    QUERY,
    QUERY_CREATE,
    UPDATE_QUERY,
    layerSelectedForSearch,
    query,
    querySearchResponse,
    toggleSyncWms
} from '../../actions/wfsquery';
import CoordinatesUtils from '../../utils/CoordinatesUtils';
import { set } from '../../utils/ImmutableUtils';
import {
    askChangesConfirmOnFeatureGridClose,
    autoCloseFeatureGridEpicOnDrowerOpen,
    autoReopenFeatureGridOnFeatureInfoClose,
    closeIdentifyWhenOpenFeatureGrid,
    closeRightPanelOnFeatureGridOpen,
    deleteGeometryFeature,
    featureGridBrowseData,
    featureGridChangePage,
    featureGridLayerSelectionInitialization,
    featureGridSort,
    handleDrawFeature,
    handleEditFeature,
    onClearChangeConfirmedFeatureGrid,
    onCloseFeatureGridConfirmed,
    onFeatureGridCreateNewFeature,
    onFeatureGridGeometryEditing,
    onFeatureGridZoomAll,
    onOpenAdvancedSearch,
    removeWmsFilterOnGridClose,
    replayOnTimeDimensionChange,
    resetControlsOnEnterInEditMode,
    resetEditingOnFeatureGridClose,
    resetGridOnLocationChange,
    resetQueryPanel,
    setHighlightFeaturesPath,
    startSyncWmsFilter,
    stopSyncWmsFilter,
    syncMapWmsFilter,
    triggerDrawSupportOnSelectionChange,
    virtualScrollLoadFeatures
} from '../featuregrid';
import { TEST_TIMEOUT, addTimeoutEpic, testEpic } from './epicTestUtils';

const filterObj = {
    featureTypeName: 'TEST',
    groupFields: [
        {
            id: 1,
            logic: 'OR',
            index: 0
        }
    ],
    filterFields: [],
    spatialField: {
        method: 'BBOX',
        attribute: 'GEOMETRY',
        operation: 'INTERSECTS',
        geometry: {
            id: 'a45697d0-cab1-11e7-a45c-3d37963eccab',
            type: 'Polygon',
            extent: [
                978438.5673027613,
                5527214.592597753,
                994987.1839265019,
                5533558.865945422
            ],
            center: [
                986712.8756146316,
                5530386.729271587
            ],
            coordinates: [
                [
                    [
                        978438.5673027613,
                        5533558.865945422
                    ],
                    [
                        978438.5673027613,
                        5527214.592597753
                    ],
                    [
                        994987.1839265019,
                        5527214.592597753
                    ],
                    [
                        994987.1839265019,
                        5533558.865945422
                    ],
                    [
                        978438.5673027613,
                        5533558.865945422
                    ]
                ]
            ],
            style: {},
            projection: 'EPSG:900913'
        }
    },
    pagination: {
        startIndex: 0,
        maxFeatures: 20
    },
    filterType: 'OGC',
    ogcVersion: '1.1.0',
    sortOptions: null,
    hits: false
};
const features = [{
    type: 'Feature',
    id: 'polygons.1',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-39,
                    39
                ],
                [-39,
                    38
                ],
                [-40,
                    38
                ],
                [-39,
                    39
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'test'
    }
},
{
    type: 'Feature',
    id: 'polygons.2',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-48.77929687,
                    37.54457732
                ],
                [-49.43847656,
                    36.06686213
                ],
                [-46.31835937,
                    35.53222623
                ],
                [-44.47265625,
                    37.40507375
                ],
                [-48.77929687,
                    37.54457732
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'poly2'
    }
},
{
    type: 'Feature',
    id: 'polygons.6',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-50.16357422,
                    28.90239723
                ],
                [-49.69116211,
                    28.24632797
                ],
                [-48.2409668,
                    28.56522549
                ],
                [-50.16357422,
                    28.90239723
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'ads'
    }
},
{
    type: 'Feature',
    id: 'polygons.7',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-64.46777344,
                    33.90689555
                ],
                [-66.22558594,
                    31.95216224
                ],
                [-63.32519531,
                    30.97760909
                ],
                [-64.46777344,
                    33.90689555
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'vvvv'
    }
}
];
const gmlFeatures = [{
    type: 'Feature',
    id: 'polygons.1',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-39,
                    39
                ],
                [-39,
                    38
                ],
                [-40,
                    38
                ],
                [-39,
                    39
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'test'
    }
},
{
    type: 'Feature',
    id: 'polygons.2',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-48.77929687,
                    37.54457732
                ],
                [-49.43847656,
                    36.06686213
                ],
                [-46.31835937,
                    35.53222623
                ],
                [-44.47265625,
                    37.40507375
                ],
                [-48.77929687,
                    37.54457732
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'poly2'
    }
},
{
    type: 'Feature',
    id: 'polygons.6',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-50.16357422,
                    28.90239723
                ],
                [-49.69116211,
                    28.24632797
                ],
                [-48.2409668,
                    28.56522549
                ],
                [-50.16357422,
                    28.90239723
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'ads'
    }
},
{
    type: 'Feature',
    id: 'polygons.7',
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [-64.46777344,
                    33.90689555
                ],
                [-66.22558594,
                    31.95216224
                ],
                [-63.32519531,
                    30.97760909
                ],
                [-64.46777344,
                    33.90689555
                ]
            ]
        ]
    },
    geometry_name: 'geometry',
    properties: {
        name: 'vvvv'
    }
}
];

const state = {
    query: {
        featureTypes: {
            'editing:polygons': {
                geometry: [{
                    label: 'geometry',
                    attribute: 'geometry',
                    type: 'geometry',
                    valueId: 'id',
                    valueLabel: 'name',
                    values: []
                }],
                original: {
                    elementFormDefault: 'qualified',
                    targetNamespace: 'http://geoserver.org/editing',
                    targetPrefix: 'editing',
                    featureTypes: [{
                        typeName: 'polygons',
                        properties: [{
                            name: 'name',
                            maxOccurs: 1,
                            minOccurs: 0,
                            nillable: true,
                            type: 'xsd:string',
                            localType: 'string'
                        },
                        {
                            name: 'geometry',
                            maxOccurs: 1,
                            minOccurs: 0,
                            nillable: true,
                            type: 'gml:Polygon',
                            localType: 'Polygon'
                        }
                        ]
                    }]
                },
                attributes: [{
                    label: 'name',
                    attribute: 'name',
                    type: 'string',
                    valueId: 'id',
                    valueLabel: 'name',
                    values: []
                }]
            }
        },
        data: {},
        result: {
            type: 'FeatureCollection',
            totalFeatures: 4,
            features,
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:EPSG::4326'
                }
            }
        },
        resultError: null,
        isNew: false,
        filterObj: {
            featureTypeName: 'editing:polygons',
            groupFields: [{
                id: 1,
                logic: 'OR',
                index: 0
            }],
            filterFields: [],
            spatialField: {...filterObj.spatialField},
            pagination: {
                startIndex: 0,
                maxFeatures: 20
            },
            filterType: 'OGC',
            ogcVersion: '1.1.0',
            sortOptions: null,
            hits: false
        },
        searchUrl: 'http://localhost:8081/geoserver/wfs?',
        typeName: 'editing:polygons',
        url: 'http://localhost:8081/geoserver/wfs?',
        featureLoading: false
    },
    layers: {
        flat: [{
            id: "TEST_LAYER",
            title: "Test Layer",
            filterObj,
            nativeCrs: "EPSG:4326"
        }]
    },
    highlight: {
        featuresPath: "featuregrid.select"
    }
};

const stateWithGmlGeometry = {
    query: {
        featureTypes: {
            'editing:polygons': {
                geometry: [{
                    label: 'geometry',
                    attribute: 'geometry',
                    type: 'geometry',
                    valueId: 'id',
                    valueLabel: 'name',
                    values: []
                }],
                original: {
                    elementFormDefault: 'qualified',
                    targetNamespace: 'http://geoserver.org/editing',
                    targetPrefix: 'editing',
                    featureTypes: [{
                        typeName: 'polygons',
                        properties: [{
                            name: 'name',
                            maxOccurs: 1,
                            minOccurs: 0,
                            nillable: true,
                            type: 'xsd:string',
                            localType: 'string'
                        },
                        {
                            name: 'geometry',
                            maxOccurs: 1,
                            minOccurs: 0,
                            nillable: true,
                            type: 'gml:Geometry',
                            localType: 'Geometry'
                        }
                        ]
                    }]
                },
                attributes: [{
                    label: 'name',
                    attribute: 'name',
                    type: 'string',
                    valueId: 'id',
                    valueLabel: 'name',
                    values: []
                }]
            }
        },
        data: {},
        result: {
            type: 'FeatureCollection',
            totalFeatures: 4,
            gmlFeatures,
            crs: {
                type: 'name',
                properties: {
                    name: 'urn:ogc:def:crs:EPSG::4326'
                }
            }
        },
        resultError: null,
        isNew: false,
        filterObj: {
            featureTypeName: 'editing:polygons',
            groupFields: [{
                id: 1,
                logic: 'OR',
                index: 0
            }],
            filterFields: [],
            spatialField: {
                method: null,
                attribute: 'geometry',
                operation: 'INTERSECTS',
                geometry: null
            },
            pagination: {
                startIndex: 0,
                maxFeatures: 20
            },
            filterType: 'OGC',
            ogcVersion: '1.1.0',
            sortOptions: null,
            hits: false
        },
        searchUrl: 'http://localhost:8081/geoserver/wfs?',
        typeName: 'editing:polygons',
        url: 'http://localhost:8081/geoserver/wfs?',
        featureLoading: false
    },
    layers: {
        flat: [{
            id: "TEST_LAYER",
            title: "Test Layer"
        }]
    },
    highlight: {
        featuresPath: "featuregrid.select"
    }
};

describe('featuregrid Epics', () => {

    describe('featureGridBrowseData epic', () => {
        const LAYER = state.layers.flat[0];
        const checkInitActions = ([a1, a2, a3]) => {
            // close TOC
            expect(a1.type).toBe(SET_CONTROL_PROPERTY);
            expect(a1.control).toBe('drawer');
            expect(a1.property).toBe('enabled');
            expect(a1.value).toBe(false);
            // set feature grid layer
            expect(a2.type).toBe(SET_LAYER);
            expect(a2.id).toBe(LAYER.id);
            // open feature grid
            expect(a3.type).toBe(OPEN_FEATURE_GRID);
        };
        it('browseData action initializes featuregrid', done => {
            testEpic(featureGridBrowseData, 5, browseData(LAYER), ([ a1, a2, a3, a4, a5 ]) => {
                checkInitActions([a1, a2, a3]);
                // sets the feature type selected for search
                expect(a4.type).toBe(FEATURE_TYPE_SELECTED);
                expect(a5.type).toBe(QUERY_FORM_RESET);
                done();
            }, state);
        });
    });
    it('test startSyncWmsFilter', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST__6",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: []
            },
            layers: {
                flat: [{
                    id: "TEST__6",
                    name: "V_TEST",
                    title: "V_TEST",
                    filterObj,
                    url: "base/web/client/test-resources/wms/getCapabilitiesSingleLayer3044.xml"
                }]
            },
            query: {
                syncWmsFilter: true
            }
        };
        CoordinatesUtils.getProjUrl = () => "base/web/client/test-resources/wms/projDef_3044.txt";

        const newState = assign({}, state, stateFeaturegrid);
        testEpic(startSyncWmsFilter, 1, toggleSyncWms(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case START_SYNC_WMS:
                    expect(action.type).toBe(START_SYNC_WMS);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('set highlight feature path with geometry not supported EDIT MODE', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(3);
            actions.map((action) => {
                switch (action.type) {
                case SET_HIGHLIGHT_FEATURES_PATH:
                    expect(action.featuresPath).toBe('featuregrid.select');
                    break;
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("clean");
                    expect(action.method).toBe("");
                    expect(action.features).toEqual([]);
                    expect(action.options).toEqual({});
                    expect(action.style).toBe(undefined);
                    break;
                case SHOW_NOTIFICATION:
                    expect(action.uid).toBe("notSupportedGeometryWarning");
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        };

        testEpic(setHighlightFeaturesPath, 3, toggleEditMode(), epicResult, stateWithGmlGeometry);
    });

    it('set highlight feature path VIEW MODE', (done) => {
        const epicResult = actions => {
            try {
                expect(actions.length).toBe(2);
                actions.map((action) => {
                    switch (action.type) {
                    case SET_HIGHLIGHT_FEATURES_PATH:
                        expect(action.featuresPath).toBe('featuregrid.select');
                        break;
                    case CHANGE_DRAWING_STATUS:
                        expect(action.status).toBe("clean");
                        expect(action.method).toBe("");
                        expect(action.features).toEqual([]);
                        expect(action.options).toEqual({});
                        expect(action.style).toBe(undefined);
                        break;
                    default:
                        expect(true).toBe(false);
                    }
                });
            } catch (e) {
                done(e);
            }
            done();
        };

        testEpic(setHighlightFeaturesPath, 2, toggleViewMode(), epicResult, state);
    });

    it('set highlight feature path EDIT MODE', (done) => {
        const epicResult = actions => {
            try {
                expect(actions.length).toBe(1);
                actions.map((action) => {
                    switch (action.type) {
                    case SET_HIGHLIGHT_FEATURES_PATH:
                        expect(action.featuresPath).toBe(undefined);
                        break;
                    default:
                        expect(true).toBe(false);
                    }
                });
            } catch (e) {
                done(e);
            }
            done();
        };
        testEpic(setHighlightFeaturesPath, 1, toggleEditMode(), epicResult, state);
    });

    it('trigger draw support on selection change', (done) => {

        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [],
                changes: [],
                features
            }
        };

        const newState = assign({}, state, stateFeaturegrid);
        const epicResult = actions => {
            try {
                expect(actions.length).toBe(1);
                actions.map((action) => {
                    switch (action.type) {
                    case CHANGE_DRAWING_STATUS:
                        expect(action.status).toBe("clean");
                        expect(action.method).toBe("");
                        expect(action.features).toEqual([]);
                        expect(action.options).toEqual({});
                        expect(action.style).toBe(undefined);
                        break;
                    default:
                        expect(true).toBe(false);
                    }
                });
            } catch (e) {
                done(e);
            }
            done();
        };
        testEpic(triggerDrawSupportOnSelectionChange, 1, toggleEditMode(), epicResult, newState);
    });

    it('trigger draw support on selection change with not supported geometry', (done) => {

        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [],
                changes: []
            }
        };

        const newState = assign({}, stateWithGmlGeometry, stateFeaturegrid);

        testEpic(addTimeoutEpic(triggerDrawSupportOnSelectionChange, 50), 1, toggleEditMode(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case TEST_TIMEOUT:
                    done();
                    break;
                default:
                    expect(false).toBe(true);
                }
            });
        }, newState);
    });

    it('test featureGridLayerSelectionInitialization', (done) => {
        testEpic(featureGridLayerSelectionInitialization, 1, layerSelectedForSearch('layer001'), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case SET_LAYER:
                    expect(action.id).toBe('layer001');
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test closeRightPanelOnFeatureGridOpen', (done) => {
        testEpic(closeRightPanelOnFeatureGridOpen, 3, openFeatureGrid(), actions => {
            expect(actions.length).toBe(3);
            actions.map((action, i) => {
                switch (action.type) {
                case SET_CONTROL_PROPERTY: {
                    switch (i) {
                    case 0: {
                        expect(action.control).toBe('metadataexplorer');
                        expect(action.property).toBe('enabled');
                        expect(action.value).toBe(false);
                        expect(action.toggle).toBe(undefined);
                        break;
                    }
                    case 1: {
                        expect(action.control).toBe('annotations');
                        expect(action.property).toBe('enabled');
                        expect(action.value).toBe(false);
                        expect(action.toggle).toBe(undefined);
                        break;
                    }
                    case 2: {
                        expect(action.control).toBe('details');
                        expect(action.property).toBe('enabled');
                        expect(action.value).toBe(false);
                        expect(action.toggle).toBe(undefined);
                        break;
                    }
                    default: expect(true).toBe(false);
                    }
                    break;
                }
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test deleteGeometryFeature', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'select001'}],
                changes: []
            }
        };
        testEpic(deleteGeometryFeature, 2, deleteGeometry(), actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case DELETE_GEOMETRY_FEATURE:
                    expect(action.features).toEqual([{id: 'select001'}]);

                    break;
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("clean");
                    expect(action.method).toBe("");
                    expect(action.features).toEqual([]);
                    expect(action.options).toEqual({});
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, stateFeaturegrid);
    });

    it('test onFeatureGridCreateNewFeature', (done) => {

        testEpic(onFeatureGridCreateNewFeature, 1, createNewFeatures(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("clean");
                    expect(action.method).toBe("");
                    expect(action.features).toEqual([]);
                    expect(action.options).toEqual({});
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test resetGridOnLocationChange', (done) => {
        testEpic(resetGridOnLocationChange, 2, [openFeatureGrid(), onLocationChanged({})], actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case CLOSE_FEATURE_GRID:
                    expect(action.features).toBe(undefined);
                    break;
                case TOGGLE_MODE:
                    expect(action.mode).toBe(MODES.VIEW);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test resetQueryPanel', (done) => {
        const newState = {
            controls: {
                queryPanel: {
                    enabled: true
                }
            }
        };
        testEpic(resetQueryPanel, 1, onLocationChanged({}), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case SET_CONTROL_PROPERTY:
                    expect(action.control).toBe('queryPanel');
                    expect(action.property).toBe('enabled');
                    expect(action.value).toBe(false);
                    expect(action.toggle).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test autoCloseFeatureGridEpicOnDrowerOpen', (done) => {
        const newState = {
            featuregrid: {
                open: true
            }
        };
        testEpic(autoCloseFeatureGridEpicOnDrowerOpen, 1, [openFeatureGrid(), toggleControl('drawer')], actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CLOSE_FEATURE_GRID:
                    expect(action.type).toBe(CLOSE_FEATURE_GRID);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test askChangesConfirmOnFeatureGridClose', (done) => {
        testEpic(askChangesConfirmOnFeatureGridClose, 1, closeFeatureGridConfirm(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CLOSE_FEATURE_GRID:
                    expect(action.type).toBe(CLOSE_FEATURE_GRID);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test onClearChangeConfirmedFeatureGrid', (done) => {
        testEpic(onClearChangeConfirmedFeatureGrid, 2, clearChangeConfirmed(), actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case TOGGLE_TOOL:
                    expect(action.tool).toBe('clearConfirm');
                    expect(action.value).toBe(false);
                    break;
                case CLEAR_CHANGES:
                    expect(action.type).toBe(CLEAR_CHANGES);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test onCloseFeatureGridConfirmed', (done) => {
        testEpic(onCloseFeatureGridConfirmed, 2, closeFeatureGridConfirmed(), actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case TOGGLE_TOOL:
                    expect(action.tool).toBe('featureCloseConfirm');
                    expect(action.value).toBe(false);
                    break;
                case SET_CONTROL_PROPERTY:
                    expect(action.control).toBe('drawer');
                    expect(action.property).toBe('enabled');
                    expect(action.value).toBe(false);
                    expect(action.toggle).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });


    it('test onFeatureGridZoomAll', (done) => {
        testEpic(onFeatureGridZoomAll, 1, zoomAll(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case ZOOM_TO_EXTENT:
                    expect(action.extent).toEqual([-66.22558594, 28.24632797, -39, 39]);
                    expect(action.crs).toBe('EPSG:4326');
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {...state, featuregrid: {features}});
    });

    it('test resetControlsOnEnterInEditMode', (done) => {
        testEpic(resetControlsOnEnterInEditMode, 1, toggleEditMode(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case RESET_CONTROLS:
                    expect(action.skip).toEqual(['query']);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });

    it('test closeIdentifyWhenOpenFeatureGrid', (done) => {
        testEpic(closeIdentifyWhenOpenFeatureGrid, 1, openFeatureGrid(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CLOSE_IDENTIFY:
                    expect(action.type).toBe(CLOSE_IDENTIFY);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {});
    });


    it('test stopSyncWmsFilter', (done) => {
        testEpic(stopSyncWmsFilter, 2, toggleSyncWms(), actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case STOP_SYNC_WMS:
                    expect(action.type).toBe(STOP_SYNC_WMS);
                    break;
                case CHANGE_LAYER_PROPERTIES:
                    expect(action.layer).toBe('TEST_LAYER');
                    expect(action.newProperties).toEqual({filterObj: undefined});
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, {
            featuregrid: {
                selectedLayer: 'TEST_LAYER'
            }
        });
    });

    it('test handleDrawFeature', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'TEST_LAYER'}, {id: 'layer002'}],
                changes: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);
        testEpic(handleDrawFeature, 1, startDrawingFeature(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("drawOrEdit");
                    expect(action.method).toBe("Polygon");
                    expect(action.owner).toBe("featureGrid");
                    expect(action.features).toEqual([{id: 'TEST_LAYER', type: 'Feature'}]);
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test handleEditFeature', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'TEST_LAYER'}, {id: 'layer002'}],
                changes: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);
        testEpic(handleEditFeature, 1, startEditingFeature(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("drawOrEdit");
                    expect(action.method).toBe("Polygon");
                    expect(action.owner).toBe("featureGrid");
                    expect(action.features).toEqual([{id: 'TEST_LAYER', type: 'Feature'}]);
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });
    it('test resetEditingOnFeatureGridClose', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'TEST_LAYER'}, {id: 'layer002'}],
                changes: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);

        testEpic(resetEditingOnFeatureGridClose, 1, [openFeatureGrid(), toggleEditMode(), closeFeatureGrid()], actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("clean");
                    expect(action.method).toBe("");
                    expect(action.features).toEqual([]);
                    expect(action.options).toEqual({});
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test onFeatureGridGeometryEditing', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);

        testEpic(onFeatureGridGeometryEditing, 1, [geometryChanged([{id: 'polygons.1', geometry: { type: 'Polygon', coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, 90]]]}, geometry_name: 'geometry' }], 'featureGrid', '')], actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case GEOMETRY_CHANGED:
                    expect(action.features).toEqual([{
                        id: 'polygons.1',
                        type: 'Feature',
                        _new: 'polygons._new',
                        geometry: { type: 'Polygon', coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, 90]]]},
                        geometry_name: 'geometry'
                    }]);

                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test onFeatureGridGeometryEditing with', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);

        testEpic(onFeatureGridGeometryEditing, 2, [geometryChanged([{id: 'polygons.1', geometry: { type: 'Polygon', coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, 90]]]}, geometry_name: 'geometry' }], 'featureGrid', 'enterEditMode')], actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case GEOMETRY_CHANGED:
                    expect(action.features).toEqual([{
                        id: 'polygons.1',
                        type: 'Feature',
                        _new: 'polygons._new',
                        geometry: { type: 'Polygon', coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, 90]]]},
                        geometry_name: 'geometry'
                    }]);
                    break;
                case CHANGE_DRAWING_STATUS:
                    expect(action.status).toBe("drawOrEdit");
                    expect(action.method).toBe("Polygon");
                    expect(action.owner).toBe("featureGrid");
                    expect(action.features).toEqual([{
                        id: 'polygons.1',
                        type: 'Feature',
                        _new: 'polygons._new',
                        geometry: { type: 'Polygon', coordinates: [[[-180, 90], [180, 90], [180, -90], [-180, 90]]]},
                        geometry_name: 'geometry'
                    }]);
                    expect(action.style).toBe(undefined);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });

    it('test syncMapWmsFilter with only: nativeCrs', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: []
            },
            layers: {
                flat: [{
                    id: "TEST_LAYER",
                    title: "Test Layer",
                    nativeCrs: "EPSG:4326"
                }]
            },
            query: {
                filterObj: {}
            }
        };
        const newState = assign({}, state, stateFeaturegrid);

        testEpic(addTimeoutEpic(syncMapWmsFilter), 1, [{type: UPDATE_QUERY}, {type: START_SYNC_WMS}], actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case CHANGE_LAYER_PROPERTIES: {
                    expect(isEmpty(action.newProperties.filterObj)).toBeTruthy();
                    expect(isNil(action.newProperties.nativeCrs)).toBeTruthy();
                    break;
                }
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });


    it('test startSyncWmsFilter with nativeCrs present in layer props', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST__6",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: []
            },
            layers: {
                flat: [{
                    id: "TEST__6",
                    name: "V_TEST",
                    title: "V_TEST",
                    filterObj,
                    nativeCrs: "EPSG:3044",
                    url: "base/web/client/test-resources/wms/getCapabilitiesSingleLayer3044.xml"
                }]
            },
            query: {
                syncWmsFilter: true
            }
        };
        const newState = assign({}, state, stateFeaturegrid);
        testEpic(startSyncWmsFilter, 1, toggleSyncWms(), actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case START_SYNC_WMS:
                    expect(action.type).toBe(START_SYNC_WMS);
                    break;
                default:
                    expect(true).toBe(false);
                }
            });
            done();
        }, newState);
    });


    it('test onOpenAdvancedSearch', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                // layer id with `.` and `:`
                selectedLayer: "TEST:A.LAYER__6",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: [],
                advancedFilters: {
                    "TEST:A.LAYER__6": {
                        "someFilter": "something"
                    }
                }
            },
            layers: {
                flat: [{
                    id: "TEST:A.LAYER__6",
                    name: "V_TEST",
                    title: "V_TEST",
                    filterObj,
                    url: "base/web/client/test-resources/wms/getCapabilitiesSingleLayer3044.xml"
                }]
            },
            query: {
                syncWmsFilter: true
            }
        };

        const newState = assign({}, state, stateFeaturegrid);
        testEpic(onOpenAdvancedSearch, 4, [openAdvancedSearch(), toggleControl('queryPanel', 'enabled')], actions => {

            expect(actions.length).toBe(4);
            actions.map((action) => {
                switch (action.type) {
                case LOAD_FILTER:
                    // load filter, if present
                    expect(action.filter).toExist();
                    break;
                case CHANGE_DRAWING_STATUS:
                    //  throw drawstatechange if drawStatus is not clean on queryPanel close
                    expect(action.status).toBe('clean');
                    break;
                default:
                    expect(true).toBe(true);
                }
            });
            done();
        }, newState);
    });

    it('test virtualScrollLoadFeatures to dispatch query action', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST__6",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: [],
                pages: [],
                pagination: {
                    size: 10
                },
                features: []
            }
        };

        const newState = assign({}, state, stateFeaturegrid);
        testEpic(virtualScrollLoadFeatures, 1, [moreFeatures({startPage: 0, endPage: 2})], actions => {

            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case QUERY:
                    expect(action.filterObj.pagination.startIndex).toBe(0);
                    expect(action.filterObj.pagination.maxFeatures).toBe(30);
                    break;
                default:
                    expect(true).toBe(true);
                }
            });
            done();
        }, newState);
    });
    it('test virtualScrollLoadFeatures to dispatch also viewparams', (done) => {
        const stateFeaturegrid = {
            layers: {
                flat: [{
                    id: "TEST__6",
                    title: "Test Layer",
                    name: 'editing:polygons',
                    params: {
                        viewParams: "a:b"
                    }
                }]
            },
            featuregrid: {
                open: true,
                selectedLayer: "TEST__6",
                mode: 'EDIT',
                select: [{ id: 'polygons.1', _new: 'polygons._new' }],
                changes: [],
                pages: [],
                pagination: {
                    size: 10
                },
                features: []
            }
        };

        const newState = assign({}, state, stateFeaturegrid);
        testEpic(virtualScrollLoadFeatures, 1, [moreFeatures({ startPage: 0, endPage: 2 })], actions => {

            expect(actions.length).toBe(1);
            actions.map((action) => {
                switch (action.type) {
                case QUERY:
                    expect(action.filterObj.pagination.startIndex).toBe(0);
                    expect(action.filterObj.pagination.maxFeatures).toBe(30);
                    expect(action.queryOptions.viewParams).toBe("a:b");
                    break;
                default:
                    expect(true).toBe(true);
                }
            });
            done();
        }, newState);
    });
    it('test virtualScrollLoadFeatures to emit GRID_QUERY_RESULT on query success', (done) => {
        const stateFeaturegrid = {
            featuregrid: {
                open: true,
                selectedLayer: "TEST__6",
                mode: 'EDIT',
                select: [{id: 'polygons.1', _new: 'polygons._new'}],
                changes: [],
                pages: [],
                pagination: {
                    size: 10

                },
                features: []
            }
        };
        const newState = assign({}, state, stateFeaturegrid);
        testEpic(virtualScrollLoadFeatures, 2, [moreFeatures({startPage: 0, endPage: 2}), querySearchResponse({features: Array(30)}, " ", {pagination: {startIndex: 0, maxFeatures: 30}})], actions => {
            expect(actions.length).toBe(2);
            actions.map((action) => {
                switch (action.type) {
                case QUERY:
                    expect(action.filterObj.pagination.startIndex).toBe(0);
                    expect(action.filterObj.pagination.maxFeatures).toBe(30);
                    break;
                case GRID_QUERY_RESULT:
                    expect(action.features.length).toBe(30);
                    expect(action.pages.length).toBe(3);
                    expect(action.pages[0]).toBe(0);
                    expect(action.pages[1]).toBe(10);
                    expect(action.pages[2]).toBe(20);
                    break;
                default:
                    expect(true).toBe(true);
                }
            });
            done();
        }, newState);
    });

    it('removeWmsFilterOnGridClose', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === CHANGE_LAYER_PROPERTIES) {
                    expect(action.layer).toBe("TEST");
                    done();
                }
            });
        };

        testEpic(addTimeoutEpic(removeWmsFilterOnGridClose), 1, [openFeatureGrid(), closeFeatureGrid()], epicResult, {
            query: { syncWmsFilter: true},
            featuregrid: { selectedLayer: "TEST"}
        });
    });
    it('removeWmsFilterOnGridClose does not remove filter on featureinfo open', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === TEST_TIMEOUT) {
                    done();
                }
            });
        };
        testEpic(addTimeoutEpic(removeWmsFilterOnGridClose, 60), 1, [openFeatureGrid(), featureInfoClick(), closeFeatureGrid()], epicResult, {
            query: { syncWmsFilter: true },
            featuregrid: { selectedLayer: "TEST" }
        });
    });
    it('removeWmsFilterOnGridClose does not remove filter on advanced search open', (done) => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === TEST_TIMEOUT) {
                    done();
                }
            });
        };
        testEpic(addTimeoutEpic(removeWmsFilterOnGridClose, 60), 1, [openFeatureGrid(), openAdvancedSearch(), closeFeatureGrid()], epicResult, {
            query: { syncWmsFilter: true },
            featuregrid: { selectedLayer: "TEST" }
        });
    });
    it('autoReopenFeatureGridOnFeatureInfoClose', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === OPEN_FEATURE_GRID) {
                    done();
                }
            });
        };
        testEpic(autoReopenFeatureGridOnFeatureInfoClose, 1, [openFeatureGrid(), featureInfoClick(), hideMapinfoMarker(), closeFeatureGrid()], epicResult );
    });

    it('autoReopenFeatureGridOnFeatureInfoClose: cancel ability to reopen feature grid on drawer toggle control', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            expect(actions[0].type).toBe(TEST_TIMEOUT);
            done();
        };
        testEpic(addTimeoutEpic(autoReopenFeatureGridOnFeatureInfoClose), 1, [openFeatureGrid(), featureInfoClick(), toggleControl('drawer'), hideMapinfoMarker(), closeFeatureGrid()], epicResult );
    });

    it('autoReopenFeatureGridOnFeatureInfoClose: other toggle control apart from drawer cannot cancel ability to open feature grid', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            expect(actions[0].type).toBe(OPEN_FEATURE_GRID);
            done();
        };
        testEpic(autoReopenFeatureGridOnFeatureInfoClose, 1, [openFeatureGrid(), featureInfoClick(), toggleControl('notdrawer'), hideMapinfoMarker(), closeFeatureGrid()], epicResult );
    });

    it('autoReopenFeatureGridOnFeatureInfoClose: feature info doesn\'t reopen feature grid after close', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(2);
            expect(actions[0].type).toBe(OPEN_FEATURE_GRID);
            expect(actions[1].type).toBe(TEST_TIMEOUT);
            done();
        };
        testEpic(addTimeoutEpic(autoReopenFeatureGridOnFeatureInfoClose, 20), 2, [
            openFeatureGrid(),
            featureInfoClick(),
            hideMapinfoMarker(),
            closeFeatureGrid(),
            featureInfoClick(),
            hideMapinfoMarker()],
        epicResult);
    });

    it('featureGridChangePage', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === QUERY) {
                    done();
                }
            });
        };
        testEpic(featureGridChangePage, 1, [changePage(0, 10)], epicResult);
    });
    it('featureGridChangePage manages queryOptions viewparams', done => {

        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === QUERY) {
                    expect(action.queryOptions.viewParams).toBe("a:b");
                    done();
                }
            });
        };
        testEpic(featureGridChangePage, 1, [changePage(0, 10)], epicResult, () => ({
            layers: {
                flat: [{
                    id: "TEST_LAYER",
                    title: "Test Layer",
                    name: 'editing:polygons',
                    params: {
                        viewParams: "a:b"
                    }
                }]
            }, featuregrid: {
                open: true,
                selectedLayer: "TEST_LAYER",
                changes: []
            }
        }));
    });

    it('featureGridSort', done => {
        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === QUERY) {
                    done();
                }
            });
        };
        testEpic(featureGridSort, 1, [sort("ATTR", "ASC")], epicResult, {
            featuregrid: {
                pagination: {
                    size: 10
                }
            }
        });
    });

    it('featureGridSort manages queryOptions viewparams', done => {

        const epicResult = actions => {
            expect(actions.length).toBe(1);
            actions.map((action) => {
                if (action.type === QUERY) {
                    expect(action.queryOptions.viewParams).toBe("a:b");
                    done();
                }
            });
        };
        testEpic(featureGridSort, 1, [sort("ATTR", "ASC")], epicResult, () => ({
            layers: {
                flat: [{
                    id: "TEST_LAYER",
                    title: "Test Layer",
                    name: 'editing:polygons',
                    params: {
                        viewParams: "a:b"
                    }
                }]
            }, featuregrid: {
                pagination: {
                    size: 10
                },
                open: true,
                selectedLayer: "TEST_LAYER",
                changes: []
            }
        }));
    });
    describe('replayOnTimeDimensionChange', () => {
        const SEARCH_URL = '/test-url';
        const FILTER_OBJECT = { "dummy": "object" };
        const TEST_STATE_OPEN_BASE = {
            layers: {
                flat: [{
                    id: "TEST_LAYER",
                    title: "Test Layer",
                    name: 'editing:polygons',
                    params: {
                        viewParams: "a:b"
                    }
                }]
            },
            featuregrid: {
                pagination: {
                    size: 10
                },
                open: true,
                selectedLayer: "TEST_LAYER",
                changes: []
            }
        };
        const TEST_STATE_CLOSED = set('featuregrid.open', false, TEST_STATE_OPEN_BASE);
        const TEST_STATE_SYNC_ACTIVE = set('featuregrid.timeSync', true, TEST_STATE_OPEN_BASE);
        const isSameQuery = a => {
            expect(a.type).toBe(QUERY_CREATE);
            expect(a.searchUrl).toBe(SEARCH_URL);
            expect(a.filterObj).toBe(FILTER_OBJECT);
        };
        it('toggle on setTimeSync if FG is open', done => {
            testEpic(replayOnTimeDimensionChange, 1, [query(SEARCH_URL, FILTER_OBJECT), setTimeSync(false)], ([a]) => {
                isSameQuery(a);
                done();
            }, TEST_STATE_OPEN_BASE);
        });
        it('do not toggle if FG is closed', done => {
            testEpic(addTimeoutEpic(replayOnTimeDimensionChange, 10), 1, [query(SEARCH_URL, FILTER_OBJECT), setTimeSync(true)], ([a]) => {
                expect(a.type).toBe(TEST_TIMEOUT);
                done();
            }, TEST_STATE_CLOSED);
        });
        it('toggle with time change', done => {
            testEpic(replayOnTimeDimensionChange, 1, [query(SEARCH_URL, FILTER_OBJECT), changeLayerParams("TEST_LAYER", { time: '123' })], ([a]) => {
                isSameQuery(a);
                done();
            }, TEST_STATE_SYNC_ACTIVE);
        });
        it('do not toggle with time change, sync disabled', done => {
            testEpic(addTimeoutEpic(replayOnTimeDimensionChange, 10), 1, [query(SEARCH_URL, FILTER_OBJECT), changeLayerParams("TEST_LAYER", { time: '123' })], ([a]) => {
                expect(a.type).toBe(TEST_TIMEOUT);
                done();
            }, TEST_STATE_OPEN_BASE);
        });
        it('do not toggle with time change if layer do not change time', done => {
            testEpic(addTimeoutEpic(replayOnTimeDimensionChange, 10), 1, [query(SEARCH_URL, FILTER_OBJECT), changeLayerParams("OTHER_LAYER", { time: '123' })], ([a]) => {
                expect(a.type).toBe(TEST_TIMEOUT);
                done();
            }, TEST_STATE_SYNC_ACTIVE);
        });
        it('do not toggle with time change if param changed is not the time', done => {
            testEpic(addTimeoutEpic(replayOnTimeDimensionChange, 10), 1, [query(SEARCH_URL, FILTER_OBJECT), changeLayerParams("TEST_LAYER", { elevation: '123' })], ([a]) => {
                expect(a.type).toBe(TEST_TIMEOUT);
                done();
            }, TEST_STATE_SYNC_ACTIVE);
        });
        it('do not toggle with time change if feature grid is closed', done => {
            const TEST_STATE_TIME_ACTIVE_CLOSED = set('featuregrid.timeSync', true, TEST_STATE_CLOSED);
            testEpic(addTimeoutEpic(replayOnTimeDimensionChange, 10), 1, [query(SEARCH_URL, FILTER_OBJECT), changeLayerParams("TEST_LAYER", { time: '123' })], ([a]) => {
                expect(a.type).toBe(TEST_TIMEOUT);
                done();
            }, TEST_STATE_TIME_ACTIVE_CLOSED);
        });

    });
});
