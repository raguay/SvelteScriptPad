<svelte:head>
    <title>ScriptBar</title>
</svelte:head>

<svelte:window on:blur="{() => {if(onBlur !== null) onBlur();}}" 
               on:close="{() => { if(onClose !== null) onClose();}}" />

{#if view === 'scriptbar'}
  <ScriptBar 
    adjust={adjust}
    styles={styles}
    oldState={scriptbar}
    onClose={onClose}
    on:changeView={(e) => {viewChange(e.detail);}}
  />
{:else if view === 'webview'}
  <WebView
    styles={styles}
    body={body}
    on:changeView={(e) => {viewChange(e.detail);}}
    adjust={adjust}
  />
{:else}
  <div id='errorPage'>
    <h1>Something went wrong</h1>
    <p>Sorry, but you somehow got to a place that isn't reachable.</p>
    <p>Press be button below to get back to the normal page.</p>
    <button
      on:click={() => { view = 'scriptbar'}}
    >
      Go Back
    </button>
  </div>
{/if}

<style>
  #errorPage {
    display: flex;
    flex-direction: column;
    background-color: white;
    color: black;
  }

  #errorPage button {
    border-radius: 5px;
    font-size: 15px;
    height: 30px;
    outline: none;
    margin: 10px auto 10px auto;
    padding: 6px 6px 6px 6px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    outline-style:none;
    background-color: rgba(255, 255, 255, 0.3);
  }

  :global(body) {
    margin: 0px;
    padding: 0px;
    border: 0px;
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
    border: 0px solid transparent;
    border-radius: 10px;
    overflow: hidden;
  }
</style>

<script>
  import { onMount } from 'svelte';
  
  import ScriptBar from './components/ScriptBar.svelte';
  import WebView from './components/WebView.svelte';

  export let onBlur;
  export let onClose;
  export let adjust;
  export let prefs;
  
  let styles = {
      appBackground: '#191B1E',
      textcolor: '#B3B0B0',
      fontSize: '14px',
      fontFamily: 'Arial'
    };
  let view = 'scriptbar';     // which view page to display. Default to scriptbar.
  let body = {                // WebView configuration information. This is minimum.
    html: '<h1>Web View</h1>',
    config: {
      width: 200,
      height: 400
    }
  }
  let scriptbar;
  
  //
  // Function:    viewChange
  //
  // Description: A function to change the view being displayed. Sort of a page 
  //              controler. It also saves information from a previous page used 
  //              to get back to the original location.
  //
  function viewChange(viewChange) {
    //
    // See if the view change parameter has a scriptbar section. If so, 
    // save it for future returns.
    //
    if( typeof viewChange.scriptbar !== 'undefined') {
      scriptbar = viewChange.scriptbar;
    } 

    //
    // Set the view name and the configuration (body) for the view. This is 
    // designed to go from scriptbar view to web view with the body containing 
    // the html and configurations for the website.
    //
    view = viewChange.name;
    body = viewChange.body;

    if(view === 'scriptbar') {
      //
      // Coming back to scriptbar, set the default application width.
      //
      window.preferences.appWidth = globalThis.defaults.width;
    }
  }
</script>
