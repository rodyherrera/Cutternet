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
const LanguageController = require('../Controllers/Language');

Router.route('/:Language').get(LanguageController.GetLanguages);

Router.use(AuthMiddleware.Protect, AuthMiddleware.RestrictTo('admin'));

Router.route('/').post(LanguageController.CreateLanguage);
Router.route('/:Identifier')
    .delete(LanguageController.DeleteLanguage)
    .patch(LanguageController.UpdateLanguage);

module.exports = Router;
