'use strict';

/**
 * Service wrapper for $http
 */
NS.apiService = function ($http, $q) {
    /**
     * Function to initiate XMLHttpRequest
     * @param {} options - Config object describing the request to be made and how it should be processed
     * @returns a promise object with the standard then method and two http specific methods: success and error
     */
    this.call = function (options) {
        var deferred = $q.defer();
        var url = options.url;

        // Add cache busting to the URL
        if (typeof url !== "undefined" && options.cachebust === true) {
            if (url.indexOf("?") !== -1) {
                url += "&";
            } else {
                url += "?";
            }
            url += "timestamp=" + new Date().getTime();
        }

        var ajaxOptions = {
            method: options.method || "GET", //default GET
            cache: options.cache || false,
            url: url,
            data: options.data,
            params: options.params,
            headers: options.headers,
            timeout: options.timeout,
            withCredentials:
                (typeof options.withCredentials !== 'undefined') ?
                options.withCredentials :
                true
        };

        var apiServiceOnSuccess = function (response) {
            deferred.resolve(response);
        };

        var apiServiceOnError = function (response) {
            deferred.reject(response);
        };

        // make the call
        $http(ajaxOptions).then(apiServiceOnSuccess, apiServiceOnError);
        // return promise
        return deferred.promise;
    };
};

NS.myApp.service('apiService', NS.apiService);


