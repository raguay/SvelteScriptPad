<div class='main' 
     style="height: {Math.floor(height)}px;" 
     data-index="{index}"
     bind:this={dom}>
  <p on:dblclick={(e) => { dispatch('dblclick',{});}} 
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}
     class='name' style='font-size: {style.fontSize};' 
     data-index="{index}"
  >
    {name}
  </p>
  <p class='value' 
     style='font-size: {style.fontSize};' 
     on:click="{(event) =>{ clickIP();}}" data-index="{index}"
  >
    {value}
  </p>
</div>

<style>
  .main {
    width: 100%;
    display: flex;
    flex-direction: row;
    margin: auto 0px auto 0px;
    padding: 0px;
  }

  .name {
    margin: 0px;
    padding: 0px;
  }

  .value {
    margin: 0px 0px 0px auto;
    padding: 0px;
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

  let value = 'loading...';
  let ipaddress = '';
  
  const dispatch = createEventDispatcher();
  
  $: updateWidget(index);
  
  function getData() {
    //
    // Get the current value instead of waiting for the next update.
    //
    fetch('http://localhost:9978/api/getip')
                .then((resp) => { 
                  return resp.json();
                }).then((data) => {
                  if(data !== null) {
                    if(typeof data.ip !== 'undefined') {
                      value = data.ip;
                    }
                    ipaddress = 'http://' + value + ':' + config.port;
                  }
                });
  }

  onMount(() => {
    getData();
  })

  function updateWidget(index) {
    getData();
  }

  function clickIP() {
    if(config.showLink) {
      window.nw.Clipboard.get().set(ipaddress);
    }
  }
  
  function middleButton(index) {
    dispatch('middleButton', {
      index: index
    })
  }
</script>
