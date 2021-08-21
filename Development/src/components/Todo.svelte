<div id=todoPanel  class="{openPanel ? 'normal' : 'hidden'}" style='background-color: {styles.editorBackground}; color: {styles.textcolor}' >
  <input id="todoInput" bind:value="{todoItem}" on:keydown="{(event)=>{if(event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); createTodo();}}}" style='background-color: {styles.editorBackground}; color: {styles.textcolor}'/>
  <div>
    {#if todos}
      <ul id="tabs">
        {#each todos as todo}
          {#if todo.name === currentTodo}
            <li class="tabName current">{todo.name}</li>
          {:else}
            <li class="tabName notCurrent" on:click="{(event) => { setNewCurrent(todo.name);}}">{todo.name}</li>
          {/if}
        {/each}
      </ul>
      <div id="todoListWrap">
        {#each todos as todo,key1}
          {#if todo.name === currentTodo}
            <div class="todoListPanel activePanel">
              <ul class="todoList">
                {#each todo.todos as item,key2}
                  {#if !item.delete && !item.done }
                    <li class="todoListItem">
                      <span class="checkboxIcon" on:click="{(event) => {changeDone(key1,key2)}}">
                        {#if item.done}
                          ☑️
                        {:else}
                          🔳
                        {/if}
                      </span>
                      <span class="description">{item.description}</span>
                      <span class="deleteIcon" on:click="{(event) => { changeDelete(key1, key2)}}">
                        ❌
                      </span>
                    </li>
                  {/if}
                {/each}
                {#each todo.todos as item,key2}
                  {#if !item.delete && item.done }
                    <li class="todoListItem">
                      <span class="checkboxIcon" on:click="{(event) => {changeDone(key1,key2)}}">
                        {#if item.done}
                          ☑️
                        {:else}
                          🔳
                        {/if}
                      </span>
                      <span class="description">{item.description}</span>
                      <span class="deleteIcon" on:click="{(event) => { changeDelete(key1, key2)}}">
                        ❌
                      </span>
                    </li>
                  {/if}
                {/each}
              </ul>
            </div>
          {:else}
            <div class="todoListPanel inactivePanel">
              <ul class="todoList">
                {#each todo.todos as item}
                  {#if !todo.delete}
                    <li class="todoListItem">
                      {item.description}
                    </li>
                  {/if}
                {/each}
              </ul>
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  #todoPanel {
    display: flex;
    flex-direction: column;
    height: 400px;
    resize: none;
    font-size: 15px;
    position: absolute;
    margin: 0px;
    right: 10px;
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
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
    overflow: hidden;
  }

  #tabs {
    display: flex;
    flex-direction: row;
    margin: 5px 0px 5px 0px;
    padding: 0px;
    list-style-type: none;
    width: 460px;
    min-width: 460px;
    max-width: 460px;
    padding: 5px 0px 0px 10px;
  }

  #todoListWrap {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 304px;
    padding: 10px 0px 0px 10px;
  }

  #todoInput {
    font-size: 15px;
    border-radius: 5px;
    box-shadow: inset 0px 0px 5px 2px #0f0a16;
    border: 2px #0f0a16;
    min-height: 30px;
    width: 455px;
    min-width: 455px;
    max-width: 455px;
    padding: 10px 10px 10px 10px;
    margin: 10px 5px 0px 10px;
    outline: none;    
  }

  .normal {
    width: 476px;
    box-shadow: inset 0px 0px 5px 2px black;
    padding: 0px;
    top: 5px;
  }

  .hidden {
    width: 0px;
    box-shadow: inset 0px 0px 0px 0px black;
    padding: 0px;
    top: 15px;
  }

  .tabName {
    font-size: 10px;
    list-style: none;
    margin: 0px 10px 0px 0px;
    padding: 0px;
    cursor: pointer;
  }

  .deleteIcon {
    flex: 0;
    height: 25px;
    width: 25px;
    margin: 0px 10px 0px 0px;
    cursor: pointer;
  }

  .checkboxIcon {
    flex: 0;
    height: 25px;
    width: 25px;
    margin: 0px 10px 0px 0px;
    cursor: pointer;
  }

  .description {
    flex: 2;
    -webkit-user-select: text; /* Safari */
    -khtml-user-select: text; /* Konqueror HTML */
    -moz-user-select: text; /* Firefox */
    -ms-user-select: text; /* Internet Explorer/Edge */
    user-select: text;
    width: 400px;
    min-width: 400px;
    max-width: 400px;
    overflow-wrap: break-word;
  }

  .current {
    color: white;
  }

  .notCurrent {
    color: gray;
  }

  .todoListPanel {
    width: 460px;
    min-width: 460px;
    max-width: 460px;
  }

  .activePanel {
    display: flex;
    flex-direction: column;
  }

  .inactivePanel {
    display: none;
  }

  .todoListItem {
    display: flex;
    flex-direction: row;
    list-style: none;
    align-items: center;
  }

  .todoList {
    margin-block-start: 0px;
    margin-block-end: 0px;
    list-style-type: none;
    padding-inline-start: 0px;
    padding: 0px;
    margin: 0px;
  }
</style>

<script>
  import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  export let openPanel = false;
  export let preferences = {};
  export let styles = {};
  export let updateTodos = false;
  export let ScriptPad = {};

  const dispatch = createEventDispatcher();
  let todos = [];
  let currentTodo = '';
  let todoItem = '';

  $: updateTodos = updateTodos ? getTodos() : false;

  onMount(() => {
    todos = ScriptPad.getTodos(getTodos);
    currentTodo = todos[0].name;

    //
    // Run the file watchers after booting. Currently set for a one minute
    // delay. The watching of files while NW.js is still loading causes a lock
    // up condition. 
   // here as well.
    //
    setTimeout( () => {
      ScriptPad.setFileWatches();
    }, 1000*60);
  });

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

  function createTodo() {
    todos = todos.map((list) => {
      if(list.name === currentTodo) {
        list.todos = [{
          description: todoItem,
          done: false,
          delete: false
        }].concat(list.todos);
      }
      return list;
    });
    todoItem = '';
    saveTodos();
  }

  function setNewCurrent(name) {
    currentTodo = name;
  }

  function changeDelete(key1, key2) {
    todos[key1].todos[key2].delete = !todos[key1].todos[key2].delete;
    if(!todos[key1].todos[key2].done) {
      changeDone(key1, key2);
    }
    saveTodos();
  }

  function changeDone (key1, key2) {
    todos[key1].todos[key2].done = !todos[key1].todos[key2].done;
    if(todos[key1].todos[key2].done) {
      //
      // Add the @done tag
      //
      todos[key1].todos[key2].description += " @done(" + ScriptPad.moment().format('MM/DD/YYYY') + ")";
    } else {
      //
      // Remove the @done tag if there.
      //
      todos[key1].todos[key2].description = todos[key1].todos[key2].description.replace(/@done\([^\)]*\)/,'')
    }
    saveTodos();
  }

  function getTodos() {
    fire('clearUpdateTodos',{});
    todos = ScriptPad.getTodos(getTodos);
    if(todos !== []) {
      if(currentTodo === '') {
        setNewCurrent(todos[0].name);
      }
    }
    ScriptPad.setFileWatches();
  }

  function saveTodos() {
    ScriptPad.saveTodos(todos);
  }
</script>
