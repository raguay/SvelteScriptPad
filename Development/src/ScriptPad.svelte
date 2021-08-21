<svelte:head>
    <title>ScriptPad</title>
</svelte:head>

<svelte:window on:blur="{() => {if(onBlur !== null) onBlur();}}" on:keyup="{(event) => {processKeys(event);}}" />

<Header background="{styles.appBackground}" />
<div id='main' style='background-color: {styles.appBackground}; color: {styles.textcolor};' >
  <ExtScriptEditor
    openPanel={showExtScriptEditor}
    styles={styles}
    mConfig={prefs}
    ScriptPad={ScriptPad}
    on:returnToMain={() => { toggleExtScriptEditor();}}
  />
  <NodeRed 
    styles="{styles}" ScriptPad="{ScriptPad}"
    visible="{RedActive}" 
  />
  <Preferences 
    openPanel="{PreferencePanelOpen}" 
    styles="{styles}" 
    preferences="{prefs}" 
    on:changeStyles="{(data) => {changeStyles(data.detail.data)}}" 
    on:changePreferences="{(event) => {changePreferences(event.detail.data)}}" 
    on:quitPreferences="{() => {quitPreferences(); PreferencePanelOpen = false;}}" 
    currentID="{currentid}" 
    ScriptPad="{ScriptPad}" />
  <NoteEditor 
    currentid='{currentid}' 
    RegExpOpen="{RegExpOpen}" 
    ScriptEditorOpen="{ScriptEditorOpen}" 
    TemplateEditorOpen="{TemplateEditorOpen}" 
    on:toggleRegExp="{() => {toggleRegExpEditor()}}" 
    on:toggleScriptEditor="{() => {toggleScriptEditor()}}" 
    on:toggleTemplateEditor="{()=>{toggleTemplateEditor()}}" 
    styles="{styles}" 
    preferences="{prefs}" 
    on:changeTodos="{() => { changeTodos(); }}" 
    ScriptPad="{ScriptPad}"/>
  <div id='controlsClosure'>
    <MainMenuButton on:toggleMainMenu="{() => {toggleMainMenu()}}" openMenu="{MainMenuOpen}" styles="{styles}" />
    <ButtonBar buttons="{styles.buttons}" on:selected="{(event) => {setNoteId(event.detail.data)}}" />
    {#if (prefs.UseTaskPaper)||(prefs.UseNotePlan)}
      <TodoButton iconAddress="{styles.todoIconAddress}" on:toggleTodo="{() => {toggleTodoMenu()}}" />
    {/if}
  </div>
  <Todo openPanel="{TodoOpen}" preferences="{prefs}" styles="{styles}" updateTodos="{updateTodos}" on:clearUpdateTodos="{() => { updateTodos = false; }}" ScriptPad="{ScriptPad}"/>
  <MainMenu openMenu="{MainMenuOpen}"
    ScriptPad="{ScriptPad}" 
    on:toggleMainMenu="{() => {toggleMainMenu()}}" on:toggleAboutMenu="{() => {toggleAbout()}}" 
    on:toggleNodeRed={() => { toggleNodeRed()}}
    on:toggleRegExp="{() => {toggleRegExpEditor()}}"
    on:toggleScriptEditor="{() => {toggleScriptEditor()}}"
    on:toggleExtScriptEditor="{() => {toggleExtScriptEditor()}}"
    on:toggleTemplateEditor="{() => {toggleTemplateEditor()}}"
    on:togglePreferences="{(event) => {togglePreferences(event.detail.data)}}" 
    preferences="{prefs}"
    styles="{styles}" />
  <About open="{AboutOpen}" styles="{styles}" on:toggleAboutMenu="{() => {toggleAbout();}}" ScriptPad="{ScriptPad}" />
</div>

<style>
  #main {
    position: absolute;
    left: -2px;
    font-family: 'Lucida Console', Monaco, monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0px;
    padding: 5px;
    width: 482px;
    height: 450px;
    border-radius: 10px;
    overflow: hidden;
  }

  #controlsClosure {
    padding: 3px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;    
  }

  :global(body) {
    margin: 0px;
    padding: 0px;
    background-color: transparent;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    font-family: 'Lucida Console', Monaco, monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    cursor: default;
    border: 1px solid transparent;
    border-radius: 10px;
    overflow: hidden;
  }
</style>

