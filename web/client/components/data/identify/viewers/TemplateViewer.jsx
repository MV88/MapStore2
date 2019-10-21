/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import { template } from 'lodash';
import TemplateUtils from '../../../../utils/TemplateUtils';
import HtmlRenderer from '../../../misc/HtmlRenderer';
import { Row, Col, Grid } from 'react-bootstrap';

export default ({layer = {}, response}) => (
    <Grid fluid>
        {response.features.map((feature, i) =>
            <Row key={i}>
                <Col xs={12}>
                    <HtmlRenderer html={template(TemplateUtils.getCleanTemplate(layer.featureInfo && layer.featureInfo.template || '', feature, /\$\{.*?\}/g, 2, 1))(feature)}/>
                </Col>
                <Col xs={12}>
                    <hr/>
                </Col>
            </Row>
        )}
    </Grid>
);
