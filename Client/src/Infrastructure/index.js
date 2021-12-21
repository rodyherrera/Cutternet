/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Client Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
import ApiRoutes from '../Settings/ApiRoutes.json';
import ClientRoutes from '../Settings/ClientRoutes.json';
import GeneralSettings from '../Settings/General.json';

export const FormattedRouteAPI = (Route) => ApiRoutes.Server + Route;

export const Routes = ClientRoutes;

export const {
    Server,
    AnalyticForEmbedded,
    Auth: AuthRoutesAPI,
    Language: LanguageRoutesAPI,
    Link: LinkRoutesAPI
} = ApiRoutes;

export const {
    General: GeneralRoutes,
    Auth: AuthRoutes,
    Link: LinkRoutes,
    Language: LanguageRoutes
} = ClientRoutes;

export const {
    APIPagination,
    DataValidation,
    FlashMessage: FlashMessageConfig,
    About: AboutProject
} = GeneralSettings;
