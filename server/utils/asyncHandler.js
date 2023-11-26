const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch(err => next(err));

        // try {
    //     await requestHandler(req, res, next);
        // } catch (error) {
        //    res.staus(error || 500).json({ error: error.message });
        // }
    };
};
export { asyncHandler }