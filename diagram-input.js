angular.module('diagramInput', []).directive('diagramInput', function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/diagram-container.html',
        scope: {
            schema: '=',
            inputs: '=',
            model: '=',
            image: '=',
            maxWidth: '=',
            disabled: '=',
            debounce: '='
        },
        link: function(scope, element, attr) {
            scope.imageHeight = 0;
            scope.imageWidth = 0;
            scope.focusedField = {};

            scope.$watch(function() {
                var measuredWidth = element[0].firstChild.clientWidth;
                scope.imageWidth = measuredWidth > scope.maxWidth ? scope.maxWidth : measuredWidth;
                scope.imageHeight = element[0].firstChild.clientHeight;
            });

            angular.element(window).on("resize", function() {
                scope.$apply();
            });

            var imageLoader = new Image();
            imageLoader.src = scope.image;
            imageLoader.onload = function() {
                scope.$apply();
            };
        },
		controller: ['$scope', function formBuilderController($scope) {}]
    };
}).directive('diagramInputField', function($parse) {
    return {
        restrict: 'E',
		require:['^diagramInput'],
        templateUrl: 'templates/diagram-field.html',
		scope: {
            properties: '=',
            formElement: '=',
            model: '=',
            imageHeight: '=',
            imageWidth: '=',
            disabled: '=',
            debounce: '=',
            focusedField: '='
		},
        link: function(scope, element, attr, controllers) {
            var maxCharWidth = 8;

            scope.fontScaleFactor = function(str) {
                var scaling = 1;
                while(str && ((str.toString().length * maxCharWidth * scaling) > scope.imageWidth * (scope.formElement.x2 - scope.formElement.x1)))
                    scaling *= 0.9;
                return scaling;
            };

            scope.scaledHeight = function() {
                return Math.round(scope.imageHeight * (scope.formElement.y2 - scope.formElement.y1));
            };
            scope.scaledWidth = function() {
                return Math.round(scope.imageWidth * (scope.formElement.x2 - scope.formElement.x1));
            };

            var absMin = scope.properties.min;
            var absMax = scope.properties.max;
            var parsedRelMinFn = null;
            var parsedRelMaxFn = null;
            var computedRelMin;
            var computedRelMax;

            if(scope.properties.relMin) {
                try {
                    parsedRelMinFn = $parse(scope.properties.relMin);
                } catch(e) {
                    console.log("Malformed relative min function", e);
                }
            }
            if(scope.properties.relMax) {
                try {
                    parsedRelMaxFn = $parse(scope.properties.relMax);
                } catch(e) {
                    console.log("Malformed relative max function", e);
                }
            }

            scope.getMinValue = function() {
                try {
                    computedRelMin = parsedRelMinFn(scope);
                    return computedRelMin > absMin ? computedRelMin : absMin;
                } catch(e) {
                    return absMin;
                }
            };

            scope.getMaxValue = function() {
                try {
                    computedRelMax = parsedRelMaxFn(scope);
                    return computedRelMax < absMax ? computedRelMax : absMax;
                } catch(e) {
                    return absMax;
                }
            };
        }
    };
});
