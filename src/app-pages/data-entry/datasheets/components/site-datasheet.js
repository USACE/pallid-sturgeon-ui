import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import Card from 'app-components/card';
import Button from 'app-components/button';

const SiteDatasheet = connect(
  'selectSitesData',
  ({ sitesData }) => {

    const {
      siteYear,
      fieldOffice,
      project,
      segment,
      season,
      sampleUnitTypeCode,
      bendrn,
      bendRiverMile
    } = sitesData[0];

    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-7'>
            <h4>Missouri River Data Sheets</h4>
          </div>
          <div className='col-5'>
            <Button
              isOutline
              size='small'
              variant='secondary'
              text='Create Search Effort Datasheet'
              title='Create Search Effort Datasheet'
              className='float-right'
            // handleClick={() => doDataEntrySetActiveType('fish')}
            />
            <Button
              isOutline
              size='small'
              variant='info'
              text='Create Missouri River Datasheet'
              title='Create Missouri River Datasheet'
              className='float-right mr-2'
            // handleClick={() => doDataEntrySetActiveType('fish')}
            />
          </div>
        </div>
        {/* Top Level Info */}
        <Card className='mt-3'>
          <Card.Body>
            <div className='row mt-2'>
              <div className='col-2'>
                <b className='mr-2'>Year:</b>
                {siteYear || '--'}
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
                {sampleUnitTypeCode || '--'}
              </div>
              <div className='col-2'>
                <b className='mr-2'>Sample Unit:</b>
                {'--'}
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
      </div>
    );
  });

export default SiteDatasheet;
