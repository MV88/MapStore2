const PropTypes = require('prop-types');
/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {DropdownList} = require('react-widgets');
const MapInfoUtils = require('../../../../utils/MapInfoUtils');

module.exports = class extends React.Component {
    static propTypes = {
        element: PropTypes.object,
        label: PropTypes.object,
        defaultInfoFormat: PropTypes.object,
        generalInfoFormat: PropTypes.string,
        onInfoFormatChange: PropTypes.func
    };

    static defaultProps = {
        defaultInfoFormat: MapInfoUtils.getAvailableInfoFormat(),
        generalInfoFormat: "text/plain",
        onInfoFormatChange: () => {}
    };

    getInfoFormat = (infoFormats) => {
        return Object.keys(infoFormats).map((infoFormat) => {
            return infoFormat;
        });
    }
    render() {
        // the selected value if missing on that layer should be set to the general info format value and not the first one.
        const data = this.getInfoFormat(this.props.defaultInfoFormat);
        const checkDisabled = !!(this.props.element.featureInfo && this.props.element.featureInfo.viewer);
        return (
            <div>
                {this.props.element.type === "wms" ?
                [(<label
                    id="mapstore-featureinfoformat-label"
                    key="featureinfoformat-label"
                    className="control-label"
                    style={{marginBottom: "10px"}}>
                    {this.props.label}
                </label>),
                (<DropdownList
                    key="format-dropdown"
                    data={data}
                    value={this.props.element.featureInfo ? this.props.element.featureInfo.format : MapInfoUtils.getLabelFromValue(this.props.generalInfoFormat)}
                    defaultValue={data[0]}
                    disabled={checkDisabled}
                    onChange={(value) => {
                        this.props.onInfoFormatChange("featureInfo", Object.assign({}, {
                            ['format']: value,
                            ['viewer']: this.props.element.featureInfo ? this.props.element.featureInfo.viewer : undefined
                        }));
                    }} />
                )] : null}
            </div>
        );
    }
};
