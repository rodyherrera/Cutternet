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
import { LinkRoutesAPI } from '../../Infrastructure';
import { GenericRequestToBackend, ParseToURLParameters } from '../../Utils/Shortcuts';

export const CreateLink = (Data) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.CRUD,
        Method: 'POST',
        Body: Data,
        SendToken: true
    });

export const GetLink = (Data) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.CRUD + ParseToURLParameters(Data, ['Username', 'LinkName']),
        Method: 'POST',
        Body: Data
    });

export const GetMyLinks = (Filter) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.CRUD,
        Method: 'GET',
        SendToken: true,
        Filter
    });

export const GetStatistics = (Filter, Data) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.GetStatistics + ParseToURLParameters(Data, ['Username', 'LinkName']),
        Method: 'GET',
        SendToken: true,
        Filter
    });

export const UpdateLink = (Data) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.CRUD + ParseToURLParameters(Data, ['Username', 'LinkName']),
        Method: 'PATCH',
        Body: Data,
        SendToken: true
    });

export const DeleteLink = (Data) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.CRUD + ParseToURLParameters(Data, ['Username', 'LinkName']),
        Method: 'DELETE',
        SendToken: true
    });

export const GetAllLinks = (Filter) =>
    GenericRequestToBackend({
        Path: LinkRoutesAPI.GetAllLinks,
        Method: 'GET',
        SendToken: true,
        Filter
    });
