<div id="HeaderOutside">
    <div id="HeaderInside" style="border-bottom-color: {background};" >
    </div>
</div>

<style>
    #HeaderOutside {
        height: 10px;
        width: 490px;
        align-content: center;
    }

    #HeaderInside {
        position: absolute;
        left: 240px;
        width: 0; 
        height: 0; 
        color: transparent;
        background-color: transparent;
        border-top: 0px;        
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 10px solid;
    }
</style>

<script>
    export let background = 'red';
</script>