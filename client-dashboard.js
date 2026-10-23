import {auth,db} from "./firebase-config.js";
import {onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {collection,addDoc,query,where,onSnapshot,doc,getDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const $=s=>document.querySelector(s);let currentUser=null;
$("#logout").onclick=()=>signOut(auth).then(()=>location.href="../index.html");
onAuthStateChanged(auth,async user=>{if(!user){location.href="../auth/login.html";return}currentUser=user;
 const u=await getDoc(doc(db,"users",user.uid));if(!u.exists()||u.data().role!=="client"){await signOut(auth);location.href="../auth/login.html";return}
 const profile=u.data();$("#welcome").textContent=`Signed in as ${profile.name||user.email}`;
 const q=query(collection(db,"orders"),where("clientEmail","==",user.email));
 onSnapshot(q,snap=>{const root=$("#orders");root.replaceChildren();if(snap.empty){root.textContent="No orders yet. Create your first project.";return}
 const rows=[];snap.forEach(d=>rows.push({id:d.id,...d.data()}));rows.sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
 rows.forEach(o=>{const card=document.createElement("article");card.className="order";const h=document.createElement("h3");h.textContent=o.title;const p=document.createElement("p");p.className="muted";p.textContent=`${o.category} · Budget: ${o.budget}`;const tag=document.createElement("span");tag.className="tag";tag.textContent=o.status;card.append(h,p,tag);if(o.deliveryLink){const a=document.createElement("a");a.href=o.deliveryLink;a.target="_blank";a.rel="noopener";a.textContent="Open delivery";card.append(document.createElement("br"),a)}root.append(card)})
 },err=>{$("#orders").textContent="Could not load orders. Check Firestore rules."});
});
$("#order-form").addEventListener("submit",async e=>{e.preventDefault();if(!currentUser)return;const b=e.currentTarget.querySelector("button");b.disabled=true;
 try{const d=new FormData(e.currentTarget),u=await getDoc(doc(db,"users",currentUser.uid));await addDoc(collection(db,"orders"),{clientEmail:currentUser.email,clientUid:currentUser.uid,clientName:u.data().name||"",title:String(d.get("title")).trim(),category:d.get("category"),description:String(d.get("description")).trim(),budget:String(d.get("budget")).trim(),status:"pending",assignedTo:null,deliveryLink:"",createdAt:serverTimestamp()});e.currentTarget.reset();$("#form-message").textContent="Project submitted."}
 catch(err){$("#form-message").textContent=err.message||"Could not submit order."}finally{b.disabled=false}});
