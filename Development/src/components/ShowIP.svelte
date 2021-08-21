<div id="IP" >
  <p on:click="{() => { showServer(); }}">{showip}</p>
</div>

<style>
  #IP {
    right: 5px;
    margin: 0px;
    float: right;
  }

  #IP p {
    font-size: 14px;
    margin: 0px;
    cursor: pointer;
  }
</style>

<script>
  export let style = {};
  export let ScriptPad = {};
  
  let showip = ScriptPad.getIP();
  let serverPage = null;
  
  function showServer() {
    ScriptPad.nw.Window.open('http://localhost:9978/',{
      id: 'ScriptPadServerPage'
      }, function(win) {
        serverPage = win;
    });
  }
</script>
