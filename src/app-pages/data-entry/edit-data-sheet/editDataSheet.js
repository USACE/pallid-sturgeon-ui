import React from 'react';
import { connect } from 'redux-bundler-react';

import FishForm from './forms/fishForm';
import MissouriRiverForm from './forms/missouriRiverForm';
import SearchEffortForm from './forms/searchEffortForm';
import SupplementalForm from './forms/supplementalForm';
import TelemetryForm from './forms/telemetryForm';

const EditDataSheet = connect(
  'selectRouteParams',
  ({
    routeParams,
  }) => {
    const { datasheet, formType } = routeParams;

    const getForm = () => {
      switch(datasheet) {
        case 'missouriRiver':
          return <MissouriRiverForm edit={formType === 'edit' ? true : false} />;
        case 'fish':
          return <FishForm />;
        case 'supplemental':
          return <SupplementalForm edit={formType === 'edit' ? true : false} />;
        case 'searchEffort':
          return <SearchEffortForm edit={formType === 'edit' ? true : false} />;
        case 'telemetry':
          return <TelemetryForm edit={formType === 'edit' ? true : false} />;
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
