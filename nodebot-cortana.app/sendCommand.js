(function () {
    var command = args.detail.result.semanticInterpretation.properties.command[0];
    WinJS.xhr({ url: 'http://commandrobot.azurewebsites.net/api/command?cmd=' + command });
})();