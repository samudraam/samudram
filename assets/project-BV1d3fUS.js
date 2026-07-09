import"./loader-bCRQtbAi.js";import{p as m,i as $}from"./apply-theme-Ce-kM_Nc.js";let s=null,u=0,o=[],f=null,y=!1;const p=()=>(s instanceof HTMLElement||(s=document.createElement("div"),s.className="gallery-lightbox",s.id="gallery-lightbox",s.setAttribute("role","dialog"),s.setAttribute("aria-modal","true"),s.setAttribute("aria-label","Image gallery"),s.setAttribute("aria-hidden","true"),s.hidden=!0,s.innerHTML=`
    <div class="gallery-lightbox__backdrop" data-action="close"></div>
    <div class="gallery-lightbox__panel glass-surface">
      <button
        type="button"
        class="gallery-lightbox__close glass-surface"
        data-action="close"
        aria-label="Close gallery"
      >
        <span aria-hidden="true">×</span>
      </button>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--prev glass-surface"
        data-action="prev"
        aria-label="Previous image"
      >
        <span aria-hidden="true">←</span>
      </button>
      <figure class="gallery-lightbox__figure">
        <img class="gallery-lightbox__img" src="" alt="" />
        <figcaption class="gallery-lightbox__caption"></figcaption>
      </figure>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--next glass-surface"
        data-action="next"
        aria-label="Next image"
      >
        <span aria-hidden="true">→</span>
      </button>
      <p class="gallery-lightbox__counter glass-surface" aria-live="polite"></p>
    </div>
  `,document.body.appendChild(s),s.addEventListener("click",j)),s),x=()=>{const e=p(),t=o[u];if(!t)return;const a=e.querySelector(".gallery-lightbox__img"),n=e.querySelector(".gallery-lightbox__caption"),g=e.querySelector(".gallery-lightbox__counter"),r=e.querySelector('[data-action="prev"]'),i=e.querySelector('[data-action="next"]');if(!(a instanceof HTMLImageElement))return;a.src=t.src,a.alt=t.alt??"",n instanceof HTMLElement&&(n.textContent=t.caption??"",n.hidden=!t.caption),g instanceof HTMLElement&&(g.textContent=`${u+1} / ${o.length}`);const c=o.length>1;r instanceof HTMLButtonElement&&(r.hidden=!c),i instanceof HTMLButtonElement&&(i.hidden=!c)},H=e=>{if(!o.length)return;u=e,x();const t=p();t.hidden=!1,t.setAttribute("aria-hidden","false"),t.classList.add("is-open"),document.body.classList.add("gallery-lightbox-open");const a=t.querySelector(".gallery-lightbox__close");a instanceof HTMLElement&&a.focus()},L=()=>{const e=p();e.hidden=!0,e.setAttribute("aria-hidden","true"),e.classList.remove("is-open"),document.body.classList.remove("gallery-lightbox-open"),f instanceof HTMLElement&&(f.focus(),f=null)},b=e=>{o.length<=1||(u=(u+e+o.length)%o.length,x())},j=e=>{const t=e.target;if(!(t instanceof Element))return;const a=t.closest("[data-action]");if(!(a instanceof HTMLElement))return;const n=a.getAttribute("data-action");if(n==="close"){L();return}if(n==="prev"){b(-1);return}n==="next"&&b(1)},k=e=>{if(!p().hidden){if(e.key==="Escape"){e.preventDefault(),L();return}if(e.key==="ArrowLeft"){e.preventDefault(),b(-1);return}e.key==="ArrowRight"&&(e.preventDefault(),b(1))}},w=(e,t)=>{t!=null&&t.length&&(o=t,p(),y||(document.addEventListener("keydown",k),y=!0),e.querySelectorAll("[data-gallery-index]").forEach(a=>{a.addEventListener("click",()=>{const n=Number(a.getAttribute("data-gallery-index"));Number.isNaN(n)||(f=a instanceof HTMLElement?a:null,H(n))}),a.addEventListener("keydown",n=>{n instanceof KeyboardEvent&&(n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),a.dispatchEvent(new Event("click"))))})}))},T="http://127.0.0.1:7547/ingest/96b32e8d-a64f-4e20-aa21-99c92673c97b",_="32ef22",D="pre-fix",v=new Set(["localhost","127.0.0.1"]),d=(e,t,a)=>{v.has(window.location.hostname)&&fetch(T,{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":_},body:JSON.stringify({sessionId:_,runId:D,hypothesisId:e,location:"src/project-detail.js",message:t,data:a,timestamp:Date.now()})}).catch(()=>{})},h=e=>{var t,a;return{currentSrc:e.currentSrc,sourceSrc:((t=e.querySelector("source"))==null?void 0:t.getAttribute("src"))??"",resolvedSourceUrl:((a=e.querySelector("source"))==null?void 0:a.src)??"",poster:e.poster,readyState:e.readyState,networkState:e.networkState,paused:e.paused,ended:e.ended,muted:e.muted,controls:e.controls,preload:e.preload,display:getComputedStyle(e).display,visibility:getComputedStyle(e).visibility,pointerEvents:getComputedStyle(e).pointerEvents,className:e.className,error:e.error?{code:e.error.code,message:e.error.message}:null}},A=()=>new URLSearchParams(window.location.search).get("slug"),I=e=>m.projects.find(t=>t.slug===e),M=e=>{if(d("H2,H3,H4","project video init state",{video:h(e)}),e.poster||e.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA){e.classList.add("is-media-ready"),d("H3","project video marked ready immediately",{video:h(e)});return}e.addEventListener("loadeddata",()=>{e.classList.add("is-media-ready"),d("H3","project video marked ready after loadeddata",{video:h(e)})},{once:!0})},U=(e,t)=>{["loadstart","loadedmetadata","canplay","play","playing","pause","waiting","stalled","error"].forEach(a=>{e.addEventListener(a,()=>{d("H1,H2,H4,H5",`project video ${a}`,{index:t,video:h(e)})})})},N=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project videos">
      <p class="media-section__label">Video</p>
      <div class="media-videos">${e.map(a=>{const n=a.src.startsWith("public/")?a.src:`public/${a.src}`;return`
        <figure class="media-video glass-surface">
          <video
            controls
            muted
            playsinline
            preload="metadata"
            poster="${a.poster||""}"
          >
            <source src="${n}" type="video/mp4" />
            <source src="${a.src}" type="video/mp4" />
          </video>
          ${a.caption?`<figcaption class="media-video__caption">${a.caption}</figcaption>`:""}
        </figure>
      `}).join("")}</div>
    </section>
  `:"",P=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project images">
      <p class="media-section__label">Gallery</p>
      <div class="media-gallery">${e.map((a,n)=>`
        <button
          type="button"
          class="media-image__trigger"
          data-gallery-index="${n}"
          aria-label="View full size: ${a.alt||`Image ${n+1}`}"
        >
          <figure class="media-image glass-surface">
            <img src="${a.src}" alt="${a.alt??""}" loading="lazy" />
            ${a.caption?`<figcaption class="media-image__caption">${a.caption}</figcaption>`:""}
          </figure>
        </button>
      `).join("")}</div>
    </section>
  `:"",R=e=>e!=null&&e.length?`
    <section class="notes-section" aria-label="Project notes">
      <p class="notes-section__label">Field Notes</p>
      ${e.map(a=>`
        <article class="note-block">
          <h2 class="note-block__heading">${a.heading}</h2>
          <p class="note-block__body">${a.body}</p>
        </article>
      `).join("")}
    </section>
  `:"",E=e=>{e.innerHTML=`
    <p class="project-detail__error">
      Entry not found in the archive.
      <a href="projects.html" class="project-detail__back">Return to projects</a>
    </p>
  `,document.title="Not Found — Projects"},B=(e,t)=>{var i,c;document.title=`${t.title} — Projects`;const a=t.status==="WIP"?" project-detail__status--wip":"",n=t.tags.map(l=>`<li>${l}</li>`).join(""),g=t.externalUrl?`<a
        class="project-detail__external glass-surface"
        href="${t.externalUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View live project
        <span aria-hidden="true">↗</span>
      </a>`:"",r=t.media??{};d("H1,H2,H5","project detail render media",{slug:t.slug,pageUrl:window.location.href,baseUri:document.baseURI,videos:(i=r.videos)==null?void 0:i.map(l=>({src:l.src,resolvedSrc:new URL(l.src,document.baseURI).href,poster:l.poster,resolvedPoster:l.poster?new URL(l.poster,document.baseURI).href:""}))}),e.innerHTML=`
    <a href="projects.html" class="project-detail__back">
      <span aria-hidden="true">←</span> Field Log / Archive
    </a>

    <div class="project-detail__meta-row">
      <span class="project-detail__date">${t.date}</span>
      <span class="project-detail__status${a}">${t.status}</span>
      <span class="project-detail__category glass-surface">${t.category}</span>
    </div>

    <h1 class="project-detail__title">${t.title}</h1>
    <p class="project-detail__desc">${t.description}</p>

    <ul class="project-detail__tags">${n}</ul>

    ${g}

    ${N(r.videos)}
    ${P(r.images)}
    ${R(t.notes)}
  `,e.querySelectorAll("video").forEach((l,S)=>{U(l,S),M(l)}),(c=r.images)!=null&&c.length&&w(e,r.images)},C=()=>{const e=document.getElementById("project-detail"),t=A();if(!(e instanceof HTMLElement))return;const a=t?I(t):void 0,n=(a==null?void 0:a.theme)??m.defaultTheme;if($(m.themes,n,m.defaultTheme),!t){E(e);return}if(!a){E(e);return}B(e,a)};document.addEventListener("DOMContentLoaded",C);