<script>
  import ButtonBar from './components/ButtonBar.svelte';
  import TodoButton from './components/TodoButton.svelte';
  import MainMenuButton from './components/MainMenuButton.svelte';
  import Todo from './components/Todo.svelte';
  import MainMenu from './components/MainMenu.svelte';
  import NoteEditor from './components/NoteEditor.svelte';
  import About from './components/About.svelte';
  import Preferences from './components/Preferences.svelte';
  import Header from './components/Header.svelte';
  import ExtScriptEditor from './components/ExtScriptEditor.svelte';
  import NodeRed from './components/NodeRed.svelte';

  export let prefs;
  export let styles;
  export let ScriptPad;
  export let onBlur;
  export let onClose;

  let currentid = 0;
  let RedActive = false;
  let MainMenuOpen = false;
  let TodoOpen = false;
  let AboutOpen = false;
  let RegExpOpen = false;
  let ScriptEditorOpen = false;
  let PreferencePanelOpen = false;
  let TemplateEditorOpen = false;
  let updateTodos = false;
  let showExtScriptEditor = false;

  function changeTodos() {
    updateTodos = true;
  }

  function changeStyles(newStyles) {
    styles = newStyles;
    saveUserStyles(prefs.style);
  }

  function changePreferences(newPreferences) {
    prefs = newPreferences;
    updateTodos = true;
    saveUserPreferences();
  }

  function quitPreferences() {
    PreferencePanelOpen = false;
    window.Pref = false;
  }

  function processKeys(event) {
    var key = event.key;
    if(event.ctrlKey&&(((key >= '0')&&(key <= '9'))|| (key === 'y') || (key === 't') || (key === 'r')||(key === 'e')||(key === 'x') ||(key === 'p')||(key === 'n'))) { 
      event.preventDefault();
      event.stopPropagation();
      switch(key) {
        case 'r': {
          toggleRegExpEditor();
          break;
        }
        case 'y': {
          toggleExtScriptEditor();
          break;
        }
        case 'e': {
          toggleScriptEditor();
          break;
        }
        case 't': {
          toggleTemplateEditor();
          break;
        }
        case 'p': {
          break;
        }
        case 'n': {
          toggleNodeRed();
        }
        case '1': {
          setNoteId(0);
          break;
        }
        case '2': {
          setNoteId(1);
          break;
        }
        case '3': {
          setNoteId(2);
          break;
        }
        case '4': {
          setNoteId(3);
          break;
        }
        case '5': {
          setNoteId(4);
          break;
        }
          case '6': {
          setNoteId(5);
          break;
        }
        case '7': {
          setNoteId(6);
          break;
        }
        case '8': {
          setNoteId(7);
          break;
        }
        case '9': {
          setNoteId(8);
          break;
        }
      }
    }
  }

  function toggleNodeRed() {
    if(RedActive) {
      RedActive = false;
    } else {
      RedActive = true;
      showExtScriptEditor = false;
      AboutOpen = false;
      MainMenuOpen = false;
      TodoOpen = false;
      RegExpOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleExtScriptEditor() {
    if(showExtScriptEditor) {
      showExtScriptEditor = false;
    } else {
      RedActive = false;
      showExtScriptEditor = true;
      AboutOpen = false;
      MainMenuOpen = false;
      TodoOpen = false;
      RegExpOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleAbout() {
    if(AboutOpen) {
      AboutOpen = false;
    } else {
      RedActive = false;
      AboutOpen = true;
      showExtScriptEditor = false;
      MainMenuOpen = false;
      TodoOpen = false;
      RegExpOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleMainMenu() {
    if(MainMenuOpen) {
      MainMenuOpen = false;
    } else {
      MainMenuOpen = true;
      RedActive = false;
      showExtScriptEditor = false;
      TodoOpen = false;
      AboutOpen = false;
      RegExpOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleTodoMenu() {
    if(TodoOpen) {
      TodoOpen = false;
    } else {
      TodoOpen = true;
      RedActive = false;
      showExtScriptEditor = false;
      MainMenuOpen = false;
      AboutOpen = false;
      RegExpOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleRegExpEditor() {
    if(RegExpOpen) {
      RegExpOpen = false;
    } else {
      RegExpOpen = true;
      RedActive = false;
      showExtScriptEditor = false;
      TodoOpen = false;
      MainMenuOpen = false;
      AboutOpen = false;
      ScriptEditorOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleScriptEditor() {
    if(ScriptEditorOpen) {
      ScriptEditorOpen = false;
    } else {
      ScriptEditorOpen = true;
      RedActive = false;
      showExtScriptEditor = false;
      RegExpOpen = false;
      TodoOpen = false;
      MainMenuOpen = false;
      AboutOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = false;
      window.Pref = false;
    }
  }

  function toggleTemplateEditor() {
    if(TemplateEditorOpen) {
      TemplateEditorOpen = false;
    } else {
      RedActive = false;
      ScriptEditorOpen = false;
      showExtScriptEditor = false;
      RegExpOpen = false;
      TodoOpen = false;
      MainMenuOpen = false;
      AboutOpen = false;
      PreferencePanelOpen = false;
      TemplateEditorOpen = true;
      window.Pref = false;
    }
  }

  function togglePreferences() {
    if(PreferencePanelOpen) {
      PreferencePanelOpen = false;
      window.Pref = false;
    } else {
      ScriptEditorOpen = false;
      RedActive = false;
      showExtScriptEditor = false;
      RegExpOpen = false;
      TodoOpen = false;
      MainMenuOpen = false;
      AboutOpen = false;
      PreferencePanelOpen = true;
      TemplateEditorOpen = false;
      window.Pref = true;
    }
  }

  function setNoteId(id) {
    if((id >= 0)&&(id <= 8)) {
      styles.buttons[currentid].selected = false;
      currentid = id;
      styles.buttons[id].selected = true;
    }
  }

  function saveUserPreferences() {
    ScriptPad.PREFERENCES = prefs
    ScriptPad.writePreferencesFile()
  }

  function saveUserStyles(styleName) {
    styles.buttons = styles.buttons.map((item) => {item.selected = false; return item;})
    if(!globalThis.styleList.includes(styleName)) {
      globalThis.styleList.push(styleName);
    }
    ScriptPad.STYLE = styles
    ScriptPad.writeStyleFile(styleName)
  }
</script>
