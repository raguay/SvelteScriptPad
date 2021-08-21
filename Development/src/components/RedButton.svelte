<div id='RedButton'>
  <div class="{active ? 'Large' : 'Small'} buttonDiv" on:click="{() => { fire('redclick', null)}}">
  </div>
</div>

<style>
  #RedButton {
    padding: 0px;
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

	.buttonDiv {
		display: inline-block;
		padding: 0px;
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color:transparent;
		outline-style:none;
    background-color: red;
	}

	.Large {
		height: 38px;
		width: 38px;
		border-radius: 38px;
		margin: 2px;
	}

	.Small {
		height: 34px;
		width: 34px;
		border-radius: 34px;
		margin: 4px;
	}		
</style>

<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();

  export let active = false;
  
	function fire(name,data) {
		dispatch(name, {
    		data: data
  		});
	}
</script>
