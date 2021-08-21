<div id="todoButton" on:click="{() => {fire('toggleTodo', 0)}}">
  {#if iconAddress !== null }
    <img src="{iconAddress}" height=35 width=35 alt='Clipboard Icon for Todos' />
  {/if}
</div>

<style>
	#todoButton {
		width: 35px;
		height: 35px;
		margin: 5px;
		padding: 0px;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color:transparent;
		outline-style:none;
	}

	img {
    	-webkit-user-select: none;
    	-moz-user-select: none;
    	-ms-user-select: none;
    	-o-user-select: none;
    	user-select: none;
    	-webkit-tap-highlight-color:transparent;
    	outline-style:none;		
	}
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  export let iconAddress = null;
	
  const dispatch = createEventDispatcher();

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }
</script>
