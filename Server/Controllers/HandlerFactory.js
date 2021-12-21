/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Backend Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
const CatchAsync = require('../Utils/CatchAsync');
const APIFeatures = require('../Utils/APIFeatures');
const { RuntimeError } = require('../Utils/RuntimeError');
const FilterObject = require('../Utils/FilterObject');

exports.DeleteOne = ({ Model, ApplyIdentifier = undefined }) =>
    CatchAsync(async (Request, Response, Next) => {
        let Identifier = Request.params.Identifier;
        if (ApplyIdentifier !== undefined) Identifier = ApplyIdentifier(Request);
        const RequestedDatabaseRecord = await Model.findByIdAndDelete(Identifier);
        if (!RequestedDatabaseRecord) return Next(new RuntimeError('INVALID_RECORD_ID', 404));
        Response.status(200).json({
            Status: 'Success',
            Data: RequestedDatabaseRecord
        });
    });

exports.UpdateOne = ({ Model, FilterRequestFields = [], ApplyIdentifier = undefined }) =>
    CatchAsync(async (Request, Response, Next) => {
        let Identifier = Request.params.Identifier;
        if (ApplyIdentifier !== undefined) Identifier = ApplyIdentifier(Request);
        const FilteredBody = FilterObject(Request.body, ...FilterRequestFields);
        const RequestedDatabaseRecord = await Model.findByIdAndUpdate(Identifier, FilteredBody, {
            new: true,
            runValidators: true
        });
        if (!RequestedDatabaseRecord) return Next(new RuntimeError('INVALID_RECORD_ID', 404));
        Response.status(200).json({
            Status: 'Success',
            Data: RequestedDatabaseRecord
        });
    });

exports.CreateOne = ({ Model, FilterRequestFields = [], ApplyFilter = undefined }) =>
    CatchAsync(async (Request, Response) => {
        let FilteredBody = FilterObject(Request.body, ...FilterRequestFields);
        if (ApplyFilter !== undefined) FilteredBody = { ...FilteredBody, ...ApplyFilter(Request) };
        const NewDatabaseRecord = await Model.create(FilteredBody);
        Response.status(201).json({
            Status: 'Success',
            Data: NewDatabaseRecord
        });
    });

exports.GetAll = ({ Model, ApplyFilter = undefined, ApplyRecursion = [undefined, undefined] }) =>
    CatchAsync(async (Request, Response) => {
        const Resolve = CatchAsync(async () => {
            let Filter = {};
            if (ApplyFilter !== undefined) Filter = ApplyFilter(Request);
            const Features = await new APIFeatures({
                Query: Model.find(Filter),
                QueryString: Request.query,
                Model
            })
                .Filter()
                .Search()
                .Sort()
                .LimitFields()
                .Paginate();
            const Records = await Features.Query;
            const Results = Records.length;
            const TotalResults = Request.query.Search
                ? (await Model.find(Model.searchBuilder(Request.query.Search))).length
                : (await Model.find(Filter)).length;
            return { Records, Results, TotalResults };
        });
        let { Results, TotalResults, Records } = await Resolve();

        if (typeof ApplyRecursion[0] !== undefined && typeof ApplyRecursion[1] === 'object')
            if (
                ApplyRecursion[0]({
                    Request,
                    Database: { TotalResults, Results, Records }
                })
            ) {
                ApplyFilter = () => ApplyRecursion[1];
                let { Results, TotalResults, Records } = await Resolve();
            }
        Response.status(200).json({
            Status: 'Success',
            Results,
            TotalResults,
            Data: Records
        });
    });

exports.GetOne = ({ Model, PopulateOptions }) =>
    CatchAsync(async (Request, Response, Next) => {
        let Query = await Model.findById(Request.params.Identifier);
        if (PopulateOptions != undefined) Query = Query.populate(PopulateOptions);
        const RequestedDatabaseRecord = await Query;
        if (!RequestedDatabaseRecord) return Next(new RuntimeError('INVALID_RECORD_ID', 404));
        Response.status(200).json({
            Status: 'Success',
            Data: RequestedDatabaseRecord
        });
    });
