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

  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const readTime = (md) => Math.max(1, Math.round(md.trim().split(/\s+/).length / 220)) + " min read";

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
  function markdown(md) {
    const lines = md.trim().split("\n");
    let html = "", para = [], list = null;
    const flushPara = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>`; para = []; } };
    const flushList = () => { if (list) { html += `<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.type}>`; list = null; } };
    for (const raw of lines) {
      const line = raw.trim();
      let m;
      if (!line) { flushPara(); flushList(); continue; }
      if ((m = line.match(/^(#{2,3})\s+(.*)/))) { flushPara(); flushList(); html += `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`; continue; }
      if ((m = line.match(/^>\s?(.*)/))) { flushPara(); flushList(); html += `<blockquote><p>${inline(m[1])}</p></blockquote>`; continue; }
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
    flushPara(); flushList();
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
      <article class="post-card reveal" data-delay="${i % 3}">
        <a class="post-cover" href="post.html?p=${encodeURIComponent(p.slug)}" aria-hidden="true" tabindex="-1">
          <span class="badge ${p.category === "Everyday" ? "badge-ink" : ""}">${esc(p.category)}</span>
          ${coverHTML(p, i)}
        </a>
        <div class="post-meta"><span>${fmtDate(p.date)}</span><span class="dot"></span><span>${readTime(p.body)}</span></div>
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
        ["index.html#topics", "Topics", "topics"],
        ["blog.html", "Journal", "blog"],
        ["index.html#about", "About", "about"],
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
              <p>${esc(S.intro)}</p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="index.html#episodes">Episodes</a></li>
                <li><a href="index.html#topics">Topics</a></li>
                <li><a href="blog.html">Journal</a></li>
                <li><a href="index.html#about">About</a></li>
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
            <span>Want to be a guest? <a href="mailto:${esc(S.contactEmail)}" style="color:var(--saffron)">${esc(S.contactEmail)}</a></span>
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
    const timer = setTimeout(finish, 850);
    const skip = () => { clearTimeout(timer); finish(); };
    intro.addEventListener("click", skip);
    document.addEventListener("keydown", skip, { once: true });
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

    $("#topics-grid").innerHTML = S.topics.map((t, i) => `
      <div class="topic reveal" data-delay="${i % 3}">
        <span class="num">0${i + 1}.</span>
        <h3>${esc(t.name)}</h3>
        <p>${esc(t.note)}</p>
      </div>`).join("");

    $("#journal-grid").innerHTML = POSTS.slice(0, 3).map(postCard).join("");

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
        <div class="featured-post reveal">
          <a class="post-cover" href="post.html?p=${encodeURIComponent(first.slug)}" aria-hidden="true" tabindex="-1">
            <span class="badge ${first.category === "Everyday" ? "badge-ink" : ""}">${esc(first.category)}</span>${coverHTML(first, 0)}
          </a>
          <div>
            <div class="post-meta"><span>Latest</span><span class="dot"></span><span>${fmtDate(first.date)}</span><span class="dot"></span><span>${readTime(first.body)}</span></div>
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
          <h1>${esc(p.title)}</h1>
          <div class="post-meta"><span>${fmtDate(p.date)}</span><span class="dot"></span><span>${readTime(p.body)}</span><span class="dot"></span><span>By ${esc(S.channelName)}</span></div>
        </div>
      </section>
      ${media}
      <div class="container">
        <article class="prose">${markdown(p.body)}</article>
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

    $("#copy-link").addEventListener("click", async (e) => {
      try { await navigator.clipboard.writeText(location.href); e.currentTarget.style.background = "var(--saffron)"; } catch (_) {}
    });
  }

  /* ---------------- Boot ---------------- */
  renderChrome();
  setupModal();
  const page = document.body.dataset.page;
  if (page === "home") { renderHome(); splitLetters($(".hero-title")); }
  if (page === "blog") renderBlog();
  if (page === "post") renderPost();
  setupReveal();
  setupIntro();
})();
