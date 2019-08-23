
/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { setAddingMedia, setEditingMedia, saveMedia, selectItem } from '../../actions/mediaEditor';
import { saveStateSelector, currentResourcesSelector, editingSelector, selectedItemSelector } from '../../selectors/mediaEditor';

import ResizableModal from '../../components/misc/ResizableModal';
import Portal from '../../components/misc/Portal';
import MediaEditor from '../../components/mediaEditor/MediaEditor';
import Message from '../../components/I18N/Message';

// connect editor state
const Editor = connect(createStructuredSelector({
    saveState: saveStateSelector,
    selectedItem: selectedItemSelector,
    editing: editingSelector,
    resources: currentResourcesSelector
}), {
    selectItem,
    setAddingMedia,
    setEditingMedia,
    saveMedia
})(MediaEditor);

/**
 * Media Editor Modal. Contains the media picker
 * @param {object} props the properties
 * @param {boolean} props.open show/hide the modal
 * @param {function} props.hide handler for close
 */
const MediaModal = ({
    open,
    chooseMedia,
    selectedItem,
    hide = () => { }
}) => {

    return (
        <Portal>
            <ResizableModal
                title={<Message msgId="mediaEditor.modalTitle"/>}
                show={open}
                clickOutEnabled={false}
                onClose={() => hide()}
                size="lg"
                buttons={[
                    {
                        text: <Message msgId="mediaEditor.apply"/>,
                        bsSize: 'sm',
                        disabled: !selectedItem,
                        onClick: () => chooseMedia(selectedItem)
                    }
                ]}>
                <Editor />
            </ResizableModal>
        </Portal>
    );
};

export default MediaModal;
