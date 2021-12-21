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
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../../Services/Language/Context';
import { SetFormattedTitle } from '../../../Utils/Shortcuts';
import GenericLinksRetriever from '../../../Components/Link/GenericLinksRetriever';

const ManageLinks = () => {
    const [GetLinks, SetLinks] = useState([]);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const { GetLanguages } = useContext(LanguageContext);

    useEffect(() => {
        SetFormattedTitle(GetLanguages.MANAGE_LINKS_TITLE, GetLanguages);
        return () => {
            SetLinks([]);
            SetIsLoading(false);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <GenericLinksRetriever
            GetIsLoading={GetIsLoading}
            SetIsLoading={SetIsLoading}
            SetLinks={SetLinks}
            HeaderTitle={GetLanguages.MANAGE_LINKS_HEADER_TITLE}
            GetLinks={GetLinks}
        />
    );
};

export default ManageLinks;
