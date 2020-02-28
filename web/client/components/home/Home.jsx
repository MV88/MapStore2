import PropTypes from 'prop-types';

/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { Glyphicon, Tooltip, Button } from 'react-bootstrap';
import OverlayTrigger from '../misc/OverlayTrigger';
import Message from '../../components/I18N/Message';

class Home extends React.Component {
    static propTypes = {
        icon: PropTypes.node
    };

    static contextTypes = {
        router: PropTypes.object,
        messages: PropTypes.object
    };

    static defaultProps = {
        icon: <Glyphicon glyph="home"/>
    };

    render() {
        let tooltip = <Tooltip id="toolbar-home-button">{<Message msgId="gohome"/>}</Tooltip>;
        return (
            <OverlayTrigger overlay={tooltip} placement="left">
                <Button
                    {...this.props}
                    id="home-button"
                    className="square-button"
                    bsStyle="primary"
                    onClick={this.goHome}
                    tooltip={tooltip}
                >{this.props.icon}</Button>
            </OverlayTrigger>
        );
    }

    goHome = () => {
        this.context.router.history.push("/");
    };
}

export default Home;
