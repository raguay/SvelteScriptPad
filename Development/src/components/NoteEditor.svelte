<div id="noteEditor" style="background-color: {styles.appBackground};" on:keyup="{(event) => {processKeyUp(event)}}">
  <CodeMirror height='385px' width='466px' config='{editorConfig}' on:textChange='{(event) => {textChanged(event.detail.data, cm)}}' value="{StoredText[currentid]}" cursor="{StoredCursor[currentid]}" on:editorChange='{(event) => {editorChange(event.detail.data); }}'/>
  <RegExpEditor openRegExp="{RegExpOpen}" styles="{styles}" StoredText="{StoredText}" currentid="{currentid}" on:toggleRegExp="{() => {fire('toggleRegExp',0)}}" on:saveScript="{(event) => {saveRegExp(event.detail.data)}}" on:deleteScript="{(event) => {deleteRegExp(event.detail.data)}}" focusFN={focus} RegExpList="{UserRegExp}" on:saveText="{(event) => { saveText(event.detail.data)}}"/>
  <ScriptEditor openScriptEditor="{ScriptEditorOpen}" on:toggleScriptEditor="{() => {fire('toggleScriptEditor',0)}}" styles="{styles}" UserScripts="{UserScripts}" on:saveScript="{(event) => {saveScript(event.detail.data)}}" on:deleteScript="{(event) => {deleteScript(event.detail.data)}}" focusFN={focus} preferences="{preferences}" />
  <TemplateEditor openTemplateEditor="{TemplateEditorOpen}" on:toggleTemplateEditor="{() => {fire('toggleTemplateEditor',0)}}" styles="{styles}" ScriptPad="{ScriptPad}" on:saveTemplate="{(event) => {saveTemplate(event.detail.data)}}" on:deleteTemplate="{(event) => {deleteTemplate(event.detail.data)}}" focusFN={focus} preferences="{preferences}" />
  <PopUpMenu styles="{styles}" openPopUp="{openPopUp}" syscripts="{SystemScripts}" usrscripts="{UserScripts}" on:scriptSelected="{(event) => { runScript(event.detail.data, cm) }}" on:focusEditor="{(event) => {focus();}}" />
  <PopUpMenu styles="{styles}" openPopUp="{openTemplatePopUp}" syscripts="{ScriptPad.SYSTEMTEMPLATES}" usrscripts="{ScriptPad.TEMPLATES === null ? [] : ScriptPad.TEMPLATES.filter(item => item.name === 'Defaults' ? false : true)}" on:scriptSelected="{(event) => { runTemplate(event.detail.data, cm) }}" on:focusEditor="{(event) => {focus();}}" />
</div>

<style>
  #noteEditor {
    height: 386px;
    width: 466px;
    resize: none;
    font-size: 15px;
    box-shadow: inset 0px 0px 5px 2px black;
    padding: 7px;
    margin: 0px;
  }
</style>

