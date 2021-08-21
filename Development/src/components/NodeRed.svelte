<div id="codered" class="{visible ? 'show' : 'hide'}" style="background-color: {styles.editorBackground}; color: {styles.textcolor};">
  <div id="history" bind:this={historyDiv} >
    {@html history }
  </div>
  <div id="redStatus">
    {#if live}
      <span class="status">
        running...
      </span>
    {:else}
      <span class="status">
        stopped.
      </span>
    {/if}
    {#if ScriptPad.PREFERENCES.REDDashboard}
      <div id='dashboardBut' on:click="{() => { openDashboard(); }}" >
        Dashboard
      </div>
    {/if}
    <div id='editFlowBut' on:click="{() => { openEditor(); }}" >
      Edit Flows
    </div>
    <div id='ssbut' class="{live ? 'liveColor' : 'deadColor'}" on:click="{() => { StopStartRed(); }}" >
      {#if live}
        Stop
      {:else}
        Start
      {/if}
    </div>
  </div>
</div>

<style>
  #codered {
    position: absolute;
    display: flex;
    flex-direction: column;
    height: 386px;
    width: 466px;
    resize: none;
    font-size: 15px;
    box-shadow: inset 0px 0px 5px 2px black;
    padding: 7px;
    margin: 0px;
    -webkit-transition: 1.0s ease-in-out;
    -moz-transition: 1.0s ease-in-out;
    -o-transition: 1.0s ease-in-out;
    transition: 1.0s ease-in-out;      
    -webkit-user-select: none;        
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    caret-color: transparent;
    z-index: 91;
  }

  #redStatus {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 32px;
    border-radius: 0px 0px 10px 10px;
  }

  #history {
    width: 460px;
    height: 330px;
    margin: 0px 0px 10px 0px;
    padding: 10px;
    overflow: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #dashboardBut {
    display: inline-block;
    padding: 0px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    height: 20px;
    border-radius: 20px;
    padding: 5px 10px;
    margin: 0px 10px 0px 10px;
    text-align: center;
    float: right;
    background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
    border-radius:10px;
    border:1px solid #4e6096;
    color:#ffffff;
    font-size:14px;
    text-decoration:none;
    text-shadow:0px 1px 0px #283966;
    flex-basis: 100%;
  }

  #editFlowBut {
    display: inline-block;
    padding: 0px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    height: 20px;
    border-radius: 20px;
    padding: 5px 10px;
    margin: 0px 10px 0px 10px;
    text-align: center;
    float: right;
    background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
    border-radius:10px;
    border:1px solid #4e6096;
    color:#ffffff;
    font-size:14px;
    text-decoration:none;
    text-shadow:0px 1px 0px #283966;
    flex-basis: 100%;
  }

  #editFlowBut:hover {
    background:linear-gradient(to bottom, #476e9e 5%, #7892c2 100%);
  }

  #editFlowBut:active {
    position:relative;
    top:1px;
  }

  #ssbut {
    display: inline-block;
    padding: 0px;
    margin: 0px 5px 0px 0px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    height: 20px;
    border-radius: 20px;
    padding: 5px 10px;
    text-align: center;
    float: right;
    background:linear-gradient(to bottom, #7892c2 5%, #476e9e 100%);
    border-radius:10px;
    border:1px solid #4e6096;
    color:#ffffff;
    font-size:14px;
    text-decoration:none;
    text-shadow:0px 1px 0px #283966;
    flex-basis: 100%;
  }

  #ssbut:hover {
    background:linear-gradient(to bottom, #476e9e 5%, #7892c2 100%);
  }

  #ssbut:active {
    position:relative;
    top:1px;
  }

  .status {
    margin: auto 0px auto 0px;
  }

  .show {
    right: 8px;
  }

  .hide {
    right: 1000px;
  }

  .liveColor {
    background-color:#476e9e;
  }

  .deadColor {
    background-color:#7892c2;
  }
</style>

<script>
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte';

  export let styles = {};
  export let ScriptPad = {};
  export let visible = false;

  let historyDiv;
  let history = '';
  let live = false;
  let flowWin = null;
  let DBwin = null;
  const dispatch = createEventDispatcher();

  function fire(name, data) {
    dispatch(name, {
        data: data
    });
  }

  onMount(() => {
    //
    // Node-Red watches the file system. NW.js doesn't work if something initiates
    // watching the file system right off the launch. Therefore, delay a full minute 
    // before starting Node-Red.
    //
    ScriptPad.logger = nodeRedLogger;
    setTimeout( () => {
      if((!ScriptPad.REDSTARTED) && ScriptPad.PREFERENCES.REDAuto) {
        live = false;
        StopStartRed();
      }
    }, 1000*30);
  });

  afterUpdate(() => {
    //
    // Make sure the bottom most line is visible.
    //
    historyDiv.scrollTop = historyDiv.scrollHeight - historyDiv.clientHeight;
  });

  function StopStartRed() {
    if(live) {
      ScriptPad.stopRed(afterStartStop);
    } else {
      ScriptPad.initNodeRed(nodeRedLogger);
      ScriptPad.startRed(afterStartStop);
    }
  }
  
  function afterStartStop() {
    live = ScriptPad.REDSTARTED;
  }
  
  function addToHistory(line) {
    history += '<p style="margin: 0px;">' + line + '</p>';
  }
  
  function addToHistoryError(line) {
    history += '<p style="margin: 0px; color: red;">' + line + '</p>';
  }

  function nodeRedLogger(msg) {
    var dt = new Date(msg.timestamp);
    var zmin = dt.getMinutes().toString();
    zmin = zmin.length === 1 ? "0"+zmin : zmin;
    var result = '[' + (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear() + ' ' + dt.getHours() + ':' + zmin + ']  ';
    if( typeof msg.msg !== 'undefined') {
      result += msg.msg;
    } else {
      result += JSON.stringify(msg,undefined,2);
    }
    if(result.includes("Error")) {
      addToHistoryError(result);
    } else {
      addToHistory(result);
    }
  }

  function openEditor() {
    if(live) {
      ScriptPad.nw.Window.open('http://localhost:' + ScriptPad.PORTNUMBER + '/red/admin/',{
        id: 'flowEditor'
      }, (win) => {
        flowWin = win;
      });
    } else {
      var options = {
        body: "Node-Red isn't started."
      };

      var notification = new Notification("Node-Red in ScriptPad",options);
      notification.onclick = function () {
        // do something when clicked on.
      }
      notification.onshow = function () {
        // auto close after 1 second
        setTimeout(function() {notification.close();}, 30*1000);
      }
    }
  }

  function openDashboard() {
    if(live) {
      ScriptPad.nw.Window.open('http://localhost:' + ScriptPad.PORTNUMBER + '/red/api/ui',{
        id: 'NodeRedDashboard'
      }, (win) => {
        DBWin = win;
      });
    } else {
      var options = {
        body: "Node-Red isn't started."
      };

      var notification = new Notification("Node-Red in ScriptPad",options);
      notification.onclick = function () {
        // do something when clicked on.
      }
      notification.onshow = function () {
        // auto close after 1 second
        setTimeout(function() {notification.close();}, 30*1000);
      }
    }
  }

</script>
