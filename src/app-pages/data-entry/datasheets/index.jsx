import Card from '@components/card/card';
import FindDataSheet from './pages/find-data-sheet';
import Breadcrumb from '@src/app-components/breadcrumb';

const breadcrumbLinks = [
  {
    text: 'Find Datasheet',
    current: true,
  },
];

const DataSheets = () => (
  <div className='container-fluid'>
    <Breadcrumb paths={breadcrumbLinks} />
    <Card className='mb-3'>
      <Card.Header text='Find Data Sheet by ID' />
      <Card.Body>
        <FindDataSheet />
      </Card.Body>
    </Card>
  </div>
);

export default DataSheets;
