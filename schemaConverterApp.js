var app = angular.module('SchemaConverter', ['formBuilder']);

app.controller('SchemaConverterCtrl', function($scope, $http, $location) {

    function createFormBuilderSchema(old) {
        var schema = [];
        var conversionMessages = [];

        var steps = ["medical", "device", "delivery"];

        steps.forEach(function(step) {
            old.forEach(function(stage) {
                if(stage.stage_id == "patient" && stage.step_id == "other" && step == "medical") {
                    conversionMessages.push({
                        title: "Patient (other)",
                        messages: [
                            {
                                type: "danger",
                                message: "Skipped over hidden patient stage."
                            }
                        ] 
                    });
                    return;
                }

                if(stage.step_id != step) return;

                var newStage = {
                    title: stage.header,
                    step_id: stage.step_id,
                    fields: {},
                    form: []
                };
                var stageMessages = {
                    title: stage.header + " (" + stage.step_id + ")",
                    messages: []
                };

                stage.form.forEach(function(formElement) {
                    stageMessages.messages.push({
                        type: "success",
                        message: formElement.key ? formElement.key : JSON.stringify(formElement, 4)
                    });
                });

                

                conversionMessages.push(stageMessages);
                schema.push(newStage);
            });
        });

        

        return {
            schema: schema,
            messages: conversionMessages
        };
    }

    $scope.convert = function() {
        try {
            var parsedOldSchema = JSON.parse($scope.oldSchema);
            var output = createFormBuilderSchema(parsedOldSchema);
        } catch(e) {
            alert(e);
            return;
        }
        $scope.conversionMessages = output.messages;
        $scope.conversionFinished = true;
        $scope.convertedSchema = output.schema;
    };


});
