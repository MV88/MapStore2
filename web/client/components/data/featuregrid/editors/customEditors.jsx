import React from 'react';
import DropDownEditor from './DropDownEditor';

const Editors = {
    "DropDownEditor": {
        "string": (props) => <DropDownEditor dataType="string" {...props}/>
    }
};


export default Editors;
