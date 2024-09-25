
const asyncHandler=(reqHandlerfunction: Function) => (req, res, next) => {
    Promise.resolve(reqHandlerfunction(req, res ,next))
           .catch((error)=>next(error))
}

export { asyncHandler }