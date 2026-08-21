const PRODUCTS={
  camo:{name:"Abstract Camo Tee",price:500,size:"XL",image:"images/product1.jpg"},
  floral:{name:"Floral Frame Tee",price:500,size:"XL",image:"images/sample2.jpg"}
};

function getCart(){try{return JSON.parse(sessionStorage.getItem("venverCart")||"[]")}catch{return[]}}
function setCart(cart){sessionStorage.setItem("venverCart",JSON.stringify(cart))}
function updateCount(){const n=getCart().reduce((s,i)=>s+i.quantity,0);document.querySelectorAll("#cartCount").forEach(e=>e.textContent=n)}

document.querySelectorAll(".qty").forEach(box=>{
  const input=box.querySelector("input");
  box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>input.value=b.dataset.value));
});

document.querySelectorAll(".add").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const card=btn.closest(".product-card");
    const qty=Math.max(1,Number(card.querySelector("input").value)||1);
    const key=btn.dataset.key, p=PRODUCTS[key], cart=getCart();
    const found=cart.find(i=>i.key===key);
    if(found) found.quantity+=qty; else cart.push({key,quantity:qty,size:p.size});
    setCart(cart); updateCount();
    btn.textContent="ADDED ✓"; setTimeout(()=>btn.textContent="ADD",900);
  });
});

function renderCart(){
  const box=document.getElementById("items"); if(!box)return;
  const cart=getCart(), empty=document.getElementById("empty"), layout=document.getElementById("layout");
  if(!cart.length){empty.classList.remove("hidden");layout.classList.add("hidden");updateCount();return}
  empty.classList.add("hidden");layout.classList.remove("hidden");box.innerHTML="";
  let subtotal=0;
  cart.forEach((item,index)=>{
    const p=PRODUCTS[item.key], line=p.price*item.quantity; subtotal+=line;
    const row=document.createElement("article"); row.className="cart-item";
    row.innerHTML=`<img src="${p.image}" alt="${p.name}">
      <div><p class="eyebrow">VENVER</p><h2>${p.name}</h2><p>Size: <strong>${item.size}</strong></p><p>₹${p.price} each</p>
      <div class="controls"><button class="minus">−</button><input type="number" min="1" value="${item.quantity}"><button class="plus">+</button><button class="remove">REMOVE</button></div></div>
      <strong>₹${line}</strong>`;
    row.querySelector(".minus").onclick=()=>{item.quantity=Math.max(1,item.quantity-1);setCart(cart);renderCart()};
    row.querySelector(".plus").onclick=()=>{item.quantity+=1;setCart(cart);renderCart()};
    row.querySelector("input").onchange=e=>{item.quantity=Math.max(1,Number(e.target.value)||1);setCart(cart);renderCart()};
    row.querySelector(".remove").onclick=()=>{cart.splice(index,1);setCart(cart);renderCart()};
    box.appendChild(row);
  });
  document.getElementById("subtotal").textContent=`₹${subtotal}`;
  document.getElementById("total").textContent=`₹${subtotal}`;
  updateCount();
}
document.getElementById("checkout")?.addEventListener("click",()=>alert("Checkout is not active yet. We will connect real payments later."));
updateCount(); renderCart();