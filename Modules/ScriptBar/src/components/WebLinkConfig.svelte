<div class='WebLinkConfig'>
  <label for='LinkAddress'
         class='componentLabel' >
    What is the link address?
  </label>
  <input id='LinkAddress'
         type="text"
         class="componentInput"
         bind:value={config.link}
         on:change={() => { dispatch('change',{
           link: config.link,
           browser: config.browser
         });}}
  />
  <label for='Browser'
         class='componentLabel' >
    What browser to use?
  </label>
  <select id='Browser'
         class="componentInput"
         bind:value={config.browser}
         on:change={() => { dispatch('change',{
           link: config.link,
           browser: config.browser
         });}}
  >
    <option value="internal">Internal</option>
    <option value="system">System Default</option>
    {#each browserList as browser}
      <option value="{browser.loc}">{browser.name}</option>
    {/each}
  </select>
</div>

<style>
  .WebLinkConfig {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .componentLabel {
    margin: 5px 0px 5px 0px;
  }

  .componentInput {
    margin: 5px 0px 10px 0px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.3);
  }
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let config;
  export let style;
  
  const dispatch = createEventDispatcher();
  
  let browserList = [];
  
  onMount(() => {
    //
    // Figure out which browsers are on this computer.
    //
    if(window.fs.existsSync('/Applications/Safari.app')) {
      browserList.push({
        name: 'Safari',
        loc: '/Applications/Safari.app'
      });
    }
    if(window.fs.existsSync('/Applications/Google Chrome.app')) {
      browserList.push({
        name: 'Google Chrome',
        loc: '/Applications/Google Chrome.app'
      });
    }
    if(window.fs.existsSync('/Applications/FireFox.app')) {
      browserList.push({
        name: 'FireFox',
        loc: '/Applications/FireFox.app'
      });
    }
    if(window.fs.existsSync('/Applications/FireFox Nightly.app')) {
      browserList.push({
        name: 'FireFox Nightly',
        loc: '/Applications/FireFox Nightly.app'
      });
    }
    browserList = browserList;
  })
</script>
