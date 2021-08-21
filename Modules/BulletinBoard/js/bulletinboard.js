const express = require('express')
const bodyParser = require('body-parser')
const os = require('os')
const fs = require('fs')

//
// Setup globals.
//
globalThis.BBData = null;
globalThis.BBDataFILE = os.homedir() + '/.scriptpad/bulletinBoard.json';
globalThis.BullentinBoardServer = null;
globalThis.BullentinBoard = null;
globalThis.BBCurrentMSG = "";
globalThis.BBhidden = true;
globalThis.BullentinBoard = nw.Window.get();

//
// When the window is loaded, create the server.
//
function startServer() {
    //
    // Name:          BulletinBoardServer
    //
    // Description:   This is the server for running my bulletin board for
    //                display information to me.
    //

    //
    // Create the Express application and set all middleware.
    //
    globalThis.BBapp = express()

    //
    // This block is for securing the api. Only requests from
    // the exact same local computer will be allowed. All others
    // will just be ignored.
    //
    globalThis.BBapp.use('/api', (req, res, next) => {

        //
        // We need to do some security checking on all the other, non-API calls.
        //
        var okay = true
        var requesterIP = req.ip.split('.')
        var localIP = req.connection.localAddress.split('.')
        if ((requesterIP[0] === localIP[0]) && (requesterIP[1] === localIP[1]) && (requesterIP[2] === localIP[2]) && (requesterIP[3] === localIP[3])) {
            //
            // Okay, the request is from our computer. You can allow it.
            //
            okay = true
        } else {
            okay = false
        }
        //
        // If okay is true, proceed. Otherwise, just drop out.
        //
        if (okay) {
            next()
        }
    })

    //
    // If not already stopped, process the body as JSON.
    //
    // for parsing application/json
    globalThis.BBapp.use(bodyParser.json())

    // for parsing application/x-www-form-urlencoded
    globalThis.BBapp.use(bodyParser.urlencoded({
        extended: true
    }))

    //
    // Setup global variables.
    //
    globalThis.BBapp.route('/api/message/append/:message').get((req, res, next) => {
        //
        // See if we need to make it bigger.
        //
        globalThis.BBCurrentMSG += req.params.message
            //
            // Set the message into the html.
            //
        document.getElementById('message').textContent = globalThis.BBCurrentMSG
            //
            // Fix the window size.
            //
        resizeWindow();
        //
        // If hidden, make sure the user can see the change.
        //
        if (globalThis.BBhidden) {
            globalThis.BullentinBoard.show()
            globalThis.BBhidden = false
        }
        //
        // Make the window blur.
        //
        globalThis.BullentinBoard.blur()
            //
            // Tell the person that sent it that we got it okay.
            //
        res.send("okay")
    });

    globalThis.BBapp.route('/api/message/:message').get((req, res, next) => {
        //
        // See if we need to make it bigger.
        //
        globalThis.BBCurrentMSG = req.params.message;
        //
        // Set the message into the html.
        //
        document.getElementById('message').textContent = globalThis.BBCurrentMSG
            //
            // Make sure the window is not hidden.
            //
            //
        if (globalThis.BBCurrentMSG === '-') {
            globalThis.BullentinBoard.hide();
            globalThis.BBhidden = true;
        } else {
            if (globalThis.BBhidden) {
                globalThis.BullentinBoard.show()
                globalThis.BBhidden = false
            }
        }
        //
        // Resize the window
        //
        resizeWindow();
        //
        // Make the window blur.
        //
        globalThis.BullentinBoard.blur()
            //
            // Tell the person that sent it that we got it okay.
            //
        res.send("okay")
    });

    //
    // this route is for clearing the message board.
    //
    globalThis.BBapp.route('/api/message/').get((req, res, next) => {
        //
        // Set the message into the html.
        //
        document.getElementById('message').textContent = ''
        globalThis.BBCurrentMSG = ''
            //
            // Resize the Window.
            //
        resizeWindow();
        if (document.getElementById('dialog').innerHTML == '') {
            globalThis.BullentinBoard.hide();
            globalThis.BBhidden = true;
        } else {
            globalThis.BullentinBoard.blur();
        }
        //
        // Tell the person that sent it that we got it okay.
        //
        res.send("okay")
    });

    //
    // This is for user defined dialogs pushed to the server. The
    // server here just does the barebones for functionality. The
    // user sends all the inner workings of a dialog.
    //
    // Functionality:
    //
    // The user does a put request with a JSON object containing the
    // element "html" which contains all the code for the dialog.
    //
    // The user script has to put the results into globalThis.BBData.dialogResult
    // as a string. Then the user script has to call globalThis.BBData.callBack()
    // to return the results and clear up the display.
    //
    globalThis.BBapp.route('/api/dialog').put((req, res, next) => {
        globalThis.BBData.dialogStore.dialog = req.body;
        globalThis.BBData.dialogStore.callBack = function() {
            //
            // Give the results to the user.
            //
            res.send(globalThis.BBData.dialogStore.dialogResult);
            //
            // Reset the window position if the dialog
            // moved it.
            //
            if ((globalThis.BBData.dialogStore.dialog.x > 0) || (globalThis.BBData.dialogStore.dialog.y > 0)) {
                globalThis.BullentinBoard.x = globalThis.BBData.defaultX;
                globalThis.BullentinBoard.y = globalThis.BBData.defaultY;
            }
            //
            // clear out for the next one.
            //
            globalThis.BBData.dialogStore.dialog = null;
            globalThis.BBData.dialogStore.callBack = null;
            globalThis.BBData.dialogStore.dialogResult = "";
            document.getElementById('dialog').innerHTML = "";
            if (document.getElementById('message').innerHTML == "") {
                globalThis.BullentinBoard.hide();
                globalThis.BBhidden = true;
            }
            resizeWindow();
        };

        //
        // Get the user's dialog, insert it, and execute the code in it.
        //
        insertAndExecute('dialog', globalThis.BBData.dialogStore.dialog.html);

        //
        // Resize the window.
        //
        resizeWindow();

        //
        // Make sure the window is not hidden.
        //
        if (globalThis.BBhidden) {
            globalThis.BullentinBoard.show()
            globalThis.BBhidden = false
        } else {
            globalThis.BullentinBoard.focus()
        }
    });

    //
    // Quit server and exit.
    //
    globalThis.BBapp.route('/api/quit').get((req, res, next) => {
        globalThis.BullentinBoardServer.close()
        globalThis.BullentinBoard.close(true);
        nw.App.quit();
    });

    //
    // Kill any other requests.
    //
    globalThis.BBapp.use('/', (req, res, next) => {
        console.log("Illegal Request.")
    })

    //
    // Get the defaults.
    //
    getDefaults();
}



