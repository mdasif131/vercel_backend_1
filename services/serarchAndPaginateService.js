export const searchAndPaginateService = async (
  Requested,
  DataModel,
  SearchArray,
  JoinStage,
) => {
  try {
    let pageNo = Number(Requested.params.pageNo);
    let perPage = Number(Requested.params.perPage);
    let searchValue = Requested.params.searchKeyword;
    let skipRow = (pageNo - 1) * perPage;
    let data;

    if (searchValue !== '0') {
      let SearchQuery = { $or: SearchArray };
      data = await DataModel.aggregate([
        JoinStage, // Add lookup first
        { $match: SearchQuery },
        {
          $facet: {
            Total: [{ $count: 'count' }],
            Rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    } else {
      data = await DataModel.aggregate([
        JoinStage, // Add lookup first
        {
          $facet: {
            Total: [{ $count: 'count' }],
            Rows: [{ $skip: skipRow }, { $limit: perPage }],
          },
        },
      ]);
    }
    return { status: 'success', data: data };
  } catch (error) {
    return { status: 'fail', message: 'Internal Server Error', error };
  }
};
