import { connect } from 'redux-bundler-react';
import { Grid, GridContainer, Table } from '@trussworks/react-uswds';
import Card from '@src/app-components/card';

const PallidIdOverview = connect(({}) => (
  <div className='container-fluid'>
    {/* <Card className='mt-3'> */}
    {/* <Card.Header text='Pallid ID Overview' /> */}
    {/* <Card.Body> */}
    <GridContainer className='border'>
      <Grid row gap='sm' className='padding-bottom-1'>
        <Grid tablet={{ col: 4 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Priority Score:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Genetic Needs:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 4 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Lab:</span> -TODO-
          </p>
        </Grid>
      </Grid>
      <br />
      <h4>Stocked Juvenile Information</h4>
      <hr></hr>
      <Grid row gap='sm' className='padding-bottom-1'>
        <Grid tablet={{ col: 6 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Hatchery:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 6 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Stock Site:</span> -TODO-
          </p>
        </Grid>
      </Grid>
      <Grid row gap='sm' className='padding-bottom-1'>
        <Grid tablet={{ col: 3 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Year Class:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 3 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>CWT:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 3 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>Scute:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 2 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>ER:</span> -TODO-
          </p>
        </Grid>
        <Grid tablet={{ col: 2 }}>
          <p className='margin-bottom-0'>
            <span className='text-bold'>EL:</span> -TODO-
          </p>
        </Grid>
      </Grid>
      <br />
      <Grid row gap='sm' className='padding-bottom-1'>
        <Grid tablet>
          <h4>Recaptured Information</h4>
        </Grid>
      </Grid>
      <hr />
      <Grid row gap='sm' className='padding-bottom-1'>
        <Grid tablet>
          <span>TODO - Recaptured Information goes here</span>
          <Table></Table>
        </Grid>
      </Grid>
    </GridContainer>
    {/* </Card.Body> */}
    {/* </Card> */}
  </div>
));

export default PallidIdOverview;
