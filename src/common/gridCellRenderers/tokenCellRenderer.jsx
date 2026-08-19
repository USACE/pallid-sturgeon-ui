import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { mdiAccountKey } from '@mdi/js';

import Button from '@components/button';
import TokenModal from '@src/app-pages/admin/users/TokenModal';
import Icon from '@components/icon/icon';

const TokenCellRenderer = connect(
  'doModalOpen',
  ({ doModalOpen, api, columnApi, rowIndex, data }) => {

    return (
        <div className='btn-group'>
          <Button
            isOutline
            size='small'
            className='ml-1'
            title='View User Token'
            icon={<Icon path={mdiAccountKey} />}
            handleClick={() =>
              doModalOpen(TokenModal, {
                user4Token: data.email,
              })
            }
          />
      </div>
    );
  }
);

export default TokenCellRenderer;
