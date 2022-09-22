import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from 'app-components/button';
import Icon from 'app-components/icon';

const SuppIdCellRenderer = connect(
  'doFetchSupplementalDataEntry',
  'doUpdateUrl',
  ({
    doFetchSupplementalDataEntry,
    doUpdateUrl,
    uri,
    paramType,
    value,
    data
  }) => {
    const params = paramType === 'tableId' ? { tableId: value } : { fId: data.fid };

    return (
      <>
        {paramType === 'tableId' &&
          (<Button
            size='small'
            variant='link'
            className='p-0 mb-1'
            text={value}
            handleClick={() => doFetchSupplementalDataEntry(params, doUpdateUrl(uri))}
          />)
        }
        {paramType !== 'tableId' &&
          (<Button
            isOutline
            size='small'
            variant='info'
            title='Associated Supplemental Data Entries'
            text='View Data'
            icon={<Icon icon='dots-horizontal' />}
            handleClick={() => doFetchSupplementalDataEntry(params, doUpdateUrl(uri))}
          />)
        }
      </>
    );
  });

export default SuppIdCellRenderer;