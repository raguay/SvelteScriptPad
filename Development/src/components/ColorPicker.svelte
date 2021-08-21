{#if show}
    <div id="colorPicker" style="background-color: {background}; color: {textColor}" >
        <p>The color for {explainText}:</p>
        <canvas id="picker" bind:this="{canvas}" ></canvas><br>
        <input id="color"  bind:this="{input}" value='{color}' on:keyup="{(event) => { processKey(event);}}" />
        <button on:click="{(event) => {saveColor()}}" style="background-color: {background}; color: {textColor};" >Select</button>
        <button on:click="{(event) => {quitColorPicker();}}" style="background-color: {background}; color: {textColor};" >Quit</button>
    </div>
{/if}

<style>
    #colorPicker button {
        border-radius: 5px;
        border-color: black;
        font-size: 15px;
        height: 30px;
        text-shadow: 2px 2px 2px black;
        box-shadow: 2px 2px 5px 2px black;
        outline: none;
        margin: 0px 10px;
        padding: 3px 6px 6px 6px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color:transparent;
        outline-style:none;
    }

    #colorPicker button:active {
        box-shadow: inset 2px 2px 5px 2px black;
    }

   #colorPicker {
        position: absolute;
        top: 8%;
        left: 8%;
        z-index: 100;
        padding: 20px;
        border: 3px solid black;
        border-radius: 10px;
    }
</style>

<script>
    import { createEventDispatcher, afterUpdate } from 'svelte';
    import { KellyColorPicker } from './html5kellycolorpicker.js';
    export let color = "";
    export let id = 0;
    export let background = "black";
    export let textColor = "white";
    export let show = false;
    export let item = 'circle';
    export let explainText = '';
    let canvas;
    let input;
    let picker = {};
	const dispatch = createEventDispatcher();

    afterUpdate(() => {
        if(show) {
            picker = new KellyColorPicker({
                place: canvas, 
                input: input, 
                colorSaver: true,
                methodSwitch: true
            });
        }
    });

    function fire(name, data) {
        dispatch(name, {
            data: data
        });
    }

    function quitColorPicker() {    
        fire('quitColorPicker',{})
    }

    function saveColor() {
        document.body.style.cursor = 'default';
        fire('colorChanged',{color: input.value, id: id});
    }

    function processKey(event) {
        if(event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            saveColor();
        }
    }
</script>
