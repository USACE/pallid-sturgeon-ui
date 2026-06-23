import { connect } from 'redux-bundler-react';
import { Grid } from '@trussworks/react-uswds';

import Card from '@components/card';

import '../../dataentry.scss';

const DataHeader = connect(
  'selectBaseData',
  'selectRouteParams',
  'selectDataEntryData',
  ({ baseData, dataEntryData, type }) => {
    const isEmpty = Object.keys(dataEntryData).length === 0;

    const metadata = {
      'missouri-river': {
        id: dataEntryData?.mrId,
        fid: dataEntryData?.mrFid,
        text: 'MR',
      },
      'search-effort': {
        id: dataEntryData?.seId,
        fid: dataEntryData?.seFid,
        text: 'SE',
      },
    };

    return (
      <Card className='mb-3'>
        <Card.Body>
          {!isEmpty && (
            <Grid row gap='md' className='padding-bottom-1 border-bottom'>
              <Grid tablet={{ col: 2 }}>
                <span className='text-bold'>{metadata?.[type]?.text} ID:</span> {metadata?.[type]?.id || '--'}
              </Grid>
              <Grid tablet={{ col: 2 }}>
                <span className='text-bold'>{metadata?.[type]?.text} Field ID:</span> {metadata?.[type]?.fid || '--'}
              </Grid>
            </Grid>
          )}
          <Grid row gap='md' className={`padding-bottom-1 border-bottom ${!isEmpty ? 'padding-top-1' : ''}`}>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Site ID:</span> {baseData?.siteId || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Year:</span> {baseData?.year || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Field Office:</span> {baseData?.fieldoffice || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Project:</span> {baseData?.projectId || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Segment:</span> {baseData?.segmentId || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Season:</span> {baseData?.season || '--'}
            </Grid>
          </Grid>
          <Grid row gap='md' className='padding-top-1 padding-bottom-1'>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Sample Unit Type:</span> {baseData?.sampleUnitType || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Sample Unit:</span> {baseData?.bend || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>R/N:</span> {baseData?.bendrn || '--'}
            </Grid>
            <Grid tablet={{ col: 2 }}>
              <span className='text-bold'>Bend River Mile:</span> {baseData?.bendRiverMile || '--'}
            </Grid>
          </Grid>
        </Card.Body>
      </Card>
    );
  }
);

export default DataHeader;
