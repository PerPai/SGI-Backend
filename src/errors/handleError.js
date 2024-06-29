const InternalError = (res, error) =>{
    return res.status(500).json({
        "message": error
    })
}

export default InternalError;