<script>
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import RegExpEditor from './RegExpEditor.svelte';
  import ScriptEditor from './ScriptEditor.svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  import CodeMirror from './CodeMirror.svelte';
  import ApiRoutes from '../modules/ApiRoutes.js';
  import TemplateEditor from './TemplateEditor.svelte';
  import PublicRoutes from '../modules/PublicRoutes.js';

  export let currentid = 0;
  export let RegExpOpen = false;
  export let ScriptEditorOpen = false;
  export let TemplateEditorOpen = false;
  export let styles = {};
  export let preferences = {};
  export let ScriptPad = {};

  const dispatch = createEventDispatcher();
  let StoredText = ['', '', '', '', '', '', '', '', ''];
  let StoredHistory = [null, null, null, null, null, null, null, null, null];
  let StoredCursor = [{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0},{line: 0, char: 0}]; let openPopUp = false;
  let openTemplatePopUp = false;
  let UserScripts = [];
  let UserRegExp = [];
  let SystemScripts = [];
  let SystemRegExp = [];
  let webSocket = {};
  let currentLine = '';
  let cm = null;

  $: editorConfig = {
    Mode: preferences.noteMode,
    lineNumbers: preferences.noteLineNumbers,
    theme: styles.editorTheme ? styles.editorTheme : 'oceanic-next',
    keyMap: preferences.noteKeyMap,
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: preferences.styleActiveLine
  };

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function editorChange(e) {
    cm = e;
  }

  function processKeyUp(event) {
    var keyCode = event.keyCode;
    if(event.ctrlKey&&((keyCode === 77 ) || (keyCode === 80) || ((keyCode === 69) && (event.getModifierState('Alt'))))) { 
      event.preventDefault(); 
      event.stopPropagation(); 
      if(keyCode=== 77) {
        togglePopUp();
      } else if(keyCode === 69) {
        getTeaCodeExpand();
      } else if(keyCode === 80) {
        toggleTemplatePopUp();
      }
    }
  }

  function getTeaCodeExpand() {
    if(cm !== null ) {
      //
      // Get the current line in the editor.
      //
      currentLine = cm.getLine(StoredCursor[currentid].line);

      //
      // Pass it to the server with the extension to use
      // for TeaCode expanding.
      //
      //
      // Get the expander to query and escape the quotes.
      //
      var expander = currentLine.replace(new RegExp("\"", "g"), "\\\"");

      //
      // Query TeaCode with osascript.
      //
      var exp = ScriptPad.TeaCodeExpand(expander, '.md');

      //
      // Set the expanded text. First, select the old text
      // for removing and placing the new text.
      //
      var currentLoc = StoredCursor[currentid];
      var size = currentLine.length;
      var doc = cm.getDoc();
      doc.setSelection({line: currentLoc.line, ch: 0},{line: currentLoc.line, ch: size});
      //
      // Data struture returned:
      //
      // exp.text - The expanded text
      // exp.cursorPosition - where to place the cursor.
      //
      doc.replaceSelection(exp.text);
      var cindex = doc.indexFromPos(doc.getCursor());
      var npos = doc.posFromIndex(cindex - (exp.text.length - exp.cursorPosition));
      doc.setCursor(npos);
    }
  }

  function saveText(text) {
    StoredText[currentid] = text;
    saveNote(currentid);
  }

  function togglePopUp() {
    openPopUp = !openPopUp;
  }

  function toggleTemplatePopUp() {
    openTemplatePopUp = !openTemplatePopUp;
  }

  function textChanged(textCursor) {
    StoredText[currentid] = textCursor.value;
    StoredCursor[currentid] = textCursor.cursor;
    StoredHistory[currentid] = textCursor.history;
    saveNote(currentid);
  }

  function getNote(id) {
    StoredText[id] = ScriptPad.getNote(id);
    return(StoredText[id]);
  }

  function saveNote(id) {
    ScriptPad.saveNote(id,StoredText[id]);
  }

  function setNewAPIText(id,text) {
    StoredText[id] = text;
    ScriptPad.saveNote(id,StoredCursor[id]);
  }

  function saveUserScripts() {
    ScriptPad.putScripts(UserScripts);
  }

  function getUserScripts() {
    UserScripts = ScriptPad.getScripts();
  }

  function saveUserTemplates() {
    ScriptPad.saveUserTemplates(ScriptPad.TEMPLATES);
  }

  function getUserTemplates() {
    ScriptPad.getUserTemplates();
  }

  function getUserRegExp() {
    UserRegExp = ScriptPad.getRegExp();
  }

  function saveUserRegExp() {
    ScriptPad.saveRegExps(UserRegExp);
  }

  function getTodos() {
    //
    // Save the scripts.
    //
    fire('changeTodos',{});
  }

  function getSystemScripts() {
    SystemScripts = ScriptPad.getSystemScripts();
  }

  function getSystemRegExp() {
    SystemRegExp = ScriptPad.getSystemRegExps();
  }

  onMount(() => {
    //
    // We are about to mount. Load the text for each note from the server.
    //
    cm.getDoc().setValue(getNote(0));
    getNote(1);
    getNote(2);
    getNote(3);
    getNote(4);
    getNote(5);
    getNote(6);
    getNote(7);
    getNote(8);

    //
    // Get the scripts.
    //
    getUserScripts();
    getSystemScripts();

    //
    // Get the templates.
    //
    ScriptPad.getUserTemplates();
    ScriptPad.getSystemTemplates();

    //
    // Get the Regular Expressions.
    //
    getUserRegExp();
    getSystemRegExp();

    //
    // Setup the Templater Helpers and default data;
    //
    ScriptPad.setupHandlebarHelpers();

    //
    // Setup the server for the external API.
    //

    //
    // Create the router.
    //
    ScriptPad.apiRouter = window.express.Router()
    ScriptPad.pubServerRouter = window.express.Router()
    
    //
    // Create the main Express application.
    //
    ScriptPad.app = window.express()

    //
    // Setup the routes.
    //
    ApiRoutes(ScriptPad.apiRouter, ScriptPad, setNewAPIText)
    PublicRoutes(ScriptPad.pubServerRouter, ScriptPad)

    //
    // Add the different routers.
    //
    ScriptPad.app.use('/api', ScriptPad.apiRouter)
    ScriptPad.app.use('/', ScriptPad.pubServerRouter)
    
    //
    // Create the server.
    //
    ScriptPad.httpServer = window.http.createServer(ScriptPad.app);

    //
    // Create the websocket connection.
    //
    ScriptPad.io = window.socketio(ScriptPad.httpServer);

    //
    // Run the server:
    //
    try {
      ScriptPad.server = ScriptPad.httpServer.listen(ScriptPad.PORTNUMBER)
    } catch (e) {
      console.log(e);
    }
  });

  function saveScript(script) {
    openPopUp = false;
    if(UserScripts !== null) {
      deleteScript(script);
      UserScripts = UserScripts.concat(script);
    }
    saveUserScripts();
  }

