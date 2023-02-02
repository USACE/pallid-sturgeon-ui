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
    data
  }) => {
    const fId = data.fid;
    // const params = paramType === 'tableId' ? { tableId: value } : { fId: data.fid };
    console.log(fId);

    return (
      <>
        <Button
          isOutline
          size='small'
          variant='info'
          title='Associated Supplemental Data Entries'
          text={'View Data'}
          icon={<Icon icon='dots-horizontal' />}
          // handleClick={() => doUpdateCurrentTab(2)}
        />
      </>
    );
  });

export default ProcLinkCellRenderer;
