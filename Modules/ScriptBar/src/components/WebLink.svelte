<div class='main'  
     style="height: {Math.floor(height)}px;"
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}
     bind:this={dom}>
  <span class='weblinkname'
    on:dblclick={(e) => { e.preventDefault(); dispatch('dblclick', {}); }}
  >
    {name}
  </span>
  <span class='weblinklink'
     on:click={(e) => { openLink(); }}
  >
    {#if config.browser[0] === '/'}
      {window.npath.basename(config.browser,'.app')}
    {:else}
      {config.browser}
    {/if}
  </span>
</div>

<style>
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: auto 0px auto 0px;
    padding: 0px;
  }

  .weblinkname {
    
  }

  .weblinklink {
    margin: 0px 0px 0px auto;
    cursor: pointer;
  }
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
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
  //
  // Function:     openLink
  //
  // Description:  This function opens the given link in the browser specified.
  //
  function openLink() {
    if(config.browser === 'internal') {
      fetch('http://localhost:9978/api/web/launch',{
        method: "PUT",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          url: config.link
        })
      });
    } else if(config.browser === 'system') {
      //
      // Launch on the system default browser.
      //
      nw.Shell.openExternal(config.link);
    } else {
      //
      // Launch using the specified program.
      //
      window.exec('/usr/bin/open -a "' + config.browser + '" "' + config.link + '"');
    }
  }
</script>
