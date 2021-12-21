import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AuthContext } from '../../Services/Auth/Context';
import { AuthRoutes } from '../../Infrastructure';
import '../../Assets/StyleSheet/Simple-Content-Center.css';
import { CircularProgress } from '@mui/material';
import { LanguageContext } from '../../Services/Language/Context';

const ProtectedRoute = ({ Mode, RestrictTo = undefined }) => {
    const { GetLanguages } = useContext(LanguageContext);
    const { IsAuthenticated, GetIsLoadingSignInWithCache, GetUser } = useContext(AuthContext);
    const Location = useLocation();

    return GetIsLoadingSignInWithCache ? (
        <main id="Simple-Content-Center-Main">
            <section>
                <CircularProgress className="Circular-Loader" size={'2rem'} />
            </section>
            <section>
                <p>{GetLanguages.LOADING_SIGN_IN_WITH_CACHE_MESSAGE}</p>
            </section>
        </main>
    ) : RestrictTo !== undefined ? (
        GetUser && RestrictTo.toLowerCase().includes(GetUser.Role.toLowerCase()) ? (
            <Outlet />
        ) : (
            <Navigate to="/" />
        )
    ) : Mode === 'Protect' ? (
        !IsAuthenticated ? (
            <Navigate to={AuthRoutes.SignIn} state={{ from: Location }} />
        ) : (
            <Outlet />
        )
    ) : IsAuthenticated ? (
        <Navigate to="/" state={{ from: Location }} />
    ) : (
        <Outlet />
    );
};

export default ProtectedRoute;
