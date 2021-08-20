import createRestBundle from './create-rest-bundle';

export default createRestBundle({
  name: 'datasheet',
  addons: {
    doDataEntryLoadData: () => ({ dispatch, store }) => {
      dispatch({ type: 'LOADING_DATASHEET_INIT_DATA' });
      store.doDatasheetProjectsFetch();
      store.doDatasheetSeasonsFetch();
      store.doDatasheetSegmentsFetch();
      store.doDatasheetBendsFetch();
    },
  },
});
