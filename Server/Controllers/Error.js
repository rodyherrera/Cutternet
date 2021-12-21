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
const { RuntimeError } = require('../Utils/RuntimeError');

const ReportError = (ErrorRaised, Response) => {
    if (process.env.NODE_ENV === 'development')
        Response.status(ErrorRaised.StatusCode).json({
            Status: ErrorRaised.Status,
            Message: ErrorRaised.message,
            Stack: ErrorRaised.stack,
            Error: ErrorRaised
        });
    else if (ErrorRaised.IsOperational)
        Response.status(ErrorRaised.StatusCode).json({
            Status: ErrorRaised.Status,
            Message: ErrorRaised.message
        });
    else {
        console.error('(Cutternet) > Critical Error:', ErrorRaised);
        Response.status(500).json({
            Status: 'Server Error',
            Message: 'Internal Server Error'
        });
    }
};

const ErrorHandlers = {
    OnJWTError: ['AUTH_INVALID_TOKEN', 401],
    OnJWTTokenExpiredError: ['AUTH_EXPIRED_TOKEN', 401],
    OnDatabaseCastError: (RaisedError) => [
        `Invalid ${RaisedError.path}: ${RaisedError.value}.`,
        400
    ],
    OnDatabaseDuplicatedFields: (RaisedError) => {
        const Name = Object.keys(RaisedError.keyValue)[0];
        let Message = '';
        if (Name === 'Email')
            Message = 'There is already a user with that email address, use another.';
        else if (Name === 'Username') Message = 'The username is already in use, try another.';
        else Message = `The field "${Name}" is already in use, try another value.`;
        return [Message, 400];
    },
    OnDatabaseValidationError: (RaisedError) => {
        const Errors = Object.values(RaisedError.errors).map((ClientError) => ClientError.message);
        return [Errors.join(' '), 400];
    }
};

const ParseError = (RaisedError) => {
    const { name: ErrorName, code: ErrorCode } = RaisedError;
    switch (ErrorName) {
        case 'CastError':
            return ErrorHandlers.OnDatabaseCastError(RaisedError);
        case 'ValidationError':
            return ErrorHandlers.OnDatabaseValidationError(RaisedError);
        case 'JsonWebTokenError':
            return ErrorHandlers.OnJWTError();
        case 'TokenExpiredError':
            return ErrorHandlers.OnJWTTokenExpiredError();
    }
    switch (ErrorCode) {
        case 11000:
            return ErrorHandlers.OnDatabaseDuplicatedFields(RaisedError);
    }
    return [RaisedError.message, 400];
};

module.exports = (RaisedError, Request, Response, Next) => {
    RaisedError.StatusCode = RaisedError.StatusCode || 500;
    RaisedError.Status = RaisedError.Status || 'Server Error';
    if (process.env.NODE_ENV === 'production')
        RaisedError = new RuntimeError(...ParseError(RaisedError));
    ReportError(RaisedError, Response);
};
