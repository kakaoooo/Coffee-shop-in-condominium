import { useState, useEffect, useRef } from "react";
import './App.css'; 
import axios from 'axios';
const API_BASE = `http://${window.location.hostname}:5001/api`;
const UPLOADS_BASE = `http://${window.location.hostname}:5001`;

const T = {
  en: {
    shopTagline:"Fresh beverages, delivered to your door", admin:"Admin", catAll:"All", 
    catEspresso:"Coffee", catCold:"Non-Coffee", 
    beanHouse:"House Blend", beanLight:"Light Roast (+฿10)", milkFresh:"Fresh Milk", milkOat:"Oat Milk (+฿10)", 
    optHot:"Hot", optIced:"Iced", 
    standard:"Standard", cart:"Your Cart", emptyCart:"Cart is empty.", total:"Total", proceedCheckout:"Proceed to Checkout →", yourDetails:"Your Details", namePH:"Your name *", unitLabel:"Delivery Unit *", notePH:"Special instructions (optional)", proceedPayment:"Proceed to Payment →", scanToPay:"📱 Scan QR to Pay", totalAmt:"Total Amount", attachSlip:"📎 Attach slip screenshot (required):", tapUpload:"📷 Tap to upload screenshot", maxSize:"(max 10MB)", removeSlip:"✕ Remove", confirmPayment:"✅ Confirm Payment & Place Order", backCart:"← Back to Cart", back:"← Back", viewCart:"View Cart →", items:"items", orderLabel:"Order", hide:"▲ Hide", showDetails:"▼ Details", orderedItems:"Items ordered:", slipRejectedMsg:"⚠️ Payment could not be verified. Please upload a clear screenshot.", uploadNewSlip:"📷 Upload new slip", submitNewSlip:"📤 Submit New Slip", slipSubmittedOk:"✅ New slip submitted! Please wait for verification.", statusPending:"Verifying payment slip 🔍", statusPreparing:"Brewing your order ☕", statusDelivering:"On the way to your unit! 🚶", statusCompleted:"Delivered — enjoy! 🎉", statusRejected:"Slip rejected — re-upload ⚠️", staffLogin:"Staff Login", pwPH:"Password", loginBtn:"Login", backToMenu:"← Back to Menu", wrongPw:"Wrong password!", dashboard:"👨‍🍳 Order Dashboard", showCompleted:"Show completed", refresh:"🔄 Refresh", exit:"← Exit", statTotal:"Total", statPending:"Pending", statBrewing:"Preparing", statDone:"Done", noCompleted:"No completed orders yet.", noActive:"No active orders.", verifyBrew:"✅ Verify Slip & Prepare", rejectSlip:"❌ Reject Slip", markDelivering:"🚶 Mark Delivering", markDelivered:"✅ Mark Delivered", awaitSlip:"Awaiting new slip from customer...", delConfirm:"Permanently delete this order?", slipLabel:"💳 Payment Slip:", clickEnlarge:"Click to enlarge", unitPrefix:"Unit:",
    menuNames:{ 1:"Classic Espresso",2:"Creamy Latte",3:"Cappuccino",4:"Americano",5:"Flat White",6:"Caramel Macchiato",7:"Premium Cocoa",8:"Matcha Latte",9:"Strawberry Soda",10:"Peach Soda",11:"Blue Hawaii",12:"Lemon Tea" },
    menuDescs:{ 1:"Rich & bold single shot",2:"Espresso with silky steamed milk",3:"Espresso, steamed milk & foam",4:"Espresso with hot water — no milk",5:"Double ristretto & velvety milk",6:"Vanilla, milk, espresso & caramel",7:"Rich and smooth chocolate",8:"Authentic Japanese green tea",9:"Fizzy and refreshing strawberry",10:"Sweet and sparkling peach",11:"Tropical blue citrus soda",12:"Refreshing iced lemon tea" },
    submitting: "Processing..."
  },
  th: {
    shopTagline:"เครื่องดื่มสดใหม่ ส่งตรงถึงประตูห้องคุณ", admin:"แอดมิน", catAll:"ทั้งหมด", 
    catEspresso:"กาแฟ", catCold:"ไม่ใช่กาแฟ", 
    beanHouse:"เมล็ดคั่วกลาง", beanLight:"คั่วอ่อน (+฿10)", milkFresh:"นมสด", milkOat:"นมโอ๊ต (+฿10)", 
    optHot:"ร้อน", optIced:"เย็น",
    standard:"มาตรฐาน", cart:"ตะกร้าสินค้า", emptyCart:"ยังไม่มีสินค้าในตะกร้า", total:"รวม", proceedCheckout:"ดำเนินการสั่งซื้อ →", yourDetails:"ข้อมูลการจัดส่ง", namePH:"ชื่อของคุณ *", unitLabel:"เลือกสถานที่ *", notePH:"คำแนะนำพิเศษ (ถ้ามี)", proceedPayment:"ไปยังหน้าชำระเงิน →", scanToPay:"📱 สแกน QR โอนเงิน", totalAmt:"ยอดรวม", attachSlip:"📎 แนบรูปสลิปโอนเงิน (จำเป็น):", tapUpload:"📷 แตะเพื่ออัปโหลดสลิป", maxSize:"(ไม่เกิน 10MB)", removeSlip:"✕ ลบออก", confirmPayment:"✅ ยืนยันการโอน & สั่งซื้อ", backCart:"← กลับตะกร้า", back:"← กลับ", viewCart:"ดูตะกร้า →", items:"รายการ", orderLabel:"ออเดอร์", hide:"▲ ซ่อน", showDetails:"▼ รายละเอียด", orderedItems:"รายการที่สั่ง:", slipRejectedMsg:"⚠️ ไม่สามารถยืนยันยอดเงินได้ กรุณาแนบสลิปที่ชัดเจนใหม่อีกครั้งครับ", uploadNewSlip:"📷 อัปโหลดสลิปใหม่", submitNewSlip:"📤 ส่งสลิปใหม่", slipSubmittedOk:"✅ ส่งสลิปใหม่สำเร็จ! กรุณารอตรวจสอบครับ", statusPending:"กำลังตรวจสอบสลิป 🔍", statusPreparing:"กำลังเตรียมออเดอร์ให้คุณ ☕", statusDelivering:"กำลังเดินไปส่งที่ห้อง! 🚶", statusCompleted:"ส่งถึงมือเรียบร้อย 🎉", statusRejected:"สลิปไม่ถูกต้อง — กรุณาส่งใหม่ ⚠️", staffLogin:"เข้าสู่ระบบพนักงาน", pwPH:"รหัสผ่าน", loginBtn:"เข้าสู่ระบบ", backToMenu:"← กลับหน้าร้าน", wrongPw:"รหัสผ่านไม่ถูกต้อง!", dashboard:"👨‍🍳 จัดการออเดอร์", showCompleted:"ดูประวัติที่เสร็จแล้ว", refresh:"🔄 รีเฟรช", exit:"← ออก", statTotal:"ทั้งหมด", statPending:"รอตรวจสลิป", statBrewing:"กำลังเตรียม", statDone:"เสร็จแล้ว", noCompleted:"ยังไม่มีประวัติออเดอร์ที่เสร็จครับ", noActive:"ยังไม่มีออเดอร์ใหม่ครับ", verifyBrew:"✅ ยืนยันสลิป & เริ่มทำ", rejectSlip:"❌ ปฏิเสธสลิป", markDelivering:"🚶 กำลังส่ง", markDelivered:"✅ ส่งเรียบร้อย", awaitSlip:"รอสลิปใหม่จากลูกค้า...", delConfirm:"ต้องการลบออเดอร์นี้ถาวรหรือไม่?", slipLabel:"💳 สลิปการโอนเงิน:", clickEnlarge:"แตะเพื่อขยาย", unitPrefix:"สถานที่:",
    menuNames:{ 1:"เอสเพรสโซ",2:"ลาเต้",3:"คาปูชิโน",4:"อเมริกาโน",5:"แฟลตไวท์",6:"คาราเมล มัคคิอาโต",7:"โกโก้พรีเมียม",8:"มัทฉะลาเต้",9:"สตรอว์เบอร์รีโซดา",10:"พีชโซดา",11:"บลูฮาวาย",12:"ชามะนาว" },
    menuDescs:{ 1:"ช็อตเข้มข้น กลมกล่อม",2:"เอสเพรสโซกับนมสดนุ่มนวล",3:"เอสเพรสโซ นมสด และโฟมนุ่ม",4:"เอสเพรสโซผสมน้ำร้อน — ไม่มีนม",5:"ริสเตรตโต้คู่ กับนมเนียน",6:"วานิลลา นม เอสเพรสโซ และคาราเมล",7:"ช็อกโกแลตเข้มข้น หอมมัน",8:"ชาเขียวแท้จากญี่ปุ่น",9:"โซดาสตรอว์เบอร์รี ซ่าสดชื่น",10:"โซดาพีช หอมหวานละมุน",11:"โซดาบลูฮาวาย สไตล์ทรอปิคอล",12:"ชามะนาว เปรี้ยวอมหวาน สดชื่น" },
    submitting: "กำลังดำเนินการ..."
  }
};

