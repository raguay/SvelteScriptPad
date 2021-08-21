<div class='main'  
     style="height: {Math.floor(height)}px;"
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}
     on:dblclick={(e) => { e.preventDefault(); dispatch('dblclick', {}); }}
     bind:this={dom}>
  <hr />
</div>

<style>
  .main {
    width: 100%;
    height: 20px;
    display: flex;
    flex-direction: row;
    margin: auto 0px auto 0px;
    padding: 0px;
  }

  .main hr {
    width: 100%;
    margin: 0px;
    padding: 0px;
    align-self: center;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  
  export let style;
  export let name;
  export let config;
  export let socket;
  export let index;
  export let height;
  export let dom;
  
  const dispatch = createEventDispatcher();
  
  function middleButton(index) {
    dispatch('middleButton', {
      index: index
    })
  }
</script>
