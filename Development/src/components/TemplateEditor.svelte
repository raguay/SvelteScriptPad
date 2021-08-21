<div id="TemplateEditorPanelStyle" class="{openTemplateEditor ? 'visible' : 'invisible'}" style="background-color: {styles.appBackground}; color: {styles.textcolor};" on:keyup="{(event) => {if(event.ctrlKey&&(event.key === 'p' )) { event.preventDefault(); event.stopPropagation(); togglePopUp();}}}" on:transitionend="{(event) => { transitionEnd(event) }}" >
   <input bind:this="{TemplateNameElement}" class="TemplateEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the Template Name." bind:value="{TemplateName}" />
   <input class="TemplateEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter a Description for the Template." bind:value="{TemplateDescription}" />
   <div id="codeMirorWrap">
       <CodeMirror height='305px' width='455px' config='{editorConfig}' on:textChange='{(event) => {textChanged(event.detail.data)}}' value="{Template}" cursor="{currentCursor}" history="{history}" on:editorChange='{(event) => {editorChange(event.detail.data); }}' />
   </div>
   <div id="buttonBar">
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {newAction()}}">New</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {saveAction()}}">Save</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {deleteAction()}}">Delete</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor};" on:click="{() => {cancelAction()}}">Cancel</button>
   </div>
   <PopUpMenu styles="{styles}" openPopUp="{openPopUp}" sysscripts="{[]}" usrscripts="{ScriptPad.TEMPLATES === null ? [] : ScriptPad.TEMPLATES}" on:scriptSelected="{(event) => { editTemplate(event.detail.data) }}" on:focusEditor="{(event) => {focus();}}" />
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

   #TemplateEditorPanelStyle {
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

   .TemplateEditorInput {
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
  export let openTemplateEditor = false;
  export let styles = {};
  export let focusFN;
  export let preferences;
  export let ScriptPad;
 
  let openPopUp = false;
  let TemplateName = '';
  let TemplateDescription = '';
  let cm;
  let currentCursor = { line: 0, ch: 0};
  let Template = "";
  let TemplateNameElement;
  let history = null;
   
  $: editorConfig = {
     Mode: preferences.codeMode,
     lineNumbers: preferences.codeLineNumbers,
     theme: styles.editorTheme ? styles.editorTheme : 'oceanic-next',
     keyMap: preferences.scriptKeyMap,
     lineWrapping: false,
     matchBrackets: true,
     autoCloseBrackets: true,
     styleActiveLine: preferences.styleActiveLine
  };

   function transitionEnd(event) {
      if(openTemplateEditor) {
         if(!openPopUp) {
            TemplateNameElement.focus();
         }
      } else {
         focusFN();
      }
   }

  function editorChange(newCM) {
    cm = newCM;
  }

   function focus() {
      TemplateNameElement.focus();
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
     Template = change.value;
     history = change.history;
   }
   
   function newAction() {
     TemplateName = '';
     TemplateDescription = '';
     Template = '';
     cm.getDoc().setValue('');
   }

   function saveAction() {
     fire('saveTemplate', {
       name: TemplateName,
       description: TemplateDescription,
       template: Template
     });
     fire('toggleTemplateEditor', 0);
   }

   function deleteAction() {
      fire('deleteTemplate', {
         name: TemplateName,
         description: TemplateDescription,
         template: Template
      })
      newAction();
      fire('toggleTemplateEditor', 0);
   }

  function cancelAction() {
    newAction();
    fire('toggleTemplateEditor', 0);
  }
  
  function editTemplate(template) {
      TemplateName = template.name;
      TemplateDescription = template.description;
      Template = template.template;
      cm.getDoc().setValue(template.template);
      openPopUp = false;
   }
</script>
