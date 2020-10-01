// JWT for data transmission for authtoken and authorization
import jwt from "jsonwebtoken";

const genUserToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      isAdmin: user.isAdmin,
      verified: user.verified,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "3 days",
    }
  );
  return token;
};

export default genUserToken;
