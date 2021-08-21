<div id="PopUpMenu" style="background-color: { styles.scriptMenuBackground }; color: { styles.scriptMenuTextColor }" class="{openPopUp ? 'visible' : 'invisible'}" on:transitionend="{(event) => { transitionEnd() }}" on:keyup="{(event) => {processKeys(event);}}">
    <input id="menuInput" type="text" bind:this={filterInput} bind:value={filterString} on:change="{(event) => {inputChanged(event)}}" />
    <div>
        <ul id="MenuList" bind:this="{menuList}" >
            {#each scripts as usr, num}
                <li class="{cursorLoc == num ? 'cursor' : ''}" style="color: {usr.system ? styles.scriptMenuItemSystem : styles.scriptMenuItemUser};" on:click="{(event) => {runScript(usr, num)}}">{usr.name}</li>
            {/each}
        </ul>
    </div>
</div>

<style>
    #PopUpMenu {
        position: absolute;
        top: 25px;
        font-size: 15px;
        padding: 0px;
        margin: 0px;
        border-radius: 5px;
        max-height: 380px;
        overflow: hidden;
        -webkit-transition: 1.0s ease-in-out;
        -moz-transition: 1.0s ease-in-out;
        -o-transition: 1.0s ease-in-out;
        transition: 1.0s ease-in-out;
        z-index: 100;
        right: 10px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color:transparent;
        caret-color: transparent;
        outline-style:none;
    }

    #PopUpMenu div {
        padding: 0px;
        margin: 5px;
        overflow: scroll;
        max-height: 320px;
        outline: none;
        -webkit-user-select: none;  
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        -webkit-tap-highlight-color:transparent;
        caret-color: transparent;
        user-select: none;
        overflow-x: hidden;
    }

    #PopUpMenu div ul {
        padding: 0px;
        margin: 5px 3px 10px 3px;
        outline: none;
        min-width: 240px;
        max-width: 240px;
        width: 240px;
        -webkit-user-select: none;  
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        -webkit-tap-highlight-color:transparent;
        caret-color: transparent;
        user-select: none;
        overflow-x: hidden;
        overflow-y: auto;
    }

    #PopUpMenu div ul li {
        text-align: left;
        list-style: none;
        text-decoration: none;
        cursor: pointer;
        outline: none;
        -webkit-user-select: none;  
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        -webkit-tap-highlight-color:transparent;
        caret-color: transparent;
        user-select: none;
        min-width: 240px;
        max-width: 240px;
        width: 240px;
    }

    #menuInput {
        width: 240px;
        height: 35px;
        min-height: 35px;
        max-height: 35px;
        min-width: 240px;
        max-width: 240px;
        border-radius: 10px;
        font-size: 15px;
        padding-top: 5px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-left: 10px;
        margin: 5px;
        outline: none;
        -webkit-user-select: text;  
        -moz-user-select: text;
        -ms-user-select: text;
        -o-user-select: text;
        user-select: text;
        caret-color: black;
        -webkit-tap-highlight-color: white;
    }

    .visible {
        width: 250px;
    }

    .invisible {
        width: 0px;
    }

    .cursor {
        padding-left: 5px;
        color: black !important;
        background-color: white;
        border-radius: 7px;
        min-width: 229px !important;
        max-width: 229px !important;
        width: 229px !important;
    }
</style>

<script>
	import { createEventDispatcher } from 'svelte';
    import { onMount, beforeUpdate, afterUpdate, onDestroy } from 'svelte';
	
	const dispatch = createEventDispatcher();

    export let styles = {};
    export let openPopUp = false;
    export let usrscripts = [];
    export let syscripts = [];
    let menuList;
    let filterString = '';
    let cursorLoc = 0;
    let filterLen = 0;
    let scripts = [];
    let filterInput;

    $: scripts = usrscripts.concat(syscripts).filter((item) => {
        var matchString = filterString.toLowerCase().split('').join('.*');
        if(item.name.toLowerCase().match(matchString) != null) {
            return true;
        } else {
            return false;
        }
    });

    $: filterLen = scripts.length;
    $: cursorLoc = filterLen < cursorLoc ? filterLen-1 : cursorLoc;

    afterUpdate(() => {
        //
        // Make sure the cursor is in the right range. Only the upper
        // bound can change and needs to be checked.
        //
        if(cursorLoc > (filterLen) - 1) {
            cursorLoc = filterLen - 1;
        } else if(cursorLoc < 0) {
            cursorLoc = 0;
        }

        //
        // Put the element into the middle scroll area if possible.
        //
        if(openPopUp) {
            var el = menuList.getElementsByClassName('cursor')[0];
            if(el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: 'center',
                    inline: "start"
                });
            }
        }
    });

	function fire(name, data) {
		dispatch(name, {
    		data: data
  		});
	}

    function runScript(script, num) {
        fire('scriptSelected', script);
        openPopUp = false;
        cursorLoc = num;
    }

    function processKeys(event) {
        if((event.key == 'ArrowDown')||(event.key == 'ArrowUp')||(event.key == 'Enter')) { 
            event.stopPropagation();
            event.preventDefault();
            switch(event.key) {
                case 'ArrowDown': {
                    cursorLoc++;
                    if(cursorLoc > (filterLen - 1)) cursorLoc = filterLen - 1;
                    break;
                }
                case 'ArrowUp': {
                    cursorLoc--;
                    if(cursorLoc < 0) cursorLoc = 0;
                    break;
                }
                case 'Enter': {
                    runScript(scripts[cursorLoc],cursorLoc);
                    break;
                }
            }
        }        
    }

    function transitionEnd() {
        if(openPopUp) {
            //
            // focuse the input box;
            //
            filterInput.focus();

            //
            // Make sure the cursor is in the right range. Only the upper
            // bound can change and needs to be checked.
            //
            if(cursorLoc > (filterLen) - 1) {
                cursorLoc = filterLen - 1;
            } else if(cursorLoc < 0) {
                cursorLoc = 0;
            }
        } else {
            //
            // Tell the editor to focus.
            //
            fire('focusEditor',0);            
        }
    }

    function inputChanged(event) {
        //
        // Make sure the cursor is in the right range. Only the upper
        // bound can change and needs to be checked.
        //
        if(cursorLoc > (filterLen) - 1) {
            cursorLoc = filterLen - 1;
        } else if(cursorLoc < 0) {
            cursorLoc = 0;
        }
    }
</script>
