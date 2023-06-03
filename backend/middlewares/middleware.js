const notFound=(req, resp, next)=>{
    const error = new Error(`Not found`);
    resp.send(404);
    next(error);
}
export default notFound;