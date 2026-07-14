import{i as x}from"./curtains-B_ICgrMr.js";import"./page-transitions-CQoERCvc.js";import{p as g,i as L}from"./apply-theme-Ce-kM_Nc.js";let l=null,c=0,i=[],p=null,m=!1;const d=()=>(l instanceof HTMLElement||(l=document.createElement("div"),l.className="gallery-lightbox",l.id="gallery-lightbox",l.setAttribute("role","dialog"),l.setAttribute("aria-modal","true"),l.setAttribute("aria-label","Image gallery"),l.setAttribute("aria-hidden","true"),l.hidden=!0,l.innerHTML=`
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
  `,document.body.appendChild(l),l.addEventListener("click",v)),l),_=()=>{const e=d(),t=i[c];if(!t)return;const a=e.querySelector(".gallery-lightbox__img"),n=e.querySelector(".gallery-lightbox__caption"),u=e.querySelector(".gallery-lightbox__counter"),s=e.querySelector('[data-action="prev"]'),r=e.querySelector('[data-action="next"]');if(!(a instanceof HTMLImageElement))return;a.src=t.src,a.alt=t.alt??"",n instanceof HTMLElement&&(n.textContent=t.caption??"",n.hidden=!t.caption),u instanceof HTMLElement&&(u.textContent=`${c+1} / ${i.length}`);const o=i.length>1;s instanceof HTMLButtonElement&&(s.hidden=!o),r instanceof HTMLButtonElement&&(r.hidden=!o)},$=e=>{if(!i.length)return;c=e,_();const t=d();t.hidden=!1,t.setAttribute("aria-hidden","false"),t.classList.add("is-open"),document.body.classList.add("gallery-lightbox-open");const a=t.querySelector(".gallery-lightbox__close");a instanceof HTMLElement&&a.focus()},y=()=>{const e=d();e.hidden=!0,e.setAttribute("aria-hidden","true"),e.classList.remove("is-open"),document.body.classList.remove("gallery-lightbox-open"),p instanceof HTMLElement&&(p.focus(),p=null)},f=e=>{i.length<=1||(c=(c+e+i.length)%i.length,_())},v=e=>{const t=e.target;if(!(t instanceof Element))return;const a=t.closest("[data-action]");if(!(a instanceof HTMLElement))return;const n=a.getAttribute("data-action");if(n==="close"){y();return}if(n==="prev"){f(-1);return}n==="next"&&f(1)},E=e=>{if(!d().hidden){if(e.key==="Escape"){e.preventDefault(),y();return}if(e.key==="ArrowLeft"){e.preventDefault(),f(-1);return}e.key==="ArrowRight"&&(e.preventDefault(),f(1))}},k=(e,t)=>{t!=null&&t.length&&(i=t,d(),m||(document.addEventListener("keydown",E),m=!0),e.querySelectorAll("[data-gallery-index]").forEach(a=>{a.addEventListener("click",()=>{const n=Number(a.getAttribute("data-gallery-index"));Number.isNaN(n)||(p=a instanceof HTMLElement?a:null,$(n))}),a.addEventListener("keydown",n=>{n instanceof KeyboardEvent&&(n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),a.dispatchEvent(new Event("click"))))})}))},h=e=>`/samudram/${e.replace(/^\/+/,"")}`,j=()=>new URLSearchParams(window.location.search).get("slug"),T=e=>g.projects.find(t=>t.slug===e),H=e=>{const t=()=>{console.log("Video clicked:",e.currentSrc,{paused:e.paused,currentTime:e.currentTime})};e.addEventListener("click",t)},M=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project videos">
      <p class="media-section__label">Video</p>
      <div class="media-videos">${e.map(a=>`
        <figure class="media-video glass-surface">
          <video
            controls
            muted
            playsinline
            preload="metadata"
            ${a.poster?`poster="${h(a.poster)}"`:""}
          >
            <source src="${h(a.src)}" type="video/mp4" />
          </video>
          ${a.caption?`<figcaption class="media-video__caption">${a.caption}</figcaption>`:""}
        </figure>
      `).join("")}</div>
    </section>
  `:"",S=e=>e!=null&&e.length?`
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
  `:"",w=e=>e!=null&&e.length?`
    <section class="notes-section" aria-label="Project notes">
      <p class="notes-section__label">Field Notes</p>
      ${e.map(a=>`
        <article class="note-block">
          <h2 class="note-block__heading">${a.heading}</h2>
          <p class="note-block__body">${a.body}</p>
        </article>
      `).join("")}
    </section>
  `:"",b=e=>{e.innerHTML=`
    <p class="project-detail__error">
      Entry not found in the archive.
      <a href="projects.html" class="project-detail__back">Return to projects</a>
    </p>
  `,document.title="Not Found — Projects"},A=(e,t)=>{var r;document.title=`${t.title} — Projects`;const a=t.status==="WIP"?" project-detail__status--wip":"",n=t.tags.map(o=>`<li>${o}</li>`).join(""),u=t.externalUrl?`<a
        class="project-detail__external glass-surface"
        href="${t.externalUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View live project
        <span aria-hidden="true">↗</span>
      </a>`:"",s=t.media??{};e.innerHTML=`
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

    ${u}

    ${M(s.videos)}
    ${S(s.images)}
    ${w(t.notes)}
  `,e.querySelectorAll("video").forEach(o=>{x(o),H(o)}),(r=s.images)!=null&&r.length&&k(e,s.images)},P=()=>{const e=document.getElementById("project-detail"),t=j();if(!(e instanceof HTMLElement))return;const a=t?T(t):void 0,n=(a==null?void 0:a.theme)??g.defaultTheme;if(L(g.themes,n,g.defaultTheme),!t){b(e);return}if(!a){b(e);return}A(e,a)};document.addEventListener("DOMContentLoaded",P);
