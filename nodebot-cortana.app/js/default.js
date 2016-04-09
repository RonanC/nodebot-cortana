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
            //WinJS.xhr({ url: 'http://commandmonkeyapi.azurewebsites.net/api/command?cmd=clickLaunch' });
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
            WinJS.xhr({ url: 'http://commandmonkeyapi.azurewebsites.net/api/command?cmd=' + command }); // + command 
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };

    app.start();
})();
