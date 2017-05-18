/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const React = require('react');
const Dock = require('react-dock');
/**
 * Component for rendering a dockablePanel panel.
 * @memberof components.dockablePanel
 * @class
 * @prop {string} id. The <div> id value of the dockable panel
 * @prop {string} dimMode. If none - content is not dimmed, if transparent - pointer events are disabled (so you can click through it), if opaque - click on dim area closes the dock. Default is none
 * @prop {number} dockSize. Size of dock panel (width or height, depending on position). Is a % value [0~1]
 * @prop {bool} isVisible. If true, dock is visible
 * @prop {number} maxDockSize. The maximum extension in %
 * @prop {number} minDockSize. The minimum extension in %
 * @prop {string} position. Side to dock (left, right, top or bottom). Default is bottom.
 * @prop {bool} fluid. If true, resize dock proportionally on window resize.
 * @prop {function} setDockSize. The metod called when the dockable panel is resized
 * @prop {object} toolbar. it contains the toolbar
 * @prop {object} toolbarHeight. the height of the toolbar in px
 * @prop {object} wrappedComponent. A connected Component to be rendered inside the dock panel
 * @prop {number} zIndex. Positioned below dialogs, above left menu
 *
 */
const DockablePanel = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        dimMode: React.PropTypes.string,
        dockSize: React.PropTypes.number,
        isVisible: React.PropTypes.bool,
        fluid: React.PropTypes.bool,
        maxDockSize: React.PropTypes.number,
        minDockSize: React.PropTypes.number,
        position: React.PropTypes.string,
        setDockSize: React.PropTypes.func,
        toolbar: React.PropTypes.object,
        toolbarHeight: React.PropTypes.number,
        wrappedComponent: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.func]),
        zIndex: React.PropTypes.number
    },
    contextTypes: {
        messages: React.PropTypes.object
    },
    getDefaultProps() {
        return {
            id: "dock",
            dimMode: "none",
            dockSize: 0.35,
            fluid: true,
            isVisible: true,
            maxDockSize: 1.0,
            minDockSize: 0.1,
            position: "bottom",
            setDockSize: () => {},
            toolbar: null,
            toolbarHeight: 60,
            wrappedComponent: {},
            zIndex: 1030
        };
    },
    getAutoHeight(pos) {
        return pos === "top" || pos === "bottom";
    },
    getAutoWidth(pos) {
        return pos === "left" || pos === "right";
    },
    render() {
        const WrappedComponent = this.props.wrappedComponent;
        return (
            <Dock
                id={this.props.id}
                zIndex={this.props.zIndex}
                position={this.props.position}
                size={this.props.dockSize}
                dimMode={this.props.dimMode}
                isVisible={this.props.isVisible}
                onSizeChange={this.limitDockHeight}
                fluid={this.props.fluid}
                dimStyle={{ background: 'rgba(0, 0, 100, 0.2)' }}
            >
                <div id="container-wrapped-component" style={{height: "calc(100% - " + this.props.toolbarHeight + "px)"}}>
                    {this.props.wrappedComponent !== null ? (<WrappedComponent
                    size={{
                        width: this.getAutoWidth(this.props.position),
                        height: this.getAutoHeight(this.props.position),
                        size: this.props.dockSize
                    }}
                    />) : null }
                </div>
                {this.props.toolbar}
            </Dock>
        );
    },
    limitDockHeight(size) {
        if (size >= this.props.maxDockSize) {
            this.props.setDockSize(this.props.maxDockSize);
        } else if (size <= this.props.minDockSize) {
            this.props.setDockSize(this.props.minDockSize);
        } else {
            this.props.setDockSize(size);
        }
    }
});

module.exports = DockablePanel;
