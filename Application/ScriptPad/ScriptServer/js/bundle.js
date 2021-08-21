var app=function(){"use strict";function t(){}function e(t){return t()}function r(){return Object.create(null)}function n(t){t.forEach(e)}function o(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e){t.appendChild(e)}function i(t,e,r){t.insertBefore(e,r||null)}function a(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function u(){return f(" ")}function d(t,e){e=""+e,t.data!==e&&(t.data=e)}function p(t,e,r){t.style.setProperty(e,r)}let m;function g(t){m=t}function y(t){(function(){if(!m)throw new Error("Function called outside component initialization");return m})().$$.on_mount.push(t)}function $(){const t=m;return(e,r)=>{const n=t.$$.callbacks[e];if(n){const o=function(t,e){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,!1,!1,e),r}(e,r);n.slice().forEach(e=>{e.call(t,o)})}}}const h=[],v=Promise.resolve();let b=!1;const k=[],x=[],C=[];function _(t){x.push(t)}function w(){const t=new Set;do{for(;h.length;){const t=h.shift();g(t),E(t.$$)}for(;k.length;)k.shift()();for(;x.length;){const e=x.pop();t.has(e)||(e(),t.add(e))}}while(h.length);for(;C.length;)C.pop()();b=!1}function E(t){t.fragment&&(t.update(t.dirty),n(t.before_render),t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_render.forEach(_))}let N;function T(t,r,l){const{fragment:c,on_mount:i,on_destroy:a,after_render:s}=t.$$;c.m(r,l),_(()=>{const r=i.map(e).filter(o);a?a.push(...r):n(r),t.$$.on_mount=[]}),s.forEach(_)}function S(t,e){t.$$.dirty||(h.push(t),b||(b=!0,v.then(w)),t.$$.dirty=r()),t.$$.dirty[e]=!0}function O(e,o,l,c,i,a){const s=m;g(e);const f=o.props||{},u=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:i,bound:r(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(s?s.$$.context:[]),callbacks:r(),dirty:null};let d=!1;var p;u.ctx=l?l(e,f,(t,r)=>{u.ctx&&i(u.ctx[t],u.ctx[t]=r)&&(u.bound[t]&&u.bound[t](r),d&&S(e,t))}):f,u.update(),d=!0,n(u.before_render),u.fragment=c(u.ctx),o.target&&(o.hydrate?u.fragment.l((p=o.target,Array.from(p.childNodes))):u.fragment.c(),o.intro&&e.$$.fragment.i&&e.$$.fragment.i(),T(e,o.target,o.anchor),w()),g(s)}class P{$destroy(){var e,r;r=!0,(e=this).$$&&(n(e.$$.on_destroy),e.$$.fragment.d(r),e.$$.on_destroy=e.$$.fragment=null,e.$$.ctx={}),this.$destroy=t}$on(t,e){const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(e),()=>{const t=r.indexOf(e);-1!==t&&r.splice(t,1)}}$set(){}}function j(e){var r,n,o,l,u,m=e.item.name;return{c(){var t,c,i,a;r=s("div"),n=s("p"),o=f(m),r.className=l=(e.active?"inactive":"active")+" scriptItem svelte-1r0mmc",p(r,"background-color",e.item.color),p(r,"color",e.item.textColor),t=r,c="click",i=e.click_handler,t.addEventListener(c,i,a),u=(()=>t.removeEventListener(c,i,a))},m(t,e){i(t,r,e),c(r,n),c(n,o)},p(t,e){t.item&&m!==(m=e.item.name)&&d(o,m),t.active&&l!==(l=(e.active?"inactive":"active")+" scriptItem svelte-1r0mmc")&&(r.className=l),t.item&&(p(r,"background-color",e.item.color),p(r,"color",e.item.textColor))},i:t,o:t,d(t){t&&a(r),u()}}}function L(t,e,r){const n=$();let{pref:o,item:l,style:c}=e,i=!1;function a(t){var e,r;s(),e="itemClicked",r=Object.assign(t,{toggle:s}),n(e,{data:r})}function s(){r("active",i=!i)}return t.$set=(t=>{"pref"in t&&r("pref",o=t.pref),"item"in t&&r("item",l=t.item),"style"in t&&r("style",c=t.style)}),{pref:o,item:l,style:c,active:i,launchScript:a,click_handler:function(t){a(l)}}}class B extends P{constructor(t){super(),O(this,t,L,j,l,["pref","item","style"])}}function I(e){var r,n;return{c(){r=s("div"),(n=s("h2")).textContent="ScriptPad Launcher",n.className="svelte-1555lr1",r.id="header",p(r,"background-color",e.style.backgroundColor),p(r,"color",e.style.textColor),r.className="svelte-1555lr1"},m(t,e){i(t,r,e),c(r,n)},p(t,e){t.style&&(p(r,"background-color",e.style.backgroundColor),p(r,"color",e.style.textColor))},i:t,o:t,d(t){t&&a(r)}}}function q(t,e,r){let{pref:n,style:o}=e;return t.$set=(t=>{"pref"in t&&r("pref",n=t.pref),"style"in t&&r("style",o=t.style)}),{pref:n,style:o}}class z extends P{constructor(t){super(),O(this,t,q,I,l,["pref","style"])}}function A(t,e,r){const n=Object.create(t);return n.item=e[r],n}function D(t){var e,r=new B({props:{style:t.style,pref:t.pref,item:t.item}});return r.$on("itemClicked",t.itemClicked_handler),{c(){r.$$.fragment.c()},m(t,n){T(r,t,n),e=!0},p(t,e){var n={};t.style&&(n.style=e.style),t.pref&&(n.pref=e.pref),t.list&&(n.item=e.item),r.$set(n)},i(t){e||(r.$$.fragment.i(t),e=!0)},o(t){r.$$.fragment.o(t),e=!1},d(t){r.$destroy(t)}}}function F(t){for(var e,r,o,l,m,g,y,$,h,v=new z({props:{style:t.style,pref:t.pref}}),b=t.list,k=[],x=0;x<b.length;x+=1)k[x]=D(A(t,b,x));function C(t,e,r){var n;k[t]&&(e&&(n=(()=>{k[t].d(e),k[t]=null}),N.callbacks.push(n)),k[t].o(r))}return{c(){v.$$.fragment.c(),e=u(),r=s("div");for(var n=0;n<k.length;n+=1)k[n].c();o=u(),l=s("div"),m=s("p"),g=f(t.redvar),y=f(" changed to "),$=f(t.redval),r.id="ScriptGrid",p(r,"background-color",t.style.backgroundColor),p(r,"color",t.style.textColor),r.className="svelte-7gla5x",l.id="newVars"},m(t,n){T(v,t,n),i(t,e,n),i(t,r,n);for(var a=0;a<k.length;a+=1)k[a].m(r,null);i(t,o,n),i(t,l,n),c(l,m),c(m,g),c(m,y),c(m,$),h=!0},p(t,e){var o={};if(t.style&&(o.style=e.style),t.pref&&(o.pref=e.pref),v.$set(o),t.style||t.pref||t.list){b=e.list;for(var l=0;l<b.length;l+=1){const n=A(e,b,l);k[l]?(k[l].p(t,n),k[l].i(1)):(k[l]=D(n),k[l].c(),k[l].i(1),k[l].m(r,null))}for(N={remaining:0,callbacks:[]};l<k.length;l+=1)C(l,1,1);N.remaining||n(N.callbacks)}h&&!t.style||(p(r,"background-color",e.style.backgroundColor),p(r,"color",e.style.textColor)),h&&!t.redvar||d(g,e.redvar),h&&!t.redval||d($,e.redval)},i(t){if(!h){v.$$.fragment.i(t);for(var e=0;e<b.length;e+=1)k[e].i();h=!0}},o(t){v.$$.fragment.o(t),k=k.filter(Boolean);for(let t=0;t<k.length;t+=1)C(t,0);h=!1},d(t){v.$destroy(t),t&&(a(e),a(r)),function(t,e){for(let r=0;r<t.length;r+=1)t[r]&&t[r].d(e)}(k,t),t&&(a(o),a(l))}}}function G(t,e,r){let{list:n,pref:o,style:l}=e,c="",i="";return y(()=>{setTimeout(()=>{globalThis.io=io(),globalThis.io.on("connection",t=>{globalThis.socket=t}),globalThis.io.on("varchanged",t=>{r("redvar",c=t.variable),r("redval",i=t.value)})},5e3)}),t.$set=(t=>{"list"in t&&r("list",n=t.list),"pref"in t&&r("pref",o=t.pref),"style"in t&&r("style",l=t.style)}),{list:n,pref:o,style:l,redvar:c,redval:i,itemClicked_handler:function(t){var e;e=t.detail.data,setTimeout(()=>{e.toggle()},500)}}}const M=new class extends P{constructor(t){super(),O(this,t,G,F,l,["list","pref","style"])}}({target:document.body,props:{list:[{name:"Open fman",description:"Open a copy of the fman program.",script:"",args:[],color:"lightgreen",textColor:"darkgreen"},{name:"Create Todos",description:"Create the todo list.",script:"createtodo",args:[],color:"lightpink",textColor:"blue"},{name:"Compile ScriptPad",description:"Do a full compile job on ScriptPad.",script:"compileSP",args:[],color:"yellow",textColor:"black"}],pref:{},style:{backgroundColor:"lightblue",textColor:"black"}}});return window.app=M,M}();
//# sourceMappingURL=bundle.js.map