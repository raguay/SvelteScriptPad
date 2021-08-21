<div>
  <h2>Todos</h2>
  <div class="labelRadialHolder">
    <label class="styleLabel">Use NotePlan Todos?</label>
    <input class="PrefCheck" type="checkbox" bind:checked={preferences.UseNotePlan} on:change="{() => {taskChangeFire();}}" />
  </div>
  <div class="labelRadialHolder">
    <label class="styleLabel">Use TaskPaper style Todos?</label>
    <input class="PrefCheck" type="checkbox" bind:checked={preferences.UseTaskPaper} on:change="{() => {taskChangeFire();}}" />
  </div>
  {#if preferences.UseTaskPaper}
    <div class="fileListWrap">
      <label class="styleLabel">List the TaskPaper Files:</label>
      {#each preferences.taskpaper as file, key}
        <div class="listFileLoc">
          <span class="editSpan" on:click="{(event) => {editTaskPaperFile(file.name,file.loc,key);}}">✏️</span>
          <label class="listFileLocLabel" >{file.name}</label>
          <label class="listFileLocDirLabel">{file.loc}</label>
          <span class="deleteSpan" on:click="{(event) => {deleteTaskPaperFile(file.name);}}">❌</span>
        </div>
      {/each}
    </div>
    <button class="buttonStyle" style="background-color: {styles.editorBackground}; color: {styles.textcolor};" on:click="{(event) => {createNewTaskPaperFile('','');}}">Create a New TaskPaper List</button>
    {#if showNewTaskPaperPopup }
      <div id="NewTaskPaperDiv" style="background-color: {styles.editorBackground}; color: {styles.textcolor};">
        <label>Name</label>
        <input type="text" name="name" bind:value={nameNew} style="background-color: {styles.editorBackground}; color: {styles.textcolor};" />
        <label>Location</label>
        {#if locNew !== ''}
          <input type="text" name="location" bind:value={locNew} style="background-color: {styles.editorBackground}; color: {styles.textcolor};" />
        {:else}
          <input type="file" name="location" bind:value={locNew} style="background-color: {styles.editorBackground}; color: {styles.textcolor};" />
        {/if}
        <div class="buttonRow">
          <button class="buttonStyle" style="background-color: {styles.editorBackground}; color: {styles.textcolor};" on:click="{(event) => {saveTaskPaperFile(nameNew, locNew);}}">Save</button>
          <button class="buttonStyle" style="background-color: {styles.editorBackground}; color: {styles.textcolor};" on:click="{(event) => {showNewTaskPaperPopup = false;}}">Cancel</button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  #NewTaskPaperDiv {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 30%;
    left: 20%;
    border-radius: 5px;
    border-width: 5px;
    border-color: black;
    border-style: solid;
    padding: 5px 10px;
    z-index: 100;
  }

  #NewTaskPaperDiv label {
    width: 100%;
    margin: 10px 0px 0px 0px;
  }

  #NewTaskPaperDiv input {
    width: 100%;
    font-size: 15px;
    border-radius: 5px;
    box-shadow: inset 0px 0px 5px 2px #0f0a16;
    border: 2px #0f0a16;
    min-height: 20px;
    padding: 10px 10px 10px 10px;
    margin: 5px 5px 0px 5px;
    outline: none;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    -o-user-select: text;
    user-select: text;
  }

  .buttonStyle {
    border-radius: 5px;
    border-color: black;
    border-width: 3px;
    font-size: 15px;
    height: 30px;
    text-shadow: 2px 2px 2px black;
    box-shadow: 2px 2px 5px 2px black;
    outline: none;
    margin: 5px 10px;
    padding: 3px 6px 6px 6px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    cursor: pointer;
  }

  .styleLabel {
    font-size: 18px;
    margin: 0px 0px 0px 0px;
    user-select: none;
  }

  .labelRadialHolder {
    display: flex;
    flex-direction: row;
  }

  .PrefCheck {
    margin: 6px 0px 0px 10px;
    font-size: 20px;
  }
  .fileListWrap {
    display: flex;
    flex-direction: column;
    margin: 5px 0px 0px 5px;
  }

  .listFileLocLabel {
    width: 25%;
    max-width: 25%;
    margin: 0px 5px 0px 0px;
    flex-wrap: wrap;
  }

  .listFileLocDirLabel {
    width: 60%;
    max-width: 60%;
    margin: 0px;
    overflow-wrap: break-word;
  }

  .listFileLoc {
    display: flex;
    flex-direction: row;
    margin: 10px 0px 0px 0px;
  }

  .deleteSpan {
    margin: 0px 0px 0px 5px;
  }

  .editSpan {
    margin: 0px 5px 0px 0px;
  }

</style>

<script>
  import { createEventDispatcher } from 'svelte';

  export let styles = {};
  export let preferences = {};

  const dispatch = createEventDispatcher();
  let currentKey = -1;
  let nameNew = '';
  let locNew = '';
  let showNewTaskPaperPopup = false;

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function taskChangeFire() {
    fire('changeTodos', {
      taskpaper: preferences.taskpaper,
      UseTaskPaper: preferences.UseTaskPaper,
      UseNotePlan: preferences.UseNotePlan
    });  
  }

  function createNewTaskPaperFile(name, loc) {
    showNewTaskPaperPopup = true;
    nameNew = name;
    locNew = loc;
    currentKey = -1;
  }

  function deleteTaskPaperFile(nm) {
    showNewTaskPaperPopup = false;
    const index = preferences.taskpaper.findIndex((el) =>{ return(el.name === nm);});
    preferences.taskpaper.splice(index,1);
    preferences.taskpaper = preferences.taskpaper;
    currentKey = -1;
    taskChangeFire();
  }

  function editTaskPaperFile(name,loc,index) {
    showNewTaskPaperPopup = true;
    nameNew = name;
    locNew = loc;
    currentKey = index;
    taskChangeFire();
  }

  function saveTaskPaperFile(name, loc) {
    if(currentKey === -1) {
      const index = preferences.taskpaper.find((el) =>{ el.name === name;});
      if( index >= 0) {
        preferences.taskpaper[index] = {name: name, loc: loc};
      } else {
        preferences.taskpaper = preferences.taskpaper.concat({name: name, loc: loc});
      }
    } else {
        preferences.taskpaper[currentKey] = {name: name, loc: loc};
    }
    showNewTaskPaperPopup = false;
    currentKey = -1;
    taskChangeFire();
  }
</script>
