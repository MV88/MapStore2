
/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Resizable } from 'react-resizable';
import { Glyphicon } from 'react-bootstrap';
import isNil from 'lodash/isNil';
import isNaN from 'lodash/isNaN';
import minBy from 'lodash/minBy';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import uuidv1 from 'uuid/v1';

function computeCurrentStep({
    currentValue,
    previousValue,
    maxValue,
    defaultValue,
    maxDragThreshold,
    steps
}) {
    if (isNaN(currentValue) || !isNumber(currentValue)) {
        return defaultValue !== undefined ? defaultValue : currentValue;
    }
    if (!steps) {
        return currentValue;
    }
    const threshold = currentValue - previousValue;
    const maxDragThresholdInPixel = maxDragThreshold * maxValue;

    if (Math.abs(threshold) < maxDragThresholdInPixel) {
        return previousValue;
    }

    const currentStep = minBy(
        steps.map((amount, idx) => {
            const stepValue = amount * maxValue;
            const stepDistance = Math.abs(currentValue - stepValue);
            return [
                idx,
                stepValue,
                stepDistance
            ];
        }),
        step => step[2]);

    if (currentStep[2] < maxDragThresholdInPixel) {
        return currentStep[1];
    }

    const direction = Math.sign(threshold);

    const previousStep = minBy(
        steps.map((amount, idx) => {
            const stepValue = amount * maxValue;
            const stepDistance = Math.abs(previousValue - stepValue);
            return [
                idx,
                stepValue,
                stepDistance
            ];
        }),
        step => step[2]);

    const [ previousIndex ] = previousStep;
    const currentIndex = previousIndex + direction;

    return steps[currentIndex] !== undefined
        ? steps[currentIndex] * maxValue
        : previousValue;
}

