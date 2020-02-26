const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7000 });
var md5 = require('md5');
var clearToken  = 'mysupersecrettoken'
var token = md5(clearToken)
var sessionId = '8bfc26de-754b-4c1f-9771-acfd1a7da02c'
var subscriptions = []
var _ws = ''
var trained_facial = [
    {
        "action": "neutral",
        "times": 5
    },
    {
        "action": "surprise",
        "times": 5
    },
    {
        "action": "frown",
        "times": 5
    },
    {
        "action": "smile",
        "times": 5
    }
]
var trained_mental = [
    {
        "action": "neutral",
        "times": 5
    },
    {
        "action": "push",
        "times": 5
    },
    {
        "action": "left",
        "times": 5
    },
    {
        "action": "right",
        "times": 5
    }
]
var facialTimer
var metnalTimer


/**
 * Shows details of any headsets connected to the device via USB dongle, USB cable, or Bluetooth. 
 * @param {id} num 
 */
function queryHeadsets(num) {
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": [
            {
                "connectedBy": "dongle",
                "customName": "",
                "dongle": "6ff",
                "firmware": "625",
                "id": "EPOCPLUS-3B9AXXXX",
                "motionSensors": [
                    "GYROX",
                    "GYROY",
                    "GYROZ",
                    "ACCX",
                    "ACCY",
                    "ACCZ",
                    "MAGX",
                    "MAGY",
                    "MAGZ"
                ],
                "sensors": [
                    "AF3",
                    "F7",
                    "F3",
                    "FC5",
                    "T7",
                    "P7",
                    "O1",
                    "O2",
                    "P8",
                    "T8",
                    "FC6",
                    "F4",
                    "F8",
                    "AF4"
                ],
                "settings": {
                    "eegRate": 256,
                    "eegRes": 16,
                    "memsRate": 64,
                    "memsRes": 16,
                    "mode": "EPOCPLUS"
                },
                "status": "connected"
            }
        ]
    }
    return JSON.stringify(res)
}

/**
 * Get the current logged in user.
 * @param {id} num 
 */
function getUserLogin(num) {
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": [{
            "currentOSUId":"501",
            "currentOSUsername":"nicola-sabino94",
            "lastLoginTime": "2019-11-28T12:09:17.300+07:00",
            "loggedInOSUId":"501",
            "loggedInOSUsername":"nicola-sabino94",
            "username":"nicola-sabino94"
        }]
    }
    return JSON.stringify(res)
}

/**
 * Check if your application has been granted access rights or not in EMOTIV App.
 * @param {id} num 
 */
function hasAccessRight(num) {
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "accessGranted":true,
            "message":"The User has granted access right to this application."
        }
    }
    return JSON.stringify(res)
}
/**
 * This method is to generate a Cortex access token. 
 * Most of the methods of the Cortex API require this token as a parameter.
 * @param {id} num 
 */
function authorize(num) {
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "cortexToken": token,
        }
    }
    return JSON.stringify(res)
}

/**
 * This method is to open a session with an EMOTIV headset.
 * @param {id} num 
 * @param {parameters} params 
 */
function createSession(num,params){
    if (params.cortexToken !== token) return '' // wrong token
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "appId": "xavier",
            "headset": {
                "connectedBy": "dongle",
                "customName": "",
                "dongle": "6ff",
                "firmware": "625",
                "id": "EPOCPLUS-3B9AXXXX",
                "motionSensors": [
                    "GYROX",
                    "GYROY",
                    "GYROZ",
                    "ACCX",
                    "ACCY",
                    "ACCZ",
                    "MAGX",
                    "MAGY",
                    "MAGZ"
                ],
                "sensors": [
                    "AF3",
                    "F7",
                    "F3",
                    "FC5",
                    "T7",
                    "P7",
                    "O1",
                    "O2",
                    "P8",
                    "T8",
                    "FC6",
                    "F4",
                    "F8",
                    "AF4"
                ],
                "settings": {
                    "eegRate": 256,
                    "eegRes": 16,
                    "memsRate": 64,
                    "memsRes": 16,
                    "mode": "EPOCPLUS"
                },
                "status": "connected"
            },
            "id": sessionId,
            "license": "",
            "owner": "nicola-sabino94",
            "recordIds": [],
            "recording": false,
            "started": "dont care :D",
            "status": "opened",
            "stopped": "",
            "streams": []
        }
    }
    return JSON.stringify(res)
}

