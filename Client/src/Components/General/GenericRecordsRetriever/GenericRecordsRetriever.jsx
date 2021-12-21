import React, { useEffect, useState, useContext } from 'react';
import Filter from './Filter';
import Pagination from '../Pagination/';
import { CircularProgress, FormControl, TextField, Button } from '@mui/material';
import { VscSearch } from 'react-icons/vsc';
import './GenericRecordsRetriever.css';
import '../../../Assets/StyleSheet/Simple-Content-Center.css';
import NoRecordsFoundImage from '../../../Assets/Images/General-NoRecordsFound.png';
import Message from '../Message/';
import { LanguageContext } from '../../../Services/Language/Context';
import { FormatString } from '../../../Utils/Shortcuts';
import Fade from 'react-reveal';

const GenericRecordsRetriever = ({
    OnGetRecords,
    OnGetRecordsData,
    SortFields,
    FilterFields,
    GetMessage,
    HeaderTitle,
    GetIsLoading,
    SetIsLoading,
    SetRecords,
    GetRecords,
    SetLimit,
    GetLimit,
    SetPage,
    GetPage,
    children,
    GetExecuteRefresh = undefined,
    SetExecuteRefresh = undefined,
    SearchPlaceholder = undefined,
    OnRefresh = () => {},
    SetMessage = () => {},
    OnDoesntExistsResults = undefined,
    RequiredFields = [],
    OnWaitingServerResponseMessage = 'Connecting to the server, please wait...',
    OnDoesNotExistsResutlsMessage = 'Does not exists results for show.',
    HiddeLayoutIf = undefined
}) => {
    const [GetTotalResults, SetTotalResults] = useState(0);
    const [GetPaginatedResults, SetPaginatedResults] = useState(0);
    const [GetAvailablePages, SetAvailablePages] = useState(0);
    const [GetIsComponentMounted, SetIsComponentMounted] = useState(true);
    const [GetSearchText, SetSearchText] = useState('');
    const [GetSort, SetSort] = useState([]);
    const [GetFields, SetFields] = useState([]);
    const [GetIsDisplayFilter, SetIsDisplayFilter] = useState(false);
    const { GetLanguages } = useContext(LanguageContext);

    useEffect(() => {
        return () => {
            SetTotalResults(0);
            SetPaginatedResults(0);
            SetAvailablePages(0);
            SetIsComponentMounted(false);
            SetSearchText('');
            SetSort([]);
            SetFields([]);
            SetIsDisplayFilter(false);
        };
    }, []);

    const HandleOnGetRecords = () =>
        OnGetRecords({
            Data: OnGetRecordsData || [],
            OnStart: () => SetIsLoading(true),
            OnFinish: () => SetIsLoading(false),
            OnResolve: (Response) => {
                if (GetIsComponentMounted === true) {
                    SetMessage('');
                    SetRecords(Response.Data);
                    SetTotalResults(Response.TotalResults);
                    SetAvailablePages(Math.ceil(Response.TotalResults / GetLimit));
                    SetPaginatedResults(Response.Results);
                }
            },
            Filter: {
                Paginate: { Limit: GetLimit, Page: GetPage },
                Fields: GetFields.length >= 1 ? [...GetFields, ...RequiredFields] : undefined,
                Sort: GetSort.length >= 1 ? GetSort : undefined,
                Search: GetSearchText
            }
        });

    const HandleOnRefresh = () => {
        HandleOnGetRecords();
        OnRefresh();
    };

    const HandleOnSearch = (Event) => {
        Event.preventDefault();
        HandleOnRefresh();
        SetPage(1);
    };

    const HandleApplyFilter = (Event) => {
        Event.preventDefault();
        SetIsDisplayFilter(false);
        HandleOnRefresh();
        SetPage(1);
    };

    useEffect(() => {
        if (!GetExecuteRefresh) return;
        HandleOnRefresh();
        SetExecuteRefresh(false);
    }, [GetExecuteRefresh]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => HandleOnGetRecords(), [GetPage]); // eslint-disable-line react-hooks/exhaustive-deps

    return HiddeLayoutIf ? (
        children
    ) : (
        <Fade clear>
            <main id="Generic-Records-Main">
                <section id="Generic-Records-Header">
                    <article>
                        <h2>{HeaderTitle}</h2>
                    </article>
                    <form method="POST" onSubmit={HandleOnSearch}>
                        <FormControl id="Generic-Records-Search" size="small" sx={{ width: 300 }}>
                            <TextField
                                type="text"
                                size="small"
                                name="Search"
                                onChange={(Event) => SetSearchText(Event.target.value)}
                                value={GetSearchText}
                                placeholder={SearchPlaceholder ? SearchPlaceholder : 'Search...'}
                                InputProps={{
                                    startAdornment: <VscSearch style={{ marginRight: '.5rem' }} />
                                }}
                            />
                        </FormControl>

                        <div id="Generic-Records-Header-Buttons">
                            <Button
                                variant="text"
                                type="button"
                                className="Link Button"
                                onClick={HandleOnRefresh}
                            >
                                {GetLanguages.GENERIC_RECORDS_RETRIEVER_REFRESH_ICON_MESSAGE}
                            </Button>

                            <Button
                                variant="text"
                                type="button"
                                onClick={() => SetIsDisplayFilter(true)}
                                className="Link Button"
                            >
                                {GetLanguages.GENERIC_RECORDS_RETRIEVER_FILTER_ICON_MESSAGE}
                            </Button>

                            <Button variant="text" type="submit" className="Link Button">
                                {GetLanguages.GENERIC_RECORDS_RETRIEVER_SEARCH_ICON_MESSAGE}
                            </Button>
                        </div>
                    </form>
                </section>

                <section>
                    {GetIsLoading ? (
                        <article id="Generic-Records-Loader">
                            <div>
                                <CircularProgress className="Circular-Loader" size={'2rem'} />
                            </div>
                            <div>
                                <p>{OnWaitingServerResponseMessage}</p>
                            </div>
                        </article>
                    ) : GetRecords.length >= 1 ? (
                        <>
                            <article id="Generic-Records-Results-Information">
                                <p>
                                    {FormatString({
                                        UnformattedString:
                                            GetLanguages.GENERIC_RECORDS_RETRIEVER_PAGE_MESSAGE,
                                        Values: {
                                            CurrentPage: GetPage,
                                            TotalPages: GetAvailablePages
                                        }
                                    })}
                                </p>
                                {GetAvailablePages === 1 ? (
                                    <p>
                                        {FormatString({
                                            UnformattedString:
                                                GetLanguages.GENERIC_RECORDS_RETRIEVER_SHOWING_RESULTS_MESSAGE,
                                            Values: {
                                                PaginatedResults: GetPaginatedResults
                                            }
                                        })}
                                    </p>
                                ) : (
                                    <p>
                                        {FormatString({
                                            UnformattedString:
                                                GetLanguages.GENERIC_RECORDS_RETRIEVER_VIEWED_OF_TOTAL_RESULTS_MESSAGE,
                                            Values: {
                                                PaginatedResults: GetPaginatedResults,
                                                TotalResults: GetTotalResults
                                            }
                                        })}
                                    </p>
                                )}
                            </article>
                            {GetMessage && <Message key={GetMessage} Text={GetMessage} />}
                            {children}
                            <Pagination
                                GetAvailablePages={GetAvailablePages}
                                GetPaginatedResults={GetPaginatedResults}
                                SetPaginatedResults={SetPaginatedResults}
                                GetLimit={GetLimit}
                                SetLimit={SetLimit}
                                GetPage={GetPage}
                                SetPage={SetPage}
                            />
                        </>
                    ) : OnDoesntExistsResults ? (
                        OnDoesntExistsResults()
                    ) : (
                        <article id="Simple-Content-Center-Main" className="No-Records-Found">
                            <figure>
                                <img src={NoRecordsFoundImage} alt="Not Found Img" />
                                <figcaption>
                                    <p>{OnDoesNotExistsResutlsMessage}</p>
                                </figcaption>
                            </figure>
                        </article>
                    )}
                </section>

                {GetIsDisplayFilter && (
                    <Filter
                        FilterFields={FilterFields}
                        GetFields={GetFields}
                        GetSort={GetSort}
                        SetFields={SetFields}
                        SetIsDisplayFilter={SetIsDisplayFilter}
                        SetSort={SetSort}
                        HandleApplyFilter={HandleApplyFilter}
                        SortFields={SortFields}
                    />
                )}
            </main>
        </Fade>
    );
};

export default GenericRecordsRetriever;
