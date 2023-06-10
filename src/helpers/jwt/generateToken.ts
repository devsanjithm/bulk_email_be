import * as jwt from 'jsonwebtoken';
const generateToken = async (user: any, refreshToken = true) => {
  const [at, rt] = await Promise.all([
    jwt.sign(user, process.env.ACCESSTOKEN, { expiresIn: '1d' }),
    jwt.sign(user, process.env.REFRESHTOKEN, { expiresIn: '7d' }),
  ]);

  if (refreshToken) {
    return {
      access_token: at,
      refresh_token: rt,
    };
  } else {
    return {
      access_token: at,
    };
  }
};
export default generateToken;
