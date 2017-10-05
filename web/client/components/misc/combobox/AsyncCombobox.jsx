/*
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
*/

const React = require('react');
const PagedCombobox = require('./PagedCombobox');
const rxjsConfig = require('recompose/rxjsObservableConfig').default;
const {setObservableConfig, mapPropsStreamWithConfig, compose, withStateHandlers} = require('recompose');
setObservableConfig(rxjsConfig);
const mapPropsStream = mapPropsStreamWithConfig(rxjsConfig);
const {isArray} = require('lodash');

const streamEnhancer = mapPropsStream(props$ => {
    let fetcherStream = props$.take(1).switchMap(p => {
        return p.autocompleteStreamFactory(props$);
    });
    return fetcherStream.combineLatest(props$, (data, props) => ({
        data: isArray(data && data.fetchedData && data.fetchedData.values) ? data.fetchedData.values.map(v => {return {label: v, value: v}; }) : [],
        select: props && props.select,
        focus: props && props.focus,
        toggle: props && props.toggle,
        change: props.change,
        open: props.open,
        selected: props && props.selected,
        value: props.value,
        busy: data.busy
    }));
});

const addStateAsync = compose(
    withStateHandlers((props) => ({
        open: false,
        currentPage: 1,
        value: props.value,
        data: props.data,
        url: props.url,
        typeName: props.typeName,
        textValue: props.textValue,
        textLabel: props.textLabel,
        autocompleteStreamFactory: props.autocompleteStreamFactory
    }), {
        select: (state) => () => ({
            ...state,
            selected: true
        }),
        change: (state) => (v) => {
            if (state.selected && state.changingPage) {
                return ({
                    ...state,
                    selected: false,
                    changingPage: false,
                    value: state.value,
                    currentPage: !state.changingPage ? 1 : state.currentPage
                });
            }
            const value = typeof v === "string" ? v : v.value;
            return ({
                ...state,
                selected: false,
                changingPage: false,
                value: value,
                currentPage: !state.changingPage ? 1 : state.currentPage
            });
        },
        focus: (state) => (options) => {
            if (options && options.length === 0 && state.value === "") {
                return ({
                    ...state,
                    currentPage: 1,
                    isToggled: false,
                    open: true
                });
            }
            return (state);
        },
        toggle: (state) => () => ({
            ...state,
            open: state.changingPage ? true : !state.open
        })
    })
);

const PagedComboboxEnhanced = streamEnhancer(
    ({ open, toggle, select, focus, change, value, busy, data, loading = false, filter }) => {
        return (<PagedCombobox
            pagination={{paginated: false}}
            dropUp={false}
            onFocus={focus}
            onToggle={toggle}
            onChange={change}
            onSelect={select}
            selectedValue={value}
            busy={busy}
            data={data}
            open={open}
            loading={loading}
            filter={filter}
        />);
    });

const AsyncCombobox = addStateAsync(PagedComboboxEnhanced);

module.exports = AsyncCombobox;
