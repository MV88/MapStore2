import React from 'react';
import { Checkbox } from 'react-bootstrap';
import Message from '../../I18N/Message';

export default ({
    style = {},
    titleMsg = "featuregrid.columns",
    onChange = () => {},
    attributes = []
} = {}) => (
    <div className="bg-body data-attribute-selector" style={style}>
        <h4 className="text-center"><strong><Message msgId={titleMsg} /></strong></h4>
        <div>
            {attributes.map( attr =>
                (<Checkbox
                    key={attr.attribute || attr.name}
                    checked={!attr.hide}
                    onChange={() => onChange(attr.attribute, !attr.hide ) }>
                    {attr.label || attr.attribute}
                </Checkbox>)
            )}
        </div>
    </div>
);
