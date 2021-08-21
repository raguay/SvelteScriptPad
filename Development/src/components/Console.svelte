<div id="Console" style="background-color: {styles.editorBackground}; color: {styles.textcolor};">
  <div id="history" bind:this={historyDiv} >
    {@html history }
  </div>
  <input 
    id="inputLine" 
    bind:this={input}
    type="text" 
    on:keydown="{(event) => { if(event.key == 'Enter') processLine();}}" 
    on:blur="{(event) => { if (visible) input.focus(); }}"
    style="background-color: {styles.editorBackground}; color: {styles.textcolor};"
  />
</div>

<style>
  #Console {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 360px;
    margin: 0px;
    padding: 0px;
    z-index: 10;
    border-radius: 10px;
  }

  #history {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 5px;
    overflow: auto;
    border-radius: 10px 10px 0px 0px;
  }

  #inputLine {
    border: none;
    width: 100%;
    margin: 0px;
    padding: 0px 10px 0px 10px;
    outline: none;
    border-radius: 0px 0px 10px 10px;
  }
</style>

<script>
  import { createEventDispatcher, afterUpdate, onMount } from 'svelte';

  export let styles = {};
  export let ScriptPad = {};
  export let dir = '';
  export let visible = false;
  
  let input;
  let historyDiv;
  let history = '';
  let conCom = [];
  const dispatch = createEventDispatcher();
 
  function fire(name, data) {
    dispatch(name, {
        data: data
    });
  }
  
  onMount(() => {
    conCom.push({
      'name': 'cd',
      'function': consoleCD
    });
    conCom.push({
      'name': 'echo',
      'function': consoleEcho
    });
    conCom.push({
      'name': 'menu',
      'function': consoleMenu
    });
  });

  afterUpdate(() => {
    //
    // Make sure the bottom most line is visible.
    //
    historyDiv.scrollTop = historyDiv.scrollHeight - historyDiv.clientHeight;
    input.focus();
  });

  function processLine() {
    //
    // The line to process is in input.value. First, add it to the history.
    //
    addToHistory(input.value);

    //
    // Next, process the command line.
    //
    var result = actionLine(input.value);
    if(result !== '') addToHistory(result);

    //
    // Clear the input line.
    //
    input.value = '';
    input.focus();
  }

  function addToHistory(line) {
    history = history + '<p style="margin: 0px;">' + line + '</p>';
  }

  function actionLine(line) {
    var result = '';

    //
    // Tokenize the line.
    //
    var tokens = line.trim().split(' ');
    
    //
    // Look for built in commands.
    //
    const com = conCom.find((item) => {
      if(item.name === tokens[0]) return true;
      else return false;
    })
    if(com !== 'undefined') {
      result = com.function(tokens, 0);
    } else {
      //
      // See if it is a script command.
      //
      result = 'Not a built-in';
    }
    
    //
    // Return the results.
    //
    return result;
  }

  function consoleCD(tokens, i) {
    var result = '';

    //
    // Process the path after the cd command.
    //
    var line = tokens[i+1];
    if(line === '..') {
      //
      // Go up a directory
      //
      var parts = dir.split('\\');
      parts.pop();
      line = parts.join('\\');
    }

    //
    // Make sure it's a proper directory.
    //
  
    //
    // Send it upstream if it's a valid directory.
    //
    fire('setdir', line);
    result = line;
    
    return(result);
}
  
  function consoleEcho(tokens, i) {
    return(tokens.slice(i+1).join(' '));
  }

  function consoleMenu(tokens, i) {
    //
    // This one will create a menu overlay based on the
    // directory structure and files given to it.
    //
    return('');
  }
</script>
