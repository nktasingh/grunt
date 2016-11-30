angular.module('formBuilder', ['ngSanitize', 'diagramInput']).directive('formBuilder', function($templateCache, $compile) {
	return {
		restrict: 'E',
		templateUrl: 'templates/form.html',
		scope: {
			schema: '=',
			model: '=',
			disabled: '=',
			debounce: '='
		},
		link: function(scope, element, attr) {
			if (!scope.schema) {
				throw new Error("Must be instantiated with a schema.");
				return;
			}
			scope.form_id = scope.schema.step_id + '_' + scope.schema.stage_id;
			scope.submitted = false;

			scope.getValidity = function() {
				return scope[scope.form_id].$valid;
			}

			scope.submit = function() {
				scope.submitted = true;
				scope.$emit('form-submit', scope.form_id, scope[scope.form_id].$valid);
			}
		},
		controller: ['$scope', function formBuilderController($scope) {}]
	};

}).directive('formBuilderElement', function($templateCache, $compile, $sanitize, $parse) {
	return {
		restrict: 'E',
		require:['^formBuilder'],
		templateUrl: 'templates/element.html',
		scope:{
			formElement:'=',
			formId:'=',
			schema:'=',
			model:'=',
			disabled: '=',
			debounce: '=',
			submitted: '='
		},
		link: function(scope, element, attr, controllers) {
			var schemaTypeTemplateMap = {
				'string': 'templates/input.html',
				'number': 'templates/input.html',
				'array': 'templates/checkboxes.html',
				'boolean': 'templates/checkbox.html'
			};

			var formTypeTemplateMap = {
				'radios': 'templates/radios.html',
				'select': 'templates/select.html',
				'textarea': 'templates/textarea.html'
			};

			var formBuilderCtrl = controllers[0];
			if (!scope.formElement) {
				throw new Error("Must be instantiated with form object.");
				return;
			}
			if (!scope.model) {
				throw new Error("Must be instantiated with model object.");
				return;
			}

			scope.checkFieldCondition = function() {
				if(/^model\[(.*)\](.*)$/.test(scope.formElement.condition))
					return $parse(scope.formElement.condition)(scope);

				throw new Error("Ignoring malformed condition statement.\n");
				return true;
			}

			if (scope.formElement.key) {
				scope.key = scope.formElement.key;
				scope.properties = scope.schema.fields[scope.key];
				if (!scope.properties) {
					throw new Error("Could not find properties of field in schema.");
				}
				if(scope.formElement.type) {
					scope.fieldTemplate = formTypeTemplateMap[scope.formElement.type];
				} else {
					scope.fieldTemplate = schemaTypeTemplateMap[scope.properties.type];
				}

			} else if (scope.formElement.type == 'section') {
				scope.fieldTemplate = 'templates/section.html';
				scope.subElement = scope.formElement.items;

			} else if (scope.formElement.type == 'diagram') {
				scope.fieldTemplate = 'templates/diagram.html';
				scope.items = scope.formElement.items;
				scope.schemas = {};
				scope.formElement.items.forEach(function(item) {
					scope.schemas[item.key] = scope.schema.fields[item.key];
				});

			} else if (scope.formElement.type == 'html') {
				var i = 0;
				while($templateCache.get('form-html'+i+'.html')) i++;
				$templateCache.put('form-html'+i+'.html', scope.formElement.html);
				scope.fieldTemplate = 'form-html'+i+'.html';

			} else if (scope.formElement.type == 'submit') {
				scope.fieldTemplate = 'templates/submit.html';

			} else {
				throw new Error("Bad element type given.");

			}
		}
	};
});
