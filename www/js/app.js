

var VPSApp = angular.module("VPSApp", ["ionic"]);


VPSApp.service("VPSSvc", ["$http", "$rootScope", VPSSvc]);



VPSApp.controller("VPSCtrl", 
    ["$scope", "$sce", 
      "$ionicLoading", "$ionicListDelegate", "$ionicPlatform",
      "VPSSvc",  VPSCtrl]);

function VPSCtrl($scope, $sce, $ionicLoading, $ionicListDelegate, $ionicPlatform, VPSSvc) {


    $ionicLoading.show({template: "Loading Blogs...."});

    $scope.deviceReady = false;

    $ionicPlatform.ready(function() {
      $scope.$apply(function() {
        $scope.deviceReady = true;
      });
    });


    $scope.blogs = [];
    $scope.params = {};

    $scope.$on("VPSApp.blogs", function(_, result) {
          result.posts.forEach(function(b) {
              $scope.blogs.push ({

                name: b.author.name,
                avatar_URL: b.author.avatar_URL,
                title: $sce.trustAsHtml(b.title),
                URL: b.URL,
                excerpt: $sce.trustAsHtml(b.excerpt),
                featured_image: b.featured_image

                 
              });

        });

          $scope.params.before = result.date_range.oldest;
          $scope.$broadcast("scroll.infiniteScrollComplete");
          $scope.$broadcast("scroll.refreshComplete");
          $ionicLoading.hide();
    });

    $scope.loadMore = function() {
      VPSSvc.loadBlogs($scope.params);

    }

    $scope.reload = function() {
      $scope.blogs = [];
      $scope.params = {};
      VPSSvc.loadBlogs();
    }

    $scope.show = function($index) {
      cordova.InAppBrowser.open($scope.blogs[$index].URL, "_blank", "location=no"); 
     
    }
    $scope.share = function($index) {
      $ionicListDelegate.closeOptionButtons();
      window.socialmessage.send({
          url: $scope.blogs[$index].URL
      });
      
    }
}


function VPSSvc ($http, $rootScope) {

  this.loadBlogs = function (params) {

    $http.get("https://public-api.wordpress.com/rest/v1/freshly-pressed/", {
      params: params})
    
    .success(function(result){

        $rootScope.$broadcast("VPSApp.blogs", result);
    });
  }
}
