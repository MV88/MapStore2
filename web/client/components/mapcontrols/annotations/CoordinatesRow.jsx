const React = require('react');
const PropTypes = require('prop-types');
const {Row, Col} = require('react-bootstrap');
const Toolbar = require('../../misc/toolbar/Toolbar');
const draggableComponent = require('../../misc/enhancers/draggableComponent');
const CoordinateEntry = require('./CoordinateEntry');

/**

*/
class CoordinatesRowComponent extends React.Component {

    static propTypes = {
        idx: PropTypes.number,
        component: PropTypes.object,
        onRemove: PropTypes.func,
        onChange: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        isDraggable: PropTypes.bool,
        removeVisible: PropTypes.bool,
        removeEnabled: PropTypes.bool
    };

    render() {
        const {idx} = this.props;
        return (
            <Row style={{marginLeft: 0, marginRight: 0}} onMouseEnter={() => {
                this.props.onMouseEnter(this.props.component);
            }} onMouseLeave={this.props.onMouseLeave}>
                <Col xs={1}>
                    <Toolbar
                        btnDefaultProps={{ className: 'square-button-md no-border'}}
                        buttons={[
                            {
                                disabled: !this.props.isDraggable,
                                style: {pointerEvents: !this.props.isDraggable ? "none" : "auto"},
                                glyph: 'menu-hamburger'
                            }
                        ]}/>
                </Col>
                <Col xs={5}>
                    <CoordinateEntry
                        format="decimal"
                        coordinate="lat"
                        idx={idx}
                        value={this.props.component.lat}
                        onChange={this.props.onChange}
                        constraints={{
                            decimal: {
                                lat: {
                                    min: -90,
                                    max: 90
                                },
                                lon: {
                                    min: -180,
                                    max: 180
                                }
                            },
                            aeronautical: {
                                lat: {
                                    degree: {
                                        min: 0,
                                        max: 60
                                    },
                                    minutes: {
                                        min: 0,
                                        max: 60
                                    },
                                    seconds: {
                                        min: 0,
                                        max: 60,
                                        precision: 3
                                    }
                                },
                                lon: {
                                    degree: {
                                        min: 0,
                                        max: 180
                                    },
                                    minutes: {
                                        min: 0,
                                        max: 60
                                    },
                                    seconds: {
                                        min: 0,
                                        max: 60,
                                        precision: 3
                                    }
                                }
                            }
                        }}
                    />
                </Col>
                <Col xs={5}>
                    <CoordinateEntry
                        format="aeronautical"
                        coordinate="lon"
                        idx={idx}
                        value={this.props.component.lon}
                        onChange={this.props.onChange}
                        constraints={{
                            decimal: {
                                lat: {
                                    min: -90,
                                    max: 90
                                },
                                lon: {
                                    min: -180,
                                    max: 180
                                }
                            },
                            aeronautical: {
                                lat: {
                                    degree: {
                                        min: 0,
                                        max: 60
                                    },
                                    minutes: {
                                        min: 0,
                                        max: 60
                                    },
                                    seconds: {
                                        min: 0,
                                        max: 60,
                                        precision: 3
                                    }
                                },
                                lon: {
                                    degree: {
                                        min: 0,
                                        max: 180
                                    },
                                    minutes: {
                                        min: 0,
                                        max: 60
                                    },
                                    seconds: {
                                        min: 0,
                                        max: 60,
                                        precision: 3
                                    }
                                }
                            }
                        }}
                    />
                </Col>
                <Col xs={1}>
                    <Toolbar
                        btnGroupProps={{ className: 'pull-right' }}
                        btnDefaultProps={{ className: 'square-button-md no-border'}}
                        buttons={
                        [
                            {
                                visible: this.props.removeVisible,
                                disabled: !this.props.removeEnabled,
                                glyph: 'trash',
                                onClick: () => {
                                    this.props.onRemove(idx);
                                }
                            }
                        ]
                    }/>
                </Col>
            </Row>
        );
    }
}

module.exports = draggableComponent(CoordinatesRowComponent);
