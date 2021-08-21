<Header background="{styles.appBackground}" width="{headerWidth}" height="{window.preferences.headerHeight}" />
<div id='webview' 
     style='background-color: {styles.appBackground};
            color: {styles.textcolor};
            font-family: {styles.fontFamily};
            font-size: {styles.fontSize};
            width: {body.config.width}px;
            height: {body.config.height}px;'>
  {@html body.html}
  {#if body.config.showButton}
    <div id='buttonRow'>
      <button id="closeButton"
              type="button"
              color="{styles.appBackground}"
              on:click="{() => { close(); }}" >
        Close
      </button>
    </div>
  {/if}
</div>

<style>
  #webview {
    display: flex;
    flex-direction: column;
    margin: 0px;
    padding: 5px;
    border-radius: 10px;
    overflow-wrap: anywhere;
  }

  #buttonRow {
    display: flex;
    flex-direction: row;
    margin: 0px;
    padding: 0px;
  }

  #closeButton {
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
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import Header from './Header.svelte';

  export let styles;
  export let body;
  export let adjust;

  const dispatch = createEventDispatcher();

  let headerWidth;
  
  ; headerWidth = bodyChange(body);

  onMount(() => {
    globalThis.closeWebView = close;
    headerWidth = bodyChange(body);
  });

  function bodyChange(bod) {
    if(typeof body.config.width !== 'undefined') {
      adjust(false, body.config.height + 21, body.config.width + 10);
      return(body.config.width + 10);
    } else {
      return(window.defaults.width);
    }
  }

  function close() {
    dispatch('changeView',{
      name: 'scriptbar',
      body: {
      }
    });
  }
</script>

