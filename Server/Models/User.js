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
const Crypto = require('crypto');
const Mongoose = require('mongoose');
const Validator = require('validator');
const BCrypt = require('bcryptjs');
const Link = require('./Link');
const { FormatError } = require('../Utils/RuntimeError');
const TextSearch = require('mongoose-partial-search');
const Validation = require('../Settings/').General.DataValidation.Auth;

const UserSchema = new Mongoose.Schema({
    Username: {
        type: String,
        minlength: [Validation.Username.MinLength, FormatError('AUTH_USERNAME_MINLENGTH')],
        maxlength: [Validation.Username.MaxLength, FormatError('AUTH_USERNAME_MAXLENGTH')],
        trim: true,
        searchable: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (Value) {
                // ! Has username whitespaces?
                return !/\s/g.test(Value);
            },
            message: FormatError('AUTH_USERNAME_ON_WHITESPACES')
        },
        required: [true, FormatError('AUTH_USERNAME_NOT_PROVIDED')]
    },
    Email: {
        type: String,
        searchable: true,
        required: [true, FormatError('AUTH_EMAIL_NOT_PROVIDED')],
        unique: true,
        lowercase: true,
        validate: [Validator.isEmail, FormatError('AUTH_INVALID_EMAIL')]
    },
    Password: {
        type: String,
        required: [true, FormatError('AUTH_PASSWORD_NOT_PROVIDED')],
        minlength: [Validation.Password.MinLength, FormatError('AUTH_PASSWORD_MINLENGTH')],
        maxlength: [Validation.Password.MaxLength, FormatError('AUTH_PASSWORD_MAXLENGTH')],
        select: false
    },
    PasswordConfirm: {
        type: String,
        required: [true, FormatError('AUTH_PASSWORD_CONFIRM_NOT_PROVIDED')],
        validate: {
            validator: function (Value) {
                return Value === this.Password;
            },
            message: FormatError('AUTH_PASSWORDS_NOT_SAME')
        }
    },
    Role: {
        type: String,
        lowercase: true,
        enum: ['user', 'admin'],
        default: 'User'
    },
    PasswordChangedAt: Date,
    PasswordResetToken: String,
    PasswordResetExpires: Date
});

UserSchema.plugin(TextSearch);

UserSchema.pre('save', async function (Next) {
    if (!this.isModified('Password')) return Next();
    this.Password = await BCrypt.hash(this.Password, 12);
    this.PasswordConfirm = undefined;
});

UserSchema.pre('save', function (Next) {
    if (!this.isModified('Password') || this.isNew) return Next();
    this.PasswordChangeAt = Date.now() - 1000;
    Next();
});

UserSchema.methods.IsCorrectPassword = async function (MaybePassword, UserPassword) {
    return await BCrypt.compare(MaybePassword, UserPassword);
};

UserSchema.methods.IsChangedPasswordAfterJWTWasIssued = async function (JWTTimestamp) {
    if (this.PasswordChangedAt) {
        const PasswordChangedAtDateTimestamp = parseInt(
            this.PasswordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < PasswordChangedAtDateTimestamp;
    }
    return false;
};

UserSchema.methods.CreatePasswordResetToken = function () {
    const ResetToken = Crypto.randomBytes(32).toString('hex');
    this.PasswordResetToken = Crypto.createHash('sha256').update(ResetToken).digest('hex');
    this.PasswordResetExpires = Date.now() + process.env.PASSWORD_EXPIRES_IN_MINS * 60 * 1000;
    return ResetToken;
};

UserSchema.pre('findOneAndDelete', async function (Next) {
    const UserIdentifier = this.getQuery()._id;
    await Link.deleteMany({ User: UserIdentifier });
    Next();
});

const User = Mongoose.model('User', UserSchema);
module.exports = User;
