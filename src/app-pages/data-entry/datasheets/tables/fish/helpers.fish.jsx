import ConditionTableCell from '@src/app-components/table/table-cell-components/fish/ConditionTableCell';
import CountTableCell from '@src/app-components/table/table-cell-components/fish/CountTableCell';
import FinCurlTableCell from '@src/app-components/table/table-cell-components/fish/FinCurlTableCell';
import FishLinkTableCell from '@src/app-components/table/table-cell-components/fish/FishLinkTableCell';
import FloyTagTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell';
import FloyTagMrTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell.mr';
import FloyTagPrefixTableCell from '@src/app-components/table/table-cell-components/fish/floy-tag/FloyTagTableCell.prefix';
import GeneticVialNumTableCell from '@src/app-components/table/table-cell-components/fish/GeneticVialNumTableCell';
import LengthTableCell from '@src/app-components/table/table-cell-components/fish/LengthTableCell';
import PanelHookTableCell from '@src/app-components/table/table-cell-components/fish/PanelHookTableCell';
import WeightTableCell from '@src/app-components/table/table-cell-components/fish/WeightTableCell';
import { TableCell } from '@src/app-components/table/table-cell-components/TableCell';
import { CreateComboboxOptions, createDropdownOptions } from '@src/app-pages/data-entry/dataEntryHelper';
import { createColumnHelper } from '@tanstack/react-table';

export const getFishColumns = ({
  gear,
  speciesOptions,
  lengthTypes,
  floyTagPrefixes,
  markRecaptureOptions,
  yesNoOptions,
  fishStructures,
}) => {
  const columnHelper = createColumnHelper();

  return [
    columnHelper.accessor('fid', {
      header: 'Fish ID',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 150,
    }),
    columnHelper.accessor('fFid', {
      header: 'Field ID',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 150,
    }),
    columnHelper.accessor('supplementalData', {
      header: 'Supp/Proc Link',
      cell: FishLinkTableCell,
      size: 60,
      enableSorting: false,
      meta: {
        centerText: true,
        optional: true, // These values are set to prevent error styling from rendering when inappropriate.
      },
    }),
    columnHelper.accessor('panelHook', {
      header: 'Panel/Hook',
      cell: PanelHookTableCell,
      size: 190,
      meta: {
        gear: gear,
      },
    }),
    columnHelper.accessor('species', {
      header: 'Species',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'combobox',
        options: CreateComboboxOptions(speciesOptions),
      },
    }),
    columnHelper.accessor('lengthType', {
      header: 'Length Type',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        required: true,
        options: createDropdownOptions(lengthTypes),
      },
    }),
    columnHelper.accessor('length', {
      header: 'Length(mm)',
      cell: LengthTableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('weight', {
      header: 'Weight(grams)',
      cell: WeightTableCell,
      size: 200,
      meta: { type: 'number' },
    }),
    columnHelper.accessor('countF', {
      header: 'Count',
      cell: CountTableCell,
      size: 200,
    }),
    columnHelper.accessor('ftPrefix', {
      header: 'Floy Tag Prefix',
      cell: FloyTagPrefixTableCell,
      size: 200,
      meta: {
        options: createDropdownOptions(floyTagPrefixes),
      },
    }),
    columnHelper.accessor('floyTag', {
      header: 'Floy Tag',
      cell: FloyTagTableCell,
      size: 200,
    }),
    columnHelper.accessor('mR', {
      header: 'Floy Tag M/R',
      cell: FloyTagMrTableCell,
      size: 200,
      meta: {
        options: createDropdownOptions(markRecaptureOptions),
      },
    }),
    columnHelper.accessor('geneticsVialNumber', {
      header: 'Genetics Vial #',
      cell: GeneticVialNumTableCell,
      size: 250,
    }),
    columnHelper.accessor('condition', {
      header: 'Condition',
      cell: ConditionTableCell,
      size: 200,
    }),
    columnHelper.accessor('tagnumber', {
      header: 'Tag Number',
      cell: TableCell,
      size: 200,
    }),
    columnHelper.accessor('finCurl', {
      header: 'Fin Curl',
      cell: FinCurlTableCell,
      size: 200,
      meta: {
        type: 'select',
        options: yesNoOptions,
      },
    }),
    columnHelper.accessor('otolith', {
      header: 'Otolith',
      cell: TableCell,
      size: 200,
      meta: {
        type: 'select',
        options: createDropdownOptions(fishStructures),
      },
    }),
    // NOTE: Not in requirements, but display historic data
    columnHelper.accessor('raySpine', {
      header: 'Ray Spine',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 200,
    }),
    columnHelper.accessor('KN', {
      header: 'KN',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 200,
    }),
    columnHelper.accessor('RSD', {
      header: 'RSD',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 200,
    }),
    columnHelper.accessor('editInitials', {
      header: 'Edit Initials',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 200,
    }),
    columnHelper.accessor('uploadedBy', {
      header: 'Uploaded By',
      cell: ({ cell }) => <span>{cell.getValue()}</span>,
      size: 200,
    }),
  ];
};
