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
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthRoutes, LinkRoutes, LanguageRoutes, GeneralRoutes } from '../Infrastructure';
import GeneralComponents from '../Components/General';
import AdminPages from '../Pages/Admin';
import EverybodyPages from '../Pages/Everybody';
import GuestPages from '../Pages/Guest';
import ProtectedPages from '../Pages/Protected';
import '../Assets/StyleSheet/General.css';

const Application = () => {
    return (
        <Routes>
            <Route element={<GeneralComponents.Layout />}>
                <Route path="/" exact element={<EverybodyPages.General.Home />} />
                <Route
                    path={AuthRoutes.ForgotPassword}
                    element={<EverybodyPages.Auth.ForgotPassword />}
                />
                <Route
                    path={GeneralRoutes.ServiceConditions}
                    element={<EverybodyPages.General.ServiceConditions />}
                />

                <Route element={<GeneralComponents.ProtectedRoute Mode="Guest" />}>
                    <Route path={AuthRoutes.SignIn} element={<GuestPages.Auth.SignIn />} />
                    <Route path={AuthRoutes.SignUp} element={<GuestPages.Auth.SignUp />} />
                </Route>

                <Route element={<GeneralComponents.ProtectedRoute Mode="Protect" />}>
                    <Route
                        path={LinkRoutes.CreateLink}
                        element={<ProtectedPages.Link.CreateLink />}
                    />
                    <Route
                        path={LinkRoutes.GetMyLinks}
                        element={<ProtectedPages.Link.GetMyLinks />}
                    />
                    <Route
                        path={LinkRoutes.GetStatistics}
                        element={<ProtectedPages.Link.GetStatistics />}
                    />
                    <Route
                        path={AuthRoutes.MyProfile}
                        element={<ProtectedPages.Auth.MyProfile />}
                    />
                    <Route
                        path={AuthRoutes.UpdateMyProfile}
                        element={<ProtectedPages.Auth.UpdateMyProfile />}
                    />
                    <Route
                        path={AuthRoutes.UpdateMyPassword}
                        element={<ProtectedPages.Auth.UpdateMyPassword />}
                    />
                </Route>

                <Route
                    element={<GeneralComponents.ProtectedRoute Mode="Protect" RestrictTo="Admin" />}
                >
                    <Route
                        path={LinkRoutes.ManageLinks}
                        element={<AdminPages.Link.ManageLinks />}
                    />
                    <Route
                        path={AuthRoutes.ManageUsers}
                        element={<AdminPages.Auth.ManageUsers />}
                    />
                    <Route
                        path={LanguageRoutes.CreateLanguage}
                        element={<AdminPages.Language.CreateLanguage />}
                    />
                    <Route
                        path={LanguageRoutes.ManageLanguages}
                        element={<AdminPages.Language.ManageLanguages />}
                    />
                </Route>

                <Route path="*" element={<EverybodyPages.General.PageNotFound />} />
            </Route>

            <Route element={<GeneralComponents.Layout OnlyMain={true} />}>
                <Route
                    path={GeneralRoutes.ServerDown}
                    element={<EverybodyPages.General.ServerDown />}
                />
                <Route
                    path={AuthRoutes.ResetPassword}
                    element={<EverybodyPages.Auth.ResetPassword />}
                />
                <Route path={LinkRoutes.GetLink} element={<EverybodyPages.Link.GetLink />} />
            </Route>
        </Routes>
    );
};

export default Application;
