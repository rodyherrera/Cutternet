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
const { promisify } = require('util');
const User = require('../Models/User');
const CatchAsync = require('../Utils/CatchAsync');
const { RuntimeError } = require('../Utils/RuntimeError');

exports.Protect = CatchAsync(async (Request, Response, Next) => {
    let Token;
    if (Request.headers.authorization && Request.headers.authorization.startsWith('Bearer'))
        Token = Request.headers.authorization.split(' ')[1];
    else return Next(new RuntimeError('AUTH_NOT_LOGGED_IN', 401));
    const DecodedToken = await promisify(JWT.verify)(Token, process.env.SECRET_KEY);
    const FreshUser = await User.findById(DecodedToken.id);
    if (!FreshUser) return Next(new RuntimeError('AUTH_TOKEN_DOES_NOT_EXISTS', 401));
    if (await FreshUser.IsChangedPasswordAfterJWTWasIssued(DecodedToken.iat))
        return Next(new RuntimeError('AUTH_RECENTLY_CHANGED_PASSWORD', 401));
    Request.User = FreshUser;
    Next();
});

exports.RestrictTo =
    (...Roles) =>
    (Request, Response, Next) => {
        if (!Roles.includes(Request.User.Role))
            return Next(new RuntimeError('AUTH_NOT_ENOUGH_PERMISSIONS', 403));
        Next();
    };
