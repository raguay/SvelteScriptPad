<div id="HeaderOutside" style="width: {width}px; height: {height}px;">
    <div id="HeaderInside" style="left: {position}px; height: {height}px; border-bottom-color: {background};" >
    </div>
</div>

<style>
    #HeaderOutside {
      align-content: center;
      margin: 0px;
      padding: 0px;
    }

    #HeaderInside {
      position: absolute;
      color: transparent;
      top: -9px;
      margin: 0px;
      padding: 0px;
      background-color: transparent;
      border-top: 0px;        
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid;
    }
</style>

<script>
  import { onMount } from 'svelte';
  
  export let background = 'red';
  export let width;
  export let height;

  let position = 0;

  $: position = adjustHeader(width, height);

  function adjustHeader(wd, ht) {
    if(typeof wd !== 'undefined') {
      return Math.floor(wd/2);
    } else {
      return(10);
    }
  }

  onMount(() => {
    position = adjustHeader(width, height);
  })
</script>
