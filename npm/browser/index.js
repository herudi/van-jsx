var vanjsx=(()=>{var g=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var F=Object.getOwnPropertyNames;var S=Object.prototype.hasOwnProperty;var C=(e,t)=>{for(var i in t)g(e,i,{get:t[i],enumerable:!0})},I=(e,t,i,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of F(t))!S.call(e,r)&&r!==i&&g(e,r,{get:()=>t[r],enumerable:!(a=h(t,r))||a.enumerable});return e};var _=e=>I(g({},"__esModule",{value:!0}),e);var v={};C(v,{Fragment:()=>x,IS_BROWSER:()=>l,h:()=>E,initSSR:()=>P,isValidElement:()=>J,options:()=>d,render:()=>R,resetId:()=>b,rewind:()=>$,use:()=>X});var l=typeof document!="undefined",k="dangerouslySetInnerHTML",y=e=>typeof e=="function",u=e=>typeof e=="string",w=e=>typeof e=="object",T=e=>e!=null,m=l?document:{},H=0,d={},J=e=>l?e instanceof HTMLElement:u(e)&&e[0]==="<",O=Promise.prototype.then.bind(Promise.resolve()),j=e=>Object.keys(e).reduce((t,i)=>t+i.split(/(?=[A-Z])/).join("-").toLowerCase()+":"+(typeof e[i]=="number"?e[i]+"px":e[i])+";","");function b(){H=0}function P(){l||b()}function R(e,t){t&&(t.hasChildNodes()&&(t.innerHTML=""),t.append(e))}var $=e=>R(e,null);function E(e,t,...i){t||(t={}),T(t.children)&&(i=i.concat(t.children));let a=i.flat().map(n=>typeof n=="number"?String(n):n).filter(Boolean);if(d.elem&&d.elem({props:t,type:e}),y(e)){a.length&&(t.children=l?a:a.join("")),d.fc&&d.fc({props:t,type:e});let n=e(t);if(l&&T(n)&&n.pop){let o=new DocumentFragment;return o.append(...n),o}return n}let r=l?m.createElement(e):`<${e}`;for(let n in t){let o=t[n];if(T(o)&&n!==k&&n!=="children"&&!y(o)&&(o=w(o)?j(o):o===!0?"":o===!1?null:o,T(o))){let s=n.toLowerCase();s==="classname"&&(s="class"),l?r.setAttribute(s,o):r+=` ${s}${o===""?"":`="${o}"`}`}}if(!l&&(r+=">",/area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr/.test(e)))return r;if(t[k]){let n=t[k].__html;l?r.innerHTML=n:r+=n}else a.forEach(n=>{T(n)&&(l?r.append(n):u(n)?r+=n:n.pop&&(r+=n.join("")))});return l?r:r+=e?`</${e}>`:""}var x=e=>e.children;E.Fragment=x;function N(){H--;let e=":"+H,t=()=>m.getElementById(e)||m.querySelector(`[ref="${e}"]`),i=0,a=o=>{i<2?o(t(),0):m.querySelectorAll(`[id="${e}"], [ref="${e}"]`).forEach((s,c)=>{o(s,c)})},r=o=>{a((s,c)=>{s&&(o(s),s.index=c)})},n={id:e,get _id(){return i++,e}};return l?Object.setPrototypeOf(n,new Proxy({},{get:(o,s,c)=>{if(u(s)){let f=t()||{};if(y(f[s]))return(...p)=>r(L=>L[s](...p));if(T(f[s]))return f[s]}return c},set:(o,s,c)=>(u(s)&&r(f=>{f[s]=c}),!0)})):n}function M(e){let t=N();return[t,i=>{let a=t._id;return T(i.id)?i.ref=a:i.id=a,E(e,i)}]}var X=Object.setPrototypeOf({element:M,mount:e=>(l&&O(e),e)},new Proxy({},{get:(e,t)=>()=>M(t)}));return _(v);})();
