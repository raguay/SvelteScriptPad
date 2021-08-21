<div id="CommandPanel" class="{openPanel ? 'visible' : 'invisible'}" style="background-color: {styles.appBackground};">
  <div id="TopInfo">
    {#if RedActive}
      Node-Red Panel
    {:else}
      <ShowDirectory style="{styles}" ScriptPad="{ScriptPad}" dir="{dirs[WorkspaceID]}" />
    {/if}
    <ShowIP style="{styles}" ScriptPad="{ScriptPad}" />
  </div>
  <Console 
    styles="{styles}" ScriptPad="{ScriptPad}" 
    on:setdir="{(event) => { setdir(event.detail.data); }}"
    dir="{dirs[WorkspaceID]}" visible="{consoleVisible}"
  />
  <NodeRed 
    styles="{styles}" ScriptPad="{ScriptPad}"
    visible="{RedActive}" 
  />
  <div id="CommandMenu" class="{openMenu ? 'visibleMenu' : 'invisibleMenu'}" style="background-color: {styles.appBackground};" >
    <hr />
    <a href="#top" style="color: {styles.textcolor};" on:click="{(event) =>{fire('toggleCommandConsole'); openMenu = !openMenu;}}">Quit</a>
  </div>
  <div id='controlsClosure'>
    <CommandPanelButton openMenu="{openMenu}" styles="{styles}" on:toggleCommandMenu="{(event) => {openMenu = !openMenu}}" />
    <ButtonBar buttons="{styles.commandbuttons}" on:selected="{(event) => {setWorkspaceId(event.detail.data)}}" />
    <RedButton active="{RedActive}" on:redclick="{(event) => { RedActive = !RedActive; }}" />
  </div>
</div>

<style>
  #CommandPanel {
    display: flex;
    flex-direction: column;
    height: 438px;
    width: 480px;
    resize: none;
    font-size: 15px;
    overflow-y: hidden;
    overflow-x: hidden;
    list-style: none;
    position: absolute;
    margin: 0px;
    top: 5px;
    padding: 5px;
    z-index: 110;
    -webkit-transition: 0.75s ease-in-out;
    -moz-transition: 0.75s ease-in-out;
    -o-transition: 0.75s ease-in-out;
    transition: 0.75s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline-style: none;
  }

  #TopInfo {
    width: 100%;
    height: 20px;
  }

  #CommandMenu {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 50px;
    left: 10px;
    height: 50px;
    z-index: 500;
    -webkit-transition: 0.75s ease-in-out;
    -moz-transition: 0.75s ease-in-out;
    -o-transition: 0.75s ease-in-out;
    transition: 0.75s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline-style: none;
    overflow: hidden;
 }

  #CommandMenu a {
    cursor: pointer;
    text-decoration: none;
    padding: 5px;
  }

  #CommandMenu a:hover {
    color: white;
  }

  #CommandMenu hr {
    width: 95%;
  }

  #controlsClosure {
    position: absolute;
    padding: 3px 5px;
    bottom: 5px;
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

  .visible {
    left: 0px;
 }

  .invisible {
    left: -500px;
 }
  .visibleMenu {
    width: 60px;
  }
  
  .invisibleMenu {
    width: 0px;
  }

</style>

<script>
  import ButtonBar from './ButtonBar.svelte';
  import CommandPanelButton from './CommandPanelButton.svelte';
  import ShowDirectory from './ShowDirectory.svelte';
  import ShowIP from './ShowIP.svelte';
  import Console from './Console.svelte';
  import RedButton from './RedButton.svelte';
  import NodeRed from './NodeRed.svelte';
  import { createEventDispatcher } from 'svelte';
    
  export let openPanel = false;
  export let preferences = {};
  export let styles = {};
  export let ScriptPad = {};

  let dirs = ['/Users/raguay','/Users/raguay/Documents','','','','','','',''];
  let WorkspaceID = 0;
  let openMenu = false;
  let consoleVisible = false;
  let RedActive = false;
  const dispatch = createEventDispatcher();
 
  function fire(name, data) {
    dispatch(name, {
        data: data
    });
  }
  
  function setWorkspaceId(newID) {
    styles.commandbuttons[WorkspaceID].selected = false;
    WorkspaceID = newID;
    styles.commandbuttons[newID].selected = true;
    styles = styles;
  }

  function setdir(newDir) {
    dirs[WorkspaceID] = newDir;
  }
</script>
