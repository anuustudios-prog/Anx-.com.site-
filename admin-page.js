import {requireRole} from "./auth.js";import {auth} from "./firebase-config.js";import {signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
requireRole("admin","../auth/admin-login.html").catch(()=>{});const b=document.querySelector("#logout");if(b)b.onclick=()=>signOut(auth).then(()=>location.href="../index.html");
