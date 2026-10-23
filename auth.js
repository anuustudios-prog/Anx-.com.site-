import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const $ = (s) => document.querySelector(s);
function message(text, bad=false){ const el=$("#message"); if(el){el.textContent=text;el.className="message "+(bad?"error":"");} }
const form=$("#auth-form");
if(form){
 form.addEventListener("submit", async e=>{
  e.preventDefault(); const data=new FormData(form); const mode=form.dataset.mode; const button=form.querySelector("button"); button.disabled=true;
  try{
   if(mode==="register"){
    const name=String(data.get("name")||"").trim(), email=String(data.get("email")||"").trim().toLowerCase(), password=String(data.get("password")||"");
    const cred=await createUserWithEmailAndPassword(auth,email,password);
    await setDoc(doc(db,"users",cred.user.uid),{uid:cred.user.uid,name,email,role:"client",createdAt:new Date().toISOString()});
    location.href="../client/dashboard.html";
   } else if(mode==="login"){
    await signInWithEmailAndPassword(auth,String(data.get("email")).trim(),String(data.get("password")));
    location.href="../client/dashboard.html";
   } else if(mode==="admin"){
    const email=String(data.get("email")).trim().toLowerCase(), password=String(data.get("password"));
    const cred=await signInWithEmailAndPassword(auth,email,password);
    const snap=await getDoc(doc(db,"admins",cred.user.uid));
    // Admin docs should be keyed by the authenticated user's UID, not a public email query.
    if(!snap.exists() || snap.data().role!=="admin"){await signOut(auth);throw new Error("This account is not authorized as an admin.");}
    location.href="../admin/dashboard.html";
   }
  }catch(err){message(err.message||"Something went wrong.",true)}finally{button.disabled=false}
 });
}
export async function requireRole(role, redirect="../auth/login.html"){
 return new Promise((resolve,reject)=>onAuthStateChanged(auth,async user=>{
  if(!user){location.href=redirect;reject(new Error("Please sign in."));return}
  try{let allowed=false;
   if(role==="client"){const s=await getDoc(doc(db,"users",user.uid));allowed=s.exists()&&s.data().role==="client";}
   if(role==="admin"){const s=await getDoc(doc(db,"admins",user.uid));allowed=s.exists()&&s.data().role==="admin";}
   if(!allowed){location.href=redirect;reject(new Error("Access denied."));return}
   resolve(user);
  }catch(e){reject(e)}
 }),()=>{});
}
// Editor login intentionally is NOT implemented as a secure client-side password query.
// Use the Cloud Functions/custom-token approach described in README before production.
