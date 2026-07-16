import { connect } from 'redux-bundler-react';
import { Grid } from '@trussworks/react-uswds';

import Card from '@components/card';

import './dataHeader.scss';

const DataHeader = connect(
  'selectBaseData',
  'selectRouteParams',
  'selectDataEntryData',
  'selectDataEntryFishData',
  ({ baseData, dataEntryData, dataEntryFishData, type }) => {
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

    const firstIdLabel = type === 'supp-proc' ? 'MR FID:' : `${metadata?.[type]?.text} ID:`;
    const firstIdValue = type === 'supp-proc' ? dataEntryFishData?.items?.[0]?.mrFid : metadata?.[type]?.id;

    const secondIdLabel = type === 'supp-proc' ? 'F FID:' : `${metadata?.[type]?.text} Field ID:`;
    const secondIdValue = type === 'supp-proc' ? dataEntryFishData?.items?.[0]?.fFid : metadata?.[type]?.fid;

    return (
      <Card className='test mb-3'>
        <Card.Body>
          {!isEmpty && (
            <Grid row gap='md' className='padding-bottom-1 border-bottom'>
              <Grid tablet={{ col: 2 }}>
                <span className='text-bold'>{firstIdLabel}</span> {firstIdValue || '--'}
              </Grid>
              <Grid tablet={{ col: 10 }}>
                <span className='text-bold'>{secondIdLabel}</span> {secondIdValue || '--'}
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
