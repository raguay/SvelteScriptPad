import main from './main.svelte';

window.onload = function () {
  //
  // Setup Global Variables.
  //
  globalThis.showing = false;
  globalThis.mainwin = null;
  globalThis.tray = null;
  globalThis.oldEvent = null;
  globalThis.defaults = {
    width: 400,
    height: 100
  }

  // 
  // The on blur function to determine if the window should be hidden. Normally,
  // hide the program when the windows is blurred, ie: not focused. But, don't
  // do that during the preferences as that will close the file requestor.
  //
  function onBlurFunction() {
    //
    // Determine if the preferences is being shown.
    //
/*    if(globalThis.mainwin !== null) {
      if(globalThis.showing) {
        //
        // The preferences isn't being shown, hide the 
        // program. 
        //
        globalThis.mainwin.hide();
        globalThis.showing = false;
      }
    }
*/  }

  function onCloseFunction() {
/*    //
    // Hide the window while closing.
    //
    globalThis.mainwin.hide();
    globalThis.mainwin.close(true);
*/  }

  //
  // Save a global copy for debugging.
  //
  globalThis.onBlurFunction = onBlurFunction;
  globalThis.onCloseFunction = onCloseFunction;

  // Add the data to the widgets structure.
  //
  
  //
  // Get the window handler.
  //
  //globalThis.mainwin = window.nw.Window.get();

  //
  // Create the tray icon. The path is from the main directory for the ScriptPad program.
  //
/*  if(window.fs.existsSync('Modules/ScriptBar/img/trayicon-16.png')) {
    globalThis.tray = new nw.Tray({ icon: 'Modules/ScriptBar/img/trayicon-16.png', tooltip: 'ScriptBar' });
  } else {
    globalThis.tray = new nw.Tray({ icon: 'img/trayicon-16.png', tooltip: 'ScriptBar' });
  }
*/
  //
  // Set the tray onclick function for nw.showing and hiding the window.
  //
/*  globalThis.tray.on('click', function(event) {
    if(globalThis.mainwin !== null) {
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
    }
  });
*/
  function adjustWindow(setStdApp, minHeight, minWidth) {
    //
    // Fix the height and width of the window.
    //
/*    if(typeof minHeight !== 'undefined') minHeight = Math.floor(minHeight);
    if(typeof minWidth !== 'undefined') minWidth = Math.floor(minWidth);
    if(!setStdApp) {
      globalThis.mainwin.height = minHeight;
      if(typeof minWidth !== 'undefined') {
        globalThis.mainwin.width = minWidth;
      }
    } else {
      globalThis.mainwin.width = window.preferences.appWidth;
      globalThis.mainwin.height = window.preferences.appHeight;
    }

    //
    // Set the body to the same. Adding 15 pixels to height due
    // to not quite matching the application. Still looking into why.
    //
    globalThis.mainwin.height += 15;
    document.body.width = globalThis.mainwin.width;
    document.body.height = globalThis.mainwin.height;
    window.preferences.appWidth = document.body.width;
    window.preferences.appHeight = document.body.height;
    
    //
    // Adjust the window position if needed.
    //
    if(globalThis.oldEvent !== null) {
      globalThis.mainwin.x = Math.floor(globalThis.oldEvent.x - (globalThis.mainwin.width/2) + 8);
      globalThis.mainwin.y = Math.floor(globalThis.oldEvent.y);
*/    }
  }
  
  //
  // Launch the application.
  //
  const app = new main({
    target: document.body,
    props: {
      onBlur: onBlurFunction,
      onClose: onCloseFunction,
      adjust: adjustWindow
    }
  });
  
  globalThis.appScriptBar = app;
}

export default globalThis.appScriptBar;

