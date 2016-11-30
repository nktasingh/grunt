var app = angular.module('FormBuilderTest', ['formBuilder']);

app.controller('TestCtrl', function($scope, $http, $location) {
    $scope.testSchema = {
        stage_id: 'device_options',
        step_id: 'device',
        fields: {
                'www': {
                    type: 'string',
                    title: 'WWWWWWWW',
                    required: true,
                    pattern: '^[abc]+$'
                },
                'xxx': {
                    type: 'string',
                    title: 'XXXXX',
                    required: false
                },
                'yyy': {
                    type: 'string',
                    title: 'YYYYY',
                    required: false
                },
                'zzz': {
                    type: 'string',
                    title: 'ZZZZZ',
                    required: false
                },
                'bool': {
                    type: 'boolean',
                    title: 'checkbox test...'
                },
                'radios': {
                    type: 'string',
                    title: 'radio test...',
                    enum: ['opt 1','opt 2','opt 3'],
                    map: {
                        'opt 1': 'OPTION 1',
                        'opt 2': 'OPTION 2',
                        'opt 3': 'OPTION 3',
                    },
                    required: true
                },
                'checkbox_array': {
                    type: 'array',
                    title: 'Checkbox Group',
                    enum: ['test 1', 'test 2', 'test 3'],
                    map: {
                        'test 1': 'TEST 1',
                        'test 2': 'TEST 2',
                        'test 3': 'TEST 3',
                    }
                },
                "Measurements_M1": {
                    type: "number",
                    required: true,
                    min: 0,
                    max: 100
                },
                "Measurements_M2": {
                    type: "number",
                    required: true,
                    min: 0,
                    max: 200
                },
                "Measurements_M3": {
                    type: "number",
                    required: true,
                    min: 0,
                    max: 300,
                    relMin: 'model.Measurements_M2 + 2',
                    relMax: 'model.Measurements_M2 + 4'

                }
        },
        form: [
            {
              type: "diagram",
              image: "test_assets/diagram.png",
              maxWidth: 800,
              items: [
                    {
                        key: "Measurements_M1",
                        "x1": 0.083,
                        "y1": 0.39,
                        "x2": 0.186,
                        "y2": 0.476
                    },
                    {
                        key: "Measurements_M2",
                        "x1": 0.772,
                        "y1": 0.303,
                        "x2": 0.876,
                        "y2": 0.392
                    },
                    {
                        key: "Measurements_M3",
                        "x1": 0.578,
                        "y1": 0.64,
                        "x2": 0.684,
                        "y2": 0.729
                    },
                ]
            },
            {
                key: 'www'
            },
            {
                type: 'section',
                items: [
                    {
                        key: 'xxx',
                    },
                    {
                        key: 'yyy',
                        class: 'col-xs-6'
                    },
                    {
                        key: 'zzz',
                        class: 'col-xs-6'
                    }
                ]
            },
            {
                key:'bool'
            },
            {
                key: 'radios',
                type: 'radios'
            },
            {
                key: 'radios',
                type: 'select',
            },
            {
                key: 'checkbox_array'
            },
            {
                type: 'submit',
            }
        ]
    };

	$scope.testModel = {};

    $scope.$on('form-submit', function(event, form_id, validity) {
        console.log('event: submitted', form_id);
        console.log('validity', validity)
    })


});
