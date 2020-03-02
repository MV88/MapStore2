import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import LMap from '../../../components/map/cesium/Map';
import LLayer from '../../../components/map/cesium/Layer';
import SearchBar from '../../../components/mapcontrols/search/SearchBar';
import SearchResultList from '../../../components/mapcontrols/search/SearchResultList';
import MousePosition from '../../../components/mapcontrols/mouseposition/MousePosition';
import pointOnSurface from 'turf-point-on-surface';
import { changeMapView } from '../../../actions/map';
import { changeMousePosition } from '../../../actions/mousePosition';
import { textSearch, resultsPurge, searchTextChanged, selectSearchItem } from '../../../actions/search';
import { toggleGraticule } from '../actions/controls';
import Localized from '../../../components/I18N/Localized';

class Viewer extends React.Component {
    static propTypes = {
        // redux store slice with map configuration (bound through connect to store at the end of the file)
        map: PropTypes.object,
        layers: PropTypes.array,
        mapOptions: PropTypes.object,
        // redux store dispatch func
        dispatch: PropTypes.func,
        textSearch: PropTypes.func,
        searchTextChanged: PropTypes.func,
        resultsPurge: PropTypes.func,
        changeMapView: PropTypes.func,
        changeMousePosition: PropTypes.func,
        toggleGraticule: PropTypes.func,
        updateMarker: PropTypes.func,
        mousePosition: PropTypes.object,
        messages: PropTypes.object,
        locale: PropTypes.string,
        localeError: PropTypes.string,
        searchResults: PropTypes.array,
        mapStateSource: PropTypes.string,
        showGraticule: PropTypes.bool,
        marker: PropTypes.object,
        searchText: PropTypes.string
    };

    static defaultProps = {
        mapOptions: {
            terrainProvider: {
                type: "ellipsoid"
            }
        }
    };

    onSearchClick = (center, option) => {
        this.props.updateMarker(center, option);
    };

    getMarkerPoint = () => {
        let feature = this.props.marker;
        if (feature.type === "Feature") {
            feature = pointOnSurface(feature);
        } else if (feature.lng !== undefined && feature.lat !== undefined) {
            return feature;
        }
        return {
            lat: feature.geometry && feature.geometry.coordinates[1],
            lng: feature.geometry && feature.geometry.coordinates[0]
        };

    };

    renderLayers = (layers) => {
        if (layers) {

            return layers.map(function(layer) {
                return <LLayer type={layer.type} key={layer.name} options={layer} />;
            }).concat(this.props.showGraticule ? [<LLayer type="graticule" key="graticule" options={{
                name: "graticule",
                visibility: true,
                color: [0.0, 0.0, 0.0, 1.0]
            }}/>] : []).concat(this.props.marker ? [<LLayer type="marker" key="marker" options={{
                name: "marker",
                visibility: true,
                point: this.getMarkerPoint()
            }}/>] : []);
        }
        return null;

    };

    render() {
        // wait for loaded configuration before rendering
        if (this.props.map && this.props.layers && this.props.messages) {
            return (
                <Localized messages={this.props.messages} locale={this.props.locale} loadingError={this.props.localeError}>
                    <div className="fill">
                        <LMap id="map" center={this.props.map.center} zoom={this.props.map.zoom}
                            onMapViewChanges={this.props.changeMapView} mapStateSource={this.props.mapStateSource} mapOptions={this.props.mapOptions}
                            onMouseMove={this.props.changeMousePosition}>
                            {this.renderLayers(this.props.layers)}
                        </LMap>
                        <div style={{
                            position: "absolute",
                            zIndex: 1000,
                            right: "20px",
                            top: "20px",
                            backgroundColor: "white",
                            opacity: 0.7,
                            padding: "10px"
                        }}>
                            <label>Graticule:&nbsp;&nbsp;<input type="checkbox" checked={this.props.showGraticule} onChange={this.props.toggleGraticule}/></label>
                        </div>
                        <SearchBar key="seachBar" removeIcon="remove" searchText={this.props.searchText} onSearchTextChange={this.props.searchTextChanged} onSearch={this.props.textSearch} onSearchReset={this.props.resultsPurge} />
                        <SearchResultList key="nominatimresults"
                            results={this.props.searchResults}
                            onItemClick={this.onSearchClick}
                            afterItemClick={this.props.resultsPurge}
                            mapConfig={this.props.map}/>
                        <MousePosition
                            key="mousePosition"
                            enabled
                            mousePosition={this.props.mousePosition}
                            crs="EPSG:4326"/>
                    </div>
                </Localized>
            );
        }
        return null;
    }
}


import '../../../components/map/cesium/plugins/index';

// connect Redux store slice with map configuration
export default connect((state) => {
    return {
        map: state.map || state.mapConfig && state.mapConfig.map,
        mapStateSource: state.map && state.map.mapStateSource,
        layers: state.mapConfig && state.mapConfig.layers,
        messages: state.locale ? state.locale.messages : null,
        locale: state.locale ? state.locale.current : null,
        localeError: state.locale && state.locale.loadingError ? state.locale.loadingError : undefined,
        searchResults: state.searchResults && state.searchResults.results ? state.searchResults.results : null,
        searchText: state.searchResults && state.searchResults.searchText,
        mousePosition: state.mousePosition && state.mousePosition.position || null,
        showGraticule: state.controls && state.controls.graticule || false,
        marker: state.searchResults && state.searchResults.markerPosition || null
    };
}, {
    textSearch,
    searchTextChanged,
    resultsPurge,
    changeMapView,
    changeMousePosition,
    toggleGraticule,
    updateMarker: selectSearchItem
})(Viewer);