window.onload = () => {
    setTimeout(startServer, 3000);
}

function setupWindow() {
    //
    // Set to the absolute minimums and defaults.
    //
    globalThis.BullentinBoard.width = globalThis.BBData.minWidth;
    globalThis.BullentinBoard.height = globalThis.BBData.minHeight;
    globalThis.BullentinBoard.x = globalThis.BBData.defaultX;
    globalThis.BullentinBoard.y = globalThis.BBData.defaultY;

    //
    // Make this window always on top.
    //
    globalThis.BullentinBoard.setAlwaysOnTop(true);
    //globalThis.BullentinBoard.setShowInTaskbar(false);

    //
    // When the user closes the window, just hide it.
    //
    document.getElementById("title-button-close").onclick = function() {
        //
        // Just hide the window.
        //
        globalThis.BullentinBoard.hide();
        globalThis.BBhidden = true;
    }
    globalThis.BullentinBoard.on('close', () => {
        //
        // Just hide the window.
        //
        globalThis.BullentinBoard.hide();
        globalThis.BBhidden = true;

        globalThis.BullentinBoardSehhrver.quit()
        globalThis.BullentinBoard.close(true);
        nw.App.quit();
    });

    //
    // Start the server.
    //
    try {
        globalThis.BullentinBoardServer = globalThis.BBapp.listen(9697, () => {
            console.log('BulletinBoard Server is running!')
        })
    } catch (e) {
        console.log(e)
    }
}

//
// Function:    readBBPreferencesFile
//
// Description: This will read the preferences file into
//              the global data structure.
//
function readBBPreferencesFile() {
    if (globalThis.BBData === null) {
        //
        // Preferences haven't been loaded yet. Load them if the
        // file has been created or create the defaults otherwise.
        //
        if (fs.existsSync(globalThis.BBDataFILE)) {
            //
            // There are preferences already. Load them.
            //
            globalThis.BBData = JSON.parse(fs.readFileSync(globalThis.BBDataFILE, 'utf8'))
            globalThis.BBData.dialogStore = {
                dialog: null,
                callBack: null,
                dialogResult: ""
            }
            globalThis.BBData.messageStore = ""
        } else {
            //
            // Preferences haven't been created yet. Give some defaults.
            //
            globalThis.BBData = {}
            globalThis.BBData.dialogStore = {
                dialog: null,
                callBack: null,
                dialogResult: ""
            }
            globalThis.BBData.messageStore = {}
            globalThis.BBData.minWidth = 170
            globalThis.BBData.minHeight = 25
            globalThis.BBData.defaultX = 0
            globalThis.BBData.defaultY = 0

            //
            // Create the preferences file.
            //
            writeBBPreferencesFile()
        }
    }
}

