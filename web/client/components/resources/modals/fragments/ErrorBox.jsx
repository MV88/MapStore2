/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

const DEFAULT_MESSAGES = { "FORMAT": "map.errorFormat", "SIZE": "map.errorSize", 409: "dashboard.errors.resourceAlreadyExists"};

import Message from '../../../I18N/Message';
import { Row } from 'react-bootstrap';
const errorString = err => typeof err === 'string' ? err : err.statusText;
const errorCode = err => typeof err === 'string' ? err : err.status;
const errorData = err => typeof err === 'string' ? undefined : err;
const errorMessage = error => {
    const code = errorCode(error);
    return <Message msgId={DEFAULT_MESSAGES[code] || ("Error:" + errorString(error))} msgParams={errorData(error)} />;
};

export default ({ errors = []}) => {
    return (<Row>
        {errors.length > 0 ?
            <div className="dropzone-errorBox alert-danger">
                {errors.map(error =>
                    (<div key={"error" + errorString(error)} className={"error" + errorString(error)}>
                        {errorMessage(error)}
                    </div>))}
            </div>
            : null}
    </Row>);
};
