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
class APIFeatures {
    constructor({ Query, QueryString, Model }) {
        this.Model = Model;
        this.Query = Query;
        this.QueryString = QueryString;
    }

    Search() {
        if (this.QueryString.Search)
            this.Query.find(this.Model.searchBuilder(this.QueryString.Search));
        return this;
    }

    Filter() {
        const QueryObject = { ...this.QueryString };
        const ExcludedFields = ['Page', 'Sort', 'Limit', 'Fields'];
        ExcludedFields.forEach((Element) => delete QueryObject[Element]);
        let QueryString = JSON.stringify(QueryObject);
        QueryString = QueryString.replace(/\b(gte|gt|lte|lt)\b/g, (Match) => `$${Match}`);
        this.Query.find(JSON.parse(QueryString));
        return this;
    }

    Sort() {
        if (this.QueryString.Sort) {
            const Sort = this.QueryString.Sort.split(',').join(' ');
            this.Query = this.Query.sort(Sort);
        } else this.Query = this.Query.sort({ CreatedAt: 1 });
        return this;
    }

    LimitFields() {
        if (this.QueryString.Fields) {
            const Fields = this.QueryString.Fields.split(',').join(' ');
            this.Query = this.Query.select(Fields);
        } else this.Query = this.Query.select('-__v');

        return this;
    }

    async Paginate() {
        if (this.QueryString.Limit * 1 === -1) return this;
        const Page = this.QueryString.Page * 1 || 1; // Default page (1)
        const Limit = this.QueryString.Limit * 1 || 100; // Default limit (100)
        const Skip = (Page - 1) * Limit;
        this.Query = this.Query.skip(Skip).limit(Limit);
        if (this.QueryString.Page) {
            const RecordsCount = await this.Model.countDocuments();
            if (Skip >= RecordsCount) throw new Error('INVALID_PAGE_FOR_PAGINATION');
        }
        return this;
    }
}

module.exports = APIFeatures;
