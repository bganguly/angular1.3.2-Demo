'use strict';

describe('Restaurant Search test suite: ', function () {
    beforeEach(module('myApp'));
    var createController, $scope, $httpBackend;
    var mockDataWithoutResultsAttribute= {
        "count":10,
        "created":"2016-08-19T07:08:57Z",
        "lang":"en-us",
        "diagnostics":{
            "publiclyCallable":"true",
            "cache":[
                {
                    "execution-start-time":"2",
                    "execution-stop-time":"3",
                    "execution-time":"1",
                    "method":"GET",
                    "type":"MEMCACHED",
                    "content":"local.search://transorm_xsl_5HWCXxRh"
                },
                {
                    "execution-start-time":"2",
                    "execution-stop-time":"3",
                    "execution-time":"1",
                    "method":"get",
                    "type":"MEMCACHED",
                    "content":"local.search://transorm_xsl_5HWCXxRh"
                },
                {
                    "execution-start-time":"146",
                    "execution-stop-time":"147",
                    "execution-time":"1",
                    "method":"GET",
                    "type":"MEMCACHED",
                    "content":"5c39bc778e31044790d007ed3951f35f"
                }
            ],
            "url":{
                "execution-start-time":"3",
                "execution-stop-time":"142",
                "execution-time":"139",
                "content":"hidden"
            },
            "query":{
                "execution-start-time":"156",
                "execution-stop-time":"182",
                "execution-time":"26",
                "content":"select * from xslt where xml=@xml and stylesheetliteral=@stylesheet"
            },
            "javascript":{
                "execution-start-time":"0",
                "execution-stop-time":"181",
                "execution-time":"180",
                "instructions-used":"0",
                "table-name":"local.search"
            },
            "user-time":"183",
            "service-time":"142",
            "build-version":"0.2.39"
        }
    };
    var nullMockYqlData = {
        "query" :angular.extend({},mockDataWithoutResultsAttribute,
            {
                "results":null
            }
        )
    };
    var nonNullMockYqlData = {
        "query" :angular.extend({},mockDataWithoutResultsAttribute,
            {
                "results":{
                    "Result":[
                        {
                            "id":"171743853",
                            "xmlns":"urn:yahoo:lcl",
                            "Title":"The Naked Fish",
                            "Address":"857 Higuera St",
                            "City":"San Luis Obispo",
                            "State":"CA",
                            "Phone":"(805) 543-3474",
                            "Latitude":"35.279885",
                            "Longitude":"-120.662631",
                            "Rating":{
                                "AverageRating":"NaN",
                                "TotalRatings":"0",
                                "TotalReviews":"0",
                                "LastReviewDate":null,
                                "LastReviewIntro":null
                            },
                            "Distance":"0.59",
                            "Url":"https://local.yahoo.com/info-171743853-the-naked-fish-san-luis-obispo",
                            "ClickUrl":"https://local.yahoo.com/info-171743853-the-naked-fish-san-luis-obispo",
                            "MapUrl":"https://local.yahoo.com/info-171743853-the-naked-fish-san-luis-obispo?viewtype=map",
                            "BusinessUrl":"http://www.thenakedfish.com/",
                            "BusinessClickUrl":"http://www.thenakedfish.com/",
                            "Categories":{
                                "Category":[
                                    {
                                        "id":"96926179",
                                        "content":"Seafood Restaurant"
                                    },
                                    {
                                        "id":"96926183",
                                        "content":"Fusion Restaurant"
                                    },
                                    {
                                        "id":"96926205",
                                        "content":"Sushi Restaurant"
                                    },
                                    {
                                        "id":"96926210",
                                        "content":"Japanese Restaurant"
                                    },
                                    {
                                        "id":"96926236",
                                        "content":"Restaurant"
                                    }
                                ]
                            }
                        },
                        {
                            "id":"48649488",
                            "xmlns":"urn:yahoo:lcl",
                            "Title":"Ciopinot",
                            "Address":"1051 Nipomo St",
                            "City":"San Luis Obispo",
                            "State":"CA",
                            "Phone":"(805) 547-1111",
                            "Latitude":"35.27832",
                            "Longitude":"-120.66628",
                            "Rating":{
                                "AverageRating":"4",
                                "TotalRatings":"5",
                                "TotalReviews":"5",
                                "LastReviewDate":"1293824606",
                                "LastReviewIntro":" Great food, Great Service, felt invited and taken care of. Will be there for New Years Eve"
                            },
                            "Distance":"0.44",
                            "Url":"https://local.yahoo.com/info-48649488-ciopinot-san-luis-obispo",
                            "ClickUrl":"https://local.yahoo.com/info-48649488-ciopinot-san-luis-obispo",
                            "MapUrl":"https://local.yahoo.com/info-48649488-ciopinot-san-luis-obispo?viewtype=map",
                            "BusinessUrl":"http://www.ciopinotrestaurant.com/",
                            "BusinessClickUrl":"http://www.ciopinotrestaurant.com/",
                            "Categories":{
                                "Category":[
                                    {
                                        "id":"96925852",
                                        "content":"Catering Service"
                                    },
                                    {
                                        "id":"96926179",
                                        "content":"Seafood Restaurant"
                                    },
                                    {
                                        "id":"96926236",
                                        "content":"Restaurant"
                                    },
                                    {
                                        "id":"96926245",
                                        "content":"Retail Seafood"
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        )
    };
    var failingMockYqlData= {
        "error":{
            "lang":"en-US",
            "diagnostics":null,
            "description":"Query syntax error(s) [line 1:61 missing EOF at 'b']"
        }
    };
    beforeEach(inject(function ($rootScope, $controller, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $scope = $rootScope.$new();

        createController = function () {
            return $controller('restaurantSearch', {
                '$scope': $scope
            });
        };
    }));
    it('test initial data', function () {
        var controller = createController();
        expect(controller.resultSets).toEqual(null);
        expect(controller.noResultsFound).toEqual(false);
        expect(controller.queryRunPending).toEqual(true);
    });
    it('test searchBusinesses function when query succeeds but null results returned', function () {
        var yqlQuery, getUrl;
        document.getElementById = function (eleId) {
            if (eleId === "foodType") {
                return {value: "bar"};
            } else if (eleId === "location") {
                return {value: ""};
            }
        };
        yqlQuery = "select * from local.search where query='"+
            document.getElementById("foodType").value+
            "' and location='"+
            document.getElementById("location").value+
            "'";
        // the constructed URLs are merely for illustrative purposes, as we are really using the $httpBackend to mock
        // responses, regardless of the url being supplied
        getUrl = "https://query.yahooapis.com/v1/public/yql?q="+yqlQuery+"&format=json&diagnostics=true";
        $httpBackend.
            when("GET", getUrl).
            respond(function (method, url, data) {
            return [200, nullMockYqlData, {}];
        });
        var controller = createController();
        controller.searchBusinesses();
        $httpBackend.flush();
        expect(controller.queryRunSuccessful).toEqual(true);
        expect(controller.queryRunPending).toEqual(false);
        expect(controller.noResultsFound).toEqual(true);
        expect(controller.resultSets).toEqual([]);
    });
    it('test searchBusinesses function when query succeeds and non-null results returned', function () {
        var yqlQuery, getUrl;
        document.getElementById = function (eleId) {
            if (eleId === "foodType") {
                return {value: "bar"};
            } else if (eleId === "location") {
                return {value: "san jose"};
            }
        };
        yqlQuery = "select * from local.search where query='"+
            document.getElementById("foodType").value+
            "' and location='"+
            document.getElementById("location").value+
            "'";
        getUrl = "https://query.yahooapis.com/v1/public/yql?q="+yqlQuery+"&format=json&diagnostics=true";
        $httpBackend.
            when("GET", getUrl).
            respond(function (method, url, data) {
                return [200, nonNullMockYqlData, {}];
            });
        var controller = createController();
        controller.searchBusinesses();
        $httpBackend.flush();
        expect(controller.queryRunSuccessful).toEqual(true);
        expect(controller.queryRunPending).toEqual(false);
        expect(controller.noResultsFound).toEqual(false);
        expect(controller.resultSets).not.toEqual([]);
    });
    it('test searchBusinesses function when query fails', function () {
        var yqlQuery, getUrl;
        document.getElementById = function (eleId) {
            if (eleId === "foodType") {
                return {value: "bar"};
            } else if (eleId === "location") {
                return {value: "san'jose"};
            }
        };
        yqlQuery = "select * from local.search where query='"+
            document.getElementById("foodType").value+
            "' and location='"+
            document.getElementById("location").value+
            "'";
        getUrl = "https://query.yahooapis.com/v1/public/yql?q="+yqlQuery+"&format=json&diagnostics=true";
        $httpBackend.
            when("GET", getUrl).
            respond(function (method, url, data) {
                return [400, failingMockYqlData, {}];
            });
        var controller = createController();
        controller.searchBusinesses();
        $httpBackend.flush();
        expect(controller.queryRunSuccessful).toEqual(false);
        expect(controller.queryRunPending).toEqual(false);
        expect(controller.noResultsFound).toEqual(true);
        expect(controller.resultSets).toEqual([]);
    });
    it('test isErrorsOccuredDuringSearch function when queryRunSuccessful is true', function () {
        var controller = createController();
        controller.searchWasrequested = true;
        controller.queryRunPending = true;
        controller.queryRunSuccessful = true;
        expect(controller.isErrorsOccuredDuringSearch()).toBe(false);
    });
    it('test isErrorsOccuredDuringSearch function when queryRunSuccessful is false', function () {
        var controller = createController();
        controller.searchWasrequested = true;
        controller.queryRunPending = false;
        controller.queryRunSuccessful = false;
        expect(controller.isErrorsOccuredDuringSearch()).toBe(true);
    });
    it('test isNoSearchResultsFound function when controller.resultSets.length is 0', function () {
        var controller = createController();
        controller.searchWasrequested = true;
        controller.queryRunPending = true;
        controller.resultSets = [];
        expect(controller.isNoSearchResultsFound()).toBe(false);
    });
    it('test isNoSearchResultsFound function when controller.resultSets.length is not 0', function () {
        var controller = createController();
        controller.searchWasrequested = true;
        controller.queryRunPending = false;
        controller.resultSets = nonNullMockYqlData.query.results.Result;
        expect(controller.isNoSearchResultsFound()).toBe(false);
    });
    it('test sortBy function ', function () {
        var controller = createController();
        var sortProperty= 'AverageRating';

        // default reverseSortDirection is false
        expect(controller.reverseSortDirection).toEqual(false);
        controller.sortBy(sortProperty);
        expect(controller.sortProperty ).toEqual(sortProperty);
        expect(NS.restaurantSearch.prototype.sortProperty ).toEqual(controller.sortProperty);
        expect(controller.reverseSortDirection).toEqual(true);

        // test reverseSortDirection when sortby attribute is changed (different sortby btn has been clicked)
        sortProperty= 'Distance';
        controller.sortBy(sortProperty);
        expect(controller.sortProperty ).toEqual(sortProperty);
        expect(NS.restaurantSearch.prototype.sortProperty ).toEqual(controller.sortProperty);
        expect(controller.reverseSortDirection).toEqual(false);
    });
    it('test setSortProperty function ', function () {
        var controller = createController();
        var sortProperty= 'Distance';
        controller.setSortProperty(sortProperty);
        expect(controller.sortProperty ).toEqual(sortProperty);
        expect(NS.restaurantSearch.prototype.sortProperty ).toEqual(controller.sortProperty);
    });
    it('test getSortProperty function ', function () {
        var controller = createController();
        NS.restaurantSearch.prototype.sortProperty = 'AverageRating';
        var resultRowObj= nonNullMockYqlData.query.results.Result[0];
        expect(controller.getSortProperty(resultRowObj) ).toEqual(1);
        resultRowObj= nonNullMockYqlData.query.results.Result[1];
        expect(controller.getSortProperty(resultRowObj) ).toEqual(resultRowObj.Rating.AverageRating);
        NS.restaurantSearch.prototype.sortProperty = 'Distance';
        resultRowObj= nonNullMockYqlData.query.results.Result[1];
        expect(controller.getSortProperty(resultRowObj) ).toEqual(resultRowObj.Distance);
    });
});