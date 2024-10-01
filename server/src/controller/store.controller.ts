import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utilities/asyncHandler';
import { generateAccessToken, generateRefreshToken } from '../middlewares/authentication';
import { UserRegistry } from '../models/user.model';
import { Store } from '../models/store.model';
import jwt from 'jsonwebtoken';
import { fetchStore } from '../services/store.services';
const { verify } = jwt;

const storeLogin = asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
    try {
        const {userId, password} = req.body
    if (! userId ){
      console.error('userId is not provided')
      return res.status(400).send('user id not provided');
    }
    if (! password ){
      console.error('password is not provided')
      return res.status(400).send('password not provided');
    }
    const user: Store | null = await fetchStore(userId);     
    if(! user){
      return res.status(404).send('Store not found!');
    }
    const result = await UserRegistry.isPasswordCorrect(password, user.password_hash)
    if(! result){
      console.log("store id and password donot match")
      return res.status(400).send('store id and password donot match')
    }
    const accessToken = await generateAccessToken(user);
    let verifycode = verify(accessToken, process.env.AUTH_ACCESS_TOKEN_SECRET!,(err)=>{
      if(err){
          console.log(err);
      }});
    console.log({at: accessToken })
    const refreshToken = await generateRefreshToken(user);
    verifycode = verify (refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET!,(err)=>{
      if(err){
          console.log(err);
      } });
    console.log(verifycode);
    console.log({rt: refreshToken })
    res.setHeader('Authorization', `Bearer ${accessToken}`)
    res.cookie('refreshToken', refreshToken,{maxAge:900000, httpOnly: true})
    return res.status(200).json({rt: refreshToken ,at: accessToken, msg: 'store user logged in' });

    } catch (error) {
      console.error('internal server error');
      res.status(500).statusMessage = 'Internal server error';
      next(error);
    }
    
})

export {storeLogin}