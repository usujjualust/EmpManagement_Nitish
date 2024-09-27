import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler } from '../../utilities/asyncHandler';
import { Request, Response, NextFunction } from 'express';
const { verify } = jwt;

const TOKEN = {
    accessSecret :  process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshSecret : process.env.AUTH_REFRESH_TOKEN_SECRET
}
interface AuthenticatedRequest extends Request {
    userId?: string;
    token?: string;
  }
  interface CustomJwtPayload extends JwtPayload {
    _id: string;
  }

export const requireAuthentication = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
    try {
        const authHeader = req.header("Authorization");
        console.log(req.header("Authorization"))
        if(! authHeader || ! authHeader?.startsWith('Bearer ')){
          console.error("unknown authentication scheme")
          return res.status(401).json({msg: 'unknown authentication scheme'})
        }
        const accessTokenParts = authHeader!.split(" ")
        const accessToken = accessTokenParts[1]
        console.log(accessToken)
        const decodedAccessToken = verify(accessToken,TOKEN.accessSecret!)as CustomJwtPayload;
        req.userId = decodedAccessToken._id;
        req.token = accessToken;
        next()
    } catch (error) {
        console.log(error)

        // const expParams = {
        //     error: "expired_access token",
        //     description: "access token expired"
        // };

        console.error("Authentication error", error)
        next(error)
    }
})