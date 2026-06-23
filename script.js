const year=document.getElementById('year');if(year){year.textContent=new Date().getFullYear();}
const menu=document.querySelector('.menu-btn');
const mobile=document.querySelector('.mobile-nav');
if(menu&&mobile){menu.addEventListener('click',function(){mobile.classList.toggle('open');});}
const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el);});
const glow=document.querySelector('.cursor-glow');
if(glow){window.addEventListener('mousemove',function(e){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});}