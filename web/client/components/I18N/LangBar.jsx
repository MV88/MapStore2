
var PropTypes = require('prop-types');
/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var {ButtonGroup} = require('react-bootstrap');
var LocaleUtils = require('../../utils/LocaleUtils');
var FlagButton = require('./FlagButton');

class LangBar extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        locales: PropTypes.object,
        currentLocale: PropTypes.string,
        onLanguageChange: PropTypes.func
    };

    static defaultProps = {
        id: "mapstore-langselector",
        locales: {},
        currentLocale: 'en-US',
        onLanguageChange: function() {}
    };

    render() {
        var code;
        var label;
        var list = [];
        let locales = LocaleUtils.getSupportedLocales();
        for (let lang in locales) {
            if (locales.hasOwnProperty(lang)) {
                code = locales[lang].code;
                label = locales[lang].description;
                list.push(
                    <FlagButton
                        key={lang}
                        code={code}
                        label={label}
                        lang={lang}
                        active={code === this.props.currentLocale}
                        onFlagSelected={this.props.onLanguageChange}
                        />);
            }
        }
        return (
                <ButtonGroup id={this.props.id} type="select" bsSize="small">
                    {list}
                </ButtonGroup>
        );
    }
}

module.exports = LangBar;
