
/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/
import Rx from 'rxjs';

import {
    compose,
    branch,
    withState,
    withHandlers,
    defaultProps,
    mapPropsStream,
    createEventHandler,
} from 'recompose';

import handleSaveModal from '../modals/enhancers/handleSaveModal';
import handleResourceDownload from '../modals/enhancers/handleResourceDownload';
import { updateResource } from '../../../api/persistence';

const handleSave = mapPropsStream(props$ => {
    const { handler: onSave, stream: saveEventStream$ } = createEventHandler();
    const saveStream$ =
        saveEventStream$
            .withLatestFrom(props$)
            .switchMap(([resource, props]) =>
                updateResource(resource)
                    .do(() => {
                        if (props) {
                            if (props.onClose) {
                                props.onClose();
                            }
                            if (props.onSaveSuccess) {
                                props.onSaveSuccess(resource);
                            }
                        }
                    })
                    .catch(e => Rx.Observable.of({
                        errors: [
                            ...(props.errors || []),
                            e
                        ]
                    }))
                    .startWith({ loading: true })
                    .concat(Rx.Observable.of({ loading: false }))
            );
    return props$.combineLatest(
        saveStream$.startWith({}),
        (props, saveProps) => ({
            ...props,
            ...saveProps,
            onSave
        })
    );
});
/*
 * EditDialog
 * Automatically downloads missing data and manage resource changes. Manages save, triggering onSaveSuccess
 */
const EditDialog = compose(
    handleResourceDownload,
    withHandlers({
        onClose: ({ setEdit = () => { } }) => () => setEdit(false)
    }),
    branch(
        ({ resource }) => resource && resource.id,
        compose(
            handleSave,
            handleSaveModal
        )
    )
)(require('../modals/Save'));

const resourceGrid = compose(
    defaultProps({
        bsSize: "small",
        metadataModal: EditDialog
    }),
    withState('resource', 'setResource'),
    withState('edit', 'setEdit', false),
    withHandlers({
        onEdit: ({ setEdit = () => { }, setResource = () => { } }) => (resource) => {
            if (resource) {
                setResource(resource);
                setEdit(true);
            } else {
                setResource(undefined);
                setEdit(false);
            }

        }
    })
);

module.exports = resourceGrid;
