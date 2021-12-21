import React, { useEffect } from 'react';
import { APIPagination } from '../../../Infrastructure';
import { Pagination as MUIPagination } from '@mui/material';
import './Pagination.css';

const Pagination = ({
    GetAvailablePages,
    SetPaginatedResults,
    GetPaginatedResults,
    GetLimit,
    SetLimit,
    GetPage,
    SetPage
}) => {
    useEffect(() => {
        if (GetLimit > APIPagination.Limit.Max) SetLimit(APIPagination.Limit.Max);
        if (GetAvailablePages && GetPage > GetAvailablePages) SetPage(GetAvailablePages);
        if (GetPage !== 1) {
            let PaginatedResults = GetPaginatedResults;
            for (let PageIterator = 1; PageIterator < GetPage; PageIterator++)
                PaginatedResults += GetLimit;
            SetPaginatedResults(PaginatedResults);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id="Generic-Records-Pagination">
            <MUIPagination
                count={GetAvailablePages}
                defaultPage={1}
                page={GetPage}
                onChange={(Event, Page) => SetPage(Page)}
            />
        </div>
    );
};

export default Pagination;
