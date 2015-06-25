ngDevices.controller('devicesCtrl', ['$scope', '$timeout', 'deviceListFactory', 'sendDeviceConfigFactory',
    function ($scope, $timeout, deviceListFactory, sendDeviceConfigFactory) {
        $scope.showLoadError = false;
        $scope.showLoading = false;
        $scope.echosounders = [];
        $scope.showEchosoundersList = [];
        $scope.transmitPowers = [5, 10, 20];//units is Watts
        $scope.selectedTransmitPower = $scope.transmitPowers[0];//initialization
        $scope.pingModes = { "modes": ['Sync', 'Auto'], "selectedMode": "Sync" };
        $scope.pingInterval = { "min": 100, "max": 10000, "step": 100, "value": 100 };
        $scope.selectedEchoSounder = { 'detail': {} } //to be used in add echosounder form
        $scope.selectedEchoSounderCount = 0;
        $scope.showStatusArea = true;
        $scope.titleTableCountArray = [1];
        $scope.echoSounderIntilization = function () {
            $scope.selectedTransmitPower = $scope.transmitPowers[0];
            $scope.pingModes.selectedMode = $scope.pingModes.modes[0];
            $scope.pingInterval.value = $scope.pingInterval.min;
        }

        $scope.showEnabledTransducer = function (transducer) {
            return transducer.enable
        }

        $scope.titleTableDisplay = function () {
            var count = Math.round($('.status-content').outerHeight() / $('.echosounder-table').outerHeight() + 0.5)
            var tempArray = []
            for (var i = 0; i < count - 1 ; i++) {
                tempArray.push(i);
            }
            $scope.titleTableCountArray = tempArray

            //setting height of status area ; just to ensure proper background coverage
            if (parseInt($('.status-area').css('height'), 10) < parseInt($('.status-content').outerHeight(), 10)) {
                $('.status-area').css('height', $('.status-content').outerHeight())
            }

        }
        $scope.getEnabledTransducerCount = function (transducers) {
            var count = 0;
            angular.forEach(transducers, function (value, key) {
                if (value.enable === true) {
                    count += 1;
                }
            });
            return count;
        }
        $scope.changeEchoSounderStatus = function (echoSounderName) {
            angular.forEach($scope.echosounders, function (value, key) {
                if (value.echosounder == echoSounderName) {
                    value.status = !value.status
                    $scope.selectedEchoSounder.detail = value;
                    $scope.$apply()
                    return false;
                }
            })
            $scope.sendDeviceConfig()
        }
        $scope.sendDeviceConfig = function () {
            var selectedEchoSounder = $scope.selectedEchoSounder.detail.echosounder
            var selectedTransducers = []
            var errorFlag = false
            var selectedEchoSounderIndex = -1;
            angular.forEach($scope.echosounders, function (echoDetail, index) {
                if (echoDetail.echosounder === selectedEchoSounder) {
                    selectedEchoSounderIndex = index;
                    angular.forEach(echoDetail.transducers, function (value, key) {
                        if (value.enable == true) {
                            if (value.name == "" || value.depth == "") {
                                value.error = true
                                errorFlag = true
                            } else {
                                selectedTransducers.push([value.name, value.depth, value.hardware_channel, value.recording])//may be we should change it to array of json
                                value.error = false
                            }

                        }
                        else {
                            value.error = false;
                        }
                    });
                }
            });
            //console.log("sendDeviceConfig");
            //console.log(selectedTransducers);
            //console.log(errorFlag)
            if (!errorFlag) {

                if (selectedTransducers.length !== 0) {

                    //testing hardcoded data
                    //var deviceConfigStatus = [{
                    //                            "transducers": [{ "software_channel": "11", "status": "recording", "hardware_channel": "1", "name": "H200202" },
                    //                                            { "software_channel": "22", "status": "enabled", "hardware_channel": "2", "name": "H200333" },
                    //                                            { "software_channel": "33", "status": "disabled", "hardware_channel": "3", "name": "H200612" },
                    //                                            { "software_channel": "44", "status": "disabled", "hardware_channel": "4", "name": "H200614" },
                    //                                            { "software_channel": "55", "status": "disabled", "hardware_channel": "5", "name": "H200615" },
                    //                                            { "software_channel": "66", "status": "disabled", "hardware_channel": "6", "name": "H200616" }],
                    //                            "echosounder": "4C:00:00:01"
                    //                        }];
                    //var deviceConfigStatus = deviceConfigStatus[0];
                    //$scope.processStatus(deviceConfigStatus,selectedEchoSounderIndex)
                    //$scope.showStatusArea=true;
                    //$('#addTransducerForm').modal('hide');
                    ////debugger;
                    ////console.log("$scope.titleTableCount",$scope.titleTableCount)
                    //$scope.selectedEchoSounderCount +=1
                    //$scope.showConfigBar = false;
                    //$timeout(function(){
                    //        $scope.titleTableDisplay()
                    //})
                    //// hardcoding ends

                    //code to be used in real time

                    $scope.showLoading = true;
                    sendDeviceConfigFactory.sendData(selectedEchoSounder, $scope.echosounders[selectedEchoSounderIndex].status, $scope.selectedTransmitPower, $scope.pingModes.selectedMode, $scope.pingInterval, selectedTransducers, function (success) {
                        if (success) {

                            $scope.showLoading = false;
                            var deviceConfigStatus = sendDeviceConfigFactory.getStatus();
                            $scope.processStatus(deviceConfigStatus, selectedEchoSounderIndex)
                            $scope.showStatusArea = true;
                            $('#addTransducerForm').modal('hide');
                            $scope.selectedEchoSounderCount += 1
                            $scope.showConfigBar = false;
                            $timeout(function () {
                                $scope.titleTableDisplay()
                            })

                        } else {
                            $scope.showLoading = false;
                            $scope.showLoadError = true;
                            console.log('There was some error while retriving device config status')

                        }
                        $scope.$apply();//this should be here so, that even error cases get applied
                    });

                    //code end -- for real time


                }
                else {
                    $scope.echosounders[selectedEchoSounderIndex].transducers[0].error = true;
                    console.log("Please select transducer..");
                }


            }

        }
        $scope.processStatus = function (deviceConfigStatus, selectedEchoSounderIndex) {

            angular.forEach(deviceConfigStatus.transducers, function (transValue, transKey) {
                angular.forEach($scope.echosounders[selectedEchoSounderIndex].transducers, function (value, key) {
                    if (transValue.hardware_channel == value.hardware_channel) {
                        value["software_channel"] = transValue.software_channel
                        value["status"] = transValue.status
                    }

                });
            });
            $scope.echosounders[selectedEchoSounderIndex].selected = true;
            // console.log("process",$scope.echosounders[selectedEchoSounderIndex])
            //$scope.sliceForDisplay(2) 
        }
        $scope.createEchosoundersList = function (deviceList) {

            angular.forEach(deviceList, function (echoSounders, echosounder_type) {

                if (echosounder_type == "CageEye mk.III") {

                    angular.forEach(echoSounders, function (echosounderValue) {

                        $scope.echosounders.push({
                            'echosounder': echosounderValue,
                            'transducers':
                                           [{ "id": 1, "enable": true, 'hardware_channel': '1', 'software_channel': 1, "name": "trans1kjh", "depth": 1, "recording": false, 'window': false, "view": false, "error": false },
                                           { "id": 2, "enable": true, 'hardware_channel': '2', 'software_channel': 2, "name": "trans1hkj", "depth": 1, "recording": false, 'window': false, "view": false, "error": false },
                                           { "id": 3, "enable": true, 'hardware_channel': '3', 'software_channel': 3, "name": "trans1jhk", "depth": 1, "recording": false, 'window': false, "view": false, "error": false },
                                           { "id": 4, "enable": true, 'hardware_channel': '4', 'software_channel': 4, "name": "trans1hkj", "depth": 1, "recording": false, 'window': false, "view": false, "error": false },
                                           { "id": 5, "enable": true, 'hardware_channel': '5', 'software_channel': 5, "name": "trans1jkl", "depth": 1, "recording": false, 'window': false, "view": false, "error": false },
                                           { "id": 6, "enable": true, 'hardware_channel': '6', 'software_channel': 6, "name": "trans1skh", "depth": 1, "recording": false, 'window': false, "view": false, "error": false }
                                           ],
                            'selected': false, //shows whether the echosounder has been added for live status or not ; initially false,
                            //'cage': cageKey,
                            'status': true
                        });
                    });

                } else {
                    // ignore for now
                }

                
            });


        };
        $scope.showSelectedEchoSounder = function (echosounder) {
            return echosounder.selected
        }
        $scope.showConfigBar = false
        $scope.configBar = function () {
            $scope.showConfigBar = !$scope.showConfigBar
        }

        $scope.showDeviceListDropUp = false;
        $scope.deviceListDropUp = function (echoSounderName) {
            if (echoSounderName !== undefined) {
                //TODO : required while editing exiting echosounder configuration
            }
            $scope.showDeviceListDropUp = !$scope.showDeviceListDropUp
        }
        $scope.setSelectedEchoSounder = function (echoSounderName) {
            //console.log("selectedEchoSounder")
            $scope.selectedEchoSounder.name = echoSounderName
            //$scope.$apply();
        }
        $scope.closeModel = function (modelId) {
            console.log('closeModel')
            $("#" + modelId).modal('hide')

        }
        $scope.addEchoSounder = function () {
            console.log('add Echosounder')
            //if not already retrived ;make call to factory to get list of echosouder
            //  once you have the list go to modal

            //real time code

            if ($scope.echosounders.length == 0) {
                $scope.showLoadError = false;
                $scope.showLoading = true;  //shows loading symbol
                deviceListFactory.loadData(function (success) {

                    if (success) {

                        $scope.showLoading = false;
                        $scope.deviceList = deviceListFactory.getData();                        
                        var deviceList = $scope.deviceList;
                        $scope.createEchosoundersList(deviceList)
                    } else {

                        $scope.showLoading = false;
                        $scope.showLoadError = true;
                        console.log("There was an error while retrieving device list");

                    }
                    $scope.$apply();    //this should be here so, that even error cases get applied

                });


            }
            //end of real time code  



            ////hardcoding starts
            //if ($scope.echosounders.length==0){
            //    var deviceList ={"CageEye mk.III":["4C:00:00:01", "4C:00:00:02","4C:00:00:03","4C:00:00:04","4C:00:00:05","4C:00:00:06" ]};
            //    $scope.createEchosoundersList(deviceList)
            //    
            //}
            ////hardcoding ends

            var flag = false;
            angular.forEach($scope.echosounders, function (value, key) {
                console.log(value, key)
                if (!flag) {
                    if (value.selected == false) {
                        $scope.selectedEchoSounder.detail = value;
                        flag = true
                    }
                }

            });
            $('#selectEchoSounder').modal('show')
            // debugger;


            console.log('selectedEchoSounder', $scope.selectedEchoSounder.detail);
            console.log('add Echosounder end')
        }

        $scope.showUnselected = function (echosounder) {
            console.log(echosounder)
            return !echosounder.selected
        }
        $scope.getSelectedEchoSounder = function (echosounder) {
            return echosounder.echosounder === $scope.selectedEchoSounder.detail.echosounder;
        }
        $scope.gotoEchoSounderForm = function () {
            console.log('gotoTransdcuerForm')
            $scope.echoSounderIntilization()
            $('#selectEchoSounder').modal('hide');
            $('#configureEchoSounder').modal('show');
        }
        $scope.goBackToSelectForm = function () {
            console.log('gotoTransdcuerForm')
            $('#configureEchoSounder').modal('hide');
            $('#selectEchoSounder').modal('show');

        }

        $scope.gotoAddTransducerForm = function () {
            $('#configureEchoSounder').modal('hide');
            $('#addTransducerForm').modal('show');
        }
        $scope.goBackToEchoSounderForm = function () {
            console.log('goBackToEchoSounderForm');
            $('#addTransducerForm').modal('hide');
            $('#configureEchoSounder').modal('show');
        }
        $scope.changeWindowStatus = function (echosounderName, hardwareChannel) {
            var transducer;
            console.log($scope.echosounders)
            angular.forEach($scope.echosounders, function (echosounderDetail, key) {

                if (echosounderDetail.echosounder == echosounderName) {

                    angular.forEach(echosounderDetail.transducers, function (value, key) {

                        if (value.hardware_channel == hardwareChannel) {

                            var previousWindowStatus = value.window;
                            value.window = "refreshing";

                            sendDeviceConfigFactory.changeWindowStatus(echosounderDetail.echosounder, value.name, value.hardware_channel, value.software_channel, !previousWindowStatus,
                                function (success, result) {
                                    if (success) {
                                        console.log('success')
                                        //{echosounder: "4111-0000", transducerName: "etet", window: true}
                                        value.window = result.window;
                                        console.log("windowstatus result: ", result);
                                    }
                                    else {
                                        console.log('error')
                                        value.window = "error"
                                    }
                                    
                                    $scope.$apply();
                                });
                            return false;

                        }

                    });

                }

            });


        }
        $scope.changeRecordingStatus = function (echosounderName, hardwareChannel) {
            var transducer;
            debugger;
            console.log($scope.echosounders)
            angular.forEach($scope.echosounders, function (echosounderDetail, key) {
                if (echosounderDetail.echosounder == echosounderName) {
                    angular.forEach(echosounderDetail.transducers, function (value, key) {
                        if (value.hardware_channel == hardwareChannel) {
                            var previousRecordingStatus = value.recording
                            value.recording = "refreshing"
                            sendDeviceConfigFactory.changeRecordingStatus(echosounderDetail.echosounder, value.name, value.hardware_channel, value.software_channel, !previousRecordingStatus,
                                function (success, result) {
                                    if (success) {
                                        value.recording = result.recording;
                                        console.log("recordingstatus result: ", result);
                                    }
                                    else {
                                        value.recording = "error"
                                    }                                    
                                    $scope.$apply();
                                })
                            return false;
                        }
                    });
                }
            })


            angular.forEach($scope.deviceConfigStatus.transducers, function (value, key) {

            });

        }
        $timeout(function () {
            console.log('timeout');
            $scope.echosounders = [];
            /*            $('#selectEchoSounder').modal({
                            keyboard: false
                        })
                        $('#configureEchoSounder').modal({
                            keyboard: false
                        })
                        $('#addTransducerForm').modal({
                            keyboard: false
                        })*/
        })


    }]);