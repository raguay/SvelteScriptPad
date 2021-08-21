<div id='about' class="{open ? 'visible' : 'invisible'}" style="background-color: {styles.appBackground}; color: {styles.textcolor};">
	<div id='innerAbout'>
       <h1>Script Pad</h1>
       <p>Created by Richard Guay
          <a href="mailto:raguay@customct.com">raguay@customct.com</a>
       </p>
       <p>Built With:</p>
       <div class="helpers">
        <div class="pimg" on:click="{(event) => {ScriptPad.nw.Shell.openExternal('https://svelte.dev');}}">
          <div class="pimgText">
            <p>Svelte</p>
         </div>
          <img src="branding-master/svelte-logo.svg" height=50 alt="Svelte Logo">
        </div>
        <div class="pimg" on:click="{(event) => {ScriptPad.nw.Shell.openExternal('https://nwjs.io/');}}">
          <div class="pimgText">
            <p>NW.js</p>
          </div>
          <img src="imgs/nwjs.png" height=50 width=50 alt="NW.js logo">
        </div>
        <div class="pimg" on:click="{(event) => {ScriptPad.nw.Shell.openExternal('https://github.com/jakedeichert/mask')}}">
          <div class="pimgText">
            <p>Mask</p>
            <img src="imgs/Mask.png" height=50 width=50 alt="Mask logo">
          </div>
        </div>
       </div>
       <Donate ScriptPad="{ScriptPad}" />
       <button on:click='{() => {fire("toggleAboutMenu", 0)}}' style="background-color: {styles.editorBackground}; color: {styles.textcolor};">Close</button>
   </div>
</div>

<style>
	#about {
		display: flex;
		flex-direction: column;
		height: 360px;
		font-size: 15px;
		overflow-y: scroll;
		overflow-x: hidden;
		list-style: none;
		position: absolute;
		margin: 0px;
		top: 20px;
		z-index: 200;
		-webkit-transition: 1.0s ease-in-out;
		-moz-transition: 1.0s ease-in-out;
		-o-transition: 1.0s ease-in-out;
		transition: 1.0s ease-in-out;
		text-align: center;
		-webkit-user-select: none;        
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color:transparent;
		outline-style:none;	
	}

	#innerAbout {
		max-width: 445px;
		min-width: 445px;
		width: 445px;
		display: flex;
		flex-direction: column;
		height: 320px;
		resize: none;
	}

  #innerAbout h1 {
    margin: 5px auto 10px auto;
  }

  #innerAbout p {
    margin: 5px 0px;
  }

	#innerAbout button {
   		border-radius: 5px;
   		font-size: 15px;
   		float: right;
   		height: 30px;
   		min-height: 30px;
   		width: 75px;
   		min-width: 75px;
   		margin: 10px auto 10px auto;
   		outline: none;
   		-webkit-user-select: none;        
   		-moz-user-select: none;
   		-ms-user-select: none;
   		-o-user-select: none;
   		user-select: none;
   		-webkit-tap-highlight-color:transparent;
   		outline-style:none;
   		border-color: black;
	}

	#innerAbout a {
   		text-decoration: none;
	}

  .helpers {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    margin: 5px 0px;
  }

  .pimg {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: flex-start;
    height: 75px;
    width: 100px;
  }

  .pimgText {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .pimg p {
    vertical-align: middle;
    margin: 5px 0p;
  }

	.visible {
		width: 445px;
		box-shadow: inset 0px 0px 5px 2px black;
		padding: 7px;
		left: 15px;
	}

	.invisible {
		width: 0px;
		box-shadow: inset 0px 0px 0px 0px black;
		padding: 0px;
		left: 5px;
	}
</style>

<script>
  import Donate from './Donate.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let styles = {};
  export let ScriptPad = {};
  export let open = false;

	function fire(name, data) {
		dispatch(name, {
    		data: data
  		});
	}
</script>
