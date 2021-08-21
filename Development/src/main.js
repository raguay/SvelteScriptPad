import ScriptPad from './ScriptPad.svelte';
import ScriptPadInternal from './modules/ScriptPadInternal.js';

window.onload = function () {
  //
  // Setup Global Variables.
  //
  globalThis.showing = false;
  globalThis.Server = null;
  globalThis.mainwin = null;
  globalThis.tray = null;
  globalThis.preferences = {};
  globalThis.style = {};
  globalThis.styleList = ['default'];
  globalThis.ScriptPadInternal = ScriptPadInternal;

  ///
  // Get the window handler.
  //
  let nw = globalThis.ScriptPadInternal.nw;
  globalThis.mainwin = nw.Window.get();

  //
  // Get the editor themes list.
  //
  globalThis.preferences = globalThis.ScriptPadInternal.readPreferencesFile();
  globalThis.style = globalThis.ScriptPadInternal.getStyleFile(globalThis.preferences.style);

  //
  // Create the tray icon.
  //
  globalThis.tray = new nw.Tray({ icon: 'scriptpad/imgs/trayicon-16.icns', tooltip: 'ScriptNote' });

  //
  // Set the tray onclick function for nw.showing and hiding the window.
  //
  globalThis.tray.on('click', function(event) {
    if(globalThis.mainwin !== null) {
      if (globalThis.showing) {
        globalThis.mainwin.hide();
        globalThis.showing = false;
      } else {
        //
        // Center the window on the position of the tray icon.
        //
        globalThis.mainwin.x = event.x - 233;
        globalThis.mainwin.y = event.y;
        globalThis.mainwin.show();
        globalThis.mainwin.focus();
        globalThis.showing = true;
      }
    }
  });

  // 
  // The on blur function to determine if the window should be hidden. Normally,
  // hide the program when the windows is blurred, ie: not focused. But, don't
  // do that during the preferences as that will close the file requestor.
  //
  function onBlurFunction() {
    //
    // Determine if the preferences is being shown.
    //
    if(globalThis.mainwin !== null) {
      var ans = globalThis.mainwin.eval(null,"window.Pref");
      if(!ans || !globalThis.showing) {
        //
        // The preferences isn't being shown, hide the 
        // program. 
        //
        globalThis.mainwin.hide();
        globalThis.showing = false;
      }
    }
  }

  function onCloseFunction() {
    //
    // Hide the window while closing.
    //
    globalThis.mainwin.hide();

    //
    // Run the close window.
    //
    globalThis.ScriptPadInternal.quit();
  }

  globalThis.Pref = false;
  globalThis.onBlurFunction = onBlurFunction;
  globalThis.onCloseFunction = onCloseFunction;

  //
  // Start the different modules.
  //
  globalThis.moduleWin = null;
  var moduleDir = fs.readdirSync(ScriptPadInternal.SERVERLOCATION + "/Modules");
  globalThis.moduleWin = new Array();
  var modNum = moduleDir.length;
  for(var i = 0; i < modNum; i++) {
    //
    // Local the module preferences in the package.json file.
    //
    const modwin = {
      name: moduleDir[i],
      path: ScriptPadInternal.SERVERLOCATION + "/Modules/" + moduleDir[i],
      description: "",
      win: null,
      live: false
    }; 

    if(ScriptPadInternal.fs.existsSync("Modules/" + moduleDir[i] + "/package.json")) {
      const data = JSON.parse(ScriptPadInternal.fs.readFileSync("Modules/" + moduleDir[i] + "/package.json"));
      modwin.name = data.name;
      modwin.description = data.description;
      if(data.autoload) {
        var index = i;
        const windowProps = data.window;
        windowProps.new_instance = true;
        modwin.live = true;
        nw.Window.open("chrome-extension://" + chrome.runtime.id + "/Modules/" + moduleDir[i] + "/index.html",
                       windowProps, (win) => {
          //
          // Save the new window variable.
          //
          globalThis.moduleWin[index].win = win;
        });
      }
      globalThis.moduleWin[i] = modwin;
    }
  }

  //
  // last of all, create and launch the Svelte application.
  //
  const app = new ScriptPad({
    target: document.body,
    props: {
      prefs: globalThis.preferences,
      styles: globalThis.style,
      ScriptPad: globalThis.ScriptPadInternal,
      onBlur: onBlurFunction,
      onClose: onCloseFunction
    }
  });

  globalThis.appScriptPad = app;
}

export default globalThis.appScriptPad;

