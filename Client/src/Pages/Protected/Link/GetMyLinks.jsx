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
import GenericLinksRetriever from '../../../Components/Link/GenericLinksRetriever';
import { LanguageContext } from '../../../Services/Language/Context';
import { SetFormattedTitle } from '../../../Utils/Shortcuts';

const ManageLinks = () => {
    const [GetLinks, SetLinks] = useState([]);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const { GetLanguages } = useContext(LanguageContext);

    useEffect(() => {
        SetFormattedTitle(GetLanguages.GET_MY_LINKS_TITLE, GetLanguages);
        return () => {
            SetLinks([]);
            SetIsLoading(null);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <GenericLinksRetriever
            GetIsLoading={GetIsLoading}
            SetIsLoading={SetIsLoading}
            SetLinks={SetLinks}
            HeaderTitle={GetLanguages.GET_MY_LINKS_HEADER_TITLE}
            GetLinks={GetLinks}
        />
    );
};

export default ManageLinks;
