// KIVORA storefront — public browsing first, account required for account features.
const SUPABASE_URL = "https://izqgesrvwhdftumenhtz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_hoHkcLlcElwXzDhPLnoutQ_gvUgfP2z";
const configured = !!(window.supabase && SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.startsWith("sb_publishable_"));
const db = configured ? window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY) : null;
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=85`;
const sample = [
{id:"p01",name:"Samsung Galaxy S23 Ultra",category:"Smartphones",price:1150000,image_url:"https://commons.wikimedia.org/wiki/Special:FilePath/Samsung_S23_Ultra.jpg?width=900",store_name:"KIVORA TECH",badge:"FEATURED"},
{id:"p02",name:"Apple iPhone 15 Pro",category:"Smartphones",price:1450000,image_url:img("photo-1592899677977-9c10ca588bbd"),store_name:"MOBILE HUB",badge:"POPULAR"},
{id:"p03",name:"Google Pixel 8",category:"Smartphones",price:790000,image_url:img("photo-1511707171634-5f897ff02aa9"),store_name:"MOBILE HUB"},
{id:"p04",name:"Xiaomi Redmi Note Series",category:"Smartphones",price:320000,image_url:img("photo-1598327105666-5b89351aff97"),store_name:"PHONE DEPOT"},
{id:"p05",name:"Tecno Camon Series",category:"Smartphones",price:285000,image_url:img("photo-1512499617640-c74ae3a79d37"),store_name:"PHONE DEPOT"},
{id:"p06",name:"Infinix Note Series",category:"Smartphones",price:270000,image_url:img("photo-1598327105666-5b89351aff97"),store_name:"PHONE DEPOT"},
{id:"p07",name:"MacBook Air Laptop",category:"Computers & Accessories",price:1850000,image_url:img("photo-1496181133206-80ce9b88a853"),store_name:"TECH WORLD",badge:"TOP PICK"},
{id:"p08",name:"HP Pavilion Laptop",category:"Computers & Accessories",price:980000,image_url:img("photo-1588872657578-7efd1f1555ed"),store_name:"TECH WORLD"},
{id:"p09",name:"Lenovo ThinkPad Laptop",category:"Computers & Accessories",price:890000,image_url:img("photo-1496181133206-80ce9b88a853"),store_name:"TECH WORLD"},
{id:"p10",name:"Wireless Over-Ear Headphones",category:"Electronics",price:28500,image_url:img("photo-1505740420928-5e560c06d30e"),store_name:"SOUND HOUSE"},
{id:"p11",name:"Designer Leather Handbag",category:"Shoes & Bags",price:68000,image_url:img("photo-1584917865442-de89df76afd3"),store_name:"THE STYLE ROOM"},
{id:"p12",name:"Classic Everyday Sneakers",category:"Shoes & Bags",price:42000,image_url:img("photo-1542291026-7eec264c27ff"),store_name:"STEP CULTURE"},
{id:"p13",name:"Travel Backpack",category:"Fashion",price:38500,image_url:img("photo-1553062407-98eeb64c6a62"),store_name:"THE STYLE ROOM"},
{id:"p14",name:"Ladies Smart Casual Outfit",category:"Fashion",price:35000,image_url:img("photo-1483985988355-763728e1935b"),store_name:"STYLE EDIT"},
{id:"p15",name:"Skincare Essentials Set",category:"Beauty",price:18900,image_url:img("photo-1601049541289-9b1b7bbbfe19"),store_name:"GLOW HOUSE"},
{id:"p16",name:"Luxury Wrist Watch",category:"Jewellery & Watches",price:45000,image_url:img("photo-1523275335684-37898b6baf30"),store_name:"TIME & CO"},
{id:"p17",name:"Modern Table Lamp",category:"Home & Furniture",price:22000,image_url:img("photo-1507473885765-e6ed057f782c"),store_name:"HOME EDIT"},
{id:"p18",name:"Minimal Lounge Chair",category:"Home & Furniture",price:185000,image_url:img("photo-1505693416388-ac5ce068fe85"),store_name:"HOME EDIT"},
{id:"p19",name:"Home Fitness Dumbbells",category:"Sports & Fitness",price:27000,image_url:img("photo-1583454110551-21f2fa2afe61"),store_name:"ACTIVE LIFE"},
{id:"p20",name:"Gaming Controller",category:"Electronics",price:39000,image_url:img("photo-1592840496694-26d035b52b48"),store_name:"GAME ZONE"},
{id:"p21",name:"Bluetooth Portable Speaker",category:"Electronics",price:32000,image_url:img("photo-1608043152269-423dbba4e7e1"),store_name:"SOUND HOUSE"},
{id:"p22",name:"Modern Desk Setup",category:"Computers & Accessories",price:145000,image_url:img("photo-1498050108023-c5249f4df085"),store_name:"TECH WORLD"},
{id:"p23",name:"Kids Building Toy Set",category:"Toys & Games",price:18500,image_url:img("photo-1587654780291-39c9404d746b"),store_name:"PLAY HOUSE"},
{id:"p24",name:"Car Care Accessories",category:"Automotive",price:16500,image_url:img("photo-1486262715619-67b85e0b08d3"),store_name:"AUTO CORNER"}
];
let products=[...sample], category="All", search="", cart=JSON.parse(localStorage.getItem("kivora_cart")||"[]"), favorites=JSON.parse(localStorage.getItem("kivora_favorites")||"[]"), mode="login", currentUser=null;
const $=id=>document.getElementById(id), money=n=>"₦"+Number(n||0).toLocaleString("en-NG");
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openModal(id){$("overlay").classList.add("show");$(id).classList.add("show")}
function closeAll(){$("overlay").classList.remove("show");document.querySelectorAll(".modal").forEach(x=>x.classList.remove("show"));$("cartDrawer").classList.remove("open")}
function msg(id,text){$(id).textContent=text}
function card(p){const fav=favorites.includes(String(p.id));return `<article class="product-card"><div class="product-image"><img src="${esc(p.image_url||"")}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.opacity='.18'"><span class="product-badge">${esc(p.badge||"KIVORA FIND")}</span><button class="heart ${fav?"saved":""}" data-fav="${esc(p.id)}" aria-label="Add to favourites">${fav?"♥":"♡"}</button></div><div class="product-info"><span class="product-category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><div class="product-price">${money(p.price)}</div><div class="product-rating">★★★★★ <span style="color:#999">Preview listing</span></div><button data-add="${esc(p.id)}">ADD TO CART +</button></div></article>`}
function renderRail(id,list){$(id).innerHTML=list.map(card).join("")}
function renderProducts(){
 const list=products.filter(p=>(category==="All"||p.category===category)&&(`${p.name} ${p.category} ${p.store_name||""}`).toLowerCase().includes(search.toLowerCase()));
 $("productGrid").innerHTML=list.map(card).join("");$("productCount").textContent=`${list.length} items`;$("productTitle").textContent=category==="All"?"Explore all products":category;
 $("emptyState").hidden=list.length>0;
}
function renderAll(){renderRail("popularRail",products.slice(0,10));renderRail("phonesRail",products.filter(p=>p.category==="Smartphones"));renderRail("computersRail",products.filter(p=>p.category==="Computers & Accessories"));renderRail("fashionRail",products.filter(p=>["Fashion","Shoes & Bags"].includes(p.category)));renderProducts();renderCart()}
async function loadProducts(){
 if(db){const {data,error}=await db.from("products").select("id,name,category,price,description,image_url,store_name").eq("is_active",true).order("created_at",{ascending:false});if(!error&&data?.length)products=[...data,...sample];else if(error)msg("loadMessage","Showing catalogue previews. Live seller listings could not be loaded: "+error.message);else msg("loadMessage","Showing the KIVORA starter collection. Seller listings will appear here as they are added.");}
 else msg("loadMessage","KIVORA starter collection • Sample prices are indicative previews, not confirmed seller offers. Seller listings appear here when Supabase is configured.");
 renderAll();
}
function saveCart(){localStorage.setItem("kivora_cart",JSON.stringify(cart));renderCart()}
function renderCart(){$("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);$("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${esc(x.image_url||"")}" alt=""><div><b>${esc(x.name)}</b><small>${x.qty} × ${money(x.price)}</small></div><button data-remove="${esc(x.id)}">REMOVE</button></div>`).join(""):'<p class="empty">Your cart is waiting for something good.</p>';$("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0))}
function addCart(id){const p=products.find(x=>String(x.id)===String(id));if(!p)return;const item=cart.find(x=>String(x.id)===String(id));if(item)item.qty++;else cart.push({...p,qty:1});saveCart()}
function setCategory(c){category=c;document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===c));renderProducts();$("popular").scrollIntoView({behavior:"smooth",block:"start"})}
function setMode(m){mode=m;document.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===m));$("authTitle").textContent=m==="login"?"Your account, your finds.":"Join the KIVORA community."; $("authSubmit").textContent=m==="login"?"LOG IN":"CREATE ACCOUNT";msg("authMessage","")}
function startAuth(role="buyer",m="login"){ $("accountType").value=role;openModal("authModal");setMode(m); }
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addCart(add.dataset.add);
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>String(x.id)!==String(rem.dataset.remove));saveCart()}
 const fav=e.target.closest("[data-fav]");if(fav){if(!currentUser){startAuth("buyer","login");msg("authMessage","Log in to save your favourites.");return}const id=String(fav.dataset.fav);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];localStorage.setItem("kivora_favorites",JSON.stringify(favorites));renderAll()}
 const cat=e.target.closest("[data-category]");if(cat)setCategory(cat.dataset.category);
 const tab=e.target.closest("[data-mode]");if(tab)setMode(tab.dataset.mode);
 const scroll=e.target.closest("[data-scroll]");if(scroll){const rail=$(scroll.dataset.scroll);rail.scrollBy({left:scroll.dataset.dir==="right"?rail.clientWidth*.8:-rail.clientWidth*.8,behavior:"smooth"})}
 if(e.target.matches("[data-close]")||e.target===$("overlay"))closeAll();
});
$("searchForm").addEventListener("submit",e=>{e.preventDefault();search=$("searchInput").value.trim();renderProducts();$("popular").scrollIntoView({behavior:"smooth"})});
$("accountBtn").onclick=$("quickLogin").onclick=()=>startAuth("buyer","login");
$("ordersBtn").onclick=()=>{if(!currentUser){startAuth("buyer","login");msg("authMessage","Log in to view your account and order history.");}else alert("Order history will appear here after secure checkout and order processing are enabled.");};
$("quickSell").onclick=$("sellerBannerBtn").onclick=$("footerSell").onclick=()=>{if(!currentUser){startAuth("seller","signup");msg("authMessage","Create a seller account to open your KIVORA store.");return}if(currentUser.user_metadata?.account_type!=="seller"){startAuth("seller","signup");msg("authMessage","Use a seller account to list products.");return}openModal("sellerModal")};
$("cartBtn").onclick=()=>{$("overlay").classList.add("show");$("cartDrawer").classList.add("open")};
$("checkoutBtn").onclick=()=>{if(!currentUser){closeAll();startAuth("buyer","login");msg("authMessage","Sign in or create an account to continue to checkout.");return}alert("Your cart is saved. Secure payment processing is not configured yet, so no order or payment has been placed.");};
$("authForm").addEventListener("submit",async e=>{e.preventDefault();if(!db){msg("authMessage","Supabase is not available. Check the project URL and public key, then reload.");return}const email=$("authEmail").value.trim(),password=$("authPassword").value,role=$("accountType").value;$("authSubmit").disabled=true;const result=mode==="signup"?await db.auth.signUp({email,password,options:{data:{account_type:role}}}):await db.auth.signInWithPassword({email,password});$("authSubmit").disabled=false;if(result.error){msg("authMessage",result.error.message);return}if(mode==="signup"){msg("authMessage","Account created. Check your email for a confirmation message, then log in.");}else{currentUser=result.data.user;closeAll();}}
);
$("pImage").addEventListener("change",()=>{const file=$("pImage").files[0];if(!file)return;if(file.size>5*1024*1024){msg("sellerMessage","Image must be 5 MB or smaller.");$("pImage").value="";return}$("imagePreview").src=URL.createObjectURL(file);$("imagePreview").hidden=false});
$("productForm").addEventListener("submit",async e=>{e.preventDefault();if(!db){msg("sellerMessage","Seller uploads require the connected Supabase project and the setup SQL.");return}const {data:{user}}=await db.auth.getUser();if(!user){msg("sellerMessage","Please log in with your seller account first.");return}const file=$("pImage").files[0];if(!file||file.size>5*1024*1024){msg("sellerMessage","Choose a JPG, PNG or WEBP image up to 5 MB.");return}$("productSubmit").disabled=true;msg("sellerMessage","Uploading your product photo…");const path=`${user.id}/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9.-]/g,"-")}`;const upload=await db.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});if(upload.error){$("productSubmit").disabled=false;msg("sellerMessage",upload.error.message);return}const {data:{publicUrl}}=db.storage.from("product-images").getPublicUrl(path);const row={seller_id:user.id,name:$("pName").value.trim(),category:$("pCategory").value,price:Number($("pPrice").value),description:$("pDescription").value.trim(),image_url:publicUrl,store_name:user.user_metadata?.store_name||user.email,is_active:true};const result=await db.from("products").insert(row);$("productSubmit").disabled=false;if(result.error){msg("sellerMessage",result.error.message);return}msg("sellerMessage","Product successfully added to KIVORA.");$("productForm").reset();$("imagePreview").hidden=true;await loadProducts()});
$("year").textContent=new Date().getFullYear();
renderAll();loadProducts();
if(db){db.auth.getSession().then(({data})=>{if(data.session)currentUser=data.session.user});db.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null})}
