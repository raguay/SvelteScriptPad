<div class='main' 
     style="height: {Math.floor(height)}px;" 
     data-index="{index}"
     bind:this={dom}>
  <p on:dblclick={(e) => { dispatch('dblclick',{});}} 
     on:contextmenu={(e) => { e.preventDefault(); middleButton(index);}}
     class='name' style="font-size: {style.fontSize};"
     data-index="{index}"
  >
    {disName}
  </p>
  <p class='value' 
     style="font-size: {style.fontSize};"
     data-index="{index}"
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
  }
</style>

<script>
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let style;
  export let name;
  export let config;
  export let socket = null;
  export let index;
  export let height;
  export let dom;

  let value = 'loading...';
  let disName;

  const dispatch = createEventDispatcher();

  $: NewSocket(socket);
  $: updateWidget(index);
  
  //
  // I'm using a reactive function call due to the fact that 
  // on mounting it is null and then it get's updated.
  //
  function NewSocket(soc) {
    if(soc !== null) {
      soc.on(config.flowVar, (data) => {
        if((data !== null) && (typeof data.days !== 'undefined')) {
          value = data.days;
          disName = name + ': ' + data.age;
        }
      });
    }
  }

  onMount(() => {
    disName = name;
  })
  
  function updateWidget(index) {
    getData();
    //dispatch('clearUpdate',{});
  }

  function getData() {
    //
    // Get the current value instead of waiting for the next update.
    //
    fetch('http://localhost:9978/api/nodered/var/' + config.flowVar)
                .then((resp) => { 
                  return resp.json();
                }).then((data) => {
                  if((data !== null) &&(data.text !== null)) {
                    if(typeof data.text.days !== 'undefined') {
                      value = data.text.days;
                    }
                    if(typeof data.text.age !== 'undefined') {
                      disName = name + ': ' + data.text.age;
                    } else {
                      disName = name;
                    }
                  }
                })
                .catch((err) => {
                  disName = name;
                  value = "not reachable";
                });
  }
  
  function middleButton(index) {
    dispatch('middleButton', {
      index: index
    })
  }
</script>
