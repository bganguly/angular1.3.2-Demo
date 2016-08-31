'use strict';

NS.restaurantSearch = function ($scope, apiService) {
    this.scope = $scope;
    this.apiService = apiService;
    this.resultSets = null;
    this.noResultsFound = false;
    this.searchWasrequested = false;
    this.queryRunSuccessful = false;
    this.queryRunPending = true;
    this.sortProperty = null;
    this.reverseSortDirection = false;
};

NS.restaurantSearch.prototype.searchBusinesses = function () {
    var self = this;
    var yqlQuery = "select * from local.search where query='"+
        document.getElementById("foodType").value+
        "' and location='"+
        document.getElementById("location").value+
        "'";
    self.searchWasrequested = true;

    self.apiService.call({
        url: "https://query.yahooapis.com/v1/public/yql?q="+yqlQuery+"&format=json&diagnostics=true",
        withCredentials : false
    }).then(function (response) {
        if (response.data !== "undefined" && response.data.query !== "undefined") {
            self.queryRunSuccessful = true;
            self.queryRunPending = false;
            // query returned 200 but no results are available
            if (response.data.query.results === null) {
                self.noResultsFound = true;
                self.resultSets = [];
            } else {
                self.noResultsFound = false;
                self.resultSets = response.data.query.results.Result;
            }
        }
    }, function () {
        //query returned something other than 200
        self.queryRunSuccessful = false;
        self.queryRunPending = false;
        self.noResultsFound = true;
        self.resultSets = [];
    });
};

NS.restaurantSearch.prototype.isErrorsOccuredDuringSearch = function () {
    var self = this;
    return self.searchWasrequested && ( ! self.queryRunPending)  &&  ( ! self.queryRunSuccessful);
};

NS.restaurantSearch.prototype.isNoSearchResultsFound = function () {
    var self = this;
    return self.searchWasrequested && ( ! self.queryRunPending)  && (self.resultSets.length==0);
};

NS.restaurantSearch.prototype.sortBy = function (sortProperty) {
    var self = this;
    self.setSortProperty(sortProperty);
    self.reverseSortDirection = !self.reverseSortDirection ;
};

NS.restaurantSearch.prototype.setSortProperty = function (sortProperty) {
    var self = this;
    self.sortProperty = sortProperty;
    NS.restaurantSearch.prototype.sortProperty =  self.sortProperty;
};

NS.restaurantSearch.prototype.getSortProperty = function (resultRowObj) {
    var retVal;
    switch(NS.restaurantSearch.prototype.sortProperty) {
        case "AverageRating":
            retVal = (isNaN(resultRowObj.Rating.AverageRating)) ? 1:resultRowObj.Rating.AverageRating;
            break;
        case "Distance":
            retVal= resultRowObj.Distance;
            break;
    }
    return retVal;
};

NS.myApp.controller('restaurantSearch', NS.restaurantSearch);