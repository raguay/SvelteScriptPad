<div id="regExpEditorPanelStyle" class="{openRegExp ? 'visible' : 'invisible'}" style="background-color: {styles.appBackground}; color: {styles.textcolor};" on:transitionend="{(event) => { transitionEnd(event) }}" on:keyup="{(event) => {if(event.ctrlKey&&(event.keyCode == 77 )) { event.preventDefault(); event.stopPropagation(); togglePopUp();}}}" >
   <input class="regExpEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the RegExp Name." bind:value="{regExpName}" />
   <input class="regExpEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the Description of the RegExp." bind:value="{regExpDescription}" />
   <input bind:this="{RegExpElement}" class="regExpEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the Regular Expression" bind:value="{regExpExpression}" />
   <input class="regExpEditorInput" style="caret-color: {styles.textcolor}; background-color: {styles.appBackground}; color: {styles.textcolor};" placeholder="Enter the Replacement Expression." bind:value="{regExpReplace}" />
   <div id="regExpResults">
      <ul id="regExpList">
         {#if (regExpExpression !== '')&&(text !== '')}
            {#each getMatches(regExpExpression, text) as match}
               <li>
                 <div class="matchLine">
                    {@html subMatchString(match)}
                 </div>
                 {#if regExpReplace != ''}
                     <div class="replaceLine" on:click="{(event) => { replaceSingeLocation(text, match, regExpExpression, regExpReplace)}}">
                         <span>{@html calculateReplace(match, regExpExpression, regExpReplace)}</span>
                     </div>
                 {/if}
               </li>
            {/each}
         {/if}
      </ul>
   </div>
   <div id="buttonBar">
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {newAction()}}">New</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {saveAction()}}">Save</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {deleteAction()}}">Delete</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {changeAction()}}">Change</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {extractAction()}}">Extract</button>
      <button class="button" style="background-color: {styles.editorBackground}; border-color: {styles.appBackground}; color: {styles.textcolor}; " on:click="{() => {cancelAction()}}">Cancel</button>
   </div>
   <PopUpMenu styles="{styles}" openPopUp="{openPopUp}" syscripts="{[]}" usrscripts="{RegExpList}" on:scriptSelected="{(event) => { editRegExp(event.detail.data) }}" on:focusEditor="{(event) => {focus();}}" />
</div>

