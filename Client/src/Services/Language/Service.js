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
import { LanguageRoutesAPI } from '../../Infrastructure';
import { GenericRequestToBackend } from '../../Utils/Shortcuts';

export const GetAllLanguages = (Language, Filter) =>
    GenericRequestToBackend({
        Path: LanguageRoutesAPI.CRUD + Language,
        Method: 'GET',
        Filter
    });

export const DeleteLanguage = (LanguageIdentifier) =>
    GenericRequestToBackend({
        Path: LanguageRoutesAPI.CRUD + LanguageIdentifier,
        Method: 'DELETE',
        SendToken: true
    });

export const UpdateLanguage = (LanguageIdentifier, Data) =>
    GenericRequestToBackend({
        Path: LanguageRoutesAPI.CRUD + LanguageIdentifier,
        Method: 'PATCH',
        Body: Data,
        SendToken: true
    });

export const CreateLanguage = (Data) =>
    GenericRequestToBackend({
        Path: LanguageRoutesAPI.CRUD,
        Method: 'POST',
        Body: Data,
        SendToken: true
    });
