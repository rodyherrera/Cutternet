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
const Link = require('../Models/Link');
const CatchAsync = require('../Utils/CatchAsync');
const { RuntimeError } = require('../Utils/RuntimeError');

exports.RetrieveLink = CatchAsync(async (Request, Response, Next) => {
    const { Username, LinkName } = Request.params;
    const RequestedUser = await User.findOne({ Username });
    if (!RequestedUser) return Next(new RuntimeError('LINK_USER_DOES_NOT_EXISTS', 404));
    const RequestedLink = await Link.findOne({
        User: RequestedUser._id,
        Name: LinkName
    });
    if (!RequestedLink) return Next(new RuntimeError('LINK_USER_LINK_NOT_FOUND', 404));
    Request.Link = RequestedLink;
    if (
        ['patch', 'delete'].includes(Request.method) &&
        Request.User._id !== Request.Link.User._id &&
        !Request.User.Role === 'Admin'
    )
        return Next(new RuntimeError('AUTH_NOT_ENOUGH_PERMISSIONS', 401));
    Next();
});
