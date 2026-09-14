const API="/api";
const AUTH_KEY="taj_medical_proxy_auth_v1";

function session(){
    try{
        return JSON.parse(localStorage.getItem(AUTH_KEY)||"null");
    }catch(e){
        return null;
    }
}

async function api(path){
    const s=session();

    if(!s || !s.idToken){
        throw new Error("NO_TOKEN");
    }

    const r=await fetch(API+path,{
        headers:{
            Authorization:"Bearer "+s.idToken
        }
    });

    if(!r.ok){
        throw new Error("API_ERROR");
    }

    return r.json();
}


async function init(){

    const loading=document.getElementById("loading");
    const app=document.getElementById("app");

    try{

        const [stats,users,orders]=await Promise.all([
            api("/admin/stats"),
            api("/admin/users"),
            api("/admin/orders")
        ]);


        document.getElementById("usersCount").textContent =
        stats.users || 0;

        document.getElementById("ordersCount").textContent =
        stats.orders || 0;


        document.getElementById("usersTable").innerHTML =
        (users.users || []).map(u=>`
        <tr>
        <td>${u.id}</td>
        <td>${u.email || ""}</td>
        </tr>`).join("");


        document.getElementById("ordersTable").innerHTML =
        (orders.orders || []).map(o=>`
        <tr>
        <td>${o.userId}</td>
        <td>${o.id}</td>
        <td>${o.status || ""}</td>
        </tr>`).join("");


        loading.hidden=true;
        app.hidden=false;


    }catch(e){

        console.error(e);
        loading.textContent="خطا در دسترسی ادمین";

    }
}


document.getElementById("logout").onclick=()=>{
    localStorage.removeItem(AUTH_KEY);
    location.reload();
};


init();
