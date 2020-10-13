/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

import {useEffect, useRef, useState} from "react";

/**
 * hook used to load in an asynchronous way a tool
 * @param {string} mapType can be openlayers, leaflet or cesium
 * @param {string} toolName the name of the tool, should match a file in web/client/map/<mapType> folder
 * @return {[boolean, object, object]} loaded if the tool has been correctly loaded, impl.current is the reference to the tool, error is an object containing the possible error that can occur while loading
 */
const useMapTool = (mapType = "openlayers", toolName = "") => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);
    const impl = useRef();
    useEffect(() => {
        if (mapType && !impl.current) {
            setLoaded(false);
            setError(null);
            import(`../${mapType}/${toolName}`)
                .then(tool => {
                    impl.current = tool.default;
                    setLoaded(true);
                })
                .catch((e) => {
                    setError(e);
                });
        }
        return () => {};
    }, [ mapType ]);
    return [loaded, impl.current, error];
};

export default useMapTool;