/**
 * This method returns the list of all the training profiles of the user.
 * @param {id} num 
 * @param {parameters} params 
 */
function queryProfile(num,params){
    if (params.cortexToken !== token) return '' // wrong token
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": [
            {"name":"pippo"},
            {"name":"pluto"},
            {"name":"paperino"},
            {"name":"userXavier"}
        ]
    }
    return JSON.stringify(res)
}

/**
 * This method is to manage the training profiles of the user.
 * @param {id} num 
 * @param {parameters} params 
 */
function setupProfile(num,params) {
    if (params.cortexToken !== token) return '' // wrong token
    var res

    if(params.started === 'create')
        res = {
        "id": num,
        "jsonrpc": "2.0",
            "result": {
                "action": "create",
                "message": "...",
                "name": params.profile
            }
        }

    if(params.status === 'load')
    res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "action": "load",
            "message": "The profile is loaded successfully",
            "name": params.profile
        }
    }

    if(params.status === 'save')
    res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "action": "save",
            "message": "The profile is saved successfully",
            "name": params.profile
        }
    }
    return JSON.stringify(res)
}

function getTrainedSignatureActions(num,params) {
    if (params.cortexToken !== token) return '' // wrong token
    var res = 'wrong detection type'
    if(params.detection === 'mentalCommand')
        res = {
            "id": num,
            "jsonrpc": "2.0",
            "result": {
                "totalTimesTraining": 12,
                "trainedActions": trained_mental
            }
        }

    if(params.detection === 'facialExpression')
        res = {
            "id": num,
            "jsonrpc": "2.0",
            "result": {
                "totalTimesTraining": 12,
                "trainedActions": trained_facial
            }
        }
    return JSON.stringify(res)
}

/**
 * This method is to activate or close a session.
 * @param {id} num 
 * @param {params} params 
 */
function updateSession(num,params) {
    if (params.cortexToken !== token) return '' // wrong token
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "appId": "xavier",
            "headset": {
                "connectedBy": "dongle",
                "customName": "",
                "dongle": "6ff",
                "firmware": "925",
                "id": "INSIGHT-5A68XXXX",
                "motionSensors": [
                    "GYROX",
                    "GYROY",
                    "GYROZ",
                    "ACCX",
                    "ACCY",
                    "ACCZ",
                    "MAGX",
                    "MAGY",
                    "MAGZ"
                ],
                "sensors": [
                    "AF3",
                    "T7",
                    "Pz",
                    "T8",
                    "AF4"
                ],
                "settings": {
                    "eegRate": 128,
                    "eegRes": 14,
                    "memsRate": 128,
                    "memsRes": 14,
                    "mode": "UNKNOWN"
                },
                "status": "connected"
            },
            "id": sessionId,
            "license": "xxx",
            "owner": "jon.snow",
            "recordIds": [
                "d8fe7658-71f1-4cd6-bb5d-f6775b03438f"
            ],
            "recording": false,
            "started": "2019-06-06T11:41:53.168+07:00",
            "status": "closed",
            "stopped": "2019-06-06T11:42:23.531+07:00",
            "streams": []
        }
    }
    return JSON.stringify(res);
}

function subscribe(num, params) {
    if (params.cortexToken !== token) return 'wrong token' // wrong token
    var streams = params.streams
    if(streams.length < 1) return 'no streams'

    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "failure": [],
            "success": []
        }
    }

    // 1. subscribe 
    for(var index = 0; index < streams.length; index++) {
        // define the response message
        var stream = {
            'sid' : sessionId,
            'streamName': streams[index]
        }
        res.result.success.push(stream)

    }

    if(streams.includes('fac')) {
        
        // sart streaming facial commands
        var counter = 0;
        facialTimer = setInterval(() => {
            if(counter == 4) counter = 0
            var jsonObject = trained_facial[counter]
            var command = jsonObject.action
            var fac
            if(counter == 0) fac = ['neutral', 'neutral', 0, 'smile', Math.random()]
            if(counter == 1) fac = ['neutral', 'frown', Math.random(), 'neutral', 0]
            if(counter == 2) fac = ['neutral', 'surprise', Math.random(), 'neutral', 0]
            if(counter == 3) fac = ['neutral', 'neutral', 0 , 'neutral', 0]
            var resp = {
                "fac": fac,
                "sid": sessionId,
                "time": Date.now()
            }
            _ws.send(JSON.stringify(resp))
            counter++
        },1000)
    }

    if(streams.includes('com')) {
        var counter = 0
        metnalTimer = setInterval(() => {
            if(counter == trained_facial.length) counter = 0
            var jsonObject = trained_mental[counter]
            var command = jsonObject.action
            var resp = {
                "com":[command , Math.random()],
                "sid": sessionId,
                "time": Date.now()
            }
            _ws.send(JSON.stringify(resp))
            counter++
        },1000)
    }

    return JSON.stringify(res)
    
}

