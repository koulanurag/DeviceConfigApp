ngDevices.controller('devicesCtrl', ['$scope', '$timeout', 'deviceListFactory', 'sendDeviceConfigFactory',
    function ($scope, $timeout, deviceListFactory, sendDeviceConfigFactory) {
        
        $scope.isArray = angular.isArray;
        $scope.showTransducerContent = false;
        $scope.showTransducerContentLoading = false;
        $scope.showTransducerContentError = false;
        $scope.showLoadError = false;
        $scope.showLoading = false;
        $scope.echosounders = [];
        $scope.showEchosoundersList = [];
        $scope.transmitPowers = [5, 10, 20, 40, 70];//units is Watts
        $scope.selectedTransmitPower = $scope.transmitPowers[0];//initialization
        $scope.pingModes = { "modes": ['Sync', 'Auto'], "selectedMode": "Sync" };
        $scope.pingInterval = { "min": 100, "max": 10000, "step": 100, "value": 100 };
        $scope.selectedEchoSounder = { 'detail': {} } //to be used in add echosounder form
        $scope.selectedEchoSounderCount = 0;
        $scope.showEchoSounderBox = true;
        $scope.showStatusArea = true;
        $scope.titleTableCountArray = [1];
        $scope.echosoudersInfo={}
        $scope.changeView = function(hardwareChannel){
            angular.forEach($scope.selectedEchoSounder.transducers,function(value,key){
                if(value.hardware_channel == hardwareChannel){
                    value.view = !value.view;
                }
            })
        }
        
        $scope.changeStatus = function(hardwareChannel){
            angular.forEach($scope.selectedEchoSounder.transducers,function(value,key){
                if(value.hardware_channel == hardwareChannel){
                    value.enable = !value.enable;
                }
            })
        }
        
        $scope.echoSounderIntilization = function () {
            $scope.selectedTransmitPower = $scope.transmitPowers[0];
            $scope.pingModes.selectedMode = $scope.pingModes.modes[0];
            $scope.pingInterval.value = $scope.pingInterval.min;
        }
        
        $scope.showEnabledTransducer = function (transducer) {
            return transducer.enable
        }
        
        $scope.addTransducer = function(){
            $scope.selectedEchoSounder.transducers.push({"name":"","hardware_channel":"","software_channel":"","recording":false,"window":false,"view":false,"enable":false})
        }
        $scope.getConfiguration = function(echosounderName,deviceName){
            $scope.showTransducerContent = false;
            //hardcoding starts
/*            
            var configuration = {"CageEye mk.III":{"4111-0004":{"deviceStatus":true,"transmitPower":40,"pingMode":"Auto","pingInterval":100,"transducers":[{"name":"tet","hardware_channel":1,"software_channel":1,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":2,"software_channel":2,"recording":false,"window":false,"view":false,"enable":false},{"name":"tet","hardware_channel":3,"software_channel":3,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":4,"software_channel":4,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":5,"software_channel":5,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":6,"software_channel":6,"recording":false,"window":false,"view":false,"enable":false}]}},"Merdøye mk.II":{"deviceStatus":true,"transmitPower":20,"transducers":[{"name":"tet","hardware_channel":1,"software_channel":1,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":2,"software_channel":2,"recording":false,"window":false,"view":false,"enable":false},{"name":"tet","hardware_channel":3,"software_channel":3,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":4,"software_channel":4,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":5,"software_channel":5,"recording":false,"window":false,"view":false,"enable":false},{"name":"tete","hardware_channel":6,"software_channel":6,"recording":false,"window":false,"view":false,"enable":false}]}};
            if(deviceName != undefined && Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                configuration = configuration[echosounderName][deviceName];
                $scope.showTransducerContent = true;
            }
            if(!Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                configuration = configuration[echosounderName];
                $scope.showTransducerContent = true;
            }
            if(configuration==undefined){
                $scope.selectedTransmitPower = $scope.transmitPowers[0]
                $scope.pingInterval.value = $scope.pingInterval.min
                $scope.pingModes.selectedMode=$scope.pingModes.modes[0]
                $scope.selectedEchoSounder['transducers'] = []
                $scope.showTransducerContentLoading = false;
                        
            }
            else{
                $scope.selectedTransmitPower = configuration.transmitPower
                $scope.pingInterval.value = configuration.pingInterval
                $scope.pingModes.selectedMode=configuration.pingMode
                $scope.selectedEchoSounder['transducers'] = configuration.transducers
                $scope.showTransducerContentLoading = false;
            }
            
*/            //hardcoding ends
            
            
            //real time code starts
            
            var configuration;
            $scope.showTransducerContentLoading = true;
            deviceListFactory.loadEchosounderConfiguration(function(success){
            
                if(success){
                    if(deviceName != undefined && Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                        configuration =  deviceListFactory.getEchosounderConfiguration()[echosounderName][deviceName];
                        $scope.showTransducerContent = true;
                    }
                    if(!Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                        configuration =deviceListFactory.getEchosounderConfiguration()[echosounderName];
                        $scope.showTransducerContent = true;
                    }
                    if(configuration==undefined){
                        $scope.selectedTransmitPower = $scope.transmitPowers[0]
                        $scope.pingInterval.value = $scope.pingInterval.min
                        $scope.pingModes.selectedMode=$scope.pingModes.modes[0]
                        $scope.selectedEchoSounder['transducers'] = []
                        $scope.showTransducerContentLoading = false;
                                
                    }
                    else{
                        $scope.selectedTransmitPower = configuration.transmitPower
                        $scope.pingInterval.value = configuration.pingInterval
                        $scope.pingModes.selectedMode=configuration.pingMode
                        $scope.selectedEchoSounder['transducers'] = configuration.transducers
                        $scope.showTransducerContentLoading = false;
                    }
                }
                else{
                    //error handling
                    $scope.showTransducerContentLoading = false;
                    $scope.showTransducerContentError = true;
                }
            });


            //real time code ends
        
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
        $scope.changeEchoSounderStatus = function (echosounderName,deviceName) {
            var newStatus;
            if (deviceName==undefined){
                newStatus=! $scope.echosounders[echosounderName].deviceStatus
                $scope.echosounders[echosounderName].deviceStatus="refreshing"
            }
            else{
                newStatus=! $scope.echosounders[echosounderName][deviceName].deviceStatus
                $scope.echosounders[echosounderName][deviceName].deviceStatus="refreshing"
            }
            console.log("changeEchoSounderStatus");
            deviceListFactory.changeStatus($scope.echosounders[echosounderName],echosounderName,deviceName,newStatus,function(echosounder,success){
                 if (success){
                     if (deviceName==undefined){
                        $scope.echosounders[echosounderName] = echosounder[echosounderName]
                        $scope.$apply();
                     }
                     else{
                        $scope.echosounders[echosounderName][deviceName] = echosounder[echosounderName][deviceName]  
                     }
                 }else{
                     if (deviceName==undefined){
                        $scope.echosounders[echosounderName].deviceStatus = "error";
                     }
                     else{
                        $scope.echosounders[echosounderName][deviceName].deviceStatus = "error";  
                     }
                     
                 }  
            })
        //i think i should just send echosounder and deviceName for status change instead of sending entire configration back

/*            angular.forEach($scope.echosounders, function (value, key) {
                if (value.echosounder == echoSounderName) {
                    value.status = !value.status
                    $scope.selectedEchoSounder.detail = value;
                    $scope.$apply()
                    return false;
                }
            })*/
//            $scope.sendDeviceConfig()
        
        }
        
        $scope.sendDeviceConfig = function () {
            //new code 
            debugger;
            $scope.showLoading = true;
            var device;
            if ($scope.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])) {
                device=$scope.selectedEchoSounder.device;
            }
            sendDeviceConfigFactory.sendData($scope.selectedEchoSounder.detail ,device,$scope.selectedTransmitPower, $scope.pingModes.selectedMode, $scope.pingInterval, $scope.selectedEchoSounder.transducers, function (success) {
                if (success) {
                    
                    $scope.showLoading = false;
                    if(deviceName != undefined && Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                        $scope.echosounders[$scope.selectedEchoSounder.detail] = sendDeviceConfigFactory.getStatus()[$scope.selectedEchoSounder.detail]
                    }
                    if(!Array.isArray($scope.echosoudersInfo[$scope.selectedEchoSounder.detail])){
                        $scope.echosounders[$scope.selectedEchoSounder.detail] = sendDeviceConfigFactory.getStatus()[$scope.selectedEchoSounder.detail]
                    }


                    var deviceConfigStatus = sendDeviceConfigFactory.getStatus();
                    $scope.processStatus(deviceConfigStatus, selectedEchoSounderIndex)
                    $scope.showStatusArea = true;
                    $('#selectEchoSounder').modal('hide');
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
            
            
            //new code end
            
            
   /*         
            
            
            var selectedEchoSounder = $scope.selectedEchoSounder.detail
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


            }*/

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
            //return echosounder.selected
            return true;
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
            $scope.showLoading=false;
            $scope.showLoadError=false;
            console.log('add Echosounder');
            var temp;
            //if not already retrived ;make call to factory to get list of echosouder
            //  once you have the list go to modal
            //real time code
            $scope.showLoadError = false;
            $scope.showLoading = true; 

            deviceListFactory.loadData(function (success) {

                if (success) {
                    
                    $scope.showLoading = false;
                    temp=deviceListFactory.getData()
                    $scope.echosoudersInfo=temp;
                    var flag = false;
                    angular.forEach(temp, function (value, key) {
                        console.log(value, key)
                        if (!flag) {
                            $scope.selectedEchoSounder.detail = key;
                            //$scope.type=value;
                            
                            flag = true
                        }
                    });
                    
                } else {

                    $scope.showLoading = false;
                    $scope.showLoadError = true;
                    console.log("There was an error while retrieving device list");

                }
                $scope.$apply();    //this should be here so, that even error cases get applied

            });

            //end of real time code  



            ////hardcoding starts
/*            temp={"CageEye mk.III":["4111-0004", "4111-0005","4C:00:00:03","4C:00:00:04","4C:00:00:05","4C:00:00:06" ],"Merdøye mk.II": "RS232 prototype","EK15": "not available (contact us)"};
            $scope.echosoudersInfo = temp;*/
            //hardcoding ends

/*            var flag = false;
            angular.forEach(temp, function (value, key) {
                console.log(value, key)
                if (!flag) {
                    $scope.selectedEchoSounder.detail = key;
                    //$scope.type=value;
                    
                    flag = true
                }
            });*/
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
        $scope.changeWindowStatus = function (echosounderName,hardwareChannel,deviceName) {
            
            if ($scope.echosounders[echosounderName][deviceName] !== undefined ){
                checkWindow($scope.echosounders[echosounderName][deviceName].transducers);
            }
            else{ 
                checkWindow($scope.echosounders[echosounderName].transducers);
            }
            function checkWindow(transducers){
                angular.forEach(transducers , function (value, key) {
    
                    if (value.hardware_channel == hardwareChannel) {
    
                        var previousWindowStatus = value.window;
                        value.window = "refreshing";
    
                        sendDeviceConfigFactory.changeWindowStatus(echosounderName, value.name, value.hardware_channel, value.software_channel, !previousWindowStatus,
                            function (success, result) {
                                if (success) {
                                    console.log('success')
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

        }
        $scope.changeRecordingStatus = function (echosounderName, hardwareChannel,deviceName) {
            //debugger;
            if ($scope.echosounders[echosounderName][deviceName] !== undefined){
                checkRecording($scope.echosounders[echosounderName][deviceName].transducers);
            }
            else{ 
                checkRecording($scope.echosounders[echosounderName].transducers);
            }
            function checkRecording(transducers){
                angular.forEach(transducers, function (value, key) {
                    if (value.hardware_channel == hardwareChannel) {
    
                        var previousRecordingStatus = value.recording;
                        value.recording = "refreshing";
    
                        sendDeviceConfigFactory.changeRecordingStatus(echosounderName, value.name, value.hardware_channel, value.software_channel, !previousRecordingStatus,
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


        }
        $timeout(function () {
            console.log('timeout');
            
            $('#selectEchoSounder').modal({
                backdrop : 'static',
                keyboard: false,
                show : false
            })
            //hardcode data starts
/*            
            $scope.echosounders={"CageEye mk.III":{"4111-0004":{"deviceStatus":true,"transmitPower":50,"pingMode":"Auto","pingInterval":100,"transducers":[{"name":"tet","hardware_channel":1,"software_channel":1,"recording":false,"window":false},{"name":"tete","hardware_channel":2,"software_channel":2,"recording":false,"window":false},{"name":"tet","hardware_channel":3,"software_channel":3,"recording":false,"window":false},{"name":"tete","hardware_channel":4,"software_channel":4,"recording":false,"window":false},{"name":"tete","hardware_channel":5,"software_channel":5,"recording":false,"window":false},{"name":"tete","hardware_channel":6,"software_channel":6,"recording":false,"window":false}]}},"Merdøye mk.II":{"deviceStatus":true,"transmitPower":20,"transducers":[{"name":"tet","hardware_channel":1,"software_channel":1,"recording":false,"window":false},{"name":"tete","hardware_channel":2,"software_channel":2,"recording":false,"window":false},{"name":"tet","hardware_channel":3,"software_channel":3,"recording":false,"window":false},{"name":"tete","hardware_channel":4,"software_channel":4,"recording":false,"window":false},{"name":"tete","hardware_channel":5,"software_channel":5,"recording":false,"window":false},{"name":"tete","hardware_channel":6,"software_channel":6,"recording":false,"window":false}]}}
            //$scope.echosounders={"CageEye mk.III":{},"Merdøye mk.II": {}}
            angular.forEach($scope.echosounders,function(value,key){
               if( Object.keys(value).length != 0 ){
                   $scope.showEchoSounderBox = false;
               }
            });*/
            
            //hardcoded data ends


            //code to be used in real time
            deviceListFactory.loadEchosounderConfiguration(function(success){
                if(success){
                    $scope.echosounders=deviceListFactory.getEchosounderConfiguration()
                    $scope.titleTableDisplay()
                    angular.forEach($scope.echosounders,function(value,key){
                       if( Object.keys(value).length != 0 ){
                           $scope.showEchoSounderBox = false;
                       }
                    });
                }
                else{
                    $scope.echosounders = {};
                    $scope.showEchoSounderBox= true;
                }
            });
            //real time code end
  

        })


    }]);