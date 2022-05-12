/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Backend Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
const JWT = require('jsonwebtoken');
const Crypto = require('crypto');
const User = require('../Models/User');
const CatchAsync = require('../Utils/CatchAsync');
const { RuntimeError } = require('../Utils/RuntimeError');
const SendEmail = require('../Utils/SendEmail');
const Settings = require('../Settings');

const SignToken = (Identifier) =>
    JWT.sign({ id: Identifier }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

const CreateAndSendToken = (Response, StatusCode, User) => {
    const Token = SignToken(User._id);
    const CookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') CookieOptions.secure = true;
    Response.cookie('JWT', Token, CookieOptions);
    User.Password = undefined;
    User.__v = undefined;
    Response.status(StatusCode).json({ Status: 'Success', Token, Data: User });
};

exports.SignUp = CatchAsync(async (Request, Response) => {
    const { Username, Email, Password, PasswordConfirm } = Request.body;
    const NewUser = await User.create({
        Username,
        Email,
        Password,
        PasswordConfirm
    });
    CreateAndSendToken(Response, 201, NewUser);
});

exports.SignIn = CatchAsync(async (Request, Response, Next) => {
    const { Username, Password } = Request.body;
    if (!Username || !Password)
        return Next(new RuntimeError('AUTH_USERNAME_AND_PASSWORD_NOT_PROVIDED', 400));
    const RequestedUser = await User.findOne({ Username }).select('+Password');
    if (
        !RequestedUser ||
        !(await RequestedUser.IsCorrectPassword(Password, RequestedUser.Password))
    )
        return Next(new RuntimeError('AUTH_INVALID_CREDENTIALS', 401));
    CreateAndSendToken(Response, 200, RequestedUser);
});

exports.ForgotPassword = CatchAsync(async (Request, Response, Next) => {
    const RequestedUser = await User.findOne({
        Username: Request.body.Username
    });
    if (!RequestedUser) return Next(new RuntimeError('AUTH_USER_NOT_FOUND', 404));
    const ResetToken = RequestedUser.CreatePasswordResetToken();
    await RequestedUser.save({ validateBeforeSave: false });
    const ResetURL = `${process.env.CLIENT_HOST}${Settings.ClientRoutes.Auth.ResetPassword}${ResetToken}`;
    const Message = `Have you lost your password? If it seems ..., a password change has been required for your Cutternet account, click on the following link to reset your password. This link has a limited validity time, go now!: ${ResetURL}`;
    try {
        await SendEmail({
            Email: RequestedUser.Email,
            Subject: 'Your password reset token',
            Message
        });
        Response.status(200).json({ Status: 'Success' });
    } catch (ServerError) {
        RequestedUser.PasswordResetToken = undefined;
        RequestedUser.PasswordResetExpires = undefined;
        await RequestedUser.save({ validateBeforeSave: false });
        return Next(new RuntimeError('AUTH_FORGOT_PASSWORD_EMAIL_ERROR'));
    }
});

exports.ResetPassword = CatchAsync(async (Request, Response, Next) => {
    const HashedToken = Crypto.createHash('sha256').update(Request.params.Token || '').digest('hex');
    const RequestedUser = await User.findOne({
        PasswordResetToken: HashedToken,
        PasswordResetExpires: { $gt: Date.now() }
    });
    if (!RequestedUser) return Next(new RuntimeError('AUTH_INVALID_TOKEN', 400));
    RequestedUser.Password = Request.body.Password;
    RequestedUser.PasswordConfirm = Request.body.PasswordConfirm;
    RequestedUser.PasswordResetToken = undefined;
    RequestedUser.PasswordResetExpires = undefined;
    await RequestedUser.save();
    CreateAndSendToken(Response, 200, RequestedUser);
});

exports.UpdateMyPassword = CatchAsync(async (Request, Response, Next) => {
    const RequestedUser = await User.findById(Request.User._id).select('+Password');
    if (
        !(await RequestedUser.IsCorrectPassword(
            Request.body.PasswordCurrent,
            RequestedUser.Password
        ))
    )
        return Next(new RuntimeError('AUTH_CURRENT_PASSWORD_WRONG', 401));
    RequestedUser.Password = Request.body.Password;
    RequestedUser.PasswordConfirm = Request.body.PasswordConfirm;
    await RequestedUser.save();
    CreateAndSendToken(Response, 200, RequestedUser);
});
