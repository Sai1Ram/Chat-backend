const notFound=(req, resp, next)=>{
    const error = new Error(`Not found`);
    resp.sendStatus(404);
    next(error);
}
export default notFound;