function saveTemplate(template) {
    openTemplatePopUp = false;
    if(ScriptPad.TEMPLATES !== null) {
      deleteTemplate(template);
      ScriptPad.TEMPLATES = ScriptPad.TEMPLATES.concat(template);
    }
    saveUserTemplates();
  }


  function saveRegExp(script) {
    openPopUp = false;
    if(UserRegExp !== null) {
      deleteRegExp(script);
      UserRegExp = UserRegExp.concat(script);
    }
    saveUserRegExp();
  }

  function deleteScript(script) {
    openPopUp = false;
    UserScripts = UserScripts.filter((item) => {
      var result = true;
      if(script.name === item.name) {
        result = false;
      }
      return result;
    });
    saveUserScripts();
  }

  function deleteTemplate(template) {
    openTemplatePopUp = false;
    ScriptPad.TEMPLATES = ScriptPad.TEMPLATES.filter((item) => {
      var result = true;
      if(template.name === item.name) {
        result = false;
      }
      return result;
    });
    saveUserTemplates();
  }

  function deleteRegExp(script) {
    openPopUp = false;
    UserRegExp = UserRegExp.filter((item) => {
      var result = true;
      if(script.name === item.name) {
        result = false;
      }
      return result;
    });
    saveUserRegExp();
  }

  function runScript(script, cm) {
    console.log(script);
    var scriptIndex = ScriptPad.getExtScript(script.name);
    console.log('tested for external');
    if(cm !== null) {
      openPopUp = false;
      if(script.insert) {
        var doc = cm.getDoc();
        var pos = doc.getCursor();
        doc.setSelection(pos);
        var result = '';
        if(typeof ScriptIndex !== 'undefined') {
          //
          // It's an external script.
          //
          result = ScriptPad.runExtScript(ScriptIndex,{
            script: ScriptIndex.script,
            envVar: {
              'text': ''
            },
            env: '',
            commandLine: ''
          });
        } else {
          result = evalScript(script.script,'');
        }
        doc.replaceSelection(result);
      } else {
        var text = cm.getSelection();
        var replace = false;
        if(text === '') {
          text = StoredText[currentid];
          replace = true;
        }
        var newText = '';
        if(typeof ScriptIndex !== 'undefined') {
          //
          // It's an external script.
          //
          newText = ScriptPad.runExtScript(ScriptIndex,{
            script: ScriptIndex.script,
            envVar: {
              'text': text
            },
            env: '',
            commandLine: ''
          });
        } else {
          newText = evalScript(script.script, text);
        }
        if(replace) {
          StoredText[currentid] = newText;
        } else {
          cm.getDoc().replaceSelection(newText);
        }
      }
    }
  }

  function evalScript(script, text) {
    return(ScriptPad.runJavaScriptScripts(script, text));
  }

  function runTemplate(template, cm) {
    if(cm !== null) {
      openTemplatePopUp = false;

      var sel = cm.getSelection();
      var replace = false;
      if(sel === '') {
        sel = StoredText[currentid];
      }
      //
      // Get the current position setup.
      //
      var doc = cm.getDoc();
      var pos = doc.getCursor();
      doc.setSelection(pos);

      //
      // Run the template.
      //
      var result = ScriptPad.runTemplate(template.name,template.template, sel);

      //
      // Insert the template text.
      //
      if(replace) {
        StoredText[currentid] = result;
      } else {
        doc.replaceSelection(result);
      }
    }
  }

  function focus() {
    if(cm !== null) {
      cm.focus();
    }
  }
</script>
