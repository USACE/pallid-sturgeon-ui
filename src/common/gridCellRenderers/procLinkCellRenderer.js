import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const ProcLinkCellRenderer = connect(
  'doUpdateCurrentTab',
  'selectDataEntryProcedure',
  ({
    doUpdateCurrentTab,
    dataEntryProcedure,
    data,
    setIsAddRow,
    setRowId,
  }) => {
    const fId = data.fid;
    const sId = data.sid;
    const hasProcData = !!dataEntryProcedure.items.filter(data => data.sid === sId).length;

    const handleAddRow = (add) => {
      doUpdateCurrentTab(3);
      if (add) {
        setIsAddRow(true);
        setRowId({ fid: fId, sid: sId });
      }
    };

    return (
      <>
        {hasProcData ? (
          <Button
            isOutline
            size='small'
            variant='info'
            title='Associated Procedure Data Entries'
            text={'View Data'}
            icon={<Icon icon='dots-horizontal' />}
            handleClick={() => handleAddRow(false)}
            isDisabled={(data.proclink === undefined || data.proclink === false) ? false : data.proclink}
          />
        ) : (
          <Button
            isOutline
            size='small'
            variant='success'
            title='Associated Procedure Data Entries'
            text={'Add Data'}
            icon={<Icon icon='plus' />}
            handleClick={() => handleAddRow(true)}
            isDisabled={(data.proclink === undefined || data.proclink === false) ? false : data.proclink}
          />
        )}
        
      </>
    );
  });

export default ProcLinkCellRenderer;
