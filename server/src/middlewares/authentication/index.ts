import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { Admin } from '../../models/admin.model';
import { User } from '../../models/user.model';
import { Store } from '../../models/store.model';
const AccessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET
const RefreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET
export async function generateAccessToken(user: Admin | User | Store ) {
    return sign({
        _id:user._id?.toString(),
    },
    AccessTokenSecret!,
     {
        expiresIn : process.env.AUTH_ACCESS_TOKEN_EXPIRY,
     }   

    )
}
export async function generateRefreshToken(user: Admin | User | Store ) {
    return sign({
        _id: user._id?.toString(),
    },
    RefreshTokenSecret!,
    {
        expiresIn : process.env.AUTH_REFRESH_TOKEN_EXPIRY,
    }
)
}
