var vanjsx=(()=>{var k=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var I=Object.prototype.hasOwnProperty;var J=(e,t)=>{for(var i in t)k(e,i,{get:t[i],enumerable:!0})},w=(e,t,i,c)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of C(t))!I.call(e,o)&&o!==i&&k(e,o,{get:()=>t[o],enumerable:!(c=S(t,o))||c.enumerable});return e};var O=e=>w(k({},"__esModule",{value:!0}),e);var N={};J(N,{Fragment:()=>F,IS_BROWSER:()=>a,h:()=>y,initSSR:()=>X,isValidElement:()=>j,lazy:()=>v,options:()=>u,render:()=>h,resetId:()=>H,rewind:()=>$,use:()=>M});var a=typeof document!="undefined",E="dangerouslySetInnerHTML",b=e=>typeof e=="function",g=e=>typeof e=="string",_=e=>typeof e=="object",T=e=>e!=null,d=a?document:{},R=0,u={},j=e=>a?e instanceof HTMLElement:g(e)&&e[0]==="<",P=e=>Object.keys(e).reduce((t,i)=>t+i.split(/(?=[A-Z])/).join("-").toLowerCase()+":"+(typeof e[i]=="number"?e[i]+"px":e[i])+";","");function H(e){R=T(e)?e:0}function X(){a||H()}function h(e,t){t&&(t.hasChildNodes()&&(t.innerHTML=""),t.append(e))}var $=e=>h(e,null);function y(e,t,...i){t||(t={}),T(t.children)&&(i=i.concat(t.children));let c=i.flat().map(n=>typeof n=="number"?String(n):n).filter(Boolean);if(u.elem&&u.elem({props:t,type:e}),b(e)){c.length&&(t.children=a?c:c.join("")),u.fc&&u.fc({props:t,type:e});let n=e(t);if(a&&T(n)&&n.pop){let r=new DocumentFragment;return r.append(...n),r}return n}let o=a?d.createElement(e):`<${e}`;for(let n in t){let r=t[n];if(T(r)&&n!==E&&n!=="children"&&!b(r)&&(r=_(r)?P(r):r===!0?"":r===!1?null:r,T(r))){let l=n.toLowerCase();l==="classname"&&(l="class"),a?o.setAttribute(l,r):o+=` ${l}${r===""?"":`="${r}"`}`}}if(!a&&(o+=">",/area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/.test(e)))return o;if(t[E]){let n=t[E].__html;a?o.innerHTML=n:o+=n}else c.forEach(n=>{T(n)&&(a?o.append(n):g(n)?o+=n:n.pop&&(o+=n.join("")))});return a?o:o+=e?`</${e}>`:""}var F=e=>e.children;y.Fragment=F;function x(e){R--;let t=":"+R,i=()=>d.getElementById(t)||d.querySelector(`[ref="${t}"]`),c=0,o=l=>{c<2?l(i(),0):d.querySelectorAll(`[id="${t}"], [ref="${t}"]`).forEach((s,f)=>{l(s,f)})},n=l=>{o((s,f)=>{s&&(l(s),s.index=f)})},r=l=>(T(l.id)?l.ref=t:l.id=t,c++,y(e,l));return r.id=t,a?Object.setPrototypeOf(r,new Proxy({},{get:(l,s,f)=>{if(g(s)){let m=i()||{};if(b(m[s]))return(...L)=>n(p=>p[s](...L));if(T(m[s]))return m[s]}return f},set:(l,s,f)=>(g(s)&&n(m=>{m[s]=f}),!0)})):r}var M=Object.setPrototypeOf({element:x,mount:e=>(a&&Promise.resolve().then(e),e)},new Proxy({},{get:(e,t)=>()=>x(t)})),v=(e,t)=>i=>{let c=M.div();return M.mount(()=>{e().then(o=>{c.replaceWith(o.default(i))})}),y(c,i,t)};return O(N);})();
