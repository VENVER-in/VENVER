const PRODUCTS={
  1:{id:1,name:'Abstract Camo Tee',price:500,image:'images/product1.jpg'},
  2:{id:2,name:'Floral Frame Tee',price:500,image:'images/sample2.jpg'}
};
const KEY='venverCartV2';
let cart=JSON.parse(localStorage.getItem(KEY)||'[]');
function save(){localStorage.setItem(KEY,JSON.stringify(cart));updateCount();}
function updateCount(){const n=cart.reduce((s,i)=>s+i.qty,0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n)}
function getQty(id){const custom=document.getElementById('custom'+id);let q=custom&&custom.value?parseInt(custom.value):0;if(q>0)return q;const active=document.querySelector(`[data-product="${id}"]`)?.parentElement.querySelector('.qty button.active');return active?parseInt(active.dataset.qty):1}
function add(id){const p=PRODUCTS[id];const size=document.getElementById('size'+id)?.value||'XL';const qty=Math.max(1,getQty(id));const key=id+'-'+size;const found=cart.find(x=>x.key===key);if(found)found.qty+=qty;else cart.push({key,id,size,qty});save();alert(`${qty} × ${p.name} added to cart.`)}
function renderCart(){const box=document.getElementById('cartItems');if(!box)return;const empty=document.getElementById('cartEmpty'),content=document.getElementById('cartContent');if(!cart.length){empty.hidden=false;content.style.display='none';updateCount();return}empty.hidden=true;content.style.display='grid';box.innerHTML=cart.map((i,idx)=>{const p=PRODUCTS[i.id];return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>Size: ${i.size}</p><p>₹${p.price} each</p><div class="cart-controls"><button onclick="changeQty(${idx},-1)">−</button><input type="number" min="1" value="${i.qty}" onchange="setQty(${idx},this.value)"><button onclick="changeQty(${idx},1)">+</button><button class="remove" onclick="removeItem(${idx})">REMOVE</button></div></div><div class="line-total">₹${p.price*i.qty}</div></div>`}).join('');const subtotal=cart.reduce((s,i)=>s+PRODUCTS[i.id].price*i.qty,0);document.getElementById('subtotal').textContent='₹'+subtotal;document.getElementById('total').textContent='₹'+subtotal;updateCount()}
function changeQty(idx,d){cart[idx].qty=Math.max(1,cart[idx].qty+d);save();renderCart()}
function setQty(idx,v){const q=parseInt(v);cart[idx].qty=Math.max(1,isNaN(q)?1:q);save();renderCart()}
function removeItem(idx){cart.splice(idx,1);save();renderCart()}
document.addEventListener('click',e=>{const q=e.target.closest('[data-qty]');if(q){const wrap=q.closest('.qty');wrap.querySelectorAll('button').forEach(b=>b.classList.remove('active'));q.classList.add('active');const inp=wrap.querySelector('input');if(inp)inp.value=''}});document.querySelectorAll('.add').forEach(b=>b.addEventListener('click',()=>add(Number(b.dataset.product))));document.getElementById('checkout')?.addEventListener('click',()=>alert('Checkout will be connected to a real payment/order system when VENVER is ready to sell.'));updateCount();renderCart();
