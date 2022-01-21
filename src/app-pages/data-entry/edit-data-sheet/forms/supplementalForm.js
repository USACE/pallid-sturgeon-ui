import React from 'react';
import { connect } from 'redux-bundler-react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Button from 'app-components/button';

// @TODO - Create this form
// 230269 - mrId
// 2118152 - tableId

const SupplementalForm = connect(
  'doFetchFishDataEntry',
  'selectDataEntry',
  'selectDataEntryLastParams',
  ({
    doFetchFishDataEntry,
    dataEntry = [],
    dataEntryLastParams,
  }) => {
    const { data } = dataEntry;
    const { mrId } = dataEntryLastParams;

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-9'>
            <h4 className='mb-3'>Supplemental Datasheets</h4>
          </div>
          <div className='col-3'>
            {mrId && (
              <Button
                isOutline
                variant='info'
                size='small'
                className='float-right'
                text='Fish Datasheets'
                handleClick={() => doFetchFishDataEntry({ mrId })}
              />
            )}
          </div>
        </div>
        {!data.length ? (
          <p>
            No Supplemental Datasheets
          </p>
        ) : (
          <div className='ag-theme-balham' style={{ width: '100%', height: '600px' }}>
            <AgGridReact
              rowData={data}
              defaultColDef={{
                width: 150,
              }}
            >
              <AgGridColumn field='sid' />
              <AgGridColumn field='fid' />
              <AgGridColumn field='siteId' />
              <AgGridColumn field='fFid' />
              <AgGridColumn field='mrId' />
              <AgGridColumn field='mrFid' />
              <AgGridColumn field='tagnumber' />
              <AgGridColumn field='pitrn' />
              <AgGridColumn field='scuteloc' />
              <AgGridColumn field='scutenum' />
              <AgGridColumn field='scuteloc2' />
              <AgGridColumn field='scutenum2' />
              <AgGridColumn field='elhv' />
              <AgGridColumn field='elcolor' />
              <AgGridColumn field='erhv' />
              <AgGridColumn field='ercolor' />
              <AgGridColumn field='cwtyn' />
              <AgGridColumn field='dangler' />
              <AgGridColumn field='genetic' />
              <AgGridColumn field='geneticsVialNumber' />
              <AgGridColumn field='broodstock' />
              <AgGridColumn field='hatchWild' />
              <AgGridColumn field='speciesId' />
              <AgGridColumn field='head' />
              <AgGridColumn field='snouttomouth' />
              <AgGridColumn field='inter' />
              <AgGridColumn field='mouthwidth' />
              <AgGridColumn field='mIb' />
              <AgGridColumn field='lOb' />
              <AgGridColumn field='lIb' />
              <AgGridColumn field='rIb' />
              <AgGridColumn field='rOb' />
              <AgGridColumn field='anal' />
              <AgGridColumn field='dorsal' />
              <AgGridColumn field='status' />
              <AgGridColumn field='hatcheryOrigin' />
              <AgGridColumn field='sex' />
              <AgGridColumn field='stage' />
              <AgGridColumn field='recapture' />
              <AgGridColumn field='photo' />
              <AgGridColumn field='geneticNeeds' />
              <AgGridColumn field='otherTagInfo' />
              <AgGridColumn field='comments' />
              <AgGridColumn field='editInitials' />
              <AgGridColumn field='lastEditComment' />
              <AgGridColumn field='lastUpdated' />
            </AgGridReact>
          </div>
        )}
      </div>
    );
  }
);

export default SupplementalForm;
