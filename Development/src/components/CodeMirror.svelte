<div class="wrapper" style="height: {height}; width: {width};">
  <textarea name="editor" id="CMeditor" bind:this='{CodeMirrorEditor}' />
</div>

<style>
  .wrapper {
    position: absolute;
  }

  :global(.cm-wrapcm-wrap) {
    height: 100%;
  }

  :global(.cm-scroller) { 
    overflow: auto; 
  }
</style>

<script>
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let cm = null;
  let oldText = '';
  
  export let value = '';
  export let config;
  export let cursor = {line: 0, ch: 0};
  export let history = null;
  export let height;
  export let width;

  let CodeMirrorEditor;

  $: setConfig(config, cm, height, width);

  function setConfig(config, cm, height, width) {
    if(cm !== null) {
      Object.entries(config).forEach((item) => {
        cm.setOption(item[0],item[1]);
      });
      cm.setSize(width, height);
    }
  }

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function setValue(text) {
    if(cm != null) {
      oldText = cm.getDoc().getValue();
      if(text !== oldText) {
        oldText = text;
        var doc = cm.getDoc();
        if(text) {
          doc.setValue(text);
        } else {
          doc.setValue('');
        }
        if(cursor) {
          doc.setCursor(cursor, {
            scroll: true,
            origin: '+input',
            bias: 1
          });
        } else {
          doc.setCursor({line: 0, char: 0});
        }
        if(history !== null) {
          doc.setHistory(history);
        } else {
          doc.clearHistory();
        }
        cm.focus();
      }
    }
  }
   
  beforeUpdate(() => {
    // this function is called immediately before
    // the component updates to reflect new data
  });

  afterUpdate(() => {
    // 
    // Set any changes to the value. This is needed to
    // set the value when the buffer changes.
    //
    setValue(value);
  });

  onMount(() => {
    // 
    // Create the CodeMirror Editor.
    //
    cm = window.CodeMirror.fromTextArea(CodeMirrorEditor, {
      lineNumbers: config.lineNumbers,
      mode: config.Mode,
      theme: config.theme,
      lineWrapping: config.lineWrapping,
      focus: true,
      value: '',
      keyMap: config.keyMap,
      cursorScrollMargin: 50,
      matchBrackets: config.matchBrackets,
      autoCloseBrackets: config.autoCloseBrackets,
      styleActiveLine: config.styleActiveLine
    });

    //
    // Capture the data and cursor changes as they change.
    //
    cm.on('change', (data) => {
      var doc = cm.getDoc();
      var cursor = doc.getCursor();
      var newValue = doc.getValue();
      var newHistory = doc.getHistory();
      if(!((cursor.line === 0)&&(cursor.ch === 0)&&(oldText[0] === newValue[0]))) {
        fire('textChange', {
          value: newValue,
          cursor: cursor,
          history: newHistory
        });
      }
    });
    
    fire('editorChange', cm);

    //
    // Capture the cursor changes also.
    //
    cm.on('cursorActivity', (data) => {
      var doc = cm.getDoc();
      var cursor = doc.getCursor();
      var newValue = doc.getValue();
      var newHistory = doc.getHistory();
      if(!((cursor.line === 0)&&(cursor.ch === 0)&&(oldText[0] === newValue[0]))) {
        fire('textChange', {
          value: newValue,
          cursor: cursor,
          history: newHistory
        });
      }
    });

    //
    // When focus is gained again, set the cursor location.
    //
    cm.on('focus', (data) => {
      cm.getDoc().setCursor(cursor, {
        scroll: false,
        origin: '+input',
        bias: 1
      });
    });

    //
    // Set the initial value for the editor.
    //
    setValue(value);

    //
    // Return a function to run to clean up after mounting.
    //
    return () => {
      // this function runs when the
      // component is destroyed
    };
  });

  onDestroy(() => {
    // this function runs when the
    // component is destroyed
  });
</script>
