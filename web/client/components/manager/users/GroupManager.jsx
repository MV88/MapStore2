import PropTypes from 'prop-types';

/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

// const Message = require('../I18N/Message');
import { ListGroup, ListGroupItem, Button, Glyphicon } from 'react-bootstrap';

class GroupManager extends React.Component {
    static propTypes = {
        // props
        groups: PropTypes.object,
        style: PropTypes.object,
        onDeleteGroup: PropTypes.func,
        onCreateGroup: PropTypes.func,
        user: PropTypes.object
    };

    static defaultProps = {
        groups: [],
        onUserGroupsChange: () => {},
        user: {}
    };

    render() {
        return (
            <div key="groups-manager">
                <Button key="create-btn" bsStyle="success" bsSize="small"><Glyphicon glyph="sign-plus" />Create New Group</Button>
                <ListGroup style={this.props.style} key="groups-available" bsSize="small">
                    {this.props.groups.map( group => (<ListGroupItem>
                        {group.groupName}
                        <Button style={{
                            "float": "right",
                            padding: "1px 5px",
                            fontSize: "12px",
                            lineHeight: 1.5
                        }} bsStyle="danger">X</Button>
                    </ListGroupItem>))}
                </ListGroup>
            </div>
        );
    }
}

/*

*/

export default GroupManager;
