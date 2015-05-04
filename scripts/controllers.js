var app = angular.module('crmRestaurant',['ngMaterial']);

app.constant('COMMON_CONFIG',{
    "baseFolder" : "crm_server_offline",
    "dbName" : "crmDB",
    onlineAppUrl: 'http://localhost:8027/admin'
});

//khai báo service dùng chung
app.factory('commonService', function($window, $q){
    var toScale = function() {
        //chỉnh kích thước listing-menu
        $('#listing-menu').height($window.innerHeight - 48 - 174 - 32);
    };
    var self = this;
    this.ipServer = '127.0.0.1';
    this.protocol = 'http://';
    this.scaleWindow =  function() {
        toScale();
        $(window).resize(function() {
            toScale();
        });
    };
    return this;
});

app.run(function($window, $rootScope) {
    $rootScope.wHeight = $window.innerHeight;
    $rootScope.wWidth = $window.innerWidth;
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

});


app.controller('CommonController', function($scope, COMMON_CONFIG) {
    $scope.connection_status = 'Ngoại tuyến';
    $scope.onlineAppUrl = COMMON_CONFIG.onlineAppUrl;
    $scope.$watch('online', function(newStatus) {
        if(newStatus === false) {
            $scope.connection_status = 'Ngoại tuyến';
        }else{
            $scope.connection_status = 'Trực tuyến';
        }
    })
});

app.controller('HomeController', function ($rootScope, $q, COMMON_CONFIG, commonService) {
    var self = this;
    self.ipServer = commonService.ipServer;
    self.list_menu = [];
    self.list_desk = [];
    self.current_menu = null;
    self.current_desk = {
        cud_start_time : 'dd/mm/YYYY H:i'
    };
    self.config = {
        common : {
            con_restaurant_name : ''
        }
    };
    self.list_menu = {};
    /*
    this.getIp  = function(){
        var d = $q.defer();
        chrome.storage.local.get('ip_server', function (result) {
            d.resolve(result.ip_server);
        });
        return d.promise;
    };
    */
    chrome.storage.local.get('ip_server', function (result) {
        self.current_menu = 1;
        self.ipServer = result.ip_server;
        var url_get_data = commonService.protocol + self.ipServer + '/'+ COMMON_CONFIG.baseFolder +'/data/crm.php';
        //console.log(url_get_data);
        $.ajax({
            type : 'get',
            url : url_get_data,
            dataType : 'json',
            success : function(resp){
                self.list_menu = resp.list_menu;
                self.config.common = resp.config_common;
                self.list_desk = resp.list_desk;
            }
        });
    });
    /*
    this.getIp().then(function (ip_server) {
        self.ipServer = ip_server;
        var url_get_data = commonService.protocol + self.ipServer + '/'+ COMMON_CONFIG.baseFolder +'/data/crm.php';
        //console.log(url_get_data);
        $.ajax({
            type : 'get',
            url : url_get_data,
            dataType : 'json',
            success : function(resp){
                self.list_menu = resp.list_menu;
                self.config.common = resp.config_common;
                self.list_desk = resp.list_desk;
            }
        });
    });
    */



    //scale window
    commonService.scaleWindow();


});

app.controller('SettingController', function($scope, $http, $q, COMMON_CONFIG) {
    var self = this;
    this.loading = '';
    this.ipServer = '127.0.0.1';

    this.saveIp = function(){
        chrome.storage.local.set({
            'ip_server' : self.ipServer
        });
    };



    this.getIp  = function(){
        var d = $q.defer();
        chrome.storage.local.get('ip_server', function (result) {
            d.resolve(result.ip_server);
        });
        return d.promise;
    };

    this.getIp().then(function (ip_server) {
        self.ipServer = ip_server;
    });
});

