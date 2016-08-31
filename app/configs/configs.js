'use strict';

NS.myAppConfig = function($locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: true
	});
};

NS.myApp.config(NS.myAppConfig);
