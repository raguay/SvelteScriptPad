<div id="Dir" >
  <p>{showdir}</p>
</div>

<style>
  #Dir {
    left: 5px;
    margin: 0px;
    float: left;
  }

  #Dir p {
    font-size: 14px;
    margin: 0px;
  }
</style>

<script>
  export let style = {};
  export let ScriptPad = {};
  export let dir = '';
  let showdir = '';

  $: showdir = dir;
</script>
