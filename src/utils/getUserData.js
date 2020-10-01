import jwt from "jsonwebtoken";
const getUserData = (request, requireAuth = true) => {
  // header from subscription : request.connection.context.Authorization
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const token = header.split(" ")[1];
    const decodedValues = jwt.verify(token, process.env.SECRET_KEY);
    const userData = {
      id: decodedValues.id,
      role: decodedValues.role,
      isAdmin: decodedValues.isAdmin,
      verified: decodedValues.verified,
    };
    return userData;
  }
  if (requireAuth) {
    throw new Error("Auth required");
  }
  return null;
};
export default getUserData;
