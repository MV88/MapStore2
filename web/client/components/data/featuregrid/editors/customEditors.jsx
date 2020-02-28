import React from 'react';
import DropDownEditor from './DropDownEditor';

export const Editors = {
    "DropDownEditor": {
        "string": (props) => <DropDownEditor dataType="string" {...props}/>
    }
};


export default Editors;
