/* ==========================================================================
   Insightoholix — shared site logic
   You normally don't need to edit this file: content lives in config.js and posts.js
   ========================================================================== */
(function () {
  const S = window.SITE;
  const POSTS = (window.POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const $ = (sel, root = document) => root.querySelector(sel);

  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11.1-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.7 3Zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  };

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));


  const readTime = (md, lang) => {
    const mins = Math.max(1, Math.round(md.trim().split(/\s+/).length / 220));
    return lang === "hi" ? `${mins} मिनट में पढ़ें` : `${mins} min read`;
  };
  const fmtDateFor = (iso, lang) =>
    new Date(iso + "T00:00:00").toLocaleDateString(lang === "hi" ? "hi-IN" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  // maxres isn't generated for every upload — fall back to hq
  window.__thumbFallback = (img) => {
    if (!img.dataset.fb) { img.dataset.fb = 1; img.src = img.src.replace("maxresdefault", "hqdefault"); }
  };
  const thumbImg = (id, alt) =>
    `<img src="${thumbUrl(id)}" alt="${esc(alt)}" loading="lazy" onerror="__thumbFallback(this)">`;

  /* ---------------- Minimal Markdown ---------------- */
  function inline(s) {
    return esc(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) =>
        `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  // Markdown subset. Extras for long-form articles:
  //   :::summary Title / :::context Title / :::takeaways Title / :::note Title  … :::   → styled boxes
  //   > quote lines followed by "> — Name"                                           → pull quote with credit
  function markdown(md, nested = false) {
    const lines = md.trim().split("\n");
    let html = "", para = [], list = null, quote = null, block = null, h2 = 0;
    const flushPara = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>`; para = []; } };
    const flushList = () => { if (list) { html += `<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.type}>`; list = null; } };
    const flushQuote = () => {
      if (!quote) return;
      const cite = quote.length > 1 && /^[—–]\s*/.test(quote[quote.length - 1]) ? quote.pop().replace(/^[—–]\s*/, "") : "";
      html += `<blockquote><p>${inline(quote.join(" "))}</p>${cite ? `<cite>${inline(cite)}</cite>` : ""}</blockquote>`;
      quote = null;
    };
    const flushAll = () => { flushPara(); flushList(); flushQuote(); };
    for (const raw of lines) {
      const line = raw.trim();
      let m;
      if (block) {
        if (line === ":::") {
          html += `<aside class="callout callout-${block.type}">${block.title ? `<span class="callout-label">${inline(block.title)}</span>` : ""}${markdown(block.lines.join("\n"), true)}</aside>`;
          block = null;
        } else block.lines.push(raw);
        continue;
      }
      if ((m = line.match(/^:::(\w+)\s*(.*)$/))) { flushAll(); block = { type: m[1], title: m[2], lines: [] }; continue; }
      if (!line) { flushAll(); continue; }
      if (line === "[[watch]]") { flushAll(); html += "<!--watch-->"; continue; }
      if ((m = line.match(/^(#{2,3})\s+(.*)/))) {
        flushAll();
        const id = m[1].length === 2 && !nested ? ` id="section-${++h2}"` : "";
        html += `<h${m[1].length}${id}>${inline(m[2])}</h${m[1].length}>`;
        continue;
      }
      if ((m = line.match(/^>\s?(.*)/))) { flushPara(); flushList(); (quote = quote || []).push(m[1]); continue; }
      flushQuote();
      if ((m = line.match(/^[-*]\s+(.*)/)) || (m = line.match(/^\d+\.\s+(.*)/))) {
        flushPara();
        const type = /^\d/.test(line) ? "ol" : "ul";
        if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
        list.items.push(m[1]);
        continue;
      }
      flushList();
      para.push(line);
    }
    flushAll();
    return html;
  }

  /* ---------------- Covers ---------------- */
  function coverHTML(post, i = 0) {
    if (post.cover) return `<img src="${esc(post.cover)}" alt="" loading="lazy">`;
    if (post.video) return thumbImg(post.video, post.title);
    const variants = ["", "alt", "alt2"];
    const word = post.coverText || post.title.split(/[:—?]/)[0].trim().split(/\s+/).slice(0, 4).join(" ");
    return `<div class="gen-cover ${variants[i % 3]}"><span class="hand">${esc(post.category)}</span><span class="display">${esc(word)}</span></div>`;
  }

  function postCard(p, i) {
    return `
      <article class="post-card reveal" data-delay="${i % 3}" lang="${p.lang || "en"}">
        <a class="post-cover" href="post.html?p=${encodeURIComponent(p.slug)}" aria-hidden="true" tabindex="-1">
          <span class="badge ${p.category === "Everyday" ? "badge-ink" : ""}">${esc(p.category)}</span>
          ${coverHTML(p, i)}
        </a>
        <div class="post-meta"><span>${fmtDateFor(p.date, p.lang)}</span><span class="dot"></span><span>${readTime(p.body, p.lang)}</span></div>
        <h3><a href="post.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a></h3>
        <p>${esc(p.excerpt)}</p>
      </article>`;
  }

  /* ---------------- Chrome: nav + footer ---------------- */
  function renderChrome() {
    const page = document.body.dataset.page;
    const nav = $("#nav");
    if (nav) {
      const links = [
        ["index.html#episodes", "Episodes", "episodes"],
        ["index.html#guests", "Guests", "guests"],
        ["blog.html", "Journal", "blog"],
        ["index.html#about", "Hosts", "about"],
      ];
      nav.innerHTML = `
        <div class="container nav-inner">
          <a class="brand" href="index.html" aria-label="${esc(S.channelName)} home">
            <img src="${esc(S.logo)}" alt="" width="42" height="42"><span>${esc(S.channelName)}</span>
          </a>
          <ul class="nav-links" id="nav-links">
            ${links.map(([h, t, k]) => `<li><a href="${h}"${(page === "blog" || page === "post") && k === "blog" ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}
            <li class="nav-mobile-only"><a href="${esc(S.subscribeUrl)}" target="_blank" rel="noopener">Subscribe on YouTube ↗</a></li>
          </ul>
          <div style="display:flex;gap:8px;align-items:center">
            <a class="btn btn-saffron btn-sm nav-cta" href="${esc(S.subscribeUrl)}" target="_blank" rel="noopener">${ICON.yt} Subscribe</a>
            <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${ICON.menu}</button>
          </div>
        </div>`;
      const toggle = $(".nav-toggle", nav);
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open);
        toggle.innerHTML = open ? ICON.close : ICON.menu;
      });
      nav.querySelectorAll(".nav-links a").forEach((a) =>
        a.addEventListener("click", () => { nav.classList.remove("open"); toggle.innerHTML = ICON.menu; }));
      if (window.matchMedia("(min-width: 861px)").matches) {
        const m = $(".nav-mobile-only", nav); if (m) m.remove();
      }
    }

    const footer = $("#footer");
    if (footer) {
      footer.innerHTML = `
        <div class="container">
          <div class="footer-top">
            <div>
              <a class="brand" href="index.html"><img src="${esc(S.logo)}" alt=""><span>${esc(S.channelName)}</span></a>
              <p class="hand" style="font-size:26px;color:var(--saffron);margin:18px 0 8px">${esc(S.tagline)}</p>
              <a class="btn btn-saffron btn-sm" href="${esc(S.subscribeUrl)}" target="_blank" rel="noopener">${ICON.yt} Subscribe on YouTube</a>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="index.html#episodes">Episodes</a></li>
                <li><a href="index.html#guests">Guests</a></li>
                <li><a href="blog.html">Journal</a></li>
                <li><a href="index.html#about">Hosts</a></li>
              </ul>
            </div>
            <div>
              <h4>Follow</h4>
              <ul>${S.socials.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a></li>`).join("")}</ul>
            </div>
          </div>
          <div class="footer-big" aria-hidden="true">${esc(S.channelName)}</div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${esc(S.channelName)}. All rights reserved.</span>
            <span>Want to be a guest? <a href="#pitch" data-pitch style="color:var(--saffron)">Pitch your story →</a></span>
          </div>
        </div>`;
    }
  }

  /* ---------------- Video modal ---------------- */
  function setupModal() {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Video player");
    modal.innerHTML = `<button class="modal-close" aria-label="Close video">${ICON.close}</button><div class="modal-inner"></div>`;
    document.body.appendChild(modal);
    const inner = $(".modal-inner", modal);
    let lastFocus = null;
    const close = () => {
      modal.classList.remove("open");
      setTimeout(() => (inner.innerHTML = ""), 300);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    window.openVideo = (id) => {
      lastFocus = document.activeElement;
      inner.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".modal-close", modal).focus();
    };
    modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".modal-close")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-video]");
      if (t) { e.preventDefault(); window.openVideo(t.dataset.video); }
    });
    document.addEventListener("keydown", (e) => {
      const t = e.target.closest && e.target.closest("[data-video]");
      if (t && (e.key === "Enter" || e.key === " ") && t.tagName !== "BUTTON" && t.tagName !== "A") { e.preventDefault(); window.openVideo(t.dataset.video); }
    });
  }

  /* ---------------- Reveal ---------------- */
  function setupReveal() {
    // hero elements wait for heroGo() so they build in after the intro
    const els = [...document.querySelectorAll(".reveal:not(.in)")].filter((el) => !el.closest(".hero"));
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Intro + hero entrance ---------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function splitLetters(el) {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((c) => {
            const s = document.createElement("span");
            s.className = "ch"; s.textContent = c; s.style.setProperty("--i", i++); s.setAttribute("aria-hidden", "true");
            frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  }

  function countUp(el) {
    const m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
    if (!m || reduceMotion) return;
    const target = parseFloat(m[1]), decimals = (m[1].split(".")[1] || "").length, suffix = m[2];
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = (0).toFixed(decimals) + suffix;
    requestAnimationFrame(tick);
  }

  let heroStarted = false;
  function heroGo() {
    if (heroStarted) return;
    heroStarted = true;
    document.documentElement.classList.add("hero-go");
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("in"));
    setTimeout(() => document.querySelectorAll(".hero .stat strong").forEach(countUp), 450);
  }

  function setupIntro() {
    const root = document.documentElement;
    const intro = $("#intro");
    try { sessionStorage.setItem("ix-intro", "1"); } catch (_) {}
    if (!intro || !root.classList.contains("has-intro")) {
      if (intro) intro.remove();
      root.classList.remove("has-intro");
      heroGo();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      intro.classList.add("leave");
      setTimeout(heroGo, 150);
      setTimeout(() => { intro.remove(); root.classList.remove("has-intro"); }, 650);
    };
    const timer = setTimeout(finish, 2700); // + 0.6s curtain lift ≈ 3.3s total
    const skip = () => { clearTimeout(timer); finish(); };
    intro.addEventListener("click", skip);
    document.addEventListener("keydown", skip, { once: true });
  }

  /* ---------------- Journal carousels (home) ---------------- */
  const CAROUSEL_LABELS = { "Episode Notes": "From the episodes", Everyday: "Everyday life" };
  const SLIDE_MS = 6000;

  function renderCarousels(root) {
    if (!root) return;
    const cats = [...new Set(POSTS.map((p) => p.category))];
    root.innerHTML = cats.map((cat, ci) => {
      const posts = POSTS.filter((p) => p.category === cat);
      const href = (p) => `post.html?p=${encodeURIComponent(p.slug)}`;
      return `
        <div class="carousel reveal ${ci % 2 ? "media-right" : ""}" role="region" aria-roledescription="carousel" aria-label="${esc(cat)} stories" data-offset="${ci % 2 ? SLIDE_MS / 2 : 0}">
          <div class="car-media">
            ${posts.map((p, i) => `<a href="${href(p)}" tabindex="-1" aria-hidden="true" class="${i ? "" : "active"}">
              <span class="badge ${cat === "Everyday" ? "badge-ink" : ""}">${esc(cat)}</span>${coverHTML(p, ci + 1)}</a>`).join("")}
          </div>
          <div class="car-body">
            <div class="car-top">
              <span class="hand">${esc(CAROUSEL_LABELS[cat] || cat)}</span>
              <span class="car-count" aria-hidden="true"><b>01</b> / ${String(posts.length).padStart(2, "0")}</span>
            </div>
            <div class="car-slides" aria-live="polite">
              ${posts.map((p, i) => `
                <article class="car-slide ${i ? "" : "active"}" lang="${p.lang || "en"}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${posts.length}"${i ? " aria-hidden=\"true\"" : ""}>
                  <div class="post-meta"><span>${fmtDateFor(p.date, p.lang)}</span><span class="dot"></span><span>${readTime(p.body, p.lang)}</span></div>
                  <h3><a href="${href(p)}"${i ? ' tabindex="-1"' : ""}>${esc(p.title)}</a></h3>
                  <p>${esc(p.excerpt)}</p>
                  <a class="link-arrow" href="${href(p)}"${i ? ' tabindex="-1"' : ""}>Read the story <span>→</span></a>
                </article>`).join("")}
            </div>
            ${posts.length > 1 ? `
            <div class="car-nav">
              <button class="car-btn prev" type="button" aria-label="Previous story">${ICON.arrow}</button>
              <div class="car-dots">${posts.map((p, i) => `<button class="car-dot" type="button" aria-label="Show story ${i + 1}"${i ? "" : ' aria-current="true"'}></button>`).join("")}</div>
              <button class="car-btn next" type="button" aria-label="Next story">${ICON.arrow}</button>
            </div>
            <div class="car-progress" aria-hidden="true"><i></i></div>` : ""}
          </div>
        </div>`;
    }).join("");
    root.querySelectorAll(".carousel").forEach(setupCarousel);
  }

  function setupCarousel(el) {
    const media = [...el.querySelectorAll(".car-media > a")];
    const slides = [...el.querySelectorAll(".car-slide")];
    const dots = [...el.querySelectorAll(".car-dot")];
    const bar = el.querySelector(".car-progress i");
    const count = el.querySelector(".car-count b");
    const n = slides.length;
    if (n < 2) return;
    let index = 0, timer = null, remaining = SLIDE_MS + Number(el.dataset.offset || 0), startedAt = 0;
    let hovered = false, inView = false;

    const go = (to, dir) => {
      const next = (to + n) % n;
      if (next === index) return;
      dir = dir || (next > index ? 1 : -1);
      [slides, media].forEach((list) => list[index].classList.remove("active"));
      slides[index].setAttribute("aria-hidden", "true");
      slides[index].querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
      slides[next].style.setProperty("--from", `${dir * 28}px`);
      slides[index].style.setProperty("--from", `${-dir * 28}px`);
      index = next;
      slides[index].classList.add("active"); media[index].classList.add("active");
      slides[index].removeAttribute("aria-hidden");
      slides[index].querySelectorAll("a").forEach((a) => a.removeAttribute("tabindex"));
      dots.forEach((d, i) => (i === index ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current")));
      if (count) count.textContent = String(index + 1).padStart(2, "0");
      remaining = SLIDE_MS;
      schedule();
    };

    const restartBar = (ms) => {
      if (!bar) return;
      bar.classList.remove("run"); void bar.offsetWidth;
      bar.style.setProperty("--dur", `${ms}ms`);
      bar.classList.add("run");
    };
    const running = () => !reduceMotion && !hovered && inView && !document.hidden;
    function schedule() {
      clearTimeout(timer);
      el.classList.toggle("paused", !running());
      if (!running()) return;
      startedAt = performance.now();
      restartBar(remaining);
      timer = setTimeout(() => go(index + 1, 1), remaining);
    }
    const pause = () => {
      if (timer) { clearTimeout(timer); timer = null; remaining = Math.max(400, remaining - (performance.now() - startedAt)); }
      el.classList.add("paused");
    };

    el.querySelector(".prev").addEventListener("click", () => go(index - 1, -1));
    el.querySelector(".next").addEventListener("click", () => go(index + 1, 1));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1, 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1, -1); }
    });

    // pause while the reader is hovering, focused inside or touching
    el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovered = true; pause(); } });
    el.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") { hovered = false; schedule(); } });
    el.addEventListener("focusin", () => { hovered = true; pause(); });
    el.addEventListener("focusout", (e) => { if (!el.contains(e.relatedTarget)) { hovered = false; schedule(); } });

    // swipe
    let x0 = null, y0 = 0;
    el.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") { x0 = e.clientX; y0 = e.clientY; pause(); } });
    el.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      else schedule();
    });
    el.addEventListener("pointercancel", () => { x0 = null; schedule(); });

    // only auto-advance while visible on screen and the tab is active
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { inView = en.isIntersecting; inView ? schedule() : pause(); }, { threshold: 0.35 }).observe(el);
    } else { inView = true; schedule(); }
    document.addEventListener("visibilitychange", () => (document.hidden ? pause() : schedule()));
  }

  /* ---------------- Home ---------------- */
  function renderHome() {
    const f = S.featuredVideo;
    $("#hero-intro").textContent = S.intro;
    $("#hero-stats").innerHTML = S.stats.map((s) => `<div class="stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join("");
    document.querySelectorAll("[data-subscribe]").forEach((a) => (a.href = S.subscribeUrl));
    document.querySelectorAll("[data-youtube]").forEach((a) => (a.href = S.youtubeUrl));

    $("#feature").innerHTML = `
      <div class="feature-sticker" aria-hidden="true">
        <svg viewBox="0 0 100 100"><defs><path id="c" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs>
          <text font-family="Inter, sans-serif" font-size="8.6" font-weight="700" letter-spacing="1.2" fill="#141210"><textPath href="#c" textLength="236">LATEST EPISODE • NOW STREAMING • </textPath></text></svg>
        <img src="${esc(S.logo)}" alt="">
      </div>
      <div class="feature-frame">
        <div class="thumb" data-video="${esc(f.id)}" role="button" tabindex="0" aria-label="Play: ${esc(f.title)}">
          ${thumbImg(f.id, f.title)}
          <span class="play">${ICON.play}</span>
          <span class="duration">${esc(f.duration)}</span>
        </div>
        <div class="feature-meta">
          <span class="badge">Featured episode</span>
          <h2>${esc(f.title)}</h2>
          <p>${esc(f.guest || "")}</p>
        </div>
      </div>`;

    const topicsLoop = S.topics.map((t) => `<span>${esc(t.name)}</span>`).join("");
    $("#marquee").innerHTML = topicsLoop + topicsLoop;

    $("#episodes-grid").innerHTML = S.videos.map((v, i) => `
      <article class="ep-card reveal" data-delay="${i % 3}" data-video="${esc(v.id)}" role="button" tabindex="0" aria-label="Play: ${esc(v.title)}">
        <div class="thumb">${thumbImg(v.id, v.title)}<span class="play">${ICON.play}</span><span class="duration">${esc(v.duration)}</span></div>
        <div class="ep-body">
          <div class="ep-row"><span class="badge badge-line">${esc(v.tag)}</span><span class="ep-num">№ ${String(i + 1).padStart(2, "0")}</span></div>
          <h3>${esc(v.title)}</h3>
        </div>
      </article>`).join("");

    const gGrid = $("#guest-grid");
    // lets the invite card stretch to fill an otherwise half-empty last row
    gGrid.dataset.rem3 = ((S.guests || []).length + 1) % 3;
    gGrid.dataset.rem2 = ((S.guests || []).length + 1) % 2;
    gGrid.innerHTML = (S.guests || []).map((g, i) => `
      <article class="guest-card reveal" data-delay="${i % 3}">
        <div class="guest-photo">${g.photo ? `<img src="${esc(g.photo)}" alt="${esc(g.name)}" loading="lazy">` : thumbImg(g.episode, g.name)}</div>
        <div class="guest-body">
          <span class="guest-role">${esc(g.role)}</span>
          <h3>${esc(g.name)}</h3>
          <p class="guest-topic">“${esc(g.topic)}”</p>
          <button class="guest-watch" type="button" data-video="${esc(g.episode)}">${ICON.play} Watch the episode</button>
        </div>
      </article>`).join("") + `
      <article class="guest-card invite reveal" data-delay="${(S.guests || []).length % 3}">
        <span class="hand">Your story here?</span>
        <h3>Be our next guest</h3>
        <p>Built something, survived something or know something the rest of us should hear? We'd love to talk.</p>
        <a class="btn btn-primary" href="#pitch" data-pitch>Pitch your story →</a>
      </article>`;

    const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    $("#host-list").innerHTML = (S.hosts || []).map((h, i) => `
      <article class="host reveal" data-delay="${i + 1}">
        <div class="host-avatar">${h.photo ? `<img src="${esc(h.photo)}" alt="${esc(h.name)}">` : `<span aria-hidden="true">${esc(initials(h.name))}</span>`}</div>
        <div class="host-text">
          <span class="host-role">${esc(h.role)}</span>
          <h3>${esc(h.name)}</h3>
          <span class="host-work">${esc(h.work)}</span>
          <p>${esc(h.bio)}</p>
          ${(h.links || []).filter((l) => l.url).length ? `<div class="host-links">${h.links.filter((l) => l.url).map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.name)} ↗</a>`).join("")}</div>` : ""}
        </div>
      </article>`).join("");

    renderCarousels($("#journal-carousels"));

    $("#about-heading").textContent = S.about.heading;
    $("#about-body").innerHTML = S.about.body.map((p) => `<p>${esc(p)}</p>`).join("");
  }

  /* ---------------- Journal ---------------- */
  function renderBlog() {
    const cats = ["All", ...new Set(POSTS.map((p) => p.category))];
    const params = new URLSearchParams(location.search);
    let active = cats.includes(params.get("c")) ? params.get("c") : "All";

    const filters = $("#filters");
    const draw = () => {
      filters.innerHTML = cats.map((c) => {
        const n = c === "All" ? POSTS.length : POSTS.filter((p) => p.category === c).length;
        return `<button class="chip" aria-pressed="${c === active}" data-cat="${esc(c)}">${esc(c)}<span class="count">${n}</span></button>`;
      }).join("");
      const list = active === "All" ? POSTS : POSTS.filter((p) => p.category === active);
      const [first, ...rest] = list;
      $("#featured-post").innerHTML = first ? `
        <div class="featured-post reveal" lang="${first.lang || "en"}">
          <a class="post-cover" href="post.html?p=${encodeURIComponent(first.slug)}" aria-hidden="true" tabindex="-1">
            <span class="badge ${first.category === "Everyday" ? "badge-ink" : ""}">${esc(first.category)}</span>${coverHTML(first, 0)}
          </a>
          <div>
            <div class="post-meta"><span>Latest</span><span class="dot"></span><span>${fmtDateFor(first.date, first.lang)}</span><span class="dot"></span><span>${readTime(first.body, first.lang)}</span></div>
            <h2>${esc(first.title)}</h2>
            <p>${esc(first.excerpt)}</p>
            <a class="btn btn-primary" href="post.html?p=${encodeURIComponent(first.slug)}">Read the story ${ICON.arrow}</a>
          </div>
        </div>` : `<p class="empty">No posts yet — check back soon.</p>`;
      $("#posts-grid").innerHTML = rest.map((p, i) => postCard(p, i + 1)).join("");
      setupReveal();
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      active = b.dataset.cat;
      const url = new URL(location.href);
      active === "All" ? url.searchParams.delete("c") : url.searchParams.set("c", active);
      history.replaceState(null, "", url);
      draw();
    });
    draw();
  }

  /* ---------------- Single post ---------------- */
  function renderPost() {
    const slug = new URLSearchParams(location.search).get("p");
    const idx = POSTS.findIndex((p) => p.slug === slug);
    const root = $("#post");
    if (idx === -1) {
      root.innerHTML = `<section class="post-hero"><div class="container"><span class="eyebrow">404</span><h1>That story doesn't exist (yet).</h1><a class="btn btn-primary" href="blog.html">Back to the journal ${ICON.arrow}</a></div></section>`;
      return;
    }
    const p = POSTS[idx];
    document.title = `${p.title} — ${S.channelName}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", p.excerpt);

    const ytWatch = (id) => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    const ep = [S.featuredVideo, ...(S.videos || [])].find((v) => v && v.id === p.video);
    const watchCard = (variant) => p.video ? `
      <aside class="watch-card ${variant}">
        <a class="watch-thumb" href="${ytWatch(p.video)}" target="_blank" rel="noopener" aria-label="Watch the episode on YouTube">
          ${thumbImg(p.video, p.title)}<span class="play">${ICON.play}</span>${ep && ep.duration ? `<span class="duration">${esc(ep.duration)}</span>` : ""}
        </a>
        <div class="watch-body">
          <span class="watch-label">${variant === "end" ? "Now watch the full conversation" : "Hear it in their own words"}</span>
          <p class="watch-title">${esc(ep ? ep.title : p.title)}</p>
          <div class="watch-actions">
            <a class="btn btn-saffron btn-sm" href="${ytWatch(p.video)}" target="_blank" rel="noopener">${ICON.yt} Watch on YouTube</a>
            <a class="btn btn-sm watch-sub" href="${esc(S.subscribeUrl)}" target="_blank" rel="noopener">Subscribe</a>
          </div>
        </div>
      </aside>` : "";

    const media = p.video
      ? `<div class="post-media"><iframe src="https://www.youtube-nocookie.com/embed/${esc(p.video)}?rel=0" title="${esc(p.title)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`
      : p.cover
        ? `<div class="post-media thumb"><img src="${esc(p.cover)}" alt=""></div>`
        : `<div class="post-media">${coverHTML(p, idx)}</div>`;

    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent(p.title);
    const related = POSTS.filter((x) => x.slug !== p.slug)
      .sort((a, b) => (b.category === p.category) - (a.category === p.category))
      .slice(0, 3);

    root.innerHTML = `
      <section class="post-hero">
        <div class="container">
          <a class="back" href="blog.html">${ICON.back} All stories</a><br>
          <span class="badge ${p.category === "Everyday" ? "badge-ink" : ""}">${esc(p.category)}</span>
          <h1 lang="${p.lang || "en"}">${esc(p.title)}</h1>
          <div class="post-meta"><span>${fmtDateFor(p.date, p.lang)}</span><span class="dot"></span><span>${readTime(p.body, p.lang)}</span><span class="dot"></span><span>${p.lang === "hi" ? "" : "By "}${esc(S.channelName)}</span></div>
        </div>
      </section>
      ${media}
      <div class="container">
        <div class="article-wrap">
          <nav class="toc" lang="${p.lang || "en"}" aria-label="${p.lang === "hi" ? "इस लेख में" : "In this article"}" hidden></nav>
          <article class="prose" lang="${p.lang || "en"}">${markdown(p.body).replace("<!--watch-->", watchCard("mid"))}${watchCard("end")}</article>
        </div>
        <div class="post-footer">
          <a class="btn btn-saffron" href="${esc(S.subscribeUrl)}" target="_blank" rel="noopener">${ICON.yt} Subscribe for new episodes</a>
          <div class="share">Share
            <a href="https://wa.me/?text=${text}%20${url}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">${ICON.wa}</a>
            <a href="https://twitter.com/intent/tweet?text=${text}&url=${url}" target="_blank" rel="noopener" aria-label="Share on X">${ICON.x}</a>
            <button type="button" id="copy-link" aria-label="Copy link">${ICON.link}</button>
          </div>
        </div>
        <section class="related">
          <div class="section-head"><h2 class="display section-title">Keep reading</h2><a class="link-arrow" href="blog.html">All stories <span>→</span></a></div>
          <div class="post-grid">${related.map(postCard).join("")}</div>
        </section>
      </div>`;

    // table of contents (desktop) + reading progress
    const heads = [...root.querySelectorAll(".prose > h2[id]")];
    const toc = $(".toc", root);
    if (heads.length >= 3) {
      toc.innerHTML = `<span class="toc-label">${p.lang === "hi" ? "इस लेख में" : "In this article"}</span><ol>${heads.map((h) => `<li><a href="#${h.id}">${h.textContent.replace(/^\d+\.\s*/, "")}</a></li>`).join("")}</ol>`;
      toc.hidden = false;
      const links = [...toc.querySelectorAll("a")];
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
          });
        }, { rootMargin: "-20% 0px -70% 0px" });
        heads.forEach((h) => io.observe(h));
      }
    }
    const bar = document.createElement("div");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    const article = $(".prose", root);
    const onScroll = () => {
      const r = article.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, -r.top / Math.max(1, total)))})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    $("#copy-link").addEventListener("click", async (e) => {
      try { await navigator.clipboard.writeText(location.href); e.currentTarget.style.background = "var(--saffron)"; } catch (_) {}
    });
  }

  /* ---------------- Guest pitch form ---------------- */
  function setupPitch() {
    const F = S.guestForm || {};
    const chips = (name, options, type = "radio", required = false) => `
      <div class="pf-chips" role="${type === "radio" ? "radiogroup" : "group"}">
        ${options.map((o, i) => `<label class="pf-chip"><input type="${type}" name="${name}" value="${esc(o)}"${required && i === 0 ? " required" : ""}><span>${esc(o)}</span></label>`).join("")}
      </div>`;
    const steps = [
      { title: "About you", hint: "Who's going to be in the chair?" },
      { title: "Your story", hint: "The conversation only you can have." },
      { title: "The details", hint: "Almost done. Just the practical bits." },
    ];

    const wrap = document.createElement("div");
    wrap.className = "pitch";
    wrap.hidden = true;
    wrap.innerHTML = `
      <div class="pitch-backdrop" data-close></div>
      <div class="pitch-panel" role="dialog" aria-modal="true" aria-labelledby="pitch-title">
        <aside class="pitch-side">
          <img src="${esc(S.logo)}" alt="" width="64" height="64">
          <p class="hand">Your story here?</p>
          <h2 class="display" id="pitch-title">Be our next guest</h2>
          <ol class="pitch-steps">${steps.map((s, i) => `<li data-step="${i}"><b>0${i + 1}</b><span>${s.title}</span></li>`).join("")}</ol>
          <p class="pitch-note">Every pitch is read by the hosts.</p>
        </aside>
        <div class="pitch-main">
          <button class="pitch-close" type="button" aria-label="Close" data-close>${ICON.close}</button>
          <div class="pitch-progress" aria-hidden="true"><i></i></div>
          <form class="pitch-form" novalidate>
            <fieldset class="pf-step" data-step="0">
              <legend><span class="pf-count">Step 1 of 3</span>${steps[0].title}<small>${steps[0].hint}</small></legend>
              <div class="pf-row">
                <label class="pf-field"><span>Full name *</span><input id="pf-name" name="name" autocomplete="name" required></label>
                <label class="pf-field"><span>Email *</span><input id="pf-email" name="email" type="email" autocomplete="email" required></label>
              </div>
              <div class="pf-row">
                <label class="pf-field"><span>WhatsApp / phone</span><input id="pf-phone" name="phone" type="tel" autocomplete="tel" placeholder="+91"></label>
                <label class="pf-field"><span>City</span><input id="pf-city" name="city" autocomplete="address-level2"></label>
              </div>
              <label class="pf-field"><span>What do you do? *</span><input id="pf-role" name="role" required placeholder="e.g. Cardiologist, startup founder, retired IAS officer"></label>
              <label class="pf-field"><span>LinkedIn, Instagram or website *</span><input id="pf-link" name="link" type="url" required placeholder="https://"></label>
            </fieldset>

            <fieldset class="pf-step" data-step="1" hidden>
              <legend><span class="pf-count">Step 2 of 3</span>${steps[1].title}<small>${steps[1].hint}</small></legend>
              <div class="pf-field"><span>Your world *</span>${chips("industry", F.industries || [], "radio", true)}</div>
              <label class="pf-field"><span>If your episode had a title, what would it be? *</span><input id="pf-title" name="title" required maxlength="100" placeholder="e.g. I quit a ₹40 LPA job to farm, here's what happened"></label>
              <label class="pf-field"><span>Tell us the story *</span><textarea id="pf-story" name="story" rows="5" maxlength="800" required placeholder="What happened, what you learned, and why our listeners should hear it."></textarea><em class="pf-counter" aria-live="polite">0 / 800</em></label>
              <label class="pf-field"><span>One thing most people get wrong about your field</span><input id="pf-myth" name="myth" maxlength="160"></label>
            </fieldset>

            <fieldset class="pf-step" data-step="2" hidden>
              <legend><span class="pf-count">Step 3 of 3</span>${steps[2].title}<small>${steps[2].hint}</small></legend>
              <div class="pf-field"><span>Languages you're comfortable in *</span>${chips("language", F.languages || [], "checkbox")}</div>
              <div class="pf-field"><span>How would you like to record? *</span>${chips("mode", F.modes || [], "radio", true)}</div>
              <div class="pf-field"><span>How did you find us?</span>${chips("source", F.sources || [])}</div>
              <label class="pf-consent"><input id="pf-consent" type="checkbox" name="consent" required><span>I'm happy for the Insightoholix team to contact me about this pitch.</span></label>
            </fieldset>

            <div class="pf-done" hidden>
              <span class="hand">Pitch received</span>
              <h3 class="display">Thank you<span class="pf-first"></span>!</h3>
              <p>Every pitch is read by the hosts. If your story is a fit for an upcoming episode, we'll reach out by email or WhatsApp.</p>
              <button class="btn btn-primary" type="button" data-close>Back to the site</button>
            </div>

            <p class="pf-error" role="alert" hidden></p>
            <div class="pf-nav">
              <button class="btn btn-ghost btn-sm" type="button" data-back hidden>← Back</button>
              <button class="btn btn-primary" type="submit" data-next>Continue →</button>
            </div>
          </form>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const form = $(".pitch-form", wrap);
    const stepEls = [...wrap.querySelectorAll(".pf-step")];
    const sideSteps = [...wrap.querySelectorAll(".pitch-steps li")];
    const next = $("[data-next]", wrap), back = $("[data-back]", wrap), err = $(".pf-error", wrap);
    const bar = $(".pitch-progress i", wrap);
    let step = 0, lastFocus = null;

    const show = (i) => {
      step = i;
      stepEls.forEach((el, k) => (el.hidden = k !== i));
      sideSteps.forEach((li, k) => { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
      back.hidden = i === 0;
      next.textContent = i === stepEls.length - 1 ? "Send my pitch →" : "Continue →";
      bar.style.transform = `scaleX(${(i + 1) / stepEls.length})`;
      err.hidden = true;
      const first = stepEls[i].querySelector("input, textarea");
      if (first) first.focus({ preventScroll: true });
    };
    const open = () => {
      lastFocus = document.activeElement;
      wrap.hidden = false;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => wrap.classList.add("open"));
      show(step);
    };
    const close = () => {
      wrap.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => (wrap.hidden = true), 300);
      if (location.hash === "#pitch") history.replaceState(null, "", location.pathname + location.search);
      if (lastFocus) lastFocus.focus();
    };

    const validStep = (i) => {
      const el = stepEls[i];
      for (const input of el.querySelectorAll("input[required], textarea[required]")) {
        if (input.type === "radio") {
          if (!el.querySelector(`input[name="${input.name}"]:checked`)) return `Please pick an option for "${input.closest(".pf-field").querySelector("span").textContent.replace(" *", "")}".`;
        } else if (input.type === "checkbox") {
          if (!input.checked) return "Please tick the box so we can contact you.";
        } else if (!input.value.trim()) {
          input.focus(); return `Please fill in "${input.closest("label").querySelector("span").textContent.replace(" *", "")}".`;
        } else if (!input.checkValidity()) {
          input.focus(); return input.type === "email" ? "That email address doesn't look right." : input.type === "url" ? "Please paste a full link, starting with https://" : "Please check this field.";
        }
      }
      if (i === 2 && !el.querySelector('input[name="language"]:checked')) return "Please pick at least one language.";
      return "";
    };

    const values = () => {
      const fd = new FormData(form);
      const v = {};
      for (const [k, val] of fd.entries()) v[k] = v[k] ? [].concat(v[k], val) : val;
      return v;
    };

    const send = async (v) => {
      const E = F.entries || {};
      if (F.googleFormId && E.name) {
        const body = new URLSearchParams();
        Object.entries(E).forEach(([key, entry]) => {
          if (!entry || v[key] == null) return;
          [].concat(v[key]).forEach((val) => body.append(entry, val));
        });
        // Google Forms doesn't send CORS headers, so the response can't be read; a network error still throws.
        await fetch(`https://docs.google.com/forms/d/e/${encodeURIComponent(F.googleFormId)}/formResponse`, { method: "POST", mode: "no-cors", body });
        return;
      }
      const lines = [
        ["Name", v.name], ["Email", v.email], ["Phone", v.phone], ["City", v.city], ["What I do", v.role], ["Link", v.link],
        ["Field", v.industry], ["Episode title", v.title], ["Story", v.story], ["What people get wrong", v.myth],
        ["Languages", [].concat(v.language || []).join(", ")], ["Recording", v.mode], ["Found you via", v.source],
      ].filter(([, x]) => x).map(([k, x]) => `${k}: ${x}`);
      location.href = `mailto:${S.contactEmail}?subject=${encodeURIComponent("Guest pitch: " + (v.title || v.name))}&body=${encodeURIComponent(lines.join("\n\n"))}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const problem = validStep(step);
      if (problem) { err.textContent = problem; err.hidden = false; return; }
      if (step < stepEls.length - 1) { show(step + 1); return; }
      next.disabled = true; next.textContent = "Sending…";
      try {
        const v = values();
        await send(v);
        stepEls.forEach((el) => (el.hidden = true));
        $(".pf-nav", wrap).hidden = true;
        err.hidden = true;
        $(".pf-first", wrap).textContent = v.name ? ", " + String(v.name).trim().split(/\s+/)[0] : "";
        $(".pf-done", wrap).hidden = false;
        sideSteps.forEach((li) => { li.classList.remove("on"); li.classList.add("done"); });
        bar.style.transform = "scaleX(1)";
      } catch (_) {
        err.textContent = `Your pitch couldn't be sent. Check your connection and try again, or email us at ${S.contactEmail}.`;
        err.hidden = false;
      } finally {
        next.disabled = false; if (step === stepEls.length - 1) next.textContent = "Send my pitch →";
      }
    });
    back.addEventListener("click", () => show(Math.max(0, step - 1)));
    form.addEventListener("input", () => (err.hidden = true));
    form.addEventListener("change", () => (err.hidden = true));
    const story = $("#pf-story", wrap), counter = $(".pf-counter", wrap);
    story.addEventListener("input", () => (counter.textContent = `${story.value.length} / 800`));

    wrap.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !wrap.hidden) close(); });
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-pitch]");
      if (t) { e.preventDefault(); open(); }
    });
    if (location.hash === "#pitch") open();
  }

  /* ---------------- Boot ---------------- */
  renderChrome();
  setupModal();
  setupPitch();
  const page = document.body.dataset.page;
  if (page === "home") { renderHome(); splitLetters($(".hero-title")); }
  if (page === "blog") renderBlog();
  if (page === "post") renderPost();
  setupReveal();
  setupIntro();

  // Open pages at their top. Browsers can restore an old scroll position, and when the site is shown
  // inside another page (an iframe preview) the outer page keeps its own scroll. scrollIntoView also
  // scrolls those outer containers, which window.scrollTo cannot.
  if (!location.hash) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const toTop = () => { window.scrollTo(0, 0); document.body.scrollIntoView({ block: "start" }); };
    toTop();
    requestAnimationFrame(toTop);
    window.addEventListener("load", toTop, { once: true });
  }
})();
