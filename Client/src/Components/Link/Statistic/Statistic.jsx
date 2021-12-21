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
import React, { useContext } from 'react';
import { LanguageContext } from '../../../Services/Language/Context';
import { GenericFormattedDate } from '../../../Utils/Shortcuts';
import './Statistic.css';

const Statistic = ({ StatisticData }) => {
    const { GetLanguages } = useContext(LanguageContext);

    const ExtractData = (Key) =>
        StatisticData[Key] !== undefined && StatisticData[Key] !== 'Unknown'
            ? StatisticData[Key]
            : null;

    return (
        <div className="Generic-Statistic">
            <div>
                <div>
                    {ExtractData('RegisteredAt') && (
                        <span className="Text-Muted">
                            {GenericFormattedDate(StatisticData.RegisteredAt)}
                        </span>
                    )}
                    {ExtractData('IPAddress') && <h3>{ExtractData('IPAddress')}</h3>}
                </div>
                <div>
                    {ExtractData('Country') && (
                        <p>
                            {StatisticData.Country}
                            {ExtractData('City') && <span> - {StatisticData.City}</span>}
                        </p>
                    )}
                    {ExtractData('City') && !ExtractData('Country') && <p>{StatisticData.City}</p>}
                    {ExtractData('Timezone') && (
                        <p className="Generic-Statistic-Timezone">{StatisticData.Timezone}</p>
                    )}
                </div>
            </div>
            <div>
                {ExtractData('OperatingSystem') && (
                    <p>
                        {GetLanguages.STATISTIC_CLIENT}: {StatisticData.OperatingSystem}
                        {ExtractData('Browser') && <span> - {StatisticData.Browser}</span>}
                    </p>
                )}
                {ExtractData('Browser') && !ExtractData('OperatingSystem') && (
                    <p>
                        {GetLanguages.STATISTIC_CLIENT}: {StatisticData.Browser}
                    </p>
                )}
                {ExtractData('BrowserLanguage') && (
                    <p>
                        {GetLanguages.STATISTIC_LANGUAGE}:{' '}
                        {StatisticData.BrowserLanguage.toUpperCase()}
                    </p>
                )}
                {ExtractData('Region') && (
                    <p>
                        {GetLanguages.STATISTIC_REGION}: {StatisticData.Region}
                    </p>
                )}
                {ExtractData('Latitude') && (
                    <p>
                        {GetLanguages.STATISTIC_LATITUDE}: {StatisticData.Latitude}
                    </p>
                )}
                {ExtractData('Longitude') && (
                    <p>
                        {GetLanguages.STATISTIC_LONGITUDE}: {StatisticData.Longitude}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Statistic;