function FlexibleLayoutPanel({
    active,
    activePlugins,
    className = '',
    defaultWidth,
    defaultHeight,
    resizeDisabled = false,
    axis = 'both',
    resizeHandle = 'e',
    defaultMinConstraints = [200, 200],
    defaultMaxConstraints = [Infinity, Infinity],
    onResize = () => {},
    calculateMaxAvailableSize = () => [undefined, undefined],
    calculateAvailableContainerSize = () => [Infinity, Infinity],
    size = [],
    defaultStepIndex,
    steps,
    onClose,
    maxDragThreshold = 0.1,
    firstRender,
    children
}) {

    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const [minConstraints, setMinConstraints] = useState(defaultMinConstraints);
    const [maxConstraints, setMaxConstraints] = useState(defaultMaxConstraints);

    const [handlePlaceholder, setHandlePlaceholder] = useState(false);
    const [dragDirection, setDragDirection] = useState('both');

    function getHandleGlyph() {
        if (handlePlaceholder
        || (resizeHandle === 'n' || resizeHandle === 's') && dragDirection === 'both'
        || (resizeHandle === 'w' || resizeHandle === 'e') && dragDirection === 'both') {
            return 'minus';
        }
        return `chevron-${dragDirection}`;
    }

    const panelKey = active && !resizeDisabled
        ? 'panel-enabled'
        : 'panel-disabled';
    const [keyId, setKeyId] = useState(panelKey);
    const [width, setWidth] = useState(defaultWidth);
    const [height, setHeight] = useState(defaultHeight);

    const resetInitialSize = (isFirstRender, newId) => {
        if (active && !resizeDisabled) {
            const initialStep = !isNil(defaultStepIndex) && steps && !isNil(steps[defaultStepIndex])
                ? steps[defaultStepIndex]
                : undefined;
            const [maxWidth, maxHeight] = !isNil(initialStep) && calculateMaxAvailableSize({ width, height }) || [];
            const updatedWidth = !isString(defaultWidth) && isFirstRender && maxWidth
                ? initialStep * maxWidth
                : defaultWidth;
            const updatedHeight = !isString(defaultHeight) && isFirstRender && maxHeight
                ? initialStep * maxHeight
                : defaultHeight;
            setWidth(updatedWidth);
            setHeight(updatedHeight);
        }
        setKeyId(newId);
    };

    useEffect(() => {
        if (active && (defaultWidth !== width || defaultHeight !== height) && !resizeDisabled) {
            setWidth(defaultWidth);
            setHeight(defaultHeight);
            setKeyId(uuidv1());
        }
    }, [ defaultWidth, defaultHeight ]);

    useEffect(() => resetInitialSize(true, uuidv1()), [ defaultStepIndex ]);
    useEffect(() => resetInitialSize(firstRender, panelKey), [ active ]);

    const activePluginsStr = JSON.stringify(activePlugins);
    const sizeStr = JSON.stringify(size);

    useEffect(() => {
        if (active && !resizeDisabled) {
            const [availableContainerWidth, availableContainerHeight] = calculateAvailableContainerSize();
            const [maxWidth, maxHeight] = calculateMaxAvailableSize({ width, height });
            const newMaxWidth = !isNil(maxWidth) && maxWidth || Infinity;
            const newMaxHeight = !isNil(maxHeight) && maxHeight || Infinity;
            const comparedMaxWidth = newMaxWidth > availableContainerWidth ? availableContainerWidth : newMaxWidth;
            const comparedMaxHeight = newMaxHeight > availableContainerHeight ? availableContainerHeight : newMaxHeight;

            setMaxConstraints([ comparedMaxWidth, comparedMaxHeight ]);
            if (width > comparedMaxWidth) {
                setWidth(comparedMaxWidth);
                onResize({
                    width: comparedMaxWidth,
                    height,
                    stepIndex: defaultStepIndex
                });
            }
            if (height > comparedMaxHeight) {
                setHeight(comparedMaxHeight);
                onResize({
                    width,
                    height: comparedMaxHeight,
                    stepIndex: defaultStepIndex
                });
            }
        }
    }, [ activePluginsStr, sizeStr ]);
    return (
        <div
            className={`ms-flexible-layout-panel${resizeHandle && !resizeDisabled ? ` axis-${resizeHandle}` : ''}${className && ` ${className}` || ''}`}>
            {!resizeDisabled
                ? <Resizable
                    key={keyId}
                    axis={axis}
                    width={width}
                    height={height}
                    minConstraints={minConstraints}
                    maxConstraints={maxConstraints}
                    resizeHandles={[resizeHandle]}
                    handle={<div
                        className="ms-flexible-layout-panel-handle">
                        {handlePlaceholder && <div
                            className="ms-flexible-layout-panel-handle-placeholder"
                            style={(resizeHandle === 'n' || resizeHandle === 's')
                                ? { left: 0, top }
                                : { left, top: 0 }}>
                        </div>}
                        <Glyphicon
                            glyph={getHandleGlyph()}
                            style={
                                (resizeHandle === 'w' || resizeHandle === 'e') && dragDirection === 'both'
                                    ? { transform: 'rotateZ(90deg)' }
                                    : {}}/>
                    </div>}
                    onResizeStart={(event) => {
                        const [maxWidth, maxHeight] = calculateMaxAvailableSize({ width, height });
                        const clientX = event.clientX || event.targetTouches && event.targetTouches[0].clientX;
                        const clientY = event.clientY || event.targetTouches && event.targetTouches[0].clientY;
                        setLeft(clientX);
                        setTop(clientY);
                        setHandlePlaceholder(true);
                        setMaxConstraints([
                            !isNil(maxWidth) ? maxWidth : Infinity,
                            !isNil(maxHeight) ? maxHeight : Infinity
                        ]);
                        if (steps) {
                            setMinConstraints([
                                !isNil(maxWidth) ? steps[0] * maxWidth : minConstraints[0],
                                !isNil(maxHeight) ? steps[0] * maxHeight : minConstraints[1]
                            ]);
                        }
                        setDragDirection('both');
                    }}
                    onResize={(event, data) => {
                        const clientX = event.clientX || event.targetTouches && event.targetTouches[0].clientX;
                        const clientY = event.clientY || event.targetTouches && event.targetTouches[0].clientY;

                        if (!isNaN(data.size.width)
                        && data.size.width < maxConstraints[0]
                        && data.size.width > minConstraints[0]) {
                            setLeft(clientX);
                        }

                        if (!isNaN(data.size.height)
                        && data.size.height < maxConstraints[1]
                        && data.size.height > minConstraints[1]) {
                            setTop(clientY);
                        }

                        const currentDragDirection =
                            resizeHandle === 'w' && data.size.width >= maxConstraints[0] && 'right'
                            || resizeHandle === 'w' && data.size.width <= minConstraints[0] && 'left'
                            || resizeHandle === 'e' && data.size.width >= maxConstraints[0] && 'left'
                            || resizeHandle === 'e' && data.size.width <= minConstraints[0] && 'right'
                            || data.size.height >= maxConstraints[1] && 'down'
                            || data.size.height <= minConstraints[1] && 'up'
                            || 'both';

                        setDragDirection(currentDragDirection);
                    }}
                    onResizeStop={(event, data) => {
                        const newWidth = computeCurrentStep({
                            currentValue: data.size.width,
                            previousValue: width,
                            maxValue: maxConstraints[0],
                            defaultValue: defaultWidth,
                            maxDragThreshold,
                            steps
                        });
                        const newHeight = computeCurrentStep({
                            currentValue: data.size.height,
                            previousValue: height,
                            maxValue: maxConstraints[1],
                            defaultValue: defaultHeight,
                            maxDragThreshold,
                            steps
                        });
                        setHandlePlaceholder(false);

                        const shouldClose = onClose && steps && (newWidth === 0 || newHeight === 0);
                        if (shouldClose) {
                            return onClose();
                        }

                        setWidth(newWidth);
                        setHeight(newHeight);
                        return onResize({
                            width: newWidth,
                            height: newHeight,
                            stepIndex: defaultStepIndex
                        });
                    }}>
                    <div
                        className="ms-flexible-layout-panel-body"
                        style={{ width, height }}>
                        {children}
                    </div>
                </Resizable>
                : <div
                    className="ms-flexible-layout-panel-body"
                    style={{
                        width: defaultWidth,
                        height: defaultHeight
                    }}>
                    {children}
                </div>}
        </div>
    );
}

