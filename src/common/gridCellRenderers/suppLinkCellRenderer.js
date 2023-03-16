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
    const isNewRow = Object.keys(data).length === 0;    

    const handleAddRow = (add) => {
      doUpdateCurrentTab(2);
      if (add) {
        setIsAddRow(true);
        setRowId(fId);
      }
    };

    const isButtonDisabled = () => {
      if (isNewRow || !data.fid) {
        return true;
      } else {
        if (data.supplink === null || data.supplink === undefined || data.supplink === false) {
          return false;
        } else {
          return true;
        }
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
            isDisabled={isButtonDisabled()}
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
            isDisabled={isButtonDisabled()}
          />
        )}
        
      </>
    );
  });

export default SuppLinkCellRenderer;
