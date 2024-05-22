var w=Object.defineProperty;var b=(g,c,t)=>c in g?w(g,c,{enumerable:!0,configurable:!0,writable:!0,value:t}):g[c]=t;var l=(g,c,t)=>(b(g,typeof c!="symbol"?c+"":c,t),t);import{C as v,E as F}from"./index-DsPLPeA6.js";import"./web-ifc-api-BiYij3qq.js";import{F as p,a as D,b as M}from"./index-Ba8czaZS.js";const u=class u extends v{constructor(t){super(t);l(this,"enabled",!0);l(this,"list",{});l(this,"onDisposed",new F);l(this,"onFragmentsDisposed",t=>{const{groupID:n,fragmentIDs:o}=t;for(const s in this.list){const i=this.list[s],e=Object.keys(i);if(e.includes(n))delete i[n],Object.values(i).length===0&&delete this.list[s];else for(const r of e){const a=i[r];for(const f of o)delete a[f];Object.values(a).length===0&&delete i[r]}}});t.add(u.uuid,this),t.get(p).onFragmentsDisposed.add(this.onFragmentsDisposed)}dispose(){this.list={},this.components.get(p).onFragmentsDisposed.remove(this.onFragmentsDisposed),this.onDisposed.trigger(),this.onDisposed.reset()}remove(t){for(const n in this.list){const o=this.list[n];for(const s in o){const i=o[s];delete i[t]}}}find(t){const n=this.components.get(p);if(!t){const e={};for(const[r,a]of n.list)e[r]=new Set(a.ids);return e}const o=Object.keys(t).length,s={};for(const e in t){const r=t[e];if(!this.list[e]){console.warn(`Classification ${e} does not exist.`);continue}for(const a of r){const f=this.list[e][a];if(f)for(const d in f){s[d]||(s[d]=new Map);for(const m of f[d]){const y=s[d].get(m);y===void 0?s[d].set(m,1):s[d].set(m,y+1)}}}}const i={};for(const e in s){const r=s[e];for(const[a,f]of r){if(f===void 0)throw new Error("Malformed fragments map!");f===o&&(i[e]||(i[e]=new Set),i[e].add(a))}}return i}byModel(t,n){this.list.models||(this.list.models={});const o=this.list.models;o[t]||(o[t]={});const s=o[t];for(const[i,e]of n.data){const r=e[0];for(const a of r){const f=n.keyFragments.get(a);f&&(s[f]||(s[f]=new Set),s[f].add(i))}}}async byPredefinedType(t){var s;this.list.predefinedTypes||(this.list.predefinedTypes={});const n=this.list.predefinedTypes,o=t.getAllPropertiesIDs();for(const i of o){const e=await t.getProperties(i);if(!e)continue;const r=String((s=e.PredefinedType)==null?void 0:s.value).toUpperCase();n[r]||(n[r]={});const a=n[r];for(const[f,d]of t.data){const m=d[0];for(const y of m){const h=t.keyFragments.get(y);if(!h)throw new Error("Fragment ID not found!");a[h]||(a[h]=new Set),a[h].add(e.expressID)}}}}byEntity(t){this.list.entities||(this.list.entities={});for(const[n,o]of t.data){const i=o[1][1],e=M[i];this.saveItem(t,"entities",e,n)}}byStorey(t){for(const[n,o]of t.data){const e=o[1][0].toString();this.saveItem(t,"storeys",e,n)}}async byIfcRel(t,n,o){D.isRel(n)&&await D.getRelationMap(t,n,async(s,i)=>{const{name:e}=await D.getEntityName(t,s);for(const r of i)this.saveItem(t,o,e??"NO REL NAME",r)})}setColor(t,n,o=!1){const s=this.components.get(p);for(const i in t){const e=s.list.get(i);if(!e)continue;const r=t[i];e.setColor(n,r,o)}}resetColor(t){const n=this.components.get(p);for(const o in t){const s=n.list.get(o);if(!s)continue;const i=t[o];s.resetColor(i)}}saveItem(t,n,o,s){this.list[n]||(this.list[n]={});const i=t.data.get(s);if(i)for(const e of i[0]){const r=t.keyFragments.get(e);if(r){const a=this.list[n];a[o]||(a[o]={}),a[o][r]||(a[o][r]=new Set),a[o][r].add(s)}}}};l(u,"uuid","e25a7f3c-46c4-4a14-9d3d-5115f24ebeb7");let I=u;export{I as C};