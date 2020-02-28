/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import PropTypes from 'prop-types';
import Message from '../../../I18N/Message';
import { Table } from 'react-bootstrap';
import { isArray } from 'lodash';

class MetadataTemplate extends React.Component {
     static propTypes = {
         model: PropTypes.object
     };

     static defaultProps = {
         model: {}
     };

     render() {
         const model = this.props.model;
         return (<div id={model.identifier}>
             <Table>
                 <tbody>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.identifier"/></td><td>{model.identifier}</td>
                     </tr>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.title"/></td><td>{model.title}</td>
                     </tr>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.abstract"/></td><td>{model.abstract}</td>
                     </tr>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.subject"/></td><td>{isArray(model.subject) ? model.subject.map((value, i) => <ul key={'meta' + i}><li key={i}>{value}</li></ul>) : model.subject}</td>
                     </tr>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.type"/></td><td>{model.type}</td>
                     </tr>
                     <tr>
                         <td><Message msgId="toc.layerMetadata.creator"/></td><td>{model.creator}</td>
                     </tr>
                 </tbody>
             </Table>
         </div >);
     }
}
export default MetadataTemplate;
