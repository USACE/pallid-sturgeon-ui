import React from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { projectMap } from 'app-pages/data-entry/helpers';

const ConfirmDelete = connect(
  'doModalClose',
  'doDeleteFishDataEntry',
  'doDeleteTelemetryDataEntry',
  'doDeleteSupplementalDataEntry',
  'doDeleteProcedureDataEntry',
  ({
    doModalClose,
    doDeleteFishDataEntry,
    doDeleteTelemetryDataEntry,
    doDeleteSupplementalDataEntry,
    doDeleteProcedureDataEntry,
    value,
    data,
    type
  }) => {
    const getTypeText = () => {
      switch (type) {
        case 'missouriRiver':
          return <>Missouri River Data Entry ID: </>;
        case 'fish':
          return <>Fish Data Entry ID: </>;
        case 'supplemental':
          return <>Supplemental Data Entry ID: </>;
        case 'searchEffort':
          return <>Search Effort Data Entry ID: </>;
        case 'telemetry':
          return <>Telemetry Data Entry ID: </>;
        case 'procedure':
          return <>Procedure Data Entry ID: </>;
        case 'user':
          return <>User: </>;
        default:
          return <>Unknown data type.</>;
      }
    };

    const getTypeDelete = () => {
      switch (type) {
        case 'fish':
          return doDeleteFishDataEntry(value);
        case 'supplemental':
          return doDeleteSupplementalDataEntry(data.sid);
        case 'procedure':
          return doDeleteProcedureDataEntry(data.id);
        case 'telemetry':
          return doDeleteTelemetryDataEntry(value);
        default:
          return <>Unknown data type.</>;
      }
    };

    const getTypeValue = () => {
      switch (type) {
        case 'fish' || 'telemetry':
          return value;
        case 'supplemental':
          return data.sid;
        case 'procedure':
          return data.id;
        case 'user':
          return data.firstName + ' ' + data.lastName;
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
              <div><b>{getTypeText()}</b><i>{getTypeValue()}</i></div>
              {type !== 'user' ? (
                <div><b>Uploaded By: </b><i>{data.uploadedBy}</i></div>
              ) : (
                <>
                  <div><b>Email: </b><i>{data.email}</i></div>
                  <div><b>Role: </b><i>{data.role}</i></div>
                  <div><b>Office Code: </b><i>{data.officeCode}</i></div>
                  <div><b>Project: </b><i>{data.projectCode + ' - ' + projectMap[data.projectCode] }</i></div>
                </>)}
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
