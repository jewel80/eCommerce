const { parse } = require("dotenv");

class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    seacrh() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        console.log(keyword);
        this.query = this.query.find({...keyword });
        return this;
    }

    filter() {
        const queryCopy = {...this.queryStr };

        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(el => delete queryCopy[el]);

        console.log(queryCopy)

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        console.log(queryCopy)
        this.query = this.query.find(JSON.parse(queryStr));
        // this.query = this.query.find(queryCopy)
        return this;
    }


    pagenation(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }


}

module.exports = APIFeatures;