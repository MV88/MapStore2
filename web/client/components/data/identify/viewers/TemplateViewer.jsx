/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {template} = require('lodash');
const TemplateUtils = require('../../../../utils/TemplateUtils');
const HtmlRenderer = require('../../../misc/HtmlRenderer');
const {Row, Col, Grid} = require('react-bootstrap');

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
