import React, { useEffect } from 'react';
import { connect } from 'redux-bundler-react';

import Card from 'app-components/card';

import { Row } from 'app-pages/data-entry/edit-data-sheet/forms/_shared/helper';

import '../../dataentry.scss';

const DataHeader = connect(
  'selectBaseData',
  'selectRouteParams',
  ({
    baseData,
    routeParams
  }) =>  (
    <Card className='mb-3'>
      <Card.Body>
        <Row>
          <div className='col-md-12 col-xs-4'>
            <Row className='border-bottom'>
              <div className='col-sm-2'>
                <b className='mr-2'>Site ID:</b>
                {baseData?.siteId || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Year:</b>
                {baseData?.year || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Field Office:</b>
                {baseData?.fieldoffice || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Project:</b>
                {baseData?.projectId || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Segment:</b>
                {baseData?.segmentId || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Season:</b>
                {baseData?.season || '--'}
              </div>
            </Row>
          </div>
          <div className='col-md-12 col-xs-4 mt-2'>
            <Row>
              <div className='col-sm-2'>
                <b className='mr-2'>Sample Unit Type:</b>
                {baseData?.sampleUnitType || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Sample Unit:</b>
                {baseData?.bend || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>R/N:</b>
                {baseData?.bendrn || '--'}
              </div>
              <div className='col-sm-2'>
                <b className='mr-2'>Bend River Mile:</b>
                {baseData?.bendRiverMile || '--'}
              </div>
              {(routeParams?.form === 'missouriRiver-edit' || routeParams?.form === 'missouriRiver-create') && (
                <div className='col-sm-4'>
                  <b className='mr-2'>MR FID:</b>
                  {baseData?.mrFid || '--'}
                </div>
              )}
            </Row>
          </div>
        </Row>
      </Card.Body>
    </Card>
  )
);

export default DataHeader;