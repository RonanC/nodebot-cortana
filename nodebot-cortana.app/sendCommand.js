(function () {
    var command = args.detail.result.semanticInterpretation.properties.command[0];
    WinJS.xhr({ url: 'http://commandrobotapi.azurewebsites.net/api/command?cmd=' + command });
})();