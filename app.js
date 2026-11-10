// KIVORA marketplace front end. Add Supabase project URL and public anon key below.
const SUPABASE_URL = "https://izqgesrvwhdftumenhtz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_hoHkcLlcElwXzDhPLnoutQ_gvUgfP2z";
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_") && !SUPABASE_ANON_KEY.includes("YOUR_");
const db = configured && window.supabase ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const sample = [
{id:"demo1",name:"Everyday Canvas Tote Bag",category:"Fashion",price:12500,description:"Roomy everyday canvas tote with reinforced handles. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",store_name:"KIVORA EDIT"},
{id:"demo2",name:"Wireless Over-Ear Headphones",category:"Electronics",price:28500,description:"Comfortable wireless headphones for everyday listening. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",store_name:"TECH FINDS"},
{id:"demo3",name:"Skincare Essentials Set",category:"Beauty",price:18900,description:"A simple skincare set for your daily routine. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",store_name:"GLOW HOUSE"},
{id:"demo4",name:"Minimal Table Lamp",category:"Home & Furniture",price:22000,description:"A clean modern lamp for your bedside or workspace. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",store_name:"HOME EDIT"},
{id:"demo5",name:"Classic White Sneakers",category:"Shoes & Bags",price:32000,description:"Versatile everyday sneakers. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",store_name:"STEP CULTURE"},
{id:"demo6",name:"Smartphone — iPhone 15",category:"Smartphones",price:1150000,description:"Example listing. Confirm storage, condition, warranty and current price with seller. Indicative estimate only.",image_url:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=85",store_name:"MOBILE HUB"},
{id:"demo7",name:"Laptop Computer",category:"Computers & Accessories",price:850000,description:"Example listing. Confirm processor, RAM, storage and condition with seller. Indicative estimate only.",image_url:"https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=85",store_name:"TECH FINDS"},
{id:"demo8",name:"Minimal Wrist Watch",category:"Jewellery & Watches",price:45000,description:"Minimal everyday wrist watch. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",store_name:"TIME & CO"},
{id:"demo9",name:"Home Fitness Weights",category:"Sports & Fitness",price:27000,description:"Home workout equipment. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85",store_name:"ACTIVE LIFE"},
{id:"demo10",name:"Travel Backpack",category:"Fashion",price:38500,description:"Practical backpack for commuting and travel. Indicative guide price.",image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",store_name:"KIVORA EDIT"}
];
let products=[],category="All",search="",cart=JSON.parse(localStorage.getItem("kivora_cart")||"[]"),mode="login",selectedRole="buyer",currentUser=null;
const $=id=>document.getElementById(id),money=n=>"₦"+Number(n).toLocaleString("en-NG");
function showModal(id){$("overlay").classList.add("show");$(id).classList.add("show")}
function closeAll(){$("overlay").classList.remove("show");document.querySelectorAll(".modal").forEach(x=>x.classList.remove("show"));$("cartDrawer").classList.remove("open")}
function message(id,text){$(id).textContent=text}
async function loadProducts(){
 if(db){const {data,error}=await db.from("products").select("id,name,category,price,description,image_url,store_name").eq("is_active",true).order("created_at",{ascending:false});if(!error)products=data||[];else{$("loadMessage").textContent="Could not load live listings: "+error.message;products=sample}}
 else{products=sample;$("loadMessage").textContent="Showing starter catalogue previews. Sample prices are indicative estimates; live seller listings load from Supabase."}
 renderProducts();
}
function renderProducts(){
 const list=products.filter(p=>(category==="All"||p.category===category)&&(`${p.name} ${p.category} ${p.store_name||""}`).toLowerCase().includes(search.toLowerCase()));
 $("productGrid").innerHTML=list.map(p=>`<article class="card"><div class="photo">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">`:`<span style="font-size:55px">✦</span>`}<span class="tag">${esc(p.category||"FIND")}</span></div><div class="card-info"><small>${esc(p.category||"Marketplace")}</small><h3>${esc(p.name)}</h3><div class="price">${money(p.price)}</div><div class="store">${esc(p.store_name||"KIVORA seller")}</div><button data-add="${esc(String(p.id))}">ADD TO CART ＋</button></div></article>`).join("");
 $("productCount").textContent=`${list.length} products`;$("productTitle").textContent=category==="All"?"Explore popular finds":`Explore ${category}`;$("emptyState").hidden=list.length>0;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function saveCart(){localStorage.setItem("kivora_cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>String(y.id)===String(x.id))||x;return `<div class="cart-row">${p.image_url?`<img src="${esc(p.image_url)}" alt="">`:`<span>✦</span>`}<div><b>${esc(p.name)}</b><small>${x.qty} × ${money(p.price)}</small></div><button data-remove="${esc(String(x.id))}">Remove</button></div>`}).join(""):'<p class="empty">Your cart is waiting for something good.</p>';
 $("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function addCart(id){const p=products.find(x=>String(x.id)===String(id));if(!p)return;const found=cart.find(x=>String(x.id)===String(id));if(found)found.qty++;else cart.push({...p,qty:1});saveCart()}
function setMode(m){mode=m;document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));$("authTitle").textContent=m==="login"?"Your account, your finds.":"Join the KIVORA community.";$("authSubmit").textContent=m==="login"?"Log in":"Create account";message("authMessage","")}
document.addEventListener("click",e=>{
 const a=e.target.closest("[data-add]");if(a)addCart(a.dataset.add);
 const r=e.target.closest("[data-remove]");if(r){cart=cart.filter(x=>String(x.id)!==r.dataset.remove);saveCart()}
 const c=e.target.closest("[data-category]");if(c){category=c.dataset.category;document.querySelectorAll("[data-category]").forEach(x=>x.classList.toggle("active",x===c));renderProducts()}
 const t=e.target.closest("[data-mode]");if(t)setMode(t.dataset.mode);
 if(e.target.matches("[data-close]")||e.target===$("overlay"))closeAll();
});
$("searchForm").addEventListener("submit",e=>{e.preventDefault();search=$("searchInput").value.trim();renderProducts();$("shop").scrollIntoView({behavior:"smooth"})});
$("accountBtn").onclick=()=>{showModal("authModal");setMode("login")};
$("sellBtn").onclick=$("sellerBannerBtn").onclick=()=>{if(!currentUser){selectedRole="seller";showModal("authModal");setMode("signup");message("authMessage","Create an account or log in to open your seller studio.");return}if(currentUser.user_metadata?.account_type!=="seller"){alert("This account is registered as a buyer. Create or use a seller account to list products.");return}showModal("sellerModal");message("sellerMessage","")};
$("cartBtn").onclick=()=>{$("overlay").classList.add("show");$("cartDrawer").classList.add("open")};
$("checkoutBtn").onclick=()=>{if(!currentUser){showModal("authModal");setMode("login");message("authMessage","Log in or create an account to continue. Secure payment is not enabled yet.");return}alert("Your cart is ready. KIVORA payment processing is not yet connected, so no payment or order has been placed.");};
$("authForm").addEventListener("submit",async e=>{
 e.preventDefault();if(!db){message("authMessage","Connect Supabase in app.js and run supabase_setup.sql before enabling real accounts.");return}
 $("authSubmit").disabled=true;const email=$("authEmail").value.trim(),password=$("authPassword").value;
 const result=mode==="signup"?await db.auth.signUp({email,password,options:{data:{account_type:selectedRole}}}):await db.auth.signInWithPassword({email,password});
 $("authSubmit").disabled=false;message("authMessage",result.error?result.error.message:(mode==="signup"?"Account created. Check your email if confirmation is enabled.":"You are signed in."));
});
$("pImage").addEventListener("change",()=>{const file=$("pImage").files[0];if(!file)return;if(file.size>5*1024*1024){message("sellerMessage","Image must be 5 MB or smaller.");$("pImage").value="";return}const url=URL.createObjectURL(file);$("imagePreview").src=url;$("imagePreview").hidden=false;});
$("productForm").addEventListener("submit",async e=>{
 e.preventDefault();
 if(!db){message("sellerMessage","Seller uploads need Supabase. Add your project URL/key in app.js and run supabase_setup.sql. No image or product is being saved in preview mode.");return}
 const {data:{user},error:userError}=await db.auth.getUser();if(userError||!user){message("sellerMessage","Please log in with your seller account first.");return}
 const file=$("pImage").files[0];if(!file){message("sellerMessage","Choose a product image.");return}
 if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024){message("sellerMessage","Use JPG, PNG or WEBP, maximum 5 MB.");return}
 $("productSubmit").disabled=true;message("sellerMessage","Uploading product image…");
 const safeName=file.name.toLowerCase().replace(/[^a-z0-9.-]/g,"-");const path=`${user.id}/${crypto.randomUUID()}-${safeName}`;
 const upload=await db.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});
 if(upload.error){$("productSubmit").disabled=false;message("sellerMessage","Image upload failed: "+upload.error.message);return}
 const {data:{publicUrl}}=db.storage.from("product-images").getPublicUrl(path);
 const row={seller_id:user.id,name:$("pName").value.trim(),category:$("pCategory").value,price:Number($("pPrice").value),description:$("pDescription").value.trim(),image_url:publicUrl,store_name:user.user_metadata?.store_name||user.email,is_active:true};
 const insert=await db.from("products").insert(row);
 $("productSubmit").disabled=false;
 if(insert.error){message("sellerMessage","Product record could not be saved: "+insert.error.message);return}
 message("sellerMessage","Your product is live on KIVORA!");$("productForm").reset();$("imagePreview").hidden=true;await loadProducts();
});

// Intro plays first; the marketplace stays hidden until a visitor authenticates.
function showEntry(){ $("entryScreen").hidden=true; document.body.classList.remove("authenticated"); }
function enterMarketplace(user){currentUser=user;$("entryScreen").hidden=true;document.body.classList.add("authenticated");if(user){const role=user.user_metadata?.account_type;if(role)selectedRole=role;} }
function openAuthForRole(role){selectedRole=role;showModal("authModal");setMode("login");message("authMessage",`Continue as ${role}.`)}
document.querySelectorAll("[data-role]").forEach(b=>b.addEventListener("click",()=>openAuthForRole(b.dataset.role)));
$("backEntry").addEventListener("click",()=>{closeAll();showEntry()});
setTimeout(()=>{const intro=$("introScreen");if(intro){intro.classList.add("exit");setTimeout(()=>{intro.remove();$("entryScreen").hidden=true;},650)}},4000);
if(db){db.auth.getSession().then(({data})=>{if(data.session)enterMarketplace(data.session.user)});db.auth.onAuthStateChange((_event,session)=>{if(session)enterMarketplace(session.user);else{currentUser=null;document.body.classList.remove("authenticated");$("entryScreen").hidden=true;}})}
$("year").textContent=new Date().getFullYear();renderCart();loadProducts();
