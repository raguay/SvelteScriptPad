import main from './main.svelte';

window.onload = function () {
  //
  // Setup Global Variables.
  //
  globalThis.showing = false;
  globalThis.mainwin = window.nw.Window.get();

  globalThis.tray = null;
  globalThis.oldEvent = null;
  globalThis.defaults = {
    width: 400,
    height: 100
  };
  window.preferences = {
    appWidth:  globalThis.defaults.width,  // The default width of the application
    appHeight: globalThis.defaults.height, // The height without any components running
    port: 9978,         // The port that the main ScriptPad app is listening on.
    headerWidth: globalThis.defaults.width,   // placement width for the header
    headerHeight: 10    // Height of the header
  };

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
      if(globalThis.showing) {
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
    globalThis.mainwin.close(true);
  }

  //
  // Save a global copy for debugging.
  //
  globalThis.onBlurFunction = onBlurFunction;
  globalThis.onCloseFunction = onCloseFunction;

  //
  // Create the tray icon. The path is from the main directory for the ScriptPad program.
  //
  if(window.fs.existsSync('Modules/ScriptBar/img/trayicon-16.png')) {
    globalThis.tray = new nw.Tray({ icon: 'Modules/ScriptBar/img/trayicon-16.png', tooltip: 'ScriptBar' });
  } else {
    globalThis.tray = new nw.Tray({ icon: 'img/trayicon-16.png', tooltip: 'ScriptBar' });
  }

  //
  // Set the tray onclick function for nw.showing and hiding the window.
  //
  globalThis.tray.on('click', function(event) {
    if (globalThis.showing) {
      globalThis.mainwin.hide();
      globalThis.showing = false;
    } else {
      //
      // Center the window on the position of the tray icon. We add 8 to get the
      // center of the icon with is 16px.
      //
      if(globalThis.oldEvent === null) globalThis.oldEvent = {};
      globalThis.oldEvent.x = event.x;
      globalThis.oldEvent.y = event.y;
      adjustWindow(true);
      globalThis.mainwin.show();
      globalThis.mainwin.focus();
      globalThis.showing = true;
    }
  });

  function adjustWindow(setStdApp, minHeight, minWidth) {
    //
    // Fix the height and width of the window.
    //
    if((typeof minHeight !== 'undefined')&&(!isNaN(minHeight))) {
      minHeight = Math.floor(minHeight);
    } else {
      minHeight = 100;
    }
    if((typeof minWidth !== 'undefined')&&(!isNaN(minWidth))) {
      minWidth = Math.floor(minWidth);
    } else {
      minWidth = null;
    }
    if(!setStdApp) {
      globalThis.mainwin.height = parseInt(minHeight);
      if(minWidth !== null) {
        globalThis.mainwin.width = minWidth;
      }
    } else {
      if(window.preferences.appWidth !== null) globalThis.mainwin.width = window.preferences.appWidth;
      if(window.preferences.appHeight !== null) globalThis.mainwin.height = window.preferences.appHeight;
    }

    //
    // Set the body to the same. 
    //
    window.preferences.appWidth = globalThis.mainwin.width;
    window.preferences.appHeight = globalThis.mainwin.height;
    
    //
    // Adjust the window position if needed.
    //
    if(globalThis.oldEvent !== null) {
      globalThis.mainwin.x = Math.floor(globalThis.oldEvent.x - (globalThis.mainwin.width/2) + 8);
      globalThis.mainwin.y = Math.floor(globalThis.oldEvent.y);
    }
  }
  
  //
  // Launch the application.
  //
  const app = new main({
    target: document.body,
    props: {
      onBlur: onBlurFunction,
      onClose: onCloseFunction,
      adjust: adjustWindow,
      prefs: window.preferences
    }
  });
  
  globalThis.appScriptBar = app;
}

export default globalThis.appScriptBar;