function training(num, params) {
    if (params.cortexToken !== token) return 'wrong token' // wrong token

    var res = ''
    if(params.status === 'start'){
        res = {
            "id": num,
            "jsonrpc": "2.0",
            "result": {
                "action": params.action,
                "message": "Set up training successfully",
                "status": "start"
            }
        }

        // started event
        setTimeout(() => {
            var resp = {
                "sid": sessionId,
                "sys":[params.detection,"XX_Started"],
                "time": Date.now()
            }
            console.log('[ EVENT ] started')
            _ws.send(JSON.stringify(resp))
        },2000)

        // succeeded event
        setTimeout(() => {
            var resp = {
                "sid": sessionId,
                "sys":[params.detection,"XX_Succeeded"],
                "time": Date.now()
            }
            _ws.send(JSON.stringify(resp))
            console.log('[ EVENT ] succeeded')
        },8000)

    }else if(params.status === 'accept') {
        res = {
            "id": num,
            "jsonrpc": "2.0",
            "result": {
                "action": params.action,
                "message": "Set up training successfully",
                "status": "accept"
            }
        }
        setTimeout(() => {
            var resp = {
                "sid": sessionId,
                "sys":[params.detection,"XX_Completed"],
                "time": Date.now()
            }
            _ws.send(JSON.stringify(resp))
            console.log('[ EVENT ] completed')
        },1000)
    }

    return JSON.stringify(res)
    
}

function unsubscribe(num, params) {
    if (params.cortexToken !== token) return 'wrong token' // wrong token
    var streams = params.streams
    if(streams.length < 1) return 'no streams'

    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": {
            "failure": [],
            "success": []
        }
    }

    if(streams.includes('fac')){
        clearInterval(facialTimer)
    }

    if(streams.includes('com')){
        clearInterval(metnalTimer)
    }

    for(var index = 0; index < streams.length; index++) {
        // define the response message
        var stream = {
            'streamName': streams[index]
        }
        res.result.success.push(stream)

    }

    return JSON.stringify(res)
}

/**
 * This method returns the skill ratting of a mental command action,
 * or the overall mental command kill ratting.
 * @param {id} num 
 * @param {parameters} params 
 */
function mentalCommandGetSkillRating(num,params) {
    if (params.cortexToken !== token) return 'wrong token' // wrong token
    var res = {
        "id": num,
        "jsonrpc": "2.0",
        "result": 0.1
    }
    return JSON.stringify(res)
}


wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    
    _ws = ws

    console.log('received: %s', message);
    // transform the message in a json object
    var jsonObject = JSON.parse(message)
    var id = jsonObject.id
    var method = jsonObject.method
    var params = jsonObject.params
    var res = 'undefined method for mocked API'
    if(method === 'queryHeadsets')                  res = queryHeadsets(id)
    if(method === 'getUserLogin')                   res = getUserLogin(id)
    if(method === 'hasAccessRight')                 res = hasAccessRight(id)
    if(method === 'authorize')                      res = authorize(id)
    if(method === 'createSession')                  res = createSession(id,params)
    if(method === 'queryProfile')                   res = queryProfile(id,params)
    if(method === 'setupProfile')                   res = setupProfile(id,params)
    if(method === 'getTrainedSignatureActions')     res = getTrainedSignatureActions(id,params)
    if(method === 'updateSession')                  res = updateSession(id,params)
    if(method === 'subscribe')                      res = subscribe(id,params)
    if(method === 'training')                       res = training(id,params)
    if(method === 'unsubscribe')                    res = unsubscribe(id, params)
    if(method === 'mentalCommandGetSkillRating')    res = mentalCommandGetSkillRating(id,params)

    console.log('send: %s', res);
    console.log('_______________________________________')
    ws.send(res)
  });
 
  ws.send('-- Mocked API --');
});