const MENU = [
  {id:1, cat:"Coffee", price:80, emoji:"☕", hasBean:true, hasMilk:false, hasTemp:true, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80"},
  {id:2, cat:"Coffee", price:120, emoji:"🥛", hasBean:true, hasMilk:true, hasTemp:true, image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=500&q=80"},
  {id:3, cat:"Coffee", price:120, emoji:"☕", hasBean:true, hasMilk:true, hasTemp:true, image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80"},
  {id:4, cat:"Coffee", price:100, emoji:"☕", hasBean:true, hasMilk:false, hasTemp:true, image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=500&q=80"},
  {id:5, cat:"Coffee", price:130, emoji:"🍶", hasBean:true, hasMilk:true, hasTemp:true, image: "https://www.lavazzausa.com/content/dam/lavazza-athena/b2c/stories/article/coffee-secrets/how-to-make-flat-white-coffee/hero/m-HOW-TO-SLOT-1@2.jpg"}, 
  {id:6, cat:"Coffee", price:150, emoji:"🍮", hasBean:true, hasMilk:true, hasTemp:true, image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=500&q=80"},
  {id:7, cat:"Non-Coffee", price:60, emoji:"🍫", hasBean:false, hasMilk:false, hasTemp:true, image: "https://images.squarespace-cdn.com/content/v1/5a6eaf7c6957da732ea347a3/1751600256151-P1KZZBUNZDOC8Y98FLXH/cocoa-obsession.jpg"}, 
  {id:8, cat:"Non-Coffee", price:70, emoji:"🍵", hasBean:false, hasMilk:false, hasTemp:true, image: "https://cdn.loveandlemons.com/wp-content/uploads/2023/06/iced-matcha-latte.jpg"}, 
  {id:9, cat:"Non-Coffee", price:50, emoji:"🍓", hasBean:false, hasMilk:false, hasTemp:true, image: "https://sweetpotatosoul.com/wp-content/uploads/2024/06/Tall-glass-of-strawberry-soda.jpeg"}, 
  {id:10, cat:"Non-Coffee", price:50, emoji:"🍑", hasBean:false, hasMilk:false, hasTemp:true, image: "https://www.bundaberg.com/wp-content/uploads/brew-peach-US.png"}, 
  {id:11, cat:"Non-Coffee", price:50, emoji:"🌊", hasBean:false, hasMilk:false, hasTemp:true, image: "https://www.thekitchenmagpie.com/wp-content/uploads/images/2018/04/bluehawaiiancocktail2.jpg"}, 
  {id:12, cat:"Non-Coffee", price:50, emoji:"🍋", hasBean:false, hasMilk:false, hasTemp:true, image: "https://www.thesouthernthing.com/wp-content/uploads/2020/05/lemon-lime-tea-cocktail-5-735x1050.jpg"}, 
];

const BEAN_EXTRA = 10; const MILK_EXTRA = 10;
const PROMPTPAY_NUMBER = "0918354757"; const SHOP_NAME = "Brew & Go";
const UNIT_OPTIONS = ["Lobby", "9", ...Array.from({length:150},(_,i)=>`9/${i+1}`)];

const STATUS_INFO = (t) => ({
  pending: {label:t.statusPending, dot:"var(--status-new-dot)", bg:"var(--status-new-bg)", fg:"var(--status-new-fg)"},
  preparing: {label:t.statusPreparing, dot:"var(--status-prepare-dot)", bg:"var(--status-prepare-bg)", fg:"var(--status-prepare-fg)"},
  delivering: {label:t.statusDelivering, dot:"var(--status-serve-dot)", bg:"var(--status-serve-bg)", fg:"var(--status-serve-fg)"},
  completed: {label:t.statusCompleted, dot:"var(--status-completed-dot)", bg:"var(--status-completed-bg)", fg:"var(--status-completed-fg)"},
  slip_rejected: {label:t.statusRejected, dot:"var(--status-rejected-dot)", bg:"var(--status-rejected-bg)", fg:"var(--status-rejected-fg)"},
});

function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=(c&0x8000)?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF;}return c.toString(16).toUpperCase().padStart(4,"0");}
function tlv(id,v){return id+v.length.toString().padStart(2,"0")+v;}
function buildQR(phone,amount){const n=phone.replace(/\D/g,"").replace(/^0/,"0066");const body=[tlv("00","01"),tlv("01","12"),tlv("29",tlv("00","A000000677010111")+tlv("01",n)),tlv("53","764"),...(amount>0?[tlv("54",amount.toFixed(2))]:[]),tlv("58","TH"),"6304"].join("");return body+crc16(body);}

export default function App(){
  const [lang, setLang] = useState("th");
  const t = T[lang];
  const [view, setView] = useState("menu");
  const [modal, setModal] = useState(null); 
  const [cart, setCart] = useState([]);
  
  const [beanOpt, setBeanOpt] = useState({});
  const [milkOpt, setMilkOpt] = useState({});
  const [tempOpt, setTempOpt] = useState({});
  const [viewImage, setViewImage] = useState(null);

  const [form, setForm] = useState({name:"", unit:"Lobby", note:""});
  
  const [slipFile, setSlipFile] = useState(null); 
  const [slipPrev, setSlipPrev] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [activeCatKey, setActiveCatKey] = useState("all");
  const [qrPayload, setQrPayload] = useState("");
  const [myOrderId, setMyOrderId] = useState(localStorage.getItem('myOrderId') || null);
  const [orderStatus, setOrderStatus] = useState('');
  const [myOrderItems, setMyOrderItems] = useState(() => { try { const saved = localStorage.getItem('myOrderItems'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; } });
  const [trackExp, setTrackExp] = useState(false);
  const [newSlipFile, setNewSlipFile] = useState(null);
  const [newSlipPrev, setNewSlipPrev] = useState(null);
  const qrDivRef = useRef(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminOrders, setAdminOrders] = useState([]);
  const [showDone, setShowDone] = useState(false);
  const [viewSlip, setViewSlip] = useState(null);
  
  useEffect(()=>{
    if(modal!=="qr"||!qrPayload)return;
    const el=qrDivRef.current;if(!el)return;
    el.innerHTML='';
    const render=()=>{
      try{ new window.QRCode(el,{ text:qrPayload,width:200,height:200,colorDark:"#000000",colorLight:"#ffffff",correctLevel:window.QRCode?.CorrectLevel?.M??0});
      }catch(e){el.innerHTML=`<div style="width:200px;text-align:center;padding:10px;color:red">⚠️ สแกนไม่ได้<br/>โอนที่ ${PROMPTPAY_NUMBER}</div>`;}
    };
    if(window.QRCode){render();}else{
      const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=render;document.body.appendChild(s);
    }
  },[modal,qrPayload]);
  
  useEffect(() => {
    let interval;
    if (myOrderId && orderStatus !== 'completed') {
      interval = setInterval(() => {
        axios.get(`${API_BASE}/orders/${myOrderId}`).then(res => {
            setOrderStatus(res.data.status);
            if (res.data.status === 'completed') {
              setTimeout(() => {
                localStorage.removeItem('myOrderId'); localStorage.removeItem('myOrderItems'); 
                setMyOrderId(null); setOrderStatus(''); setMyOrderItems([]);
              }, 10000); 
            }
          }).catch(console.error);
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [myOrderId, orderStatus]);
  
  const getBean = id => beanOpt[id]||"house";
  const getMilk = id => milkOpt[id]||"fresh";
  const getTemp = (id) => tempOpt[id] || 'iced';

  const getExtra = item => (item.hasBean?(getBean(item.id)==="light"?BEAN_EXTRA:0):0) + (item.hasMilk?(getMilk(item.id)==="oat"?MILK_EXTRA:0):0);
  const iKey = (id,b,m,tmp)=>`${id}_${b}_${m}_${tmp}`; 

  const addToCart = item => {
    const rawBean = item.hasBean ? getBean(item.id) : "";
    const rawTemp = item.hasTemp ? getTemp(item.id) : "";
    
    // combine hot/cold and beans option together for simpler cart display and key generation
    const combinedBean = [rawBean, rawTemp].filter(Boolean).join(",") || "—";
    const m = item.hasMilk ? getMilk(item.id) : "—";
    
    const name = T.en.menuNames[item.id];
    const key = iKey(item.id, rawBean, m, rawTemp); 
    const price = item.price + getExtra(item);
    
    setCart(prev=>{
      const ex=prev.find(c=>c.key===key);
      if(ex)return prev.map(c=>c.key===key?{...c,qty:c.qty+1,quantity:c.qty+1}:c);
      return[...prev,{...item, key, name, product_name:name, bean:combinedBean, milk:m, price, qty:1, quantity:1}];
    });
  };

  const updQty=(key,d)=>setCart(prev=>prev.map(c=>c.key===key?{...c,qty:c.qty+d,quantity:c.qty+d}:c).filter(c=>c.qty>0));
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const cartCount=cart.reduce((s,c)=>s+c.qty,0);
  
  const getDisplayLabel = (it) => {
    const parts=[];
    const b = it.bean_option || it.bean || "";
    const m = it.milk_option || it.milk || "";

    if(b.includes("light")) parts.push(t.beanLight);
    if(b.includes("house")) parts.push(t.beanHouse);
    if(b.includes("hot")) parts.push(t.optHot); 
    if(b.includes("iced")) parts.push(t.optIced); 

    if(m.includes("oat")) parts.push(t.milkOat);
    if(m.includes("fresh")) parts.push(t.milkFresh);

    return parts.length ? parts.join(", ") : t.standard;
  };
  
  const handleUploadSlip = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert(t.maxSize); return; }
    setSlipFile(file); 
    const reader = new FileReader(); 
    reader.onload = () => setSlipPrev(reader.result); 
    reader.readAsDataURL(file);
  };
  
  const handleUploadNewSlip = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert(t.maxSize); return; }
    setNewSlipFile(file);
    const reader = new FileReader(); 
    reader.onload = () => setNewSlipPrev(reader.result); 
    reader.readAsDataURL(file);
  };
  
  const handleConfirmOrder = () => {
    if(!form.name.trim()||!form.unit.trim()) return;
    setQrPayload(buildQR(PROMPTPAY_NUMBER,total));
    setSlipFile(null); setSlipPrev(null); setModal("qr");
  };
  
  const placeOrder = () => {
    if(!slipFile){ alert("⚠️ " + t.attachSlip); return; }
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('unit', form.unit);
    formData.append('note', form.note);
    formData.append('items', JSON.stringify(cart));
    formData.append('total', total);
    formData.append('slipImage', slipFile); 

    axios.post(`${API_BASE}/orders`, formData)
      .then((response) => {
        localStorage.setItem('myOrderId', response.data.orderId); 
        localStorage.setItem('myOrderItems', JSON.stringify(cart));
        setMyOrderId(response.data.orderId); 
        setMyOrderItems(cart); 
        setOrderStatus('pending'); 
        setTrackExp(true); 
        setCart([]); 
        setForm({name:"", unit:"Lobby", note:""}); 
        setSlipFile(null); 
        setSlipPrev(null); 
        setModal(null);
      })
      .catch((error) => {
        console.error("Order Error:", error);
        const serverError = error.response?.data?.error;
        alert(`❌ ไม่สามารถส่งออเดอร์ได้: ${serverError || error.message}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const reuploadSlip = () => {
    if(!newSlipFile){alert("⚠️ "+t.uploadNewSlip);return;}
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('slipImage', newSlipFile);

    axios.put(`${API_BASE}/orders/${myOrderId}/slip`, formData)
      .then(() => { setOrderStatus('pending'); setNewSlipFile(null); setNewSlipPrev(null); alert(t.slipSubmittedOk); })
      .catch((error) => {
         const serverError = error.response?.data?.error;
         alert(`❌ ไม่สามารถส่งข้อมูลได้: ${serverError || error.message}`);
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE}/login`, { password: adminPw })
      .then(res => {
         if (res.data.success) {
             localStorage.setItem('adminToken', res.data.token);
             setAdminToken(res.data.token);
             fetchAdmin(res.data.token);
         }
      })
      .catch(() => { alert(t.wrongPw); setAdminPw(''); });
  };

  const fetchAdmin = (tokenToUse = adminToken) => {
    axios.get(`${API_BASE}/admin/orders`, { headers: { Authorization: tokenToUse } })
      .then(res => setAdminOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => { if(err.response?.status === 403) handleLogout(); });
  };

  const updStatus = (id, newStatus) => {
    axios.put(`${API_BASE}/orders/${id}/status`, { newStatus }, { headers: { Authorization: adminToken } })
      .then(() => fetchAdmin()).catch(() => alert("❌ เกิดข้อผิดพลาด"));
  };

  const delOrder = (id) => {
    if(!window.confirm(t.delConfirm)) return;
    axios.delete(`${API_BASE}/orders/${id}`, { headers: { Authorization: adminToken } })
      .then(() => fetchAdmin()).catch(() => alert("❌ เกิดข้อผิดพลาด"));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null); setAdminPw(''); setView('menu');
  };
  
  const si = myOrderId ? STATUS_INFO(t)[orderStatus] || STATUS_INFO(t)['pending'] : null;
  
  const categoryTabs = [
    { key: "all", label: t.catAll },
    { key: "coffee", label: t.catEspresso },
    { key: "noncoffee", label: t.catCold }
  ];
  
  const getFilterCategoryName = (key) => {
    if(key === "coffee") return "Coffee";
    if(key === "noncoffee") return "Non-Coffee";
    return "All";
  };
  
  const filteredMenu = activeCatKey === "all" 
      ? MENU 
      : MENU.filter(m => m.cat === getFilterCategoryName(activeCatKey));

  const LangToggle = () => (
    <div className="language-switcher" style={{display:"flex", flexDirection:"row", gap:4}}>
      <button onClick={()=>setLang("en")} className={`cat-btn ${lang==="en"?'active':''}`} style={{padding:"4px 8px", display:"flex", alignItems:"center", gap:6, margin:0}}>
        <img src={`https://flagcdn.com/w20/gb.png`} alt="EN" style={{width:16, borderRadius:2}}/> EN
      </button>
      <button onClick={()=>setLang("th")} className={`cat-btn ${lang==="th"?'active':''}`} style={{padding:"4px 8px", display:"flex", alignItems:"center", gap:6, margin:0}}>
        <img src={`https://flagcdn.com/w20/th.png`} alt="TH" style={{width:16, borderRadius:2}}/> TH
      </button>
    </div>
  );

  // ════════════════════════════════════════════════════
  // ADMIN VIEW
  // ════════════════════════════════════════════════════
  if(view==="admin"){
    if(!adminToken) return(
      <div className="app-wrapper" style={{display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
        <div className="card-login">
          <div style={{fontSize:40, marginBottom:10}}>🔒</div>
          <h2 className="login-title-delighted">LOGIN</h2>
          <div style={{display:"flex", justifyContent:"center", marginBottom:16}}><LangToggle/></div>
          <form onSubmit={handleLogin}>
              <input className="input-field" type="password" placeholder={t.pwPH} 
                value={adminPw} onChange={e=>setAdminPw(e.target.value)} />
              <button type="submit" className="btn-login">{t.loginBtn}</button>
          </form>
          <button className="btn-secondary" style={{marginTop:10, width:"100%", border:"none", color:"gray"}} onClick={()=>setView("menu")}>{t.backToMenu}</button>
        </div>
      </div>
    );

    const filtered=adminOrders.filter(o=>showDone?o.status==="completed":o.status!=="completed");
    
    return(
      <div className="app-wrapper">
        <div className="header" style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, borderRadius:"0 0 16px 16px"}}>
          <h2 style={{margin:0, color:"var(--primary-foreground)"}}>{t.dashboard}</h2>
          <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
            <LangToggle/>
            <label style={{fontSize:13, display:"flex", alignItems:"center", gap:4, cursor:"pointer", color: "var(--primary-foreground)"}}>
              <input type="checkbox" checked={showDone} onChange={e=>setShowDone(e.target.checked)}/> 
              {t.showCompleted}
            </label>
            <button className="btn-secondary" style={{background:"white", border:"none"}} onClick={() => fetchAdmin()}>{t.refresh}</button>
            <button className="btn-secondary" style={{background:"var(--destructive)", color:"white", border:"none"}} onClick={handleLogout}>{t.exit}</button>
          </div>
        </div>
        
        <div className="admin-stats-grid" style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, padding:"0 24px 20px"}}>
          {[[t.statTotal,adminOrders.length],[t.statPending,adminOrders.filter(o=>o.status==="pending").length],[t.statBrewing,adminOrders.filter(o=>o.status==="preparing").length],[t.statDone,adminOrders.filter(o=>o.status==="completed").length]].map(([l,v])=>(
            <div key={l} style={{textAlign:"center", padding:"20px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius-md)"}}>
              <div style={{fontSize:32, fontWeight:"bold", color:"var(--primary)"}}>{v}</div>
              <div style={{fontSize:13, color:"gray", fontWeight:"600", letterSpacing:"0.05em"}}>{l}</div>
            </div>
          ))}
        </div>

        <div className="menu-container">
          {filtered.length===0 ?
            <div style={{textAlign:"center", color:"var(--primary)", padding:40, opacity:0.6}}>{showDone?t.noCompleted:t.noActive}</div> : 
            filtered.map(o=>{
             const st = STATUS_INFO(t)[o.status] || STATUS_INFO(t)['pending'];
             const safeRoomNumber = String(o.unit || 'Lobby');
             const displayRoom = safeRoomNumber.includes('/') ? `${safeRoomNumber}` : safeRoomNumber;

             return (
            <div key={o.id} style={{background:"var(--card)", padding:"24px", borderRadius:"var(--radius-md)", border:"1px solid var(--border)", marginBottom:20, borderLeft:`8px solid ${st.dot}`, opacity: o.status==='completed'?0.7:1, boxShadow:"var(--shadow-interactive)"}}>
              <div style={{display:"flex", justifyContent:"space-between", borderBottom:"1px solid var(--border)", paddingBottom:16, marginBottom:16}}>
                <div>
                  <strong style={{color:"var(--primary)", fontSize:20}}>#{o.id}</strong>
                  <div style={{fontSize:14, color:"gray", marginTop:8}}>📍 {t.unitPrefix} <strong style={{color:"var(--foreground)"}}>{displayRoom}</strong> {o.note && `· 📝 ${o.note}`}</div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                    <span style={{background:st.bg, color:st.fg, padding:"6px 12px", borderRadius:"20px", fontSize:13, fontWeight:"bold"}}>{st.label}</span>
                    <button onClick={()=>delOrder(o.id)} style={{background:"none", border:"none", color:"var(--destructive)", cursor:"pointer", fontSize:20}}>🗑️</button>
                </div>
              </div>
              
              {o.items.map((it,i)=>{
                 return (
                    <div key={i} style={{display:"flex", justifyContent:"space-between", fontSize:15, marginBottom:8}}>
                      <span style={{fontWeight:"600"}}>☕ {it.product_name} ×{it.quantity} <small style={{color:"var(--primary)", fontWeight:"normal"}}>({getDisplayLabel(it)})</small></span>
                    </div>
                 )
              })}

              <div style={{textAlign:"right", color:"var(--primary)", fontWeight:"800", marginTop:16, fontSize:22}}>฿{o.total}</div>
              
              {o.slip && <div style={{marginTop:16}}><img src={`${UPLOADS_BASE}${o.slip}`} alt="slip" onClick={()=>setViewSlip(`${UPLOADS_BASE}${o.slip}`)} style={{height:140, borderRadius:12, cursor:"zoom-in", border:"1px solid var(--border)", objectFit:"cover"}}/></div>}
              
              <div style={{display:"flex", gap:12, marginTop:24, flexWrap:"wrap"}}>
                {o.status==="pending"&&<><button className="btn-primary" style={{flex:1}} onClick={()=>updStatus(o.id,"preparing")}>{t.verifyBrew}</button><button className="btn-secondary" style={{borderColor:"var(--destructive)", color:"var(--destructive)"}} onClick={()=>updStatus(o.id,"slip_rejected")}>{t.rejectSlip}</button></>}
                {o.status==="preparing"&&<button className="btn-primary" style={{background:"var(--accent)", color:"var(--foreground)"}} onClick={()=>updStatus(o.id,"delivering")}>{t.markDelivering}</button>}
                {o.status==="delivering"&&<button className="btn-primary" style={{background:"var(--gold)", color:"var(--foreground)"}} onClick={()=>updStatus(o.id,"completed")}>{t.markDelivered}</button>}
                {o.status==="slip_rejected"&&<span style={{color:"var(--destructive)", fontSize:15, fontWeight:"bold"}}>{t.awaitSlip}</span>}
              </div>
            </div>
            )
          })}
        </div>
        {viewSlip&&<SlipModal src={viewSlip} onClose={()=>setViewSlip(null)}/>}
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // MENU VIEW
  // ════════════════════════════════════════════════════
  return(
    <div className="app-wrapper">

      <header className="header">
        <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px", alignItems: "center", zIndex: 50, background: "rgba(255,255,255,0.8)", padding: "6px 12px", borderRadius: "30px", backdropFilter: "blur(5px)" }}>
          <button className="btn-secondary" style={{ padding: "6px 12px", border: "none", margin: 0, fontWeight: "bold" }} onClick={()=>{setView("admin"); if(adminToken) fetchAdmin(adminToken);}}>
            🔑 {t.admin}
          </button>
          <LangToggle/>
        </div>

        <span className="header-tagline">
          <div className="pulse-dot"></div>
          Amaranta Residence
        </span>
        <h1 className="header-title">Brew & Go</h1>
        <p className="header-desc">Elevate your morning, one cup at a time.</p>
      </header>

      {myOrderId&&si&&(
        <div style={{background:si.bg, color:si.fg, margin:"0 24px 40px", borderRadius:"12px", overflow:"hidden", border:"1px solid var(--border)"}}>
          <button 
            onClick={()=>setTrackExp(!trackExp)} 
            style={{
              display:"flex", 
              justifyContent:"space-between", 
              padding:"20px 24px", 
              cursor:"pointer", 
              fontWeight:"bold", 
              width:"100%", 
              background:"none", 
              border:"none", 
              color:"inherit",
              textAlign:"left",
              fontFamily:"inherit"
            }}
          >
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <div style={{width:10, height:10, borderRadius:"50%", background:si.dot}}/>
              <span style={{letterSpacing:"0.02em"}}>{t.orderLabel} #{myOrderId} — {si.label}</span>
            </div>
            <span style={{fontSize:12, opacity:0.6}}>{trackExp?t.hide:t.showDetails}</span>
          </button>
          {orderStatus==="slip_rejected"&&(
            <div style={{padding:"0 24px 24px"}}>
              <div style={{color:"var(--destructive)", fontSize:14, marginBottom:16, fontWeight:"700"}}>{t.slipRejectedMsg}</div>
              <label style={{display:"block", border:"2px dashed var(--border)", padding:24, textAlign:"center", borderRadius:12, cursor:"pointer", background:"white"}}>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={handleUploadNewSlip}/>
                {newSlipPrev?<img src={newSlipPrev} alt="slip" style={{height:100, borderRadius:8}}/>:<div style={{color:"var(--primary)", fontWeight:"600"}}>{t.uploadNewSlip}</div>}
              </label>
              {newSlipFile&&<button className="btn-primary" style={{marginTop:16, width:"100%"}} disabled={isSubmitting} onClick={reuploadSlip}>{isSubmitting ? t.submitting : t.submitNewSlip}</button>}
            </div>
          )}
          {trackExp&&(
            <div style={{padding:"20px 24px", borderTop:`1px solid var(--border)`, background:"white", color:"var(--foreground)"}}>
              <div style={{fontSize:12, color:"gray", marginBottom:12, fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em"}}>{t.orderedItems}</div>
              {myOrderItems.map((it,i)=>(
                <div key={i} style={{display:"flex", justifyContent:"space-between", fontSize:15, marginBottom:8}}>
                  <span>{it.product_name || T[lang].menuNames[it.id]} <small style={{opacity:0.6}}>×{it.quantity}</small></span>
                  <span style={{opacity:0.6, fontSize:13}}>{getDisplayLabel(it)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="cat-tabs">
        {categoryTabs.map(c=>(
          <button key={c.key} onClick={()=>setActiveCatKey(c.key)} className={`cat-btn ${activeCatKey===c.key?'active':''}`}>{c.label}</button>
        ))}
      </nav>

      <main className="menu-container">
          {["Coffee","Non-Coffee"].filter(c=>activeCatKey==="all" || getFilterCategoryName(activeCatKey)===c).map(cat=>(
            <section key={cat} className="category-section">

              <h2 className="category-title">{cat==="Coffee" ? "☕ " + t.catEspresso : "🥤 " + t.catCold}</h2>

              <div className="menu-grid">
                {filteredMenu.filter(m=>m.cat===cat).map(item=>{
                  const b=getBean(item.id), mk=getMilk(item.id), tmp=getTemp(item.id), extra=getExtra(item);
                  const inCart=cart.filter(c=>c.id===item.id).reduce((s,c)=>s+c.qty,0);
                  return(
                    <article key={item.id} className={`menu-card ${inCart?'in-cart':''}`}>
                      {item.image && (
                        <div className="menu-card-image-wrapper">
                          <img 
                            src={item.image} 
                            alt={t.menuNames[item.id]} 
                            className="menu-card-image" 
                            loading="lazy" 
                            onClick={() => setViewImage(item.image)}
                            style={{ cursor: "zoom-in" }}
                          />
                        </div>
                      )}

                      <div className="menu-card-content">
                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                          <h3 className="menu-card-title">{t.menuNames[item.id]}</h3>
                          {inCart>0 && <span style={{background:"var(--primary)", color:"white", padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:700}}>×{inCart}</span>}
                        </div>
                        <p className="menu-card-desc">{t.menuDescs[item.id]}</p>

                        {(item.hasBean||item.hasMilk||item.hasTemp)&&(
                          <div style={{display:"flex", gap:8, marginTop:4}}>
                            {item.hasBean&&<select className="btn-secondary" style={{padding:"6px 12px", fontSize:12}} value={b} onChange={e=>setBeanOpt({...beanOpt,[item.id]:e.target.value})}><option value="house">{t.beanHouse}</option><option value="light">{t.beanLight}</option></select>}
                            {item.hasMilk&&<select className="btn-secondary" style={{padding:"6px 12px", fontSize:12}} value={mk} onChange={e=>setMilkOpt({...milkOpt,[item.id]:e.target.value})}><option value="fresh">{t.milkFresh}</option><option value="oat">{t.milkOat}</option></select>}
                            {item.hasTemp&&<select className="btn-secondary" style={{padding:"6px 12px", fontSize:12}} value={tmp} onChange={e=>setTempOpt({...tempOpt,[item.id]:e.target.value})}><option value="iced">{t.optIced}</option><option value="hot">{t.optHot}</option></select>}
                          </div>
                        )}

                        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"auto", paddingTop:16, borderTop:"1px solid var(--border)"}}>
                          <span style={{fontSize:20, fontWeight:800}}>฿{item.price+extra}</span>
                          <button className="btn-primary" style={{padding:"10px 20px", borderRadius:40}} onClick={()=>addToCart(item)}>
                             <span style={{fontSize:18}}>+</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
      </main>

      {cartCount>0&&(
        <div className="floating-cart">
          <button className="floating-cart-btn" onClick={()=>setModal("cart")}>
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <span style={{background:"white", color:"var(--primary)", width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14}}>{cartCount}</span>
              <span>{t.viewCart}</span>
            </div>
            <span>฿{total}</span>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {modal==="cart"&&(
        <Modal onClose={()=>setModal(null)}>
          <button className="btn-secondary" style={{marginBottom:32, border:"none", padding:0, fontSize:13, opacity:0.6}} onClick={()=>setModal(null)}>← {t.back}</button>
          <h2 style={{marginTop:0, fontSize:32, fontWeight:800, letterSpacing:"-0.02em", marginBottom:32}}>{t.cart}</h2>
          {cart.length===0?<p style={{textAlign:"center", color:"gray", padding:40, fontSize:15}}>{t.emptyCart}</p>:<>
            <div style={{display:"flex", flexDirection:"column", gap:24, marginBottom:40}}>
              {cart.map(c=>(
                <div key={c.key} style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div style={{flex:1}}>
                    <strong style={{fontSize:16, display:"block", marginBottom:4}}>{t.menuNames[c.id]}</strong>
                    <div style={{fontSize:13, opacity:0.5}}>{getDisplayLabel(c)}</div>
                    <div style={{fontSize:15, fontWeight:700, marginTop:4}}>฿{c.price}</div>
                  </div>
                  <div style={{display:"flex", alignItems:"center", gap:16, background:"var(--input-background)", borderRadius:40, padding:"4px 8px"}}>
                    <button className="btn-secondary" style={{padding:"4px 12px", fontSize:18, border:"none", background:"none"}} onClick={()=>updQty(c.key,-1)}>−</button>
                    <span style={{fontWeight:800, minWidth:20, textAlign:"center", fontSize:14}}>{c.qty}</span>
                    <button className="btn-secondary" style={{padding:"4px 12px", fontSize:18, border:"none", background:"none"}} onClick={()=>updQty(c.key,1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:24, fontWeight:800, margin:"32px 0", borderTop:"1px solid var(--border)", paddingTop:24}}>
              <span>{t.total}</span><span>฿{total}</span>
            </div>
            <button className="btn-primary" style={{width:"100%", borderRadius:40, padding:20}} onClick={()=>setModal("checkout")}>{t.proceedCheckout}</button>
          </>}
        </Modal>
      )}

      {/* Checkout Modal */}
      {modal==="checkout"&&(
        <Modal onClose={()=>setModal("cart")}>
          <button className="btn-secondary" style={{marginBottom:32, border:"none", padding:0, fontSize:13, opacity:0.6}} onClick={()=>setModal("cart")}>← {t.backCart}</button>
          <h2 style={{marginTop:0, fontSize:32, fontWeight:800, letterSpacing:"-0.02em", marginBottom:32}}>{t.yourDetails}</h2>
          
          <div style={{display:"flex", flexDirection:"column", gap:20}}>
            <div>
              <label style={{fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, display:"block", opacity:0.6}}>{t.namePH}</label>
              <input className="input-field" style={{background:"var(--input-background)", border:"none", borderRadius:12, padding:16, margin:0}} placeholder="Type your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </div>

            <div>
              <label className="field-label">{t.unitLabel}</label>
              <select className="input-field-subtle" value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}>
                {UNIT_OPTIONS.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>

            <div>
              <label style={{fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8, display:"block", opacity:0.6}}>{t.notePH}</label>
              <textarea className="input-field" style={{background:"var(--input-background)", border:"none", borderRadius:12, padding:16, height:100, resize:"none", margin:0}} placeholder="Any special requests?" value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/>
            </div>
          </div>

          <button className="btn-primary" style={{marginTop:40, width:"100%", borderRadius:40, padding:20}} disabled={!form.name.trim()||!form.unit.trim()} onClick={handleConfirmOrder}>{t.proceedPayment}</button>
        </Modal>
      )}

      {/* QR Modal */}
      {modal==="qr"&&(
        <Modal onClose={()=>setModal("checkout")}>
          <button className="btn-secondary" style={{marginBottom:32, border:"none", padding:0, fontSize:13, opacity:0.6}} onClick={()=>setModal("checkout")}>← {t.back}</button>
          <h2 style={{marginTop:0, textAlign:"center", fontSize:28, fontWeight:800, marginBottom:8}}>{t.scanToPay}</h2>
          <p style={{textAlign:"center", fontSize:40, fontWeight:800, color:"var(--primary)", margin:"0 0 32px"}}>฿{total.toFixed(2)}</p>
          
          <div style={{display:"flex", justifyContent:"center", marginBottom:40}}>
            <div style={{background:"white", padding:24, borderRadius:24, boxShadow:"0 20px 40px rgba(0,0,0,0.05)", border:"1px solid var(--border)"}}><div ref={qrDivRef}/></div>
          </div>
          
          <div style={{marginBottom:40}}>
            <div style={{fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, textAlign:"center", opacity:0.6}}>{t.attachSlip}</div>
            
            <label style={{display:"block", border:`2px dashed var(--border)`, padding:40, textAlign:"center", borderRadius:20, cursor:"pointer", background: "var(--input-background)", transition:"var(--transition)"}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={handleUploadSlip}/>
              
              {slipPrev ? (
                 <img src={slipPrev} alt="slip" style={{maxHeight:200, borderRadius:12, boxShadow:"var(--shadow-lift)"}}/>
              ) : (
                 <div style={{color:"var(--primary)", fontSize:15, fontWeight:600}}>
                    <span style={{fontSize:40, display:"block", marginBottom:12}}>📸</span>
                    {t.tapUpload}<br/><small style={{opacity:0.5, fontWeight:400}}>{t.maxSize}</small>
                 </div>
              )}
            </label>
            
            {slipFile && (
              <div style={{textAlign:"center", marginTop:16}}>
                <button className="btn-secondary" style={{color:"var(--destructive)", border:"none", background:"none"}} onClick={() => {setSlipFile(null); setSlipPrev(null);}}>
                   {t.removeSlip}
                </button>
              </div>
            )}
          </div>
          
          <button className="btn-primary" style={{width:"100%", borderRadius:40, padding:20}} disabled={!slipFile || isSubmitting} onClick={placeOrder}>
             {isSubmitting ? t.submitting : t.confirmPayment}
          </button>
        </Modal>
      )}

      {viewImage && <SlipModal src={viewImage} onClose={() => setViewImage(null)} />}

    </div>
  );
}

function Modal({children,onClose}){
  return (
    <div className="modal-overlay">
      <button 
        className="modal-overlay-close-btn" 
        onClick={onClose} 
        aria-label="Close modal"
        style={{
          position: "absolute",
          inset: 0,
          background: "none",
          border: "none",
          width: "100%",
          height: "100%",
          cursor: "default"
        }}
      />
      <div className="modal-content" style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

function SlipModal({src,onClose}){
  return (
    <div className="modal-overlay">
      <button 
        className="modal-overlay-close-btn" 
        onClick={onClose} 
        aria-label="Close modal"
        style={{
          position: "absolute",
          inset: 0,
          background: "none",
          border: "none",
          width: "100%",
          height: "100%",
          cursor: "default"
        }}
      />
      <div style={{position:"relative", maxWidth:400, width:"100%", zIndex: 1}}>
        <img src={src} alt="slip" style={{width:"100%", borderRadius:12, maxHeight:"80vh", objectFit:"contain"}}/>
        <button onClick={onClose} style={{position:"absolute", top:-15, right:-15, background:"var(--destructive)", color:"white", border:"none", borderRadius:"50%", width:35, height:35, cursor:"pointer", fontWeight:"bold", boxShadow:"0 2px 10px rgba(0,0,0,0.3)"}}>✕</button>
      </div>
    </div>
  );
}