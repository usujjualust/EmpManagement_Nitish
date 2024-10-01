import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler } from '../../utilities/asyncHandler';
import { Request, Response, NextFunction } from 'express';
import { generateAccessToken } from '../authentication';
import { fetchUser } from '../../services/admin.services';
const { verify } = jwt;

const TOKEN = {
    accessSecret :  process.env.AUTH_ACCESS_TOKEN_SECRET,
    refreshSecret : process.env.AUTH_REFRESH_TOKEN_SECRET
}
  export interface AuthenticatedRequest extends Request {
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
        if(error instanceof Error && error.name === 'TokenExpiredError'){
          return cookieAuthentication(req, res, next)
        }
        console.error("Authentication error", error)
        next(error)
    }
})

export const cookieAuthentication = asyncHandler(async(req: AuthenticatedRequest, res: Response, next: NextFunction) =>{
  try {
    const authCookie = req.cookies['refreshToken']
    console.log(`authCookie : ${authCookie}`)
    if (!authCookie) {
      return res.status(401).json({ error: 'Invalid refresh token' });
  }
    const decodeRefreshToken = verify(authCookie,TOKEN.refreshSecret!)as CustomJwtPayload;
    const user_id = decodeRefreshToken._id
    const user = await fetchUser(undefined, undefined, user_id)
    if(! user) {
      return res.status(404).json({id: user_id,
                            messaged: "not found"
      })
    }
    const newAccessToken = await generateAccessToken(user)
    const decodedAccessToken = verify(newAccessToken,TOKEN.accessSecret!)as CustomJwtPayload;
    req.userId = decodedAccessToken._id;
    req.token = newAccessToken;
    res.setHeader('Authorization', `Bearer ${newAccessToken}`)
    next()
    if(authCookie == null ) {
      res.status(401).json({error : 'Invalid refresh token'})
    } 



  } catch (error) {
    console.error("Authentication error", error)
    next(error)
  }
})