import DisplayTable from '@src/app-components/table/DisplayTable';

const headerData = [
  [
    {
      label: 'PIT Tag',
      name: 'tagnumber',
    },
    {
      label: 'PIT Tag 2',
      name: 'tagnumber2',
    },
    {
      label: 'Capture Date',
      name: 'captureDate',
    },
    {
      label: 'Capture Location',
      name: 'captureLocation',
    },
    {
      label: 'Hatchery',
      name: 'hatchery',
    },
    {
      label: 'Stock Date',
      name: 'stockDate',
    },
    {
      label: 'Sex',
      name: 'sex',
    },
    {
      label: 'Pallid/Hybrid',
      name: 'pallidHybrd',
    },
    {
      label: 'CWT',
      name: 'cwt',
    },
    {
      label: 'Scute',
      name: 'scute',
    },
    {
      label: 'Elastomer Left',
      name: 'el',
    },
    {
      label: 'Elastomer Right',
      name: 'er',
    },
  ],
];

const RecaptureDataTable = ({ recaptureInfo }) => <DisplayTable headerData={headerData} rowData={recaptureInfo} />;

export default RecaptureDataTable;
