((providerHelper) => {
  'use strict';
  const Promise = require('bluebird');
  const join = Promise.join;

  providerHelper.getPaginatedDataList = (req, collectionName, queryOpts, pagerOpts, projectFields, sortOpts) => {
    return join(
      req.db.collection(collectionName)
        .find(queryOpts, { projection: projectFields })
        .skip(pagerOpts.perPage * (pagerOpts.page - 1))
        .limit(pagerOpts.perPage)
        .sort(sortOpts).toArray(),
      req.db.collection(collectionName).countDocuments(queryOpts),
      (dataList, count) => {
        return {
          dataList: dataList,
          totalItems: count,
          currentPage: pagerOpts.page
        };
      });
  };

  providerHelper.checkDuplicateSlugTitle = (req, collectionName, slugOpts, titleOpts) => {
    return join(
      req.db.collection(collectionName).countDocuments(titleOpts),
      req.db.collection(collectionName).countDocuments(slugOpts),
      (dataList, count) => {
        return {
          titleCount: dataList,
          slugCount: count
        };
      });
  };

  providerHelper.getAllDocumentsByQuery = (req, collectionName, queryOpts, projection, sortOpts, pagerOpts) => {
    return req.db.collection(collectionName).find(queryOpts, projection)
      .skip(pagerOpts.perPage * (pagerOpts.page - 1))
      .limit(pagerOpts.perPage)
      .sort(sortOpts)
      .toArray();
  }
  providerHelper.countDocumentByquery = (req, collectionName, queryOpts) => {
    return req.db.collection(collectionName).countDocuments(queryOpts);
  };

  providerHelper.createDocument = (req, collectionName, objToSave) => {
    return req.db.collection(collectionName).insertOne(objToSave);
  }
  providerHelper.updateDocument = ({req, collectionName, queryOpts, objToSave}) => {
    return req.db.collection(collectionName).updateOne(queryOpts, { $set: objToSave });
  }

  providerHelper.getDocumentByQuery = ({req, collectionName, queryOpts, projectionFields}) => {
    return req.db.collection(collectionName).findOne(queryOpts, { projection: projectionFields });
  }
  providerHelper.getRandomDate = (req, collectionName, queryOpts, count, projectionFields) => {
    return req.db.collection(collectionName).aggregate([{ $match: queryOpts }, { $sample: { size: count } }, { $project: projectionFields }]).toArray();
  }
  providerHelper.getSearchData = (req, collection, queryOpts, projectionFields) => {
    return req.db
      .collection(collection)
      .aggregate([{ $match: queryOpts }, { $project: projectionFields }, { $sort: { added_on: -1 } }])
      .toArray();
  }
  providerHelper.getAllDocumentByQuery = ({req, collectionName, queryOpts, projectionFields}) => {
    return req.db.collection(collectionName).find(queryOpts, { projection: projectionFields }).toArray();
  }
})(module.exports);
