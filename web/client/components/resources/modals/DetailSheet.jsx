/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ReactQuill from 'react-quill';
import Spinner from 'react-spinkit';
import Message from '../../I18N/Message';
import Portal from '../../misc/Portal';
import ResizableModal from '../../misc/ResizableModal';
import 'react-quill/dist/quill.snow.css';

// NOTE: partial porting of details sheet from map, still to be tested and added to the save form
export default ({
    readOnly,
    showDetailEditor,
    modules = {
        toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }, 'bold', 'italic', 'underline', 'blockquote'],
            [{ 'list': 'bullet' }, { 'align': [] }],
            [{ 'color': [] }, { 'background': [] }, 'clean'], ['image', 'link']
        ]
    },
    detailsText,
    detailsBackup,
    onSaveDetails = () => {},
    onResetCurrentMap = () => {},
    onBackDetails = () => {},
    onUpdateDetails = () => {}}
) => {
    return (
        <Portal>
            {readOnly ? (
                <ResizableModal size="lg"
                    showFullscreen
                    onClose={() => {
                        onResetCurrentMap();
                    }}
                    title={<Message msgId="details.title" msgParams={{ name: name }} />}
                    show
                >
                    <div className="ms-detail-body">
                        {!detailsText ? <Spinner spinnerName="circle" noFadeIn overrideSpinnerClassName="spinner" /> : <div className="ql-editor" dangerouslySetInnerHTML={{ __html: detailsText || '' }} />}
                    </div>
                </ResizableModal>
            ) : (<ResizableModal
                show={!!showDetailEditor}
                title={<Message msgId="details.title" msgParams={{ name: name }} />}
                bodyClassName="ms-modal-quill-container"
                size="lg"
                clickOutEnabled={false}
                showFullscreen
                fullscreenType="full"
                onClose={() => { onBackDetails(detailsBackup); }}
                buttons={[{
                    text: <Message msgId="details.back" />,
                    onClick: () => {
                        onBackDetails(detailsBackup);
                    }
                }, {
                    text: <Message msgId="details.save" />,
                    onClick: () => {
                        onSaveDetails(detailsText);
                    }
                }]}>
                <div id="ms-details-editor">
                    <ReactQuill
                        bounds={"#ms-details-editor"}
                        value={detailsText}
                        onChange={(details) => {
                            if (details && details !== '<p><br></p>') {
                                onUpdateDetails(details, false);
                            }
                        }}
                        modules={modules} />
                </div>
            </ResizableModal>)}
        </Portal>);
};
