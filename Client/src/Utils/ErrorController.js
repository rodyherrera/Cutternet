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
import { IsEqualLocationPathWithNonFormattedRoutePath, ExtractError } from './Shortcuts';
import { GeneralRoutes, LinkRoutes } from '../Infrastructure';

const HandleError = ({
    ClientError,
    Navigate,
    Location,
    SetMessage,
    GetLanguages,
    AuthCallbacks = undefined,
    LinkCallbacks = undefined
}) => {
    const ResolveCallback = (CallbackIdentifier) => {
        if (AuthCallbacks !== undefined && AuthCallbacks[CallbackIdentifier] !== undefined)
            return AuthCallbacks[CallbackIdentifier];
        else if (LinkCallbacks !== undefined && LinkCallbacks[CallbackIdentifier] !== undefined)
            return LinkCallbacks[CallbackIdentifier];
        else return () => SetMessage(CallbackIdentifier);
    };

    const Rejections = {
        AUTH_TOKEN_DOES_NOT_EXISTS: ResolveCallback('OnLogout'),
        INVALID_PAGE_FOR_PAGINATION: () => {
            if (
                !IsEqualLocationPathWithNonFormattedRoutePath({
                    LocationPath: Location.pathname,
                    NonFormattedRoutePath: LinkRoutes.GetStatistics
                })
            ) {
                Navigate(LinkRoutes.CreateLink, { replace: true });
                SetMessage(['Does not exists links for show, create one']);
            }
        },
        SERVER_DOWN: () => Navigate(GeneralRoutes.ServerDown, { replace: true })
    };

    const ResolveRejection = (ErrorIdentifier) => {
        if (ErrorIdentifier instanceof Array) ErrorIdentifier = ErrorIdentifier[0];
        const MaybeInstance = Rejections[ErrorIdentifier];
        if (GetLanguages[ErrorIdentifier] !== undefined) SetMessage(GetLanguages[ErrorIdentifier]);
        else if (MaybeInstance !== undefined)
            if (['function', 'object'].includes(typeof MaybeInstance)) MaybeInstance();
            else SetMessage(MaybeInstance);
        else SetMessage(ClientError.replaceAll('(E)', ''));
    };

    if (ClientError) ResolveRejection(ExtractError(ClientError));
};

export default HandleError;
