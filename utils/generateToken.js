export function generateAccessToken(data) {
  return jwt.sign(data, process.env.TOKEN_SECRET);
}