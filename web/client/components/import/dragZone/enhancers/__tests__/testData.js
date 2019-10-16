

// const b64toBlob = require('b64-to-blob');
import Rx from 'rxjs';

import axios from 'axios';
import SHP_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.zip';
import GPX_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.gpx';
import KMZ_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.kmz';
import KML_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.kml';
import GEO_JSON_FILE_URL from 'file-loader!../../../../../test-resources/caput-mundi/caput-mundi.geojson';
import MAP_FILE from 'file-loader!../../../../../test-resources/map.config';
const getFile = (url, fileName = "file") =>
    Rx.Observable.defer( () => axios.get(url, {
        responseType: 'arraybuffer'
    }))
        .map( res =>
            new File([new Blob([res.data], {type: res.headers['response-type']})], fileName)
        );

module.exports = {
    // PDF_FILE: new File(b64toBlob('UEsDBAoAAAAAACGPaktDvrfoAQAAAAEAAAAKAAAAc2FtcGxlLnR4dGFQSwECPwAKAAAAAAAhj2pLQ7636AEAAAABAAAACgAkAAAAAAAAACAAAAAAAAAAc2FtcGxlLnR4dAoAIAAAAAAAAQAYAGILh+1EWtMBy3f86URa0wHLd/zpRFrTAVBLBQYAAAAAAQABAFwAAAApAAAAAAA=', 'application/pdf'), "file.pdf"),
    getShapeFile: () => getFile(SHP_FILE_URL, "shape.zip"),
    getGpxFile: () => getFile(GPX_FILE_URL, "file.gpx"),
    getKmlFile: () => getFile(KML_FILE_URL, "file.kml"),
    getKmzFile: () => getFile(KMZ_FILE_URL, "file.kmz"),
    getGeoJsonFile: (name = "file.json") => getFile(GEO_JSON_FILE_URL, name),
    getMapFile: () => getFile(MAP_FILE, "map.json")
};
