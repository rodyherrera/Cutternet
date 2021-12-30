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
import { useNavigate, useParams } from 'react-router';
import { LinkContext } from '../../../../Services/Link/Context';
import { APIPagination, LinkRoutes } from '../../../../Infrastructure';
import GenericRecordsRetriever from '../../../../Components/General/GenericRecordsRetriever';
import Statistic from '../../../../Components/Link/Statistic/';
import StatisticChart from '../../../../Components/Link/StatisticChart/';
import { LanguageContext } from '../../../../Services/Language/Context';
import '../../../../Assets/StyleSheet/Retriever.css';
import './GetStatistics.css';
import {
    FormatString,
    HandleLinkStatisticsDistribution,
    SetFormattedTitle,
    SlugToTitle
} from '../../../../Utils/Shortcuts';
import Accordion from '../../../../Components/General/Accordion/';

const GetStatistics = () => {
    const { OnGetStatistics, StatisticBothFields } = useContext(LinkContext);
    const { GetLanguages } = useContext(LanguageContext);
    const { Username, LinkName } = useParams();
    const [GetStatistics, SetStatistics] = useState([]);
    const [GetIsLoading, SetIsLoading] = useState(false);
    const [GetLimit, SetLimit] = useState(APIPagination.Limit.Default);
    const [GetPage, SetPage] = useState(APIPagination.Page.Default);
    const [GetDistributedStatistics, SetDistributedStatistics] = useState({ MonthVisits: [], OperatingSystems: [], BrowserLanguages: [], Browsers: [], Countries: [] });
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const Navigate = useNavigate();

    useEffect(() => {
        SetFormattedTitle(
            FormatString({
                UnformattedString: GetLanguages.GET_STATISTICS_TITLE,
                Values: { Link: LinkName }
            }),
            GetLanguages
        );
        FreshAllLinksStatistics();
        return () => {
            SetStatistics([]);
            SetIsLoading(false);
            SetLimit(APIPagination.Limit.Default);
            SetPage(APIPagination.Page.Default);
            SetDistributedStatistics({});
            SetIsComponentMounted(true);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const FreshAllLinksStatistics = () =>
        OnGetStatistics({
            Data: { Username, LinkName },
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnRejection: () => Navigate(LinkRoutes.GetMyLinks, { replace: true }),
            OnResolve: async (Response) => {
                if (GetIsComponentMounted) {
                    const DistributedData = await HandleLinkStatisticsDistribution(Response.Data);
                    SetDistributedStatistics(DistributedData);
                }
            },
            Filter: {
                Paginate: { Limit: -1 }
            }
        });

    return (
        <GenericRecordsRetriever
            OnRefresh={FreshAllLinksStatistics}
            SortFields={StatisticBothFields}
            FilterFields={StatisticBothFields}
            OnGetRecords={OnGetStatistics}
            OnGetRecordsData={{ Username, LinkName }}
            GetIsLoading={GetIsLoading}
            OnDoesNotExistsResutlsMessage={GetLanguages.ON_DOES_NOT_EXISTS_STATISTICS_MESSAGE}
            SetIsLoading={SetIsLoading}
            SetRecords={SetStatistics}
            SearchPlaceholder={GetLanguages.GET_STATISTICS_SEARCH_INPUT_PLACEHOLDER}
            GetRecords={GetStatistics}
            SetLimit={SetLimit}
            OnWaitingServerResponseMessage={GetLanguages.ON_WAITING_STATISTICS_MESSAGE}
            GetLimit={GetLimit}
            HeaderTitle={FormatString({
                UnformattedString: GetLanguages.GET_STATISTICS_HEADER_TITLE,
                Values: { LinkName: SlugToTitle(LinkName) },
                SafeLength: true
            })}
            SetPage={SetPage}
            GetPage={GetPage}
        >
            <article id="Get-Statistics-Charts-Mobile">
                <Accordion
                    Title="Statistics"
                    Identifier="Get-Statistics-Charts-Mobile-Accordeon"
                    Content={<StatisticChart StatisticData={GetDistributedStatistics} />}
                />
            </article>

            <section className="Generic-Retriever" id="Get-Statistics">
                <article className="Generic-Retriever-List">
                    {GetStatistics.map((StatisticData, StatisticIndex) => (
                        <Statistic key={StatisticIndex} StatisticData={StatisticData} />
                    ))}
                </article>
                <article className="Generic-Retriever-Information" id="Get-Statistics-Charts">
                    <StatisticChart StatisticData={GetDistributedStatistics} />
                </article>
            </section>
        </GenericRecordsRetriever>
    );
};

export default GetStatistics;
