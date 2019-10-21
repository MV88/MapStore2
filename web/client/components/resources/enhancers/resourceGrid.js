/*
* Copyright 2018, GeoSolutions Sas.
* All rights reserved.
*
* This source code is licensed under the BSD-style license found in the
* LICENSE file in the root directory of this source tree.
*/

import {
    branch,
    compose,
    createEventHandler,
    defaultProps,
    mapPropsStream,
    withHandlers,
    withState,
} from 'recompose';
import Rx from 'rxjs';

import { updateResource } from '../../../api/persistence';
import Save from '../modals/Save';
import handleResourceDownload from '../modals/enhancers/handleResourceDownload';
import handleSaveModal from '../modals/enhancers/handleSaveModal';

/*
 * EditDialog
 * Automatically downloads missing data and manage resource changes. Manages save, triggering onSaveSuccess
 */

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
)(Save);

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

export default resourceGrid;
