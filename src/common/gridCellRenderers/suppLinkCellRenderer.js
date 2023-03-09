import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const SuppLinkCellRenderer = connect(
  'doUpdateCurrentTab',
  'selectDataEntrySupplemental',
  ({
    doUpdateCurrentTab,
    dataEntrySupplemental,
    data,
    setIsAddRow,
    setRowId,
  }) => {
    const fId = data.fid; 
    const hasSuppData = !!dataEntrySupplemental.items.filter(data => data.fid === fId).length;

    const handleAddRow = (add) => {
      doUpdateCurrentTab(2);
      if (add) {
        setIsAddRow(true);
        setRowId(fId);
      }
    };

    return (
      <>
        {hasSuppData ? (
          <Button
            isOutline
            size='small'
            variant='info'
            title='Associated Supplemental Data Entries'
            text={'View Data'}
            icon={<Icon icon='dots-horizontal' />}
            handleClick={() => handleAddRow(false)}
            isDisabled={(data.supplink === undefined || data.supplink === false) ? false : data.supplink}
          />
        ) : (
          <Button
            isOutline
            size='small'
            variant='success'
            title='Associated Supplemental Data Entries'
            text={'Add Data'}
            icon={<Icon icon='plus' />}
            handleClick={() => handleAddRow(true)}
            isDisabled={(data.supplink === null || data.supplink === false) ? false : data.supplink}
          />
        )}
        
      </>
    );
  });

export default SuppLinkCellRenderer;
