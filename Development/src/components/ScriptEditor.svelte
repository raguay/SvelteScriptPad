<div id="ScriptEditorPanelStyle" class="{openScriptEditor ? 'visible' : 'invisible'}" style="background-color: {styles.appBackground}; color: {styles.textcolor};" on:keyup="{(event) => {if(event.ctrlKey&&(event.keyCode == 77 )) { event.preventDefault(); event.stopPropagation(); togglePopUp();}}}" on:transitionend="{(event) => { transitionEnd(event) }}" >
   <div id="nameInsertBox">
      <input bind:this="{ScriptNameElement}" class="ScriptEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the Script Name." bind:value="{ScriptName}" />
      <label>Insert</label>
      <input type="checkbox" name="Insert" bind:checked="{Insert}">
   </div>
   <input class="ScriptEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter a Description for the Script." bind:value="{ScriptDescription}" />
   <div id="codeMirorWrap">
       <CodeMirror height='305px' width='455px' config='{editorConfig}' on:textChange='{(event) => {textChanged(event.detail.data)}}' value="{Script}" cursor="{currentCursor}" history="{history}" on:editorChange='{(event) => {editorChange(event.detail.data); }}' />
   </div>
   <div id="buttonBar">
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {newAction()}}">New</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {saveAction()}}">Save</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {deleteAction()}}">Delete</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {cancelAction()}}">Cancel</button>
   </div>
   <PopUpMenu styles="{styles}" openPopUp="{openPopUp}" syscripts="{[]}" usrscripts="{UserScripts}" on:scriptSelected="{(event) => { editScript(event.detail.data) }}" on:focusEditor="{(event) => {focus();}}" />
</div>

<style>
    #codeMirorWrap {
        padding: 7px;
        height: 305px;
        width: 455px;
        min-height: 305px;
        max-height: 305px;
        min-width: 440px;
        max-width: 440px;
        overflow: hidden;
    }

  #nameInsertBox {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0px;
      margin: 0px;
   }

  #nameInsertBox input {
    margin: 0px 0px 0px 5px;
  }

  #nameInsertBox label {
    padding: 0px;
    margin: 0px 5px 0px 5px;
  }

   #ScriptEditorPanelStyle {
      height: 435px;
      font-size: 15px;
      overflow-y: scroll;
      overflow-x: hidden;
      list-style: none;
      position: absolute;
      margin: 0px;
      right: 8px;
      z-index: 90;
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
   }

  #buttonBar {
      display: flex;
      flex-direction: row;
      padding: 0px 0px 0px 0px;
      justify-content: center;
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
   }

   .button {
      border-radius: 5px;
      font-size: 15px;
      height: 30px;
      text-shadow: 2px 2px 2px black;
      box-shadow: 2px 2px 5px 2px black;
      outline: none;
      margin: 0px 10px;
      padding: 3px 6px 6px 6px;
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
   }

   .ScriptEditorInput {
      font-size: 15px;
      border-radius: 5px;
      box-shadow: inset 0px 0px 5px 2px #0f0a16;
      border: 2px #0f0a16;
      min-height: 30px;
      width: 455px;
      margin: 5px 5px 0px 5px;
      outline: none;
      -webkit-user-select: text;        
      -moz-user-select: text;
      -ms-user-select: text;
      -o-user-select: text;
      user-select: text;
   }

   .visible {
      width: 468px;
      box-shadow: inset 0px 0px 5px 2px black;
      top: 7px;
      padding: 10px 5px 0px 5px;
   }

   .invisible {
      width: 0px;
      box-shadow: inset 0px 0px 0px 0px black;
      top: 15px;
      padding: 0px;
   }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import CodeMirror from './CodeMirror.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  
  const dispatch = createEventDispatcher();
  export let openScriptEditor = false;
  export let styles = {};
  export let UserScripts = [];
  export let focusFN;
  export let preferences;
   
  let openPopUp = false;
  let ScriptName = '';
  let ScriptDescription = '';
  let Insert = false;
  let cm;
  let currentCursor = { line: 0, ch: 0};
  let Script = "";
  let ScriptNameElement;
  let history = null;
   
  $: editorConfig = {
     Mode: preferences.codeMode,
     lineNumbers: preferences.codeLineNumbers,
     value: '',
     theme: styles.editorTheme ? styles.editorTheme : 'oceanic-next',
     keyMap: preferences.scriptKeyMap,
     lineWrapping: false,
     matchBrackets: true,
     autoCloseBrackets: true,
     styleActiveLine: preferences.styleActiveLine
  };

   function transitionEnd(event) {
      if(openScriptEditor) {
         if(!openPopUp) {
            ScriptNameElement.focus();
         }
      } else {
         focusFN();
      }
   }

  function editorChange(newCM) {
    cm = newCM;
  }

   function focus() {
      ScriptNameElement.focus();
   }

   function togglePopUp() {
      openPopUp = !openPopUp;
   }

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
   }

   function textChanged(change) {
     currentCursor = change.cursor;
     Script = change.value;
     history = change.history;
   }
   
   function newAction() {
     ScriptName = '';
     ScriptDescription = '';
     Insert = false;
     Script = '';
     cm.getDoc().setValue('');
   }

   function saveAction() {
     fire('saveScript', {
       name: ScriptName,
       description: ScriptDescription,
       insert: Insert,
       script: Script
     });
     fire('toggleScriptEditor', 0);
   }

   function deleteAction() {
      fire('deleteScript', {
         name: ScriptName,
         description: ScriptDescription,
         insert: Insert,
         script: Script
      })
      newAction();
      fire('toggleScriptEditor', 0);
   }

  function cancelAction() {
    newAction();
    fire('toggleScriptEditor', 0);
  }
  
  function editScript(script) {
      ScriptName = script.name;
      ScriptDescription = script.description;
      Insert = script.insert;
      Script = script.script;
      cm.getDoc().setValue(script.script);
      openPopUp = false;
   }
</script>
