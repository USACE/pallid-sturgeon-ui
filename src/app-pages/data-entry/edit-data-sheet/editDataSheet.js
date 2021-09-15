import React from 'react';
import { connect } from 'redux-bundler-react';

const EditDataSheet = connect(
  'selectDataEntry',
  ({
    dataEntry,
  }) => {
    const { activeType, data } = dataEntry;

    return (
      <div className='container-fluid overflow-auto'>
        TODO
        <br/>
        <br/>
        Type: {activeType}<br/>
        Data: {JSON.stringify(data)}
      </div>
    );
  }
);

export default EditDataSheet;