<style>
   #regExpEditorPanelStyle {
      height: 445px;
      font-size: 15px;
      right: 8px;
      overflow-y: scroll;
      overflow-x: hidden;
      list-style: none;
      position: absolute;
      margin: 0px;
      z-index: 90;
      -webkit-transition: 1.0s ease-in-out;
      -moz-transition: 1.0s ease-in-out;
      -o-transition: 1.0s ease-in-out;
      transition: 1.0s ease-in-out;      
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
      caret-color: transparent;
   }

   #regExpResults {
      height: 210px;
      width: 450px;
      min-width: 455px;
      max-width: 455px;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 5px, 0px, 5px, 0px;
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
      -webkit-user-select: text;        
      -moz-user-select: text;
      -ms-user-select: text;
      -o-user-select: text;
      user-select: text;
      -webkit-tap-highlight-color:transparent;
      outline-style: none;
   }

   #regExpList {
      list-style: none;
   }

   #buttonBar {
      display: flex;
      width: 455px;
      min-width: 455px;
      max-width: 455px;
      flex-direction: row;
      padding: 0px;
      justify-content: center;
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
   }

   .matchLine {
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
   }

   .replaceLine {
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
   }

   .button {
      border-radius: 5px;
      font-size: 15px;
      height: 30px;
      text-shadow: 2px 2px 2px black;
      box-shadow: 2px 2px 5px 2px black;
      outline: none;
      margin: 0px 5px;
      padding: 3px 6px 6px 6px;
      -webkit-user-select: none;        
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color:transparent;
      outline-style:none;
   }

   .regExpEditorInput {
      font-size: 15px;
      border-radius: 5px;
      box-shadow: inset 0px 0px 5px 2px #0f0a16;
      border: 2px #0f0a16;
      min-height: 30px;
      width: 455px;
      min-width: 455px;
      max-width: 455px;
      padding: 10px 10px 10px 10px;
      margin: 5px 5px 0px 5px;
      outline: none;
      -webkit-user-select: text;        
      -moz-user-select: text;
      -ms-user-select: text;
      -o-user-select: text;
      user-select: text;
   }

   .spanStyle {
      white-space: pre;
   }

   .visible {
      width: 477px;
      box-shadow: inset 0px 0px 5px 2px black;
      padding: 0px;
      top: 7px;
   }

   .invisible {
      width: 0px;
      box-shadow: inset 0px 0px 0px 0px black;
      padding: 0px;
      top: 15px;
   }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import PopUpMenu from './PopUpMenu.svelte';
  
  const dispatch = createEventDispatcher();

  export let preferences = {};
  export let ScriptPad = {};
  export let openRegExp = false;
  export let focusFN;
  export let RegExpList = [];
  export let styles = {};
  export let StoredText = {};
  export let currentid = 0;
  
  let openPopUp = false;
  let RegExpElement;
  let regExpReplace = '';
  let regExpExpression = '';
  let regExpDescription = '';
  let regExpName = '';
  let text;

   $: text = StoredText[currentid];

  function fire(name, data) {
    dispatch(name, {
      data: data
    });
  }

    function replaceSingeLocation(txt, match, regExp, replaceExp) {
        var front = txt.slice(0,match.index);
        var back = txt.slice(match.index + match[0].length);
        var result = match[0].replace(new RegExp(regExp), replaceExp).replace(/\\n/g,'\n').replace(/\\t/g,'\t');
        fire('saveText', front + result + back);
    }

    function calculateReplace(match, regExp, replaceExp) {
        var result = '';
        try {
            result = match[0].replace(new RegExp(regExp),replaceExp).replace(/\s/g,'&nbsp;');
        } catch(e) {
            result = '';
        }
        return(result);
    }

    function getMatches(regexpression, txt) {
      var result = [];
      if((txt !== '')&&(regexpression !== '')) {
         var match = null;
         try {
            var regexp = new RegExp(regexpression,'igm');
            //
            // loop and index help to detect for an endless loop
            // in checking for new matches.
            //
            var loop = false;
            var index = -1;
            while(((match = regexp.exec(txt)) !== null) && (!loop)) {
               if(match.index === index) loop = true;
               index = match.index;
               result.push(match);
            }
            if(loop) result = [];
         } catch(e) {
            result = [];
         }
      }
      return result;
   }

   function togglePopUp() {
      if(openPopUp) {
         openPopUp = false;
      } else {
         openPopUp = true;
      }
   }

   function subMatchString(matches) {
      var result = "";
      if(matches.length < 2) {
         result += matches[0].replace(/\s/g,'&nbsp;');
      } else {
         var index = 0;
         for(var i = 1; i<matches.length; i++) {
            var next = matches[0].indexOf(matches[i]);
            if(index < next) {
               var skipped = matches[0].slice(index,next);
               result += "<span class=\"spanStyle\" style=\"color: " + styles.textcolor + ";\">" + skipped.replace(/\s/g,'&nbsp;') + "</span>";
               index += skipped.length;
            }
            index += matches[i].length;
            result += "<span class=\"spanStyle\" style=\"color: " + styles.matchStyle[i] + ";\">" + matches[i].replace(/\s/g,'&nbsp;') + "</span>";
         }
         if(index < matches[0].length) {
            result += "<span class=\"spanStyle\" style=\"color: " + styles.textcolor + ";\">" + matches[0].slice(index).replace(/\s/g,'&nbsp;') + "</span>";
         }
      }
      return result;
   }
   
   function newAction() {
       regExpReplace = '';
       regExpExpression = '';
       regExpDescription = '';
       regExpName = '';
   }

  function cancelAction() {
    newAction();
    fire('toggleRegExp',0);
  }

   function saveAction() {
      fire('saveScript',{
        name: regExpName,
        description: regExpDescription,
        script: regExpExpression,
        insert: false
      });
      fire('toggleRegExp', 0);
   }

   function deleteAction() {
      fire('deleteScript',{
        name: regExpName,
        description: regExpDescription,
        script: regExpExpression,
        insert: false
      });
      fire('toggleRegExp', 0);
   }

   function changeAction() {
      fire('saveText', text.replace(new RegExp(regExpExpression,'igm'), regExpReplace).replace(/\\n/g,'\n').replace(/\\t/g,'\t'));
      fire('toggleRegExp', 0);
   }

   function extractAction() {
      fire('saveText', extractText());
      fire('toggleRegExp', 0);
   }

   function extractText() {
       if((text !== '')&&(regExpExpression !== '')) {
         var result = [];
         var match = null;
         try {
            var regexp = new RegExp(regExpExpression,'igm');
            while((match = regexp.exec(text)) !== null) {
               result.push(match[0]);
            }
         } catch(e) {
            result = [];
         }
      } else {
         result = [];
      }
      return(result.join('\n'));
   }

   function transitionEnd(event) {
      if(openRegExp) {
         if(!openPopUp) {
            RegExpElement.focus();
         }
      } else {
         focusFN();
      }      
   }

   function editRegExp(regexp) {
      regExpReplace = '';
      regExpExpression = regexp.script;
      regExpDescription = regexp.description;
      regExpName = regexp.name;
   }

   function focus() {
      RegExpElement.focus();
   }
</script>
