import { db, storage } from "./firebase-config.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
const form=document.querySelector("#tool-form"), message=document.querySelector("#message");
if(form) form.addEventListener("submit",async e=>{
 e.preventDefault(); const b=form.querySelector("button"); b.disabled=true;
 try{
  const d=new FormData(form), name=String(d.get("name")).trim(), description=String(d.get("description")).trim(), price=Number(d.get("price"));
  const image=d.get("image"), file=d.get("download");
  if(!image?.size||!file?.size) throw new Error("Choose both an image and a download file.");
  if(!Number.isFinite(price)||price<0) throw new Error("Enter a valid non-negative price.");
  const base=`tools/${crypto.randomUUID()}`;
  const imageRef=ref(storage,`${base}/cover-${image.name}`), fileRef=ref(storage,`${base}/${file.name}`);
  await uploadBytes(imageRef,image); await uploadBytes(fileRef,file);
  const [imageUrl,downloadUrl]=await Promise.all([getDownloadURL(imageRef),getDownloadURL(fileRef)]);
  await addDoc(collection(db,"my_tools"),{name,description,price,imageUrl,downloadUrl,category:"cyber",createdAt:serverTimestamp()});
  form.reset(); message.textContent="Tool uploaded successfully.";
 }catch(err){message.textContent=err.message||"Upload failed."}finally{b.disabled=false}
});
