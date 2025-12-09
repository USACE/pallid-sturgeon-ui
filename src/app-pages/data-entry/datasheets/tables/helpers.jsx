const getNextEditCol = (curr, cols, dir) => {
  let i = curr + dir;
  while (i >= 0 && i < cols.length) {
    const isEditable = !!cols[i].getColDef().editable;
    if (isEditable) return i;
    i += step;
    // +1 -> Tab (to forward)
  }
  return -1;
  // -1 -> Shift + Tab (to backward)
};

export const tabToNextCell = (params) => {
  if (!params || !params?.previousCellPosition || !params?.columnApi) return false;
  const { columnApi, backwards, previousCellPosition } = params;
  const step = backwards ? -1 : 1;

  const currColId = previousCellPosition.column.getColId();
  if (!currColId) return false;

  const displayedCols = columnApi.getAllDisplayedColumns();

  const currIdx = displayedCols.findIndex((c) => c.getColId() === currColId);
  if (currIdx === -1) return false;

  const nextIdx = getNextEditCol(currIdx, displayedCols, step);
  if (nextIdx === -1) return false;

  return {
    rowIndex: previousCellPosition.rowIndex,
    column: displayedCols[nextIdx],
  };
};
