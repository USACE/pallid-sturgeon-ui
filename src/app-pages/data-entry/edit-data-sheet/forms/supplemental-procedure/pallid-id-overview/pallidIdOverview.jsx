import { connect } from 'redux-bundler-react';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import RecaptureDataTable from './PallidIdOverview.recaptureTable';

const PallidIdOverview = connect('selectPallidIdData', ({ pallidIdData }) => {
  const { geneticNeeds, lab, recaptureInfo, stockedJuvenileInfo } = pallidIdData;
  return (
    <div className='container-fluid'>
      <GridContainer className='border'>
        <Grid row gap='sm' className='margin-top-1'>
          <Grid tablet={{ col: 4 }}>
            <p>
              <span className='text-bold'>Priority Score:</span> --
            </p>
          </Grid>
          <Grid tablet={{ col: 4 }}>
            <p>
              <span className='text-bold'>Genetic Needs:</span> {geneticNeeds || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 4 }}>
            <p>
              <span className='text-bold'>Lab:</span> {lab || '--'}
            </p>
          </Grid>
        </Grid>

        <h5 className='margin-top-0'>Stocked Juvenile Information</h5>
        <hr />
        <Grid row gap='sm' className='margin-bottom-0'>
          <Grid tablet={{ col: 6 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>Hatchery:</span> {stockedJuvenileInfo?.[0]?.hatchery || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 6 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>Stock Site:</span> {stockedJuvenileInfo?.[0]?.stockSite || '--'}
            </p>
          </Grid>
        </Grid>
        <Grid row gap='sm' className='margin-bottom-0'>
          <Grid tablet={{ col: 3 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>Year Class:</span> {stockedJuvenileInfo?.[0]?.yearClass || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>CWT:</span> {stockedJuvenileInfo?.[0]?.cwt || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 3 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>Scute:</span> {stockedJuvenileInfo?.[0]?.scute || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 2 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>ER:</span> {stockedJuvenileInfo?.[0]?.er || '--'}
            </p>
          </Grid>
          <Grid tablet={{ col: 2 }}>
            <p className='margin-bottom-0'>
              <span className='text-bold'>EL:</span> {stockedJuvenileInfo?.[0]?.el || '--'}
            </p>
          </Grid>
        </Grid>

        <h5 className='margin-top-0'>Recaptured Information</h5>
        <hr />
        <Grid row gap='sm' className='padding-bottom-1'>
          <RecaptureDataTable recaptureInfo={recaptureInfo} />
        </Grid>
      </GridContainer>
    </div>
  );
});

export default PallidIdOverview;
