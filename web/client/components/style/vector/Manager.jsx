/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const PropTypes = require('prop-types');
const React = require('react');
const {castArray, findIndex} = require('lodash');
const {Grid} = require('react-bootstrap');
const assign = require('object-assign');
const uuidv1 = require('uuid/v1');
const tinycolor = require("tinycolor2");

const SwitchPanel = require('../../misc/switch/SwitchPanel');
const StyleCanvas = require('../StyleCanvas');
const Stroke = require('./Stroke');
const Fill = require('./Fill');
const MarkerGlyph = require('./marker/MarkerGlyph');
const MarkerType = require('./marker/MarkerType');
const SymbolLayout = require('./marker/SymbolLayout');
const Text = require('./Text');

const {/*isCircleStyle,*/ getStylerTitle, isSymbolStyle, isMarkerStyle, isStrokeStyle, isFillStyle, addOpacityToColor, isTextStyle} = require('../../../utils/VectorStyleUtils');

/***/
class Manager extends React.Component {
    static propTypes = {
        style: PropTypes.object,
        switchPanelOptions: PropTypes.array,
        lineDashOptions: PropTypes.array,
        onChangeStyle: PropTypes.func,
        onUpdateSymbols: PropTypes.func,
        width: PropTypes.number,
        symbolsPath: PropTypes.string,
        symbolList: PropTypes.array,
        defaultSymbol: PropTypes.object,
        defaultMarker: PropTypes.object,
        markersOptions: PropTypes.object
    };

    static defaultProps = {
        style: {},
        defaultSymbol: {
            iconUrl: "/assets/symbols/first-aid-kit.svg",
            iconAnchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            color: "#ffcc33",
            fillColor: "#ffcc33",
            opacity: 1,
            fillOpacity: 0.2
        },
        defaultMarker: {
            iconGlyph: 'comment',
            iconShape: 'square',
            iconColor: 'blue'
        },
        onChangeStyle: () => {},
        onUpdateSymbols: () => {},
        switchPanelOptions: []
    };

    state = {}


    componentWillMount() {
        const styles = castArray(this.props.style);
        const expanded = styles.map((s, i) => i === 0 || s.filter );
        const locked = styles.map((s, i) => i === 0 );
        this.setState({expanded, locked});
    }
    /**
     * it renders a switch panel styler
     * @prop {object} style
     * @prop {object} switchPanelOptions
    */
    renderPanelStyle = (style = {}, switchPanelOptions = {}, i) => {
        const stylerProps = {
            style,
            onChange: this.change,
            width: this.props.width
        };

        /*getting pieces to render in the styler*/
        // only for marker there is no preview
        const preview = !isMarkerStyle(style) && (<div className="ms-marker-preview" style={{display: 'flex', width: '100%', height: 90}}>
            <StyleCanvas style={{ padding: 0, margin: "auto", display: "block"}}
                shapeStyle={assign({}, style, {
                    color: addOpacityToColor(tinycolor(style.color).toRgb(), style.opacity),
                    fill: addOpacityToColor(tinycolor(style.fillColor || "#FFCC33").toRgb(), style.fillOpacity || 1),
                    radius: 75
                })}
                geomType={getStylerTitle(style)}
                width={90}
                height={90}
            />
        </div>);
        const stroke = isStrokeStyle(style) ? <Stroke {...stylerProps} lineDashOptions={this.props.lineDashOptions} key={"stroke" + i}/> : null;
        const fill = isFillStyle(style) && <Fill {...stylerProps} /> || null;
        const text = isTextStyle(style) && <Text {...stylerProps} /> || null;
        const markerType = (isMarkerStyle(style) || isSymbolStyle(style)) && <MarkerType {...stylerProps} onChangeType={this.changeType}/> || null;
        const markerGlyph = isMarkerStyle(style) && <MarkerGlyph {...stylerProps} markersOptions={this.props.markersOptions}/> || null;
        const symbolLayout = isSymbolStyle(style) && <SymbolLayout {...stylerProps} symbolsPath={this.props.symbolsPath} onUpdateOptions={this.props.onUpdateSymbols} options={this.props.symbolList}/> || null;
        const separator = <hr/>;

        const sections = [markerType, preview, symbolLayout, markerGlyph, text, fill, stroke];

        return (<Grid fluid style={{ width: '100%' }} className="ms-style" key={"grid" + i}>
            <SwitchPanel {...switchPanelOptions} key={"switchPanel" + i}>
                {
                    /*adding the separator between sections*/
                    sections.reduce((prev, curr, k) => [prev, prev && curr && <span key={"separator" + k}>{separator}</span>, curr])
                }
            </SwitchPanel>
        </Grid>);
    }

    render() {
        const styles = castArray(this.props.style);
        return (<span>{styles.map((style, i) => this.renderPanelStyle(
            {...style, id: style.id || uuidv1()},
            {
                expanded: this.state.expanded[i],
                locked: this.state.locked[i],
                onSwitch: () => {
                    this.setState(() => {
                        const expanded = this.state.expanded.map((e, k) => i === k ? !this.state.expanded[i] : this.state.expanded[k]);
                        return {expanded};
                    });
                    let newStyles = styles.map((s, k) => k === i ? {...s, "filter": !this.state.expanded[i]} : s);
                    this.props.onChangeStyle(newStyles);
                },
                title: style.title || getStylerTitle(style) + " Style"},
             i))}</span>);
    }
    change = (id, values) => {
        const styles = castArray(this.props.style);
        const styleChangedIndex = findIndex(styles, { 'id': id});
        if (styleChangedIndex !== -1) {
            let newStyles = styles.map((s, k) => k === styleChangedIndex ? {...s, ...values} : s);
            this.props.onChangeStyle(newStyles);
        }
        // TODO handle if id is missing
    }
    changeType = (id, newType) => {
        const pointStyle = newType === "symbol" ? this.props.defaultSymbol : this.props.defaultMarker;
        const styles = castArray(this.props.style);
        const styleChangedIndex = findIndex(styles, { 'id': id});
        if (styleChangedIndex !== -1) {
            let newStyles = styles.map((s, k) => k === styleChangedIndex ? {...pointStyle, id: s.id, geometry: s.geometry, filter: s.filter} : s);
            this.props.onChangeStyle(newStyles);
        }
    }
}

module.exports = Manager;