FlexibleLayoutPanel.propTypes = {
    name: PropTypes.string,
    active: PropTypes.bool,
    activePlugins: PropTypes.array,
    className: PropTypes.string,
    defaultWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    resizeDisabled: PropTypes.bool,
    axis: PropTypes.string,
    resizeHandle: PropTypes.string,
    defaultMinConstraints: PropTypes.array,
    defaultMaxConstraints: PropTypes.array,
    onResize: PropTypes.func,
    calculateMaxAvailableSize: PropTypes.func,
    calculateAvailableContainerSize: PropTypes.func,
    size: PropTypes.array,
    steps: PropTypes.array,
    onClose: PropTypes.func,
    maxDragThreshold: PropTypes.number,
    defaultStepIndex: PropTypes.number
};

FlexibleLayoutPanel.defaultProps = {
    activePlugins: [],
    className: '',
    resizeDisabled: false,
    axis: 'both',
    resizeHandle: 'e',
    defaultMinConstraints: [200, 200],
    defaultMaxConstraints: [Infinity, Infinity],
    onResize: () => {},
    calculateMaxAvailableSize: () => [undefined, undefined],
    calculateAvailableContainerSize: () => [Infinity, Infinity],
    size: [],
    maxDragThreshold: 0.1
};

export default FlexibleLayoutPanel;
