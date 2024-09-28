import jwt from 'jsonwebtoken';
const { sign } = jwt;
import { Admin } from '../../models/admin.model';
import { User } from '../../models/user.model';
const AccessTokenSecret = process.env.AUTH_ACCESS_TOKEN_SECRET
const RefreshTokenSecret = process.env.AUTH_REFRESH_TOKEN_SECRET
export async function generateAccessToken(user: Admin | User) {
    return sign({
        _id:user._id?.toString(),
    },
    AccessTokenSecret!,
     {
        noTimestamp : true
     }   

    )
}
export async function generateRefreshToken(user: Admin | User ) {
    return sign({
        _id: user._id?.toString(),
    },
    RefreshTokenSecret!,
    {
        noTimestamp : true
    }
)
}
