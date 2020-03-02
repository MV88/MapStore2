import React from 'react';
import loadingState from '../../misc/enhancers/loadingState';
import emptyState from '../../misc/enhancers/emptyState';
import propsStreamFactory from '../../misc/enhancers/propsStreamFactory';
import { compose, defaultProps } from 'recompose';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { describeFeatureType } from '../../../observables/wfs';
import { describeProcess } from '../../../observables/wps/describe';
import { Message, HTML } from '../../I18N/I18N';
const TYPES = "ALL";
import { findGeometryProperty } from '../../../utils/ogc/WFS/base';

/**
 * Enhancer that retrieves information about the featuretype attributes and the aggregate process
 * to find out proper information
 */
export default compose(
    defaultProps({
        dataStreamFactory: ($props, {onEditorChange = () => {}, onConfigurationError = () => {}} = {}) =>
            $props
                .distinctUntilChanged( ({layer = {}} = {}, {layer: newLayer} = {})=> layer.name === newLayer.name)
                .switchMap( ({layer} = {}) => Observable.forkJoin(describeFeatureType({layer}), describeProcess(layer.url, "gs:Aggregate"))
                    .do(([result]) => {
                        const geomProp = get(findGeometryProperty(result.data || {}), "name");
                        if (geomProp) {
                        // set the geometry property (needed for synchronization with a map or any other sort of spatial filter)
                            onEditorChange("geomProp", geomProp);
                        }

                    })
                    .map(([result]) => get(result, "data.featureTypes[0].properties") || [])
                    .map(featureTypeProperties => ({
                        loading: false,
                        types: TYPES,
                        featureTypeProperties
                    })
                    ))
                .catch( e => {
                    onConfigurationError(e);
                    return Observable.of({
                        errorObj: e,
                        loading: false,
                        featureTypeProperties: []
                    });
                })
                .startWith({loading: true})
    }),
    propsStreamFactory,
    loadingState(),
    emptyState(
        ({featureTypeProperties = [], types = []}) => featureTypeProperties.length === 0 || types.length === 0,
        () => ({
            title: <Message msgId="widgets.builder.errors.noWidgetsAvailableTitle" />,
            description: <HTML msgId="widgets.builder.errors.noWidgetsAvailableDescription" />
        })
    )
);
