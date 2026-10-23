import { db } from "./firebase-config.js";
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
export async function loadCyberTools(){
 const root=document.querySelector("#tools-grid"), message=document.querySelector("#tools-message"); if(!root)return;
 root.innerHTML=""; if(message)message.textContent="Loading tools…";
 try{
  const q=query(collection(db,"my_tools"),where("category","==","cyber"),orderBy("createdAt","desc"));
  const snap=await getDocs(q);
  if(snap.empty){if(message)message.textContent="No tools published yet.";return}
  if(message)message.textContent="";
  snap.forEach(d=>{const t=d.data(), card=document.createElement("article");card.className="tool-card";
   const img=document.createElement("img");img.src=t.imageUrl||"";img.alt=t.name||"Tool";img.loading="lazy";
   const body=document.createElement("div");body.className="tool-body";
   const title=document.createElement("h3");title.textContent=t.name||"Untitled tool";
   const desc=document.createElement("p");desc.textContent=t.description||"";
   const price=document.createElement("strong");price.textContent=Number(t.price)===0?"Free":`Price: ${t.price}`;
   const link=document.createElement("a");link.className="btn btn-red";link.href=t.downloadUrl||"#";link.textContent="Download";link.rel="noopener";link.target="_blank";
   body.append(title,desc,price,link);card.append(img,body);root.append(card);
  });
 }catch(e){if(message)message.textContent="Could not load tools. Check Firebase configuration and Firestore rules."}
}
