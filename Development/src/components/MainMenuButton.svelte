<div id="mainMenuButton" on:click="{(event) => { fire('toggleMainMenu',0) }}">
  <span id="firstHamburger" class="{openMenu ? 'hidden' : 'unhidden'}" style='background-color: {styles.textcolor};'></span>
  <span id="secondHamburger" class="{openMenu ? 'openX1' : 'close'}" style='background-color: {styles.textcolor};'></span>
  <span id="thirdHamburger" class="{openMenu ? 'openX2' : 'close'}" style='background-color: {styles.textcolor};'></span>
  <span id="fourthHamburger" class="{openMenu ? 'hidden' : 'unhidden'}" style='background-color: {styles.textcolor};'></span>
</div>

<style>
 #mainMenuButton {
    position: relative;
    height: 38px;
    width: 38px;
    margin: 3px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
 }

 #firstHamburger {
    display: block;
    position: absolute;
    height: 5px;
    border-radius: 10px;
    margin: 0px;
    padding: 0px;
    opacity: 1;
    left: 0;
    top: 7px;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;    
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
 }

 #secondHamburger {
    display: block;
    position: absolute;
    height: 5px;
    width: 35px;
    border-radius: 10px;
    margin: 0px;
    padding: 0px;
    opacity: 1;
    left: 0;
    top: 17px;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;    
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
 }

 #thirdHamburger {
    display: block;
    position: absolute;
    height: 5px;
    width: 35px;
    border-radius: 10px;
    margin: 0px;
    padding: 0px;
    opacity: 1;
    left: 0;
    top: 17px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;    
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
 }

 #fourthHamburger {
    display: block;
    position: absolute;
    height: 5px;
    border-radius: 10px;
    margin: 0px;
    padding: 0px;
    opacity: 1;
    left: 0;
    top: 27px;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color:transparent;
    outline-style:none;
 }

.unhidden {
    width: 35px;
}

.openX1 {
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
}

.openX2 {
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
}

.close {
    -webkit-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
}

.hidden {
    width: 0px;
}
</style>

<script>
  import { createEventDispatcher } from 'svelte';
    
  const dispatch = createEventDispatcher();

  export let openMenu = false;
  export let styles = {};

  function fire(name, data) {
    dispatch(name, {
        data: data
    });
  }
</script>
