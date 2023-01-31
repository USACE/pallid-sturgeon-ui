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
    data
  }) => {
    const fId = data.fid; 
    const hasSuppData = !!dataEntrySupplemental.items.filter(data => data.fid === fId).length;

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
            handleClick={() => doUpdateCurrentTab(2)}
          />
        ) : (
          <Button
            isOutline
            size='small'
            variant='success'
            title='Associated Supplemental Data Entries'
            text={'Add Data'}
            icon={<Icon icon='plus' />}
          // handleClick={() => doFetchSupplementalDataEntry({ fId: fId }, () => doUpdateCurrentTab(2))}
          />
        )}
        
      </>
    );
  });

export default SuppLinkCellRenderer;
