<div class='script' 
     style="height: {Math.floor(height)}px;" 
     data-index="{index}"
     bind:this={dom}
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}>
  <span class='scriptName'
        on:dblclick={(e) => { dispatch('dblclick', {})}}
  >
    {name}
  </span>
  <span class='scriptValue' 
        on:click={(e) => { sendWebView(); }}
  >
    {#if vHTML}
      {@html value}
    {:else}
      {value}
    {/if}
  </span>
</div>

<style>
  .script {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: auto 0px auto 0px;
    padding: 0px;
  }

  .scriptName {
    margin: 0px;
    padding: 0px;
  }

  .scriptValue {
    margin: 0px 0px 0px auto;
    padding: 0px;
    cursor: pointer;
  }
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let style;
  export let name;
  export let config = {
    script: "",
    env: "",
    envVar: "",
    commandLine: "",
    type: "",
    scriptImage: ''
  };
  export let socket;
  export let index;
  export let height;
  export let dom;
  
  let value = 'loading...';
  let bodyHTML = '<h1>Loading...</h1>';
  let vHTML = false;
  let bodyConfig = {
    width: 300,
    height: 300,
    showButton: true
  };

  const dispatch = createEventDispatcher();
  
  $: updateWidget(index);
  
  function getData() {
    //
    // Get the current value instead of waiting for the next update.
    // TODO: total rewrite
    //
    var callBody = JSON.stringify({
        script: config.script,
        text: config.commandLine,
        env: config.env,
        envVar: config.envVar,
        commandLine: config.commandLine
      });
    fetch('http://localhost:9978/api/script/run/',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: callBody 
    })
    .then((resp) => { 
      return resp.json();
    }).then((data) => {
      if(data !== null) {
        processScriptData(data);
      }
    });
  }

  onMount(() => {
    getData();
  })

  function updateWidget(index) {
    getData();
    index = index;
  }

  function middleButton(index) {
    dispatch('middleButton', {
      index: index
    })
  }

  function sendWebView() {
    if((typeof value === 'string') && (!value.includes("loading..."))) {
      dispatch('changeView',{
        name: 'webview',
        body: {
          html: bodyHTML,
          config: bodyConfig
        }
      });
    }
  }

  function processScriptData(data) {
    bodyConfig.showButton = true;
    if(config.type === 'generic') {
      //
      // It is a generic script. No processing other than 
      // creating the HTML as text paragraph.
      //
      bodyHTML = '<p>'+data.text+'</p>';
    } else if(config.type === 'bitbar') {
      //
      // Process it as a BitBar script.
      //
      bodyHTML = data.text;
    } else if(config.type === 'textbar') {
      //
      // Process it as a TextBar Script.
      //
      bodyHTML = processTextBarData(data.text);
    } else if(config.type === 'web') {
      //
      // The script output is html. Send it directly.
      //
      bodyHTML = data.text;
    }
  } 

  function processTextBarData(data) {
    var resultText = '';
    var resultHTML = '';
    var maxWidth = 10;
    var result = null;
    bodyConfig.height = 10;
    var count = 1;
    var viewSet = false;
    var textbarDirectives = false;
    var longLine = "";
    bodyConfig.showButton = true;
    data = String(data);
    globalThis.ScriptClick = (count, line, script, commandLine, env) => {
      var newEnv = [];
      newEnv['TEXTBAR_INDEX'] = count;
      newEnv['TEXTBAR_TEXT'] = line;
      var callBody = JSON.stringify({
          script: script.trim(),
          text: commandLine.trim(),
          env: env.trim(),
          envVar: {...newEnv},
          commandLine: commandLine.trim()
        });
      fetch('http://localhost:9978/api/script/run/',{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: callBody 
      })
      .then((resp) => { 
        return resp.json();
      }).then((data) => {
        if(data !== null) {
          globalThis.closeWebView();
        }
      });
    };
    data = data.split(/\r?\n/);
    value = config.scriptImage + data[0];
    data.slice(1).forEach( line => {
      if(line.trim() !== '') {
        line = new String(line);
        var banner = line.includes('----TEXTBAR----');
        if((banner)||(textbarDirectives)) {
          if(banner) {
            //
            // All rest of the lines are part of the directives.
            //
            textbarDirectives = true;
          } else {
            //
            // Process each directive.
            //
            var parts = line.split('=');
            switch(parts[0]) {
              case 'REFRESH':
                //
                // TODO: This case isn't currently possible. There isn't
                //       a timer setup yet.
                //
                break;
              case 'VIEWTYPE':
                  switch(parts[1]) {
                    case 'HTML':
                      result = resultHTML;
                      bodyConfig.showButton = true;
                      break;
                    default:
                      result = resultText;
                      bodyConfig.showButton = false;
                      break;
                  }
                break;
              case 'VIEWSIZE':
                var sizes = parts[1].split(',');
                bodyConfig.width = parseInt(sizes[0],10);
                bodyConfig.height = parseInt(sizes[1],10);
                viewSet = true;
                break;
              case 'IMAGE':
                  if(parts[1][0] === ':') {
                    value = '<img src="' + parts[1].slice(1) + '" />';
                    vHTML = true;
                  } else {
                    value = parts[1];
                  }
                bodyConfig.showButton = true;
                break;
              default:
                break;
            }
          }
        } else {
          //
          // It is the main output lines and not the directive lines.
          //
          resultHTML += line;
          var nline = '';
          var pline = '';
          if(line.match(/\[\d+(\:\d+)*m/) !== null) {
            //
            // This line has ASNI codes. Process it as such.
            //
            var tline = line.replace(/\\e/g,'\x1b');

            //
            // Convert ANSI color codes to span colors.
            //
            nline = window.ansi_up.ansi_to_html(tline);

            //
            // Clean the line of unknown escape codes.
            //
            nline = nline.replace(/\[\d+(\:\d+)*m/g,'');

            //
            // Remove all escapte codes for the plain line.
            //
            pline = line.replace(/\\e/g,'').replace(/\[\d+((\:|\;)\d+)*m/g,'');
          } else {
            //
            // No ANSI codes, process as a plain text line.
            //
            nline = line.replace(/ /g,'&nbsp;');

            //
            // Just use the line for the pline to determine line length.
            //
            pline = line;
          }
          
          //
          // Remove everything but the visible text.
          //
          pline = new String(pline);
          if(maxWidth < pline.length) {
            maxWidth = pline.length;
            longLine = pline;
          }
          if(line[line.length-1] === ':') {
            resultText += '<p style="margin: 0px; padding: 0px; height: 20px;">' + nline + '</p>';
          } else {
            resultText += '<p style="margin: 0px; padding: 0px; height: 20px;" onclick="globalThis.ScriptClick(' + count + ',\'' + line + '\',\'' + config.script + '\', \'' + config.commandLine + '\', \'' + config.env + '\')">' + nline + '</p>';
          }
        }
        count += 1;
      }
    });

    //
    // Setup the height and width of the script output.
    //
    if(!viewSet) {
      bodyConfig.height = count * 20; // Each line is 20px.
      if(bodyConfig.showbutton) bodyConfig.height += 55;  // Size of the button bar
      bodyConfig.width = Math.floor(getTextWidth(longLine, '14px Arial')) + 10;
    }
    if(result === null) result = resultText;
    return(result);
  }
  
  function getTextWidth(text, fnt) {
    if(typeof window.textsize === 'undefined') {
      window.textsize = document.createElement("canvas");
      window.textsizeContext = window.textsize.getContext("2d");
    }
    window.textsizeContext.font = fnt;
    return window.textsizeContext.measureText(text).width;
  }
</script>
