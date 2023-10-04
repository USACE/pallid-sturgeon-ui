import React, { useState, useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import { ModalContent, ModalFooter, ModalHeader } from 'app-components/modal';
import { projectMap } from 'app-pages/data-entry/helpers';

const ConfirmDelete = connect(
  'doModalClose',
  'doDeleteFishDataEntry',
  'doDeleteTelemetryDataEntry',
  'doDeleteSupplementalDataEntry',
  'doDeleteProcedureDataEntry',
  'doDeleteStaged',
  'doDeleteBulk',
  'selectStagedData',
  ({
    doModalClose,
    doDeleteFishDataEntry,
    doDeleteTelemetryDataEntry,
    doDeleteSupplementalDataEntry,
    doDeleteProcedureDataEntry,
    doDeleteStaged,
    doDeleteBulk,
    stagedData,
    selectedData = [],
    setSelectedRows = () => { },
    value,
    data,
    type
  }) => {
    const [staticText, setStaticText] = useState('');
    const [typeIDName, setTypeIDName] = useState(null);
    const [typeValue, setTypeValue] = useState(null);

    const isBulk = selectedData.length === 1;

    const getTypeValues = () => {
      switch (type) {
        case 'missouriRiver':
          setStaticText('Missouri River Data Entry ID: ');
          break;
        case 'fish':
          setStaticText('Fish Data Entry ID: ');
          setTypeIDName('fid');
          isBulk && setTypeValue(selectedData[0].data.id ? selectedData[0].data.id : selectedData[0].data[typeIDName]);
          value && setTypeValue(value);
          break;
        case 'supplemental':
          setStaticText('Supplemental Data Entry ID: ');
          setTypeIDName('sid');
          setTypeValue(data.sid);
          break;
        case 'searchEffort':
          setStaticText('Search Effort Data Entry ID: ');
          break;
        case 'telemetry':
          setStaticText('Telemetry Data Entry ID: ');
          setTypeIDName('tId');
          isBulk && setTypeValue(selectedData[0].data.id ? selectedData[0].data.id : selectedData[0].data[typeIDName]);
          value && setTypeValue(value);
          break;
        case 'procedure':
          setStaticText('Procedure Data Entry ID: ');
          setTypeIDName('pid');
          setTypeValue(data.id);
          break;
        case 'user':
          setStaticText('User: ');
          break;
        default:
          console.log('UNKNOWN DATATYPE');
          break;
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
          console.log('UNKNOWN DATATYPE');
          break;
      }
    };

    useEffect(() => {
      getTypeValues();
    }, []);

    return (
      <ModalContent>
        <ModalHeader title='Confirm Data Deletion' />
        <section className='modal-body'>
          <div className='container-fluid'>
            Are you sure you want to delete?
            <div className='pt-2'>
              {/* Bulk data entry delete */}
              {(selectedData.length > 0) ? (
                <div>
                  <ul>
                    {selectedData.map((item, index) => <li key={index}><b>{staticText}</b><i>{item.data.id ? item.data.id : item.data[typeIDName]}</i></li>)}
                  </ul>
                </div>
              ) : (
                // Delete single data entry
                <div><b>{staticText}</b><i>{typeValue}</i></div>
              )}
              {/* Delete single user */}
              {type !== 'user' ? (
                <div>
                  {/* <b>Uploaded By: </b><i>{data.uploadedBy}</i> */}
                </div>
              ) : (
                <>
                  <div><b>Email: </b><i>{data.email}</i></div>
                  <div><b>Role: </b><i>{data.role}</i></div>
                  <div><b>Office Code: </b><i>{data.officeCode}</i></div>
                  <div><b>Project: </b><i>{data.projectCode + ' - ' + projectMap[data.projectCode]}</i></div>
                </>)}
            </div>
          </div>
        </section>
        <ModalFooter
          customClosingLogic
          saveText='Cancel'
          onSave={() => doModalClose()}
          onDelete={() => {
            if (selectedData.length > 0) {
              doDeleteBulk(selectedData, type, typeIDName);
              setSelectedRows([]);
            } else if (data.id && stagedData.length > 0) {
              doDeleteStaged(data.id);
              setSelectedRows([]);
            } else {
              getTypeDelete();
            }
            doModalClose();
          }}
          deleteText='Delete'
        />
      </ModalContent>
    );
  }
);

export default ConfirmDelete;
