const API="/api";
const ADMIN_UID_KEY="firebase_auth_session";
function session(){try{return JSON.parse(localStorage.getItem(ADMIN_UID_KEY)||"null")}catch(e){return null}}

async function api(path){
 const s=session();
 const r=await fetch(API+path,{headers:{Authorization:"Bearer "+s.idToken}});
 if(!r.ok) throw new Error("ACCESS_ERROR");
 return r.json();
}

async function init(){
 const s=session();
 if(!s?.idToken){
    document.getElementById("loading").textContent =
    "توکن ورود پیدا نشد. ابتدا از پنل کاربر وارد شوید.";
    return;
}
  usersCount.textContent=stats.users||0;
  ordersCount.textContent=stats.orders||0;
  statusCount.textContent=JSON.stringify(stats.status||{});
  usersTable.innerHTML=(users.users||[]).map(x=>`<tr><td>${x.id}</td><td>${x.email||""}</td></tr>`).join("");
  ordersTable.innerHTML=(orders.orders||[]).map(x=>`<tr><td>${x.userId}</td><td>${x.id}</td><td>${x.status||"در انتظار"}</td></tr>`).join("");
  loading.hidden=true; app.hidden=false;
 }catch(e){loading.textContent="دسترسی ادمین ندارید"}
}
logout.onclick=()=>{localStorage.removeItem(ADMIN_UID_KEY);location.reload()};
init();
