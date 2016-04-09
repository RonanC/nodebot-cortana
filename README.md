# nodebot-cortana
Cortana App and Azure Web Service that connects to the Nodebot program.

## nodebot-cortana.service
### app.js
The nodejs web service.  
It:
- Listens for commands.  
- Listens for robots that want to register.
- Sends commands to robots.
```js
var http = require('http');
var app = require('express')();

var targetSocket;

app.set('port', process.env.PORT);
app.get('/api/command', function (req, res) {
    if (targetSocket) targetSocket.emit('command', req.query.cmd);
    // query: http://commandrobot.azurewebsites.net/api/command?cmd=dance
});

module.exports = app;

var server = http.createServer(app).listen(app.get('port'));

var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('connection from client ' + socket.id);
    socket.on('setTarget', function () {
        console.log('Setting ' + socket.id + ' as target...');
        targetSocket = socket
    });
});
```

## nodebot-cortana.app
### vcd.xml
Defines the voice commands.
```xml
<?xml version="1.0" encoding="utf-8" ?>

<VoiceCommands xmlns="http://schemas.microsoft.com/voicecommands/1.2">

  <CommandSet xml:lang="en-gb" Name="examplevcd">
    <CommandPrefix>Robot</CommandPrefix>
    <Example>Command the robot!</Example>

    <Command Name="command">
      <Example>dance</Example>
      <ListenFor>{command}</ListenFor>
      <Feedback>Commanding...</Feedback>
      <Navigate Target="sendCommand"/>
    </Command>

    <PhraseList Label="command">
      <Item>dance</Item>
      <Item>speak</Item>
      <Item>forward</Item>
      <Item>backward</Item>
      <Item>left</Item>
      <Item>right</Item>
      <Item>stop</Item>
    </PhraseList>

  </CommandSet>

</VoiceCommands>
```

### default.js
This reads the vcd.xml files, loads it into the system registry so that cortana can understand the commands.
```js
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {

        // voice
        var sf = Windows.Storage.StorageFile;
        //var vcm = Windows.Media.SpeechRecognition.;
        var vcm = Windows.ApplicationModel.VoiceCommands.VoiceCommandDefinitionManager;
        sf.getFileFromApplicationUriAsync(new Windows.Foundation.Uri("ms-appx:///vcd.xml"))
            .then(function (file) {
                //vcm.installCommandSetsFromStorageFileAsync(file);
                vcm.installCommandDefinitionsFromStorageFileAsync(file);
                //console.log("file: " + file)
                //console.log("vcm: " + vcm.installedCommandDefinitions.first.toString);
                //Windows.Media.SpeechRecognition.VoiceCommandManager.installCommandSetsFromStorageFileAsync(file);
            });


        if (args.detail.kind === activation.ActivationKind.launch) {
            console.log("if: click launch");
            //WinJS.xhr({ url: 'http://commandrobot.azurewebsites.net/api/command?cmd=clickLaunch' });
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }
            args.setPromise(WinJS.UI.processAll());
        }
        else if (args.detail.kind === activation.ActivationKind.voiceCommand) {
            console.log("else if: voice command launch");
            var command = args.detail.result.semanticInterpretation.properties.command[0];
            WinJS.xhr({ url: 'http://commandrobot.azurewebsites.net/api/command?cmd=' + command }); // + command 
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };

    app.start();
})();
```

### sendCommand.js
This sends the voice command to the web service.
```js
(function () {
    var command = args.detail.result.semanticInterpretation.properties.command[0];
    WinJS.xhr({ url: 'http://commandrobot.azurewebsites.net/api/command?cmd=' + command });
})();
```

### default.html
This is the default, we don't actually need it to open.
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>nodebot_cortana.app</title>

    <!-- WinJS references -->
    <link href="WinJS/css/ui-dark.css" rel="stylesheet" />
    <script src="WinJS/js/base.js"></script>
    <script src="WinJS/js/ui.js"></script>

    <!-- nodebot_cortana.app references -->
    <link href="/css/default.css" rel="stylesheet" />
    <script src="/js/default.js"></script>
</head>
<body class="win-type-body">
    <p>Content goes here</p>
</body>
</html>
```

