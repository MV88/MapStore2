/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import Message from '../../../I18N/Message';
import { withProps } from 'recompose';
import tooltip from '../../../misc/enhancers/tooltip';

const isMenuItem = ({target, visible = true}) => visible && target === "menu";
const hasMenuItems = (tt = []) => tt.filter(isMenuItem).length > 0;
import { Glyphicon, ButtonToolbar, DropdownButton, MenuItem as MenuItemBS } from 'react-bootstrap';
const MenuItem = tooltip(MenuItemBS);
/**
 * transform `widgetTools` property items with `target` = `menu` into a DropDown button to put in `topRightItems` for WidgetContainer, as a menu
 */
export default ({ className = "widget-menu", menuIcon = "option-vertical"} = {}) =>
    withProps(({ widgetTools, topRightItems = []}) => ({
        topRightItems: hasMenuItems(widgetTools)
            ? [...topRightItems, (<ButtonToolbar>
                <DropdownButton pullRight bsStyle="default" className={className} title={<Glyphicon glyph={menuIcon} />} noCaret id="dropdown-no-caret">
                    {widgetTools.filter(isMenuItem).map(({ onClick = () => { }, disabled = false, glyph, glyphClassName, text, textId, tooltipId, active}, i) =>
                        <MenuItem
                            active={active}
                            tooltipId={tooltipId}
                            onSelect={onClick}
                            disabled={disabled}
                            eventKey={i}>
                            <Glyphicon className={glyphClassName} glyph={glyph} />
                            {textId ? <Message msgId={textId} /> : text}
                        </MenuItem>)
                    }
                </DropdownButton>
            </ButtonToolbar>)]
            : topRightItems
    }));
