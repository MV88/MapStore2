/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {useEffect, useRef} from 'react';
import useMapTool from "../../../map/hooks/use-map-tool";

const defaultOpt = {
    follow: true, // follow with zoom and pan the user's location
    remainActive: true,
    metric: true,
    stopFollowingOnDrag: true,
    keepCurrentZoomLevel: false,
    locateOptions: {
        maximumAge: 2000,
        enableHighAccuracy: false,
        timeout: 10000,
        maxZoom: 18
    }
};
/**
 * Common interface shared across multiple map types
 * @prop {object} map the map object
 * @prop {string} mapType can be openlayers, leaflet or cesium
 * @prop {string} status locate status: DISABLED, FOLLOWING, ENABLED, LOCATING, PERMISSION_DENIED
 * @prop {string} message a message to show
 * @prop {function} changeLocateState callback to run when state changes
 * @prop {function} onLocateError callback to run when an error occurs
 */
const LocateTool = ({map, mapType, status, messages, changeLocateState, onLocateError}) => {
    const locateInstance = useRef();
    const [loaded, Impl, error] = useMapTool(mapType, 'locate');

    const onStateChange = (state) => {
        if (status !== state) {
            changeLocateState(state);
        }
    };

    const onLocationError = (err) => {
        onLocateError(err.message);
        changeLocateState("DISABLED");
    };

    /**
     * when loaded do something, use the start method
     */
    useEffect(() => {
        if (loaded) {
            // the Locate tool is a class and we can create an instance of it
            // other possibilities are to use a react component
            locateInstance.current = new Impl();
            locateInstance.current.start({
                map, options: defaultOpt, messages, status, onStateChange, onLocationError
            });
        }
        return () => {
            locateInstance.current?.clear();
        };
    }, [loaded]);

    /**
     * when some of the props changes run an update
     */
    useEffect(() => {
        locateInstance.current?.update({status, messages});
    }, [status, messages, loaded]);

    /**
     * when there is an error run the callbacks that handles it
     */
    useEffect(() => {
        if (error) {
            onLocateError(error);
        }
    }, [error]);

    return null;
};

export default LocateTool;

