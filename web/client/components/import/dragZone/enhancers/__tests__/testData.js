/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.p
 */

import Rx from 'rxjs';
import axios from 'axios';

import SHP_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.zip';
import GPX_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.gpx';
import KMZ_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.kmz';
import KML_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.kml';
import GEO_JSON_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.geojson';
import MAP_FILE from 'file-loader!../../../../../test-resources/map.config';
import UNSUPPORTED_MAP_FILE from 'file-loader!../../../../../test-resources/unsupportedMap.config';

const getFile = (url, fileName = "file") =>
    Rx.Observable.defer( () => axios.get(url, {
        responseType: 'arraybuffer'
    }))
        .map( res =>
            new File([new Blob([res.data], {type: res.headers['response-type']})], fileName)
        );

export default {
    getShapeFile: () => getFile(SHP_FILE_URL, "shape.zip"),
    getGpxFile: () => getFile(GPX_FILE_URL, "file.gpx"),
    getKmlFile: () => getFile(KML_FILE_URL, "file.kml"),
    getKmzFile: () => getFile(KMZ_FILE_URL, "file.kmz"),
    getGeoJsonFile: (name = "file.json") => getFile(GEO_JSON_FILE_URL, name),
    getMapFile: () => getFile(MAP_FILE, "map.json"),
    getUnsupportedMapFile: () => getFile(UNSUPPORTED_MAP_FILE, "unsupportedMap.json")
};
