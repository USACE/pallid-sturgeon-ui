import React from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';

// @TODO - Create this form

// 92457 for testing

const FishForm = connect(
  'selectDataEntryData',
  ({
    dataEntryData,
  }) => {
    const {
      fid,
      mrId,
      year,
      fieldOffice,
      project,
      segment,
      season,
      sampleUnitType,
      sampleUnit,
      bendrn,
      bendRiverMile,
    } = dataEntryData;

    return (
      <>
        <h4>Fish Datasheet for Missouri River Datasheet {mrId} (Field ID {fid}) </h4>
        <Card className='mt-3'>
          <Card.Body>
            <div className='row'>
              <div className='col-2'>
                <b className='mr-2'>Year:</b>
                {year || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Field Office:</b>
                {fieldOffice || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Project:</b>
                {project || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Segment:</b>
                {segment || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Season:</b>
                {season || '--'}
              </div>
            </div>
            <hr />
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit Type:</b>
                {sampleUnitType || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit:</b>
                {sampleUnit || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>R/N:</b>
                {bendrn || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Bend River Mile:</b>
                {bendRiverMile || '--'}
              </div>
            </div>
          </Card.Body>
        </Card>
      </>
    );
  }
);

export default FishForm;
