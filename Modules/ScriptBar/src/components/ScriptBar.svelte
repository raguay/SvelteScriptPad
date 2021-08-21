<Header background="{styles.appBackground}" width="{appWidth}" height="{window.preferences.headerHeight}" />
<div id='main' style='width: {appWidth-10}px;
                      height: {overlay > 0 ? overlay + 'px' : 'auto'};
                      background-color: {styles.appBackground};
                      color: {styles.textcolor};
                      font-family: {styles.fontFamily};
                      font-size: {styles.fontSize};' >
  {#if showAdd}
    <div id="addDialog"
         style='width: 100%; 
                background-color: {styles.appBackground};
                color: {styles.textcolor};
                font-family: {styles.fontFamily};
                font-size: {styles.fontSize};'>
      <div id='addDialogControls'>
        <p id="closeAddDialogControl"
           on:click="{() => { closeAddDialog() }}">
          X
        </p>
      </div>
      <AddComponent 
        styles={styles}
        types={widgetTypes}
        adjust={newAdjust}
        on:addNewComponent={addNewComponent}
      />
    </div>
  {/if}
  {#if showEdit}
    <div id="editDialog"
         style='width: 100%; 
                background-color: {styles.appBackground};
                color: {styles.textcolor};
                font-family: {styles.fontFamily};
                font-size: {styles.fontSize};'>
      <div id='editDialogControls'>
        <p id="closeEditDialogControl"
           on:click="{() => { closeEditDialog(); }}">
          X
        </p>
      </div>
      <EditComponent 
        styles={styles}
        widget={widgetToEdit}
        adjust={newAdjust}
        on:editComponent={editComponent}
        on:deleteComponent={deleteComponent}
      />
    </div>
  {/if}
  {#if showContainerMenu }
    <div id="containerMenu"
         style="background-color: {styles.appBackground};
                top: {Math.floor((containerRectBox.height/2) + containerRectBox.y)}px; 
                left: {Math.floor(containerRectBox.x + (containerRectBox.width/2))}px;">
      {#if currentContainer !== 0}
        <p class="ContainerMenuItem"
          on:click={(e) => { moveTabLeft(); }}
        >
          Move Left
        </p>
      {/if}
      {#if currentContainer !== (containers.length - 1)}
        <p class="ContainerMenuItem"
           on:click={(e) => { moveTabRight(); }}
        >
          Move Right
        </p>
      {/if}
      <p class="ContainerMenuItem"
        on:click={(e) => { deleteTab(); }}
      >
        Delete
      </p>
    </div>
  {/if}
  {#if showComponentMenu }
    <div id="ComponentMenu"
         style="background-color: {styles.appBackground};
                top: {Math.floor(componentRectBox.y)}px; 
                left: 20px;">
      {#if currentComponent !== 0}
        <p class="ComponentMenuItem"
          on:click={(e) => { moveComponentUp(); }}
        >
          Up
        </p>
      {/if}
      {#if currentComponent !== (widgets.length - 1)}
        <p class="ComponentMenuItem"
           on:click={(e) => { moveComponentDown(); }}
        >
          Down
        </p>
      {/if}
    </div>
  {/if}
  <div id="controls">
    <p id="addControl"
       on:click="{() => { openAddDialog(); }}" >
      +
    </p>
    <p id="closeControl"
       on:click="{() => { if(onClose !== null) onClose();}}" >
      X
    </p>
  </div>
  <div id='tabs'>
    {#each containers as container, index}
      {#if index === currentContainer}
        <div class='activeTab' 
             bind:this={container.this}>
          <EditSpanField 
            name={container.name}
            styles={styles}
            on:nameChanged={(e) => { changeContainerName(e.detail.name); }}
            on:middleButton={(e) => { toggleContainerMenu(); }}
          />
        </div>
      {:else}
        <div class='tab'
           on:click={() => { switchContainer(index); }}
           bind:this={container.this}
        >
          {container.name}
        </div>
      {/if}
    {/each}
    <div id='addTab' class='tab'
         on:click={() => { addTab(); }}
    >
      <span id='addTabText'>+</span>
    </div>
  </div>
  <div id="componentList">
    {#each widgets as widget, index}
      <svelte:component
        index={widget.name + "-" + index}
        height={widget.height}
        this={widget.widget} 
        style={styles}
        name={widget.name}
        config={widget.config}
        socket={socket}
        on:dblclick={() => { editWidget(widget); }}
        bind:dom={widget.dom}
        on:middleButton={(e) => { e.preventDefault(); toggleComponentMenu(index);}}
        on:changeView={(e) => { changeView(e.detail); }}
      />
    {/each}
  </div>
</div>

<style>
  #main {
    position: absolute;
    left: 0px;
    top: 10px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0px;
    padding: 5px;
    border-radius: 10px;
    overflow-x: hidden;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
  }
  
  #tabs {
    display: flex;
    flex-direction: row;
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
    overflow-x: auto;
    overflow-y: hidden;
    min-height: 30px;
    max-height: 30px;
    height: 30px;
  }
  
  #tabs::-webkit-scrollbar {
    height: 3px;
    background-color: rgba(255,255,255,0.5);
    border-radius: 3px;
  }

  #tabs::-webkit-scrollbar-thumb {
    height: 3px;
    background-color: rgba(10,10,10,0.3);
    border-radius: 3px;
  }

  #addTab {
    margin: 0px 0px 0px auto;
    cursor: pointer;
  }

  #addTabText {
    color: red;
    padding: 0px;
    margin: 0px;
  }

  #containerMenu {
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 10px;
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 5px 10px 5px 10px;
  }

  #closeEditDialogControl {
    color: red;
    cursor: pointer;
    margin: 0px 0px 0px auto;
  }

  #ComponentMenu {
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 10px;
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 5px 10px 5px 10px;
  }

  .ComponentMenuItem {
    padding: 0px;
    margin: 5px 0px 0px 0px;
  }

  .ComponentMenuItem:hover {
    color: white;
  }

  .ContainerMenuItem {
    cursor: pointer;
    margin: 5px 0px 0px 0px;
    padding: 0px;
  }

  .ContainerMenuItem:hover {
    color: white;
  }

  .tab {
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-bottom: 0px !important;
    border-radius: 50% 20% 0px 0px;
    cursor: pointer;
    user-select: none;
    padding: 2px 8px;
    margin: 0px 1px 0px 0px;
    height: 20px;
  }

  .activeTab {
    border: 2px solid rgba(255, 255, 255, 0.6) !important;
    border-bottom: 0px !important;
    border-radius: 50% 20% 0px 0px;
    cursor: pointer;
    user-select: none;
    padding: 2px 8px;
    margin: 0px 1px 0px 0px;
    height: 20px;
  }

  #editDialog {
    position: absolute;
    left: 5px;
    top: 5px;
    margin: 0px;
    padding: 5px;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
  }

  #editDialogControls {
    margin: 0px 5px 0px auto;
    padding: 0px;
    color: red;
    cursor: pointer;
  }

  #addDialog {
    position: absolute;
    left: 5px;
    top: 5px;
    margin: 0px;
    padding: 5px;
    border-radius: 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  #controls {
    display: flex;
    flex-direction: row;
    justify-content: flex;
    width: 100%;
    height: 10px;
    margin: 0px 0px 10px 0px;
    padding: 0px;
  }

  #closeControl {
    margin: 0px 5px 0px auto;
    padding: 0px;
    color: red;
    cursor: pointer;
  }
  
  #addControl {
    margin: 0px 0px 0px 5px;
    padding: 0px;
    color: red;
    cursor: pointer;
  }

  #addDialogControls {
    margin: 0px 5px 0px auto;
    padding: 0px;
    color: red;
    cursor: pointer;
  }

  #closeAddDialogControl {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    height: 10px;
    margin: 0px 0px 10px 0px;
    padding: 0px;
  }

  #componentList {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0px;
    padding: 0px;
  }

