import React from 'react';
import { connect } from 'redux-bundler-react';

import FishForm from './forms/fishForm';
import MissouriRiverForm from './forms/missouriRiverForm';
import SupplementalForm from './forms/supplementalForm';

const EditDataSheet = connect(
  'selectDataEntry',
  ({
    dataEntry,
  }) => {
    const { activeType, lastParams } = dataEntry;

    console.log('test activeType: ', activeType);
    console.log('test lastParams: ', lastParams);

    const getForm = () => {
      switch(activeType) {
        case 'missouriRiver':
          return <MissouriRiverForm />;
        case 'fish':
          return <FishForm />;
        case 'supplemental':
          return <SupplementalForm />;
        default:
          return <>Unknown data type.</>;
      }
    };

    return (
      <div className='container-fluid overflow-auto'>
        {getForm()}
      </div>
    );
  }
);

export default EditDataSheet;
