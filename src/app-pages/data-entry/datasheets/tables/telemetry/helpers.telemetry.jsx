import { mdiCrosshairsGps } from '@mdi/js';
import Icon from '@src/app-components/icon/icon';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';

const saveBtnClasses = classNames('button-small', 'text-normal', 'save-btn');

const createDropdownOptions = (data) => {
  if (!data) return [];

  return data.map((item) => {
    const { code, description } = item;

    return {
      value: code,
      text: description,
    };
  });
};

const getRowIndex = (val) => val?.split('-')?.at('-1');

export const getTelemetryColumns = ({
  frequencyId,
  positionConfidence,
  spawnBehavior,
  mesos,
  macros,
  handleCaptureRow,
  online,
}) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('tId', {
      header: 'ID',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 150,
    }),
    columnHelper.accessor('tFid', {
      header: 'Field ID',
      cell: ({ cell }) => <span>{getRowIndex(cell.getValue())}</span>,
      size: 150,
    }),
    columnHelper.accessor('bend', {
      header: 'Bend',
      cell: TableCell,
      size: 100,
      meta: { readOnly: true },
    }),
    columnHelper.accessor('bendRiverMile', {
      header: 'Bend River Mile',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 190,
    }),
    columnHelper.accessor('radioTagNum', {
      header: 'Radio Tag #',
      cell: TableCell,
      size: 200,
      meta: { type: 'number', required: true },
    }),
    columnHelper.accessor('frequencyIdCode', {
      header: 'Frequency ID',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(frequencyId),
      },
    }),
    columnHelper.accessor('captureButton', {
      header: 'Capture Button',
      cell: ({ row }) => (
        <Button className='primary-btn' onClick={() => handleCaptureRow(row.index)} type='button'>
          <Icon path={mdiCrosshairsGps} />
        </Button>
      ),
      size: 200,
    }),
    columnHelper.accessor('captureTime', {
      header: 'Capture Time',
      cell: TableCell,
      size: 200,
      meta: { type: 'text' },
    }),
    columnHelper.accessor('captureLatitude', {
      header: 'Capture Latitude',
      cell: TableCell,
      size: 200,
      meta: { type: 'text', required: true },
    }),
    columnHelper.accessor('captureLongitude', {
      header: 'Capture Longitude',
      cell: TableCell,
      size: 200,
      meta: { type: 'text', required: true },
    }),
    columnHelper.accessor('positionConfidence', {
      // select?
      header: 'Position Confidence',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(positionConfidence),
      },
    }),
    columnHelper.accessor('spawnBehavior', {
      header: 'Spawn Behavior',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(spawnBehavior),
      },
    }),
    columnHelper.accessor('mesoId', {
      // select?
      header: 'Meso',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(mesos),
      },
    }),
    columnHelper.accessor('macroId', {
      // select?
      header: 'Macro',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(macros),
      },
    }),
    columnHelper.accessor('depth', {
      header: 'Depth',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('temp', {
      header: 'Temp',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('conductivity', {
      header: 'Conductivity',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('turbidity', {
      header: 'Turbidity',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('silt', {
      header: 'Silt',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('sand', {
      header: 'Sand',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('gravel', {
      header: 'Gravel',
      cell: TableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('comments', {
      header: 'Comments',
      cell: TableCell,
      size: 200,
      meta: { type: 'text' },
    }),
    ...(online
      ? [
          columnHelper.accessor('editInitials', {
            header: 'Edit Initials',
            cell: TableCell,
            size: 200,
            meta: { type: 'text' },
          }),
          columnHelper.accessor('lastEditComment', {
            header: 'Last Edit Comment',
            cell: TableCell,
            size: 200,
            meta: { type: 'text' },
          }),
          columnHelper.accessor('checkby', {
            header: 'Check By',
            cell: TableCell,
            size: 200,
            meta: { type: 'text' },
          }),
          columnHelper.accessor('uploadedBy', {
            header: 'Uploaded By',
            cell: ({ cell }) => <span>{cell.getValue()}</span>,
            size: 190,
          }),
        ]
      : []),
  ];
};
