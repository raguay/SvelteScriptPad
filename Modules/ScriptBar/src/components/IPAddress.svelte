<div class='main' 
     style="height: {Math.floor(height)}px;" 
     data-index="{index}"
     bind:this={dom}>
  <p class='name' 
     on:dblclick={(e) => { dispatch('dblclick',{});}}
     style='font-size: {style.fontSize};'
     data-index="{index}"
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}
     >{name}</p>
  <p class='value' 
    style='font-size: {style.fontSize};'
    on:click="{(event) => { ClickIP(); }}"
    data-index="{index}">{value}</p>
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
  
  $: NewSocket(socket);
  $: updateWidget(index);
   
  const dispatch = createEventDispatcher();
  
  //
  // I'm using a reactive function call due to the fact that 
  // on mounting it is null and then it get's updated.
  //
  function NewSocket(soc) {
    if(soc !== null) {
      soc.on(config.flowVar, (data) => {
        if(data !== null) {
          if(typeof data.ip !== 'undefined') {
            value = data.ip;
          }
          ipaddress = 'http://' + value + ':' + config.port;
        }
      });
    }
  }

  function ClickIP() {
    if(config.showLink) {
      window.nw.Clipboard.get().set(ipaddress);
    }
  }

  function updateWidget(index) {
    getData();
  }

  function getData() {
    //
    // Get the current value instead of waiting for the next update.
    //
    fetch('http://localhost:9978/api/nodered/var/' + config.flowVar)
                .then((resp) => { 
                  return resp.json();
                }).then((data) => {
                  if((data !== null)&&(data.text !== null)) {
                    if(typeof data.text.ip !== 'undefined') {
                      value = data.text.ip;
                    }
                    ipaddress = 'http://' + value + ':' + config.port;
                  } else {
                    value = 'loading...';
                    ipaddress = '';
                  }
                });
  }

  onMount(() => {
    getData();
  })
  
  function middleButton(index) {
    dispatch('middleButton', {
      index: index
    })
  }
</script>