</style>

<script>
  import io from 'socket.io-client';
  import { createEventDispatcher, onMount } from 'svelte';
  import AddComponent from './AddComponent.svelte';
  import EditComponent from './EditComponent.svelte';
  import EditSpanField from './EditSpanField.svelte';
  import Header from './Header.svelte';

  //
  // The following components are widgets in the application and 
  // their configuration widget.
  //
  import FlowVariable from './FlowVariable.svelte';
  import FlowVariableConfig from './FlowVariableConfig.svelte';
  import Separator from './Separator.svelte';
  import SeparatorConfig from './SeparatorConfig.svelte';
  import BirthdayCounter from './BirthdayCounter.svelte';
  import BirthdayCounterConfig from './BirthdayCounterConfig.svelte';
  import IPAddress from './IPAddress.svelte';
  import IPAddressConfig from './IPAddressConfig.svelte';
  import IntIPAddress from './IntIPAddress.svelte';
  import IntIPAddressConfig from './IntIPAddressConfig.svelte';
  import Script from './Script.svelte';
  import ScriptConfig from './ScriptConfig.svelte';
  import WebLink from './WebLink.svelte';
  import WebLinkConfig from './WebLinkConfig.svelte';
    
  export let adjust;
  export let styles;
  export let oldState;
  export let onClose;
  
  let appBaseHeight = 72; // This is the height of everything but the widgets.
  let containers = [{
    name: 'Info',
    widgets: []
  }];
  let widgets = [];
  let widgetTypes;
  let socket;
  let showAdd = false;
  let showEdit = false;
  let widgetToEdit;
  let currentID = 0;
  let currentContainer;
  let currentComponent;
  let showContainerMenu = false;
  let containerRectBox;
  let showComponentMenu = false;
  let componentRectBox;
  let appHeight = window.preferences.appHeight;
  let appWidth = window.preferences.appWidth;
  let overlay = 0;
  let savedHeight = 0;
  
  const dispatch = createEventDispatcher();

  onMount(() => {
    //
    // Create the widgetTypes structure.
    //
    widgetTypes = [{
      moduleName: 'FlowVariable',
      module: FlowVariable,
      config: FlowVariableConfig,
      configHeight: 70
    }, {
      moduleName: 'Separator',
      module: Separator,
      config: SeparatorConfig,
      configHeight: 70
    }, {
      moduleName: 'BirthdayCounter',
      module: BirthdayCounter,
      config: BirthdayCounterConfig,
      configHeight: 70
    }, {
      moduleName: 'IPAddress',
      module: IPAddress,
      config: IPAddressConfig,
      configHeight: 194
    }, {
      moduleName: 'IntIPAddress',
      module: IntIPAddress,
      config: IntIPAddressConfig,
      configHeight: 124
    }, {
      moduleName: 'Script',
      module: Script,
      config: ScriptConfig,
      configHeight: 333
    }, {
      moduleName: 'WebLink',
      module: WebLink,
      config: WebLinkConfig,
      configHeight: 133
    }];
    
    //
    // Set the old state if it's been set.
    //
    setOldState(oldState);
    
    //
    // Get the widget list from the user's configuration.
    //
    getWidgets();

    //
    // Setup the socket.io connection to listen to.
    //
    if((typeof window.preferences.port !== 'undefined') && (window.socketio !== 'undefined')) {
      socket = io.connect('http://localhost:' + window.preferences.port);
    }
  });

  function setOldState(old) {
    if(typeof old !== 'undefined') {
      if(typeof old.container !== 'undefined') {
        currentContainer = old.container;
        currentComponent = 0;
      } else {
        currentContainer = 0;
        currentComponent = 0;
      }
    } else {
      currentContainer = 0;
      currentComponent = 0;
    }
  }

  function getWidgets() {
    //
    // Get the configuration.
    //
    fetch('http://localhost:9978/api/scriptbar/config/')
    .then((resp) => { 
      return resp.json();
    }).then((data) => {
        containers = data.config;
        widgets = [];
        window.preferences.appHeight = appBaseHeight;
        if(typeof containers[currentContainer].widgets !== 'undefined') {
          containers[currentContainer].widgets = addWidgets(containers[currentContainer].widgets);
        }
        window.containers = containers;
    });
  }

  function switchContainer(contNum) {
    widgets = [];
    window.preferences.appHeight = appBaseHeight;
    currentContainer = contNum;
    containers[contNum].widgets = addWidgets(containers[contNum].widgets);
  }

  function saveWidgets() {
    //
    // Save the widgets for loading latter.
    //
    fetch('http://localhost:9978/api/scriptbar/config/', {
      method: 'PUT',
      mode: 'cors', 
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ config: containers })
    });
  }
  
  function addWidgets(obj) {
    for(var i = 0; i < obj.length; i++) {
      var tmp = widgetTypes.find(mod => obj[i].widgetName === mod.moduleName);
      if(typeof tmp !== 'undefined') {
        //
        // Add the widget module definition.
        //
        obj[i].widget = tmp.module;
        obj[i].configWidget = tmp.config;
        obj[i].configHeight = tmp.configHeight;

        //
        // Add an ID.
        //
        obj[i].id = currentID;
        currentID = currentID + 1;
        
        //
        // Adjust the height based on the number of widgets. Loop over all the 
        // widgets and add together their heights. It should be a part of it's 
        // structure.
        //
        window.preferences.appHeight += obj[i].height;
        
        //
        // Add it to the list of widgets to be displayed.
        //
        widgets.push(obj[i]);
      }
    }
    //
    // Adjust the window.
    //
    appHeight = window.preferences.appHeight;
    newAdjust(true, window.preferences.appHeight, window.defaults.width);
    containers[currentContainer].widgets = widgets;
    return widgets;
  }
  
  function addNewComponent(e) {
    widgets = addWidgets([e.detail.module]);
    containers[currentContainer].widgets = widgets;
    closeAddDialog();
    saveWidgets();
  }

  function editWidget(widget) {
    widgetToEdit = widget;
    openEditDialog();
  }

  function editComponent(e) {
    widgets = widgets.map((item) => {
      if(item.id === e.detail.module.id) {
        appHeight -= item.height;
        item.name = e.detail.module.name;
        item.height = parseInt(e.detail.module.height, 10);
        item.config = e.detail.module.config;
        appHeight += item.height;
      }
      return(item);
    })
    lastComputedHeight = appHeight;
    closeEditDialog();
    containers[currentContainer].widgets = widgets;
    saveWidgets();
  }

  function deleteComponent(e) {
    widgets = widgets.filter((item) => {
      if(item.id !== e.detail.module.id) {
        return(item);
      } else {
        window.preferences.appHeight -= item.height;
        appHeight -= item.height
      }
    });
    closeEditDialog();
    containers[currentContainer].widgets = widgets;
    saveWidgets();
  }

  function openEditDialog() {
    showEdit = true;
  }

  function closeEditDialog() {
    showEdit = false;
    appHeight = 65;
    newAdjust(true, appHeight);
  }

  function openAddDialog() {
    showAdd = true;
  }

  function closeAddDialog() {
    showAdd = false;
    appHeight = 65;
    newAdjust(true, appHeight);
  }

  function addTab() {
    containers.push({
      name: 'New',
      widgets: []
    });
    containers = containers;
    saveWidgets();
  }

  function changeContainerName(name) {
    containers[currentContainer].name = name;
    containers = containers;
    saveWidgets();
  }

  function toggleContainerMenu() {
    showContainerMenu = !showContainerMenu;
    if(showContainerMenu) {
      containerRectBox = containers[currentContainer].this.getBoundingClientRect();
      savedHeight = appHeight;
      if(appHeight < 163) {
        overlay = 163;
        appHeight = overlay;
      }
      newAdjust(false, appHeight);
    } else {
      overlay = 0;
      appHeight = savedHeight;
      newAdjust(true, appHeight);
    }
  }

  function moveTabLeft() {
    containerRectBox = containers[currentContainer - 1].this.getBoundingClientRect();
    if(currentContainer !== 0) {
      var tmp = containers[currentContainer];
      currentContainer = currentContainer - 1;
      containers[currentContainer + 1] = containers[currentContainer];
      containers[currentContainer] = tmp;
    }
    containers = containers;
    saveWidgets();
  }

  function moveTabRight() {
    containerRectBox = containers[currentContainer + 1].this.getBoundingClientRect();
    if(currentContainer !== (containers.length-1)) {
      var tmp = containers[currentContainer];
      currentContainer = currentContainer + 1;
      containers[currentContainer - 1] = containers[currentContainer];
      containers[currentContainer] = tmp;
    }
    containers = containers;
    saveWidgets();
  }

  function deleteTab() {
    containers = containers.filter((item, index) => {
      if(index !== currentContainer) {
        return(true);
      } else {
        return(false);
      }
    });
    currentContainer = 0;
    overlay = 0;
    widgets = [];
    window.preferences.appHeight = appBaseHeight;
    containers[currentContainer].widgets = addWidgets(containers[currentContainer].widgets);
    widgets = containers[currentContainer].widgets;
    showContainerMenu = false;
    saveWidgets();
  }

  function toggleComponentMenu(id) {
    currentComponent = id;
    if(widgets.length > 1) {
      window.widgets = widgets;
      showComponentMenu = !showComponentMenu;
      if(showComponentMenu) {
        componentRectBox = widgets[id].dom.firstChild.getBoundingClientRect();
        appHeight = window.preferences.appHeight + widgets[id].configHeight;
        newAdjust(false, appHeight);
      } else {
        componentRectBox = {};
        currentComponent = 0;
        appHeight = 65;
        newAdjust(true, appHeight);
      }
    }
  }

  function moveComponentUp() {
    if(currentComponent !== 0) {
      componentRectBox = widgets[currentComponent - 1].dom.firstChild.getBoundingClientRect();
      var tmp = widgets[currentComponent];
      currentComponent = currentComponent - 1;
      widgets[currentComponent + 1] = widgets[currentComponent];
      widgets[currentComponent] = tmp;
      containers[currentContainer].widgets = widgets;
    }
    containers = containers;
    saveWidgets();
  }

  function moveComponentDown() {
    if(currentComponent !== (widgets.length-1)) {
      componentRectBox = widgets[currentComponent + 1].dom.firstChild.getBoundingClientRect();
      var tmp = widgets[currentComponent];
      currentComponent = currentComponent + 1;
      widgets[currentComponent - 1] = widgets[currentComponent];
      widgets[currentComponent] = tmp;
      containers[currentContainer].widgets = widgets;
    }
    containers = containers;
    saveWidgets();
  }

  function changeView(data) {
    data.scriptbar = {
      container: currentContainer
    };
    dispatch('changeView', data);
  }

  function newAdjust(useCalc, minheight, minwidth) {
    if(typeof minheight !== 'undefined') {
      appHeight = minheight;
    }
    if(typeof minwidth !== 'undefined') {
      appWidth = minwidth;
    }
    adjust(useCalc, appHeight, appWidth);
  }
</script>

