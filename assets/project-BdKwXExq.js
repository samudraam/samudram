import"./loader-bCRQtbAi.js";import{p as g,i as x}from"./apply-theme-Ce-kM_Nc.js";let n=null,c=0,s=[],p=null,m=!1;const d=()=>(n instanceof HTMLElement||(n=document.createElement("div"),n.className="gallery-lightbox",n.id="gallery-lightbox",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-label","Image gallery"),n.setAttribute("aria-hidden","true"),n.hidden=!0,n.innerHTML=`
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
  `,document.body.appendChild(n),n.addEventListener("click",E)),n),_=()=>{const e=d(),t=s[c];if(!t)return;const a=e.querySelector(".gallery-lightbox__img"),l=e.querySelector(".gallery-lightbox__caption"),u=e.querySelector(".gallery-lightbox__counter"),i=e.querySelector('[data-action="prev"]'),o=e.querySelector('[data-action="next"]');if(!(a instanceof HTMLImageElement))return;a.src=t.src,a.alt=t.alt??"",l instanceof HTMLElement&&(l.textContent=t.caption??"",l.hidden=!t.caption),u instanceof HTMLElement&&(u.textContent=`${c+1} / ${s.length}`);const r=s.length>1;i instanceof HTMLButtonElement&&(i.hidden=!r),o instanceof HTMLButtonElement&&(o.hidden=!r)},L=e=>{if(!s.length)return;c=e,_();const t=d();t.hidden=!1,t.setAttribute("aria-hidden","false"),t.classList.add("is-open"),document.body.classList.add("gallery-lightbox-open");const a=t.querySelector(".gallery-lightbox__close");a instanceof HTMLElement&&a.focus()},y=()=>{const e=d();e.hidden=!0,e.setAttribute("aria-hidden","true"),e.classList.remove("is-open"),document.body.classList.remove("gallery-lightbox-open"),p instanceof HTMLElement&&(p.focus(),p=null)},f=e=>{s.length<=1||(c=(c+e+s.length)%s.length,_())},E=e=>{const t=e.target;if(!(t instanceof Element))return;const a=t.closest("[data-action]");if(!(a instanceof HTMLElement))return;const l=a.getAttribute("data-action");if(l==="close"){y();return}if(l==="prev"){f(-1);return}l==="next"&&f(1)},$=e=>{if(!d().hidden){if(e.key==="Escape"){e.preventDefault(),y();return}if(e.key==="ArrowLeft"){e.preventDefault(),f(-1);return}e.key==="ArrowRight"&&(e.preventDefault(),f(1))}},v=(e,t)=>{t!=null&&t.length&&(s=t,d(),m||(document.addEventListener("keydown",$),m=!0),e.querySelectorAll("[data-gallery-index]").forEach(a=>{a.addEventListener("click",()=>{const l=Number(a.getAttribute("data-gallery-index"));Number.isNaN(l)||(p=a instanceof HTMLElement?a:null,L(l))}),a.addEventListener("keydown",l=>{l instanceof KeyboardEvent&&(l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),a.dispatchEvent(new Event("click"))))})}))},h=e=>`/samudram/${e.replace(/^\/+/,"")}`,k=()=>new URLSearchParams(window.location.search).get("slug"),T=e=>g.projects.find(t=>t.slug===e);console.log("Hello World");const H=e=>{const t=()=>{console.log("Video clicked:",e.currentSrc,{paused:e.paused,currentTime:e.currentTime})};e.addEventListener("click",t)},j=e=>{if(e.poster||e.readyState>=HTMLMediaElement.HAVE_METADATA){e.classList.add("is-media-ready");return}e.addEventListener("loadedmetadata",()=>{e.classList.add("is-media-ready")},{once:!0})},M=e=>e!=null&&e.length?`
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
  `:"",A=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project images">
      <p class="media-section__label">Gallery</p>
      <div class="media-gallery">${e.map((a,l)=>`
        <button
          type="button"
          class="media-image__trigger"
          data-gallery-index="${l}"
          aria-label="View full size: ${a.alt||`Image ${l+1}`}"
        >
          <figure class="media-image glass-surface">
            <img src="${a.src}" alt="${a.alt??""}" loading="lazy" />
            ${a.caption?`<figcaption class="media-image__caption">${a.caption}</figcaption>`:""}
          </figure>
        </button>
      `).join("")}</div>
    </section>
  `:"",S=e=>e!=null&&e.length?`
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
  `,document.title="Not Found — Projects"},w=(e,t)=>{var o;document.title=`${t.title} — Projects`;const a=t.status==="WIP"?" project-detail__status--wip":"",l=t.tags.map(r=>`<li>${r}</li>`).join(""),u=t.externalUrl?`<a
        class="project-detail__external glass-surface"
        href="${t.externalUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View live project
        <span aria-hidden="true">↗</span>
      </a>`:"",i=t.media??{};e.innerHTML=`
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

    <ul class="project-detail__tags">${l}</ul>

    ${u}

    ${M(i.videos)}
    ${A(i.images)}
    ${S(t.notes)}
  `,e.querySelectorAll("video").forEach(r=>{j(r),H(r)}),(o=i.images)!=null&&o.length&&v(e,i.images)},P=()=>{const e=document.getElementById("project-detail"),t=k();if(!(e instanceof HTMLElement))return;const a=t?T(t):void 0,l=(a==null?void 0:a.theme)??g.defaultTheme;if(x(g.themes,l,g.defaultTheme),!t){b(e);return}if(!a){b(e);return}w(e,a)};document.addEventListener("DOMContentLoaded",P);
