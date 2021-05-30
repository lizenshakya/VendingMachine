((commonHelper) => {


    commonHelper.sendSuccessDataResponse = (res, {
        status,
        message,
        data
    }) => {
        return res.status(status).json({
            statusCode: status,
            message: message,
            data
        });

    }
    commonHelper.sendSuccessDataListResponse = (res, {
        status,
        message,
        dataList
    }) => {
        return res.status(status).json({
            statusCode: status,
            message: message,
            dataList
        });

    }

    commonHelper.sendErrorMessage = ({res, error}) => {
        return res.status(500).json({
            statusCode: 500,
            message: error.message
          });
    }
    commonHelper.sendErrorResponse = ({res, errorMsg, status}) => {
        return res.status(status).json({
            statusCode: status,
            message: errorMsg,
            error: true
          });
    }
    commonHelper.sendValidationErrorMessage = ({res, message, errors}) => {
        return res.status(403).json({
            statusCode: 403,
            message,
            error: true,
            errors
          });
    }
})(module.exports);