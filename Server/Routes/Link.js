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
const Express = require('express');
const Router = Express.Router();
const AuthMiddleware = require('../Middlewares/Authentication');
const LinkMiddleware = require('../Middlewares/Link');
const LinkController = require('../Controllers/Link');
const LinkRoutes = require('../Settings/ApiRoutes.json').Link;

Router.route('/:Username/:LinkName').post(LinkMiddleware.RetrieveLink, LinkController.GetLink);

Router.use(AuthMiddleware.Protect);
Router.route('/').get(LinkController.GetMyLinks).post(LinkController.CreateLink);

Router.get(
    '/statistics/:Username/:LinkName',
    LinkMiddleware.RetrieveLink,
    LinkController.GetLinkStatistics
);

Router.route('/:Username/:LinkName')
    .patch(LinkMiddleware.RetrieveLink, LinkController.UpdateLink)
    .delete(LinkMiddleware.RetrieveLink, LinkController.DeleteLink);

Router.use(AuthMiddleware.RestrictTo('admin'));
Router.get(LinkRoutes.GetAllLinks, LinkController.GetLinks);

module.exports = Router;
