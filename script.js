/* ── LOADER ── */
const lsub=document.getElementById("lsub"),ltitle=document.getElementById("ltitle"),lline=document.getElementById("lline"),loader=document.getElementById("loader");
setTimeout(()=>{lsub.classList.add("show");ltitle.classList.add("show");lline.classList.add("go")},100);
setTimeout(()=>{loader.classList.add("hide");setTimeout(()=>loader.remove(),900)},2800);

/* ── CURSOR ── */
const cur=document.getElementById("cursor"),ring=document.getElementById("cursor-ring");
let mx=0,my=0,rx=0,ry=0;
if(window.matchMedia("(hover:hover)").matches){
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx-6+"px";cur.style.top=my-6+"px"});
  (function ar(){rx+=(mx-rx-18)*.12;ry+=(my-ry-18)*.12;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(ar)})();
  document.querySelectorAll("a,[data-mouse],.j-slot,#lightbox-close").forEach(el=>{
    el.addEventListener("mouseenter",()=>{ring.style.width="60px";ring.style.height="60px";ring.style.borderColor="rgba(201,168,76,.8)"});
    el.addEventListener("mouseleave",()=>{ring.style.width="36px";ring.style.height="36px";ring.style.borderColor="rgba(201,168,76,.5)"});
  });
}

/* ── STARS ── */
const canvas=document.getElementById("stars"),ctx=canvas.getContext("2d");
let W,H,stars=[];
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}resize();
window.addEventListener("resize",resize);
function mk(){return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.1+.2,sp:Math.random()*.28+.04,tw:Math.random()*Math.PI*2}}
for(let i=0;i<160;i++)stars.push(mk());
(function anim(){
  ctx.clearRect(0,0,W,H);
  stars.forEach(s=>{s.tw+=.015;const b=.25+Math.sin(s.tw)*.25;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(201,168,76,${b})`;ctx.fill();s.y-=s.sp;if(s.y<-4){s.y=H+4;s.x=Math.random()*W}});
  requestAnimationFrame(anim);
})();

/* ── MARQUEE ── */
const words=["CALM AURA","DOG LOVER","POKE\u0301MON ADDICT","MAIN CHARACTER","GOON SQUAD HQ","RECOMMENDATION KING","NONCHALANT","COLLEGE ARC 2026","UNBOTHERED","LOYAL","PRITHI HOMIE ERA"];
const track=document.getElementById("mtrack");
let inner="";
for(let i=0;i<4;i++)words.forEach(w=>{inner+=`<span>${w}</span><span class="dot">❖</span>`});
track.innerHTML=inner;

/* ── MOUSE GLOW ── */
document.querySelectorAll("[data-mouse]").forEach(c=>{
  c.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)/r.width*100+"%");c.style.setProperty("--my",(e.clientY-r.top)/r.height*100+"%")});
});

/* ── SCROLL REVEAL ── */
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")})},{threshold:.1});
document.querySelectorAll(".reveal").forEach(r=>io.observe(r));

/* ── STAT BARS ── */
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){const f=e.target.querySelector(".stat-fill");if(f)f.style.width=f.dataset.w+"%";barObs.unobserve(e.target)}});
},{threshold:.3});
document.querySelectorAll(".stat-cell").forEach(c=>barObs.observe(c));

/* ── LIGHTBOX ── */
const lightbox=document.getElementById("lightbox");
const lbInner=document.getElementById("lightbox-inner");
let lbVideo=null;

function openLightbox(type, src, label){
  lbInner.innerHTML="";
  if(type==="img"){
    const img=document.createElement("img");
    img.src=src;
    lbInner.appendChild(img);
  } else {
    lbVideo=document.createElement("video");
    lbVideo.src=src;
    lbVideo.controls=true;
    lbVideo.autoplay=true;
    lbVideo.style.maxWidth="90vw";
    lbVideo.style.maxHeight="85vh";
    lbInner.appendChild(lbVideo);
  }
  lightbox.classList.add("open");
  document.body.style.overflow="hidden";
}

function closeLightbox(){
  if(lbVideo){lbVideo.pause();lbVideo=null}
  lbInner.innerHTML="";
  lightbox.classList.remove("open");
  document.body.style.overflow="";
  // page stays exactly where it was — no scroll change
}

// Close on backdrop click (not on the media itself)
lightbox.addEventListener("click",e=>{
  if(e.target===lightbox)closeLightbox();
});

// Close on Escape key
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeLightbox();
});

/* ── WISH SECTION — curtain + music + line reveal ── */
const bgMusic=document.getElementById("bgMusic");
const wishCurtain=document.getElementById("wish-curtain");
const wishEyebrow=document.getElementById("wish-eyebrow");
const musicBarWrap=document.getElementById("musicBarWrap");
let wishDone=false;

const wishObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!wishDone){
      wishDone=true;

      // 1. Lift the curtain after a short dramatic pause
      setTimeout(()=>{
        wishCurtain.classList.add("lifted");
        wishEyebrow.classList.add("show");
      },800);

      // 2. Play music (needs prior user gesture — gesture from scrolling counts on most browsers)
      setTimeout(()=>{
        bgMusic.volume=0;
        bgMusic.play().then(()=>{
          // Fade in volume smoothly
          let vol=0;
          const fadeIn=setInterval(()=>{
            vol=Math.min(vol+0.04,0.85);
            bgMusic.volume=vol;
            if(vol>=0.85)clearInterval(fadeIn);
          },120);
          musicBarWrap.classList.add("show","playing");
          document.getElementById("musicLabel").textContent="NOW PLAYING";
        }).catch(()=>{
          // Autoplay blocked — show a tap-to-play hint
          musicBarWrap.classList.add("show");
          document.getElementById("musicLabel").textContent="TAP ❖ TO PLAY";
          musicBarWrap.style.cursor="pointer";
          musicBarWrap.onclick=()=>{
            bgMusic.play();
            musicBarWrap.classList.add("playing");
            document.getElementById("musicLabel").textContent="NOW PLAYING";
            musicBarWrap.onclick=null;
          };
        });
      },1400);

      // 3. Reveal lines one by one
      setTimeout(()=>{
        document.querySelectorAll(".wish-line").forEach(line=>{
          setTimeout(()=>line.classList.add("visible"),parseInt(line.dataset.delay||0)*750+300);
        });
      },1200);
    }
  });
},{threshold:.15});

const ws=document.getElementById("wish");
if(ws)wishObs.observe(ws);