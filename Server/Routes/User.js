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
const UserMiddleware = require('../Middlewares/User');
const UserController = require('../Controllers/User');
const AuthController = require('../Controllers/Authentication');
const AuthRoutes = require('../Settings/').Routes.Auth;

Router.post(AuthRoutes.SignUp, AuthController.SignUp);
Router.post(AuthRoutes.SignIn, AuthController.SignIn);
Router.post(AuthRoutes.ForgotPassword, AuthController.ForgotPassword);
Router.patch(AuthRoutes.ResetPassword, AuthController.ResetPassword);

Router.use(AuthMiddleware.Protect);

Router.patch(AuthRoutes.UpdateMyPassword, AuthController.UpdateMyPassword);
Router.delete(AuthRoutes.DeleteMe, UserController.DeleteMe);
Router.get(AuthRoutes.MyProfile, UserMiddleware.GetMe, UserController.GetUser);
Router.patch(AuthRoutes.UpdateMyProfile, UserController.UpdateMyProfile);

Router.use(AuthMiddleware.RestrictTo('admin'));

Router.route('/').get(UserController.GetAllUsers);

Router.route('/:Identifier')
    .get(UserController.GetUser)
    .patch(UserController.UpdateUser)
    .delete(UserController.DeleteUser);

module.exports = Router;
