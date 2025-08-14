export function verifyToken (req, res) {
    return res.status(200).json({
        secret:process?.env?.JWT_SECRET,
        req: req
    })
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
}