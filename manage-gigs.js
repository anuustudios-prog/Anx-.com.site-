import {db} from "./firebase-config.js";import {collection,onSnapshot,query,orderBy,doc,updateDoc,getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const root=document.querySelector("#orders"),message=document.querySelector("#message");let editors=[];
async function loadEditors(){const s=await getDocs(collection(db,"editors"));editors=s.docs.map(d=>({id:d.id,...d.data()}))}
function el(tag,text,cls){const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n}
loadEditors().then(()=>onSnapshot(query(collection(db,"orders"),orderBy("createdAt","desc")),snap=>{root.replaceChildren();message.textContent=snap.empty?"No orders yet.":`${snap.size} order(s)`;
snap.forEach(s=>{const o=s.data(),card=el("section","","panel"),h=el("h2",o.title||"Untitled order"),details=el("p",`${o.clientName||o.clientEmail||"Client"} · ${o.category} · Budget: ${o.budget||"Not set"}`),desc=el("p",o.description||""),status=el("p",`Status: ${o.status||"pending"}`),select=document.createElement("select");
select.append(new Option("Unassigned",""));editors.forEach(ed=>select.append(new Option(`${ed.name} (${ed.editorId})`,ed.editorId)));select.value=o.assignedTo||"";
const state=document.createElement("select");["pending","assigned","in_progress","completed"].forEach(v=>state.append(new Option(v,v)));state.value=o.status||"pending";
const save=document.createElement("button");save.textContent="Save assignment & status";save.onclick=async()=>{save.disabled=true;try{await updateDoc(doc(db,"orders",s.id),{assignedTo:select.value||null,status:state.value}) ;message.textContent="Order updated."}catch(e){message.textContent=e.message}finally{save.disabled=false}};
card.append(h,details,desc,status,el("label","Assign editor"),select,el("label","Status"),state,save);root.append(card)});},e=>message.textContent="Unable to load orders: "+e.message)).catch(e=>message.textContent=e.message);
