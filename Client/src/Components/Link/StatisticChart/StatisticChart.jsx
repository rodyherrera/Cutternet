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
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart,
    Title,
    CategoryScale,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    LinearScale
} from 'chart.js';
import './StatisticChart.css';

Chart.register(
    CategoryScale,
    LineElement,
    PointElement,
    Title,
    ArcElement,
    Tooltip,
    Legend,
    LinearScale
);

const StatisticChart = ({ StatisticData }) => {
    if(!StatisticData.length)
        return <></>;
    
    const GetSortedMonths = Object.keys(StatisticData.MonthVisits);

    const GetOperatingSystemStatistics = {
        labels: Object.keys(StatisticData.OperatingSystems),
        datasets: [
            {
                data: Object.values(StatisticData.OperatingSystems),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const GetBrowsersStatistics = {
        labels: Object.keys(StatisticData.Browsers),
        datasets: [
            {
                data: Object.values(StatisticData.Browsers),
                backgroundColor: [
                    'rgba(244, 236, 69, 0.2)',
                    'rgba(234, 159, 18, 0.2)',
                    'rgba(231, 234, 18, 0.2)',
                    'rgba(244, 69, 69, 0.2)',
                    'rgba(69, 191, 244, 0.2)',
                    'rgba(127, 69, 244, 0.2)'
                ],
                borderColor: [
                    'rgba(244, 236, 69, 1)',
                    'rgba(234, 159, 18, 1)',
                    'rgba(231, 234, 18, 1)',
                    'rgba(244, 69, 69, 1)',
                    'rgba(69, 191, 244, 1)',
                    'rgba(127, 69, 244, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const GetCountriesStatistics = {
        labels: Object.keys(StatisticData.Countries),
        datasets: [
            {
                data: Object.values(StatisticData.Countries),
                backgroundColor: [
                    'rgba(162, 47, 216, 0.2)',
                    'rgba(157, 216, 47, 0.2)',
                    'rgba(47, 216, 111, 0.2)',
                    'rgba(78, 47, 216, 0.2)',
                    'rgba(216, 47, 170, 0.2)',
                    'rgba(216, 47, 93, 0.2)'
                ],
                borderColor: [
                    'rgba(162, 47, 216, 1)',
                    'rgba(157, 216, 47, 1)',
                    'rgba(47, 216, 111, 1)',
                    'rgba(78, 47, 216, 1)',
                    'rgba(216, 47, 170, 1)',
                    'rgba(216, 47, 93, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const GetLanguagesStatistics = {
        labels: Object.keys(StatisticData.BrowserLanguages),
        datasets: [
            {
                data: Object.values(StatisticData.BrowserLanguages),
                backgroundColor: [
                    'rgba(226, 138, 128, 0.2)',
                    'rgba(113, 28, 28, 0.2)',
                    'rgba(57, 28, 113, 0.2)',
                    'rgba(125, 144, 180, 0.2)',
                    'rgba(153, 180, 125, 0.2)',
                    'rgba(181, 107, 107, 0.2)'
                ],
                borderColor: [
                    'rgba(226, 138, 128, 1)',
                    'rgba(113, 28, 28, 1)',
                    'rgba(57, 28, 113, 1)',
                    'rgba(125, 144, 180, 1)',
                    'rgba(153, 180, 125, 1)',
                    'rgba(181, 107, 107, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const GetMonthVisitsStatistics = {
        labels: GetSortedMonths,
        datasets: [
            {
                label: 'Visits in the current year',
                data: GetSortedMonths.map((Month) => StatisticData.MonthVisits[Month]),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
        ]
    };

    return (
        <div>
            <div id="Statistics-Chart-Month-Visits">
                <Line
                    data={GetMonthVisitsStatistics}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Visits per months in the current year'
                            }
                        },
                        scales: {
                            yAxes: {
                                ticks: {
                                    precision: 0
                                }
                            }
                        }
                    }}
                />
            </div>
            <div id="Statistic-Chart-Charts">
                <div>
                    <Pie
                        data={GetOperatingSystemStatistics}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Operating Systems'
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <Pie
                        data={GetBrowsersStatistics}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Browsers'
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <Pie
                        data={GetCountriesStatistics}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Countries'
                                }
                            }
                        }}
                    />
                </div>
                <div>
                    <Pie
                        data={GetLanguagesStatistics}
                        options={{
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Languages'
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatisticChart;