//
// Function:    writeBBPreferencesFile
//
// Description: This will write the global preferences
//              to it's file.
//
function writeBBPreferencesFile() {
    fs.writeFileSync(globalThis.BBDataFILE, JSON.stringify(globalThis.BBData), 'utf-8', 0o666, 'w+')
}

//
// The following code comes from https://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml
//
function insertAndExecute(id, text) {
    domelement = document.getElementById(id);
    domelement.innerHTML = text;
    var scripts = [];
    ret = domelement.childNodes;
    for (var i = 0; ret[i]; i++) {
        if (scripts && nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
            scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
        }
    }
    for (script in scripts) {
        evalScript(scripts[script]);
    }
}

function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
}

function evalScript(elem) {
    data = (elem.text || elem.textContent || elem.innerHTML || "");
    var head = document.getElementsByTagName("head")[0] || document.documentElement,
        script = document.createElement("script");
    script.type = "text/javascript";
    script.appendChild(document.createTextNode(data));
    head.insertBefore(script, head.firstChild);
    head.removeChild(script);
    if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }
}

//
// End of code taken from a StackOverflow question.
//

//
// Taken from https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
//
// Handy JavaScript to meature the size taken to render the supplied text;
// you can supply additional style information too if you have it.
//
function measureText(elem, pText, pFontSize, pStyle) {
    var lDiv = document.createElement(elem);
    document.body.appendChild(lDiv);
    if (pStyle != null) {
        lDiv.style = pStyle;
    }
    lDiv.style.fontFamily = 'Lucida Console, Monaco, monospace';
    lDiv.style.fontSize = pFontSize + "px";
    lDiv.style.position = "absolute";
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;
    lDiv.innerHTML = pText;
    var lResult = {
        width: lDiv.clientWidth,
        height: lDiv.clientHeight
    };
    document.body.removeChild(lDiv);
    lDiv = null;
    return lResult;
}
//
// End of code taken from a StackOverflow question.
//

function resizeWindow() {
    var messageEl = document.getElementById('message');
    var dialogEl = document.getElementById('dialog');
    var width = globalThis.BBData.minWidth;
    var height = globalThis.BBData.minHeight;
    if (messageEl.innerHTML != "") {
        var messageSize = measureText('h2', messageEl.textContent, 24, "margin: 0px; padding: 0px; font-size: 24px; font-family: Lucida Console, Monaco, monospace; margin: 33px 5px 5px 5px")
            //
            // Add 20 to the message height to account for padding around.
            // Add 30 to the width for the padding as well.
            //
        if (dialogEl.innerHTML == "") {
            height += messageSize.height + 20;
        } else {
            height += messageSize.height;
        }
        var newWidth = messageSize.width + 30;
        if (newWidth > width) {
            width = newWidth;
        }
    }
    if (dialogEl.innerHTML != "") {
        height += globalThis.BBData.dialogStore.dialog.height;
        if (globalThis.BBData.dialogStore.dialog.width > width) {
            width = globalThis.BBData.dialogStore.dialog.width;
        }
        //
        // See if the dialog wants to be at a particular
        // position. If so, move it there.
        //
        if ((globalThis.BBData.dialogStore.dialog.y > 0) || (globalThis.BBData.dialogStore.dialog.x > 0)) {
            //
            // Okay, move it there.
            //
            globalThis.BullentinBoard.y = globalThis.BBData.dialogStore.dialog.y;
            globalThis.BullentinBoard.x = globalThis.BBData.dialogStore.dialog.x;
        }
    }
    //
    // Okay, set the final size of the window.
    //
    globalThis.BullentinBoard.height = height;
    globalThis.BullentinBoard.width = width;
}

//
// Function:     getDefaults
//
// Description:  This function gets the preferences for the
//               BulletinBoard. TODO: load from file.
//
function getDefaults() {
    //
    // Get defaults.
    //
    readBBPreferencesFile();

    //
    // Setup the window
    //
    setupWindow();
}