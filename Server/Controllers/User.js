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
const User = require('../Models/User');
const CatchAsync = require('../Utils/CatchAsync');
const { RuntimeError } = require('../Utils/RuntimeError');
const FilterObject = require('../Utils/FilterObject');
const HandlerFactory = require('./HandlerFactory');

exports.DeleteUser = HandlerFactory.DeleteOne({ Model: User });
exports.GetUser = HandlerFactory.GetOne({ Model: User });
exports.GetAllUsers = HandlerFactory.GetAll({ Model: User });

exports.UpdateUser = HandlerFactory.UpdateOne({
    Model: User,
    FilterRequestFields: ['Username', 'Email', 'Role']
});

exports.DeleteMe = CatchAsync(async (Request, Response) => {
    const RequestedUser = await User.findByIdAndDelete(Request.User._id);
    Response.status(200).json({ Status: 'Success', Data: RequestedUser });
});

exports.UpdateMyProfile = CatchAsync(async (Request, Response, Next) => {
    const FilteredBody = FilterObject(Request.body, 'Username', 'Email');
    const RequestedUser = await User.findByIdAndUpdate(Request.User._id, FilteredBody, {
        new: true,
        runValidators: true
    });
    Response.status(200).json({ Status: 'Success', Data: RequestedUser });
});
