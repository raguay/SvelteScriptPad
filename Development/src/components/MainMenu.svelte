<div id=menuPanel  
     class="{openMenu ? 'normal' : 'hidden'}" 
     style='background-color: {styles.appBackground}; color: {styles.textcolor};'
     on:blur={closemenu}>
  <h3 class='HeaderName'> General Items </h3>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showAbout()}}">About</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showHelp()}}">Help</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showPreferences()}}">Preferences</a>
  <hr />
  <h3 class='HeaderName'> Program Helpers </h3>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showScriptEditor()}}">Script Editor</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showExtScriptEditor()}}">External Script Editor</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showRegExpEditor()}}">Regular Expression Editor</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showTemplateEditor()}}">Template Editor</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {showNodeRed()}}">Node-Red</a>
  <hr />
 <h3 class='HeaderName'> Modules </h3>
  {#each getModuleList() as mod, key}
    {#if mod.live}
      <p class='modName' data-key={key}>{mod.name} - running</p>
    {:else}
      <p class='modName' data-key={key}>{mod.name} - not running</p>
    {/if}
  {:else}
    <p>No modules have been loaded.</p>
  {/each}
  <hr />
  <h3 class='HeaderName'> Installers </h3>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{installAlfred}">Install Alfred Workflow</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {installKeyboardMaestro()}}">Install Keyboard Maestro Scripts</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {installDropzone3()}}">Install DropZone 3 Action</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {installPopClip()}}">Install PopClip Extension</a>
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {installLaunchbarActions()}}">Install LaunchBar Actions</a>
  <hr />
  <a href='#top' class='menuItem' style='color: {styles.textcolor};' on:click="{() => {quitApplication()}}">Quit</a>
</div>

<style>
  .HeaderName {
    margin: 0px;
    padding: 0px 0px 5px 0px;
  }
  
  .modName {
    margin: 0px;
    padding: 0p;
  }

  #menuPanel {
    display: flex;
    flex-direction: column;
    height: 310px;
    width: 310px;
    resize: none;
    font-size: 15px;
    box-shadow: inset 0px 0px 5px 2px black;
    padding: 7px;
    overflow-y: scroll;
    overflow-x: hidden;
    list-style: none;
    position: absolute;
    margin: 0px;
    top: 80px;
    z-index: 110;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
  }

  #menuPanel hr {
    width: 100%;
  }

  #menuPanel a {
    cursor: pointer;
  }

  #menuPanel a:hover {
    color: white;
  }

  .menuItem {
    text-decoration: none;
  }

  .normal {
    left: 5px;
    display: flex;
    -webkit-transition: 0.75s ease-in-out;
    -moz-transition: 0.75s ease-in-out;
    -o-transition: 0.75s ease-in-out;
    transition: 0.75s ease-in-out;
  }

  .hidden {
    left: -330px;
    display: none;
    -webkit-transition: 1.0s ease-in-out;
    -moz-transition: 1.0s ease-in-out;
    -o-transition: 1.0s ease-in-out;
    transition: 1.0s ease-in-out;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let styles = {};
  export let ScriptPad = {};
  export let openMenu = false;
  export let preferences = {};

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function showAbout() {
    fire('toggleAboutMenu', 0);
  }

  function showHelp() {
    ScriptPad.showHelp();
    closemenu();
  }

  function showPreferences() {
    fire('togglePreferences',0);
  }

  function showScriptEditor() {
    fire('toggleScriptEditor', 0);
  }
  
  function showExtScriptEditor() {
    fire('toggleExtScriptEditor', 0);
  }

  function showRegExpEditor() {
    fire('toggleRegExp', 0);
  }

  function showTemplateEditor() {
    fire('toggleTemplateEditor',0);
  }

  function showNodeRed() {
    fire('toggleNodeRed', 0);
  }

  function installAlfred() {
    ScriptPad.installAlfred();
    closemenu();
  }

  function installKeyboardMaestro() {
    ScriptPad.installKeyboardMaestro();
    closemenu();
  }

  function installDropzone3() {
    ScriptPad.installDropzone();
    closemenu();
  }

  function installPopClip() {
    ScriptPad.installPopClip();
    closemenu();
  }

  function installLaunchbarActions() {
    ScriptPad.installLaunchBar();
    closemenu();
  }

  function quitApplication() {
    ScriptPad.quit();
  }

  function getModuleList() {
    return globalThis.moduleWin;
  }

  function closemenu() {
    if(openMenu) {
      fire('toggleMainMenu',0);
    }
  }
</script>
