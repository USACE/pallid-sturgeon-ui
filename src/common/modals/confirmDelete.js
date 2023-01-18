import React from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';

const ConfirmDelete = connect(
  'doModalClose',
  'doDeleteFishDataEntry',
  ({
    doModalClose,
    doDeleteFishDataEntry,
    value,
    data,
    type
  }) => {
    const getTypeText = () => {
      switch (type) {
        case 'missouriRiver':
          return <>Missouri River</>;
        case 'fish':
          return <>Fish</>;
        case 'supplemental':
          return <>Supplemental</>;
        case 'searchEffort':
          return <>Search Effort</>;
        case 'telemetry':
          return <>Telemetry</>;
        case 'procedure':
          return <>Procedure</>;
        default:
          return <>Unknown data type.</>;
      }
    };

    const getTypeDelete = () => {
      switch (type) {
        case 'fish':
          return doDeleteFishDataEntry(value);
        default:
          return <>Unknown data type.</>;
      }
    };

    return (
      <ModalContent>
        <ModalHeader title='Confirm Data Deletion' />
        <section className='modal-body'>
          <div className='container-fluid'>
            Are you sure you want to delete?
            <div className='pt-2'>
              <div><b>{getTypeText()} Data Entry ID: </b><i>{value}</i></div>
              <div><b>Uploaded By: </b><i>{data.uploadedBy}</i></div>
            </div>
          </div>
        </section>
        <ModalFooter
          customClosingLogic
          saveText='Cancel'
          onSave={() => doModalClose()}
          onDelete={() => {
            getTypeDelete();
            doModalClose();
          }}
          deleteText='Delete'
        />
      </ModalContent>
    );
  }
);

export default ConfirmDelete;
