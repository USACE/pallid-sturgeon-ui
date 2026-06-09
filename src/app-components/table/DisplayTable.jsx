import { Table as UswdsTable } from '@trussworks/react-uswds';
import './table.scss';

const DisplayTable = ({ headerData, rowData }) => (
  <UswdsTable compact bordered fullWidth className='margin-top-0 padding-0'>
    <thead>
      {headerData?.map((headerRow) => (
        <tr key={`header-${headerRow[0].label}`}>
          {headerRow?.map((headerCell) => (
            <th>{headerCell.label}</th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
      {rowData?.map((row) => {
        const rowKey = row.rowKey || row.id;
        return (
          <tr key={`row-${rowKey}`}>
            {headerData[0].map((column) => (
              <td key={`cell-${rowKey}-${column.name}`}>{row[column.name]}</td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </UswdsTable>
);

export default DisplayTable;
