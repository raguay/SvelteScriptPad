<div class="donateButton">
  <form on:submit|preventDefault="{() => {ScriptPad.nw.Shell.openExternal('https://www.paypal.com/cgi-bin/webscr')}}" method="post" target="_blank">
    <input type="hidden" name="cmd" value="_s-xclick" alt="button command">
    <input type="image" alt="PayPal: A safe way to make donations." src="imgs/btn_donateCC_LG.gif" border="0" name="submit">
    <img alt="PayPal Button" border="0" src="imgs/pixel.gif" width="1" height="1">
  </form>
</div>

<style>
  .donateButton {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 20px 0px 0px 0px;
    padding: 0px;
  }

  .donateButton input {
    border: 0px;
  }
</style>

<script>
  export let ScriptPad;
</script>

