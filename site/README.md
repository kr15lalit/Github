# Insightoholix — Website

A premium, fast, fully static website for the [Insightoholix](https://www.youtube.com/@insightoholix) YouTube podcast, with a built-in blog ("Journal").
No frameworks and no build step: plain HTML, CSS and JavaScript.

Colours come straight from the channel logo and banner: saffron `#F5B104`, cream `#F8EADF` and ink black.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home: hero, featured episode, episode grid, topics, latest journal posts, about, subscribe |
| `blog.html` | Journal: all posts, filterable by category |
| `post.html?p=<slug>` | A single blog post (with the episode embedded when there is one) |

## Updating content (no coding needed)

**Channel info, stats, episodes, topics, socials:** edit `assets/js/config.js`.
For an episode, copy the ID from its YouTube link (`youtube.com/watch?v=`**`THIS_PART`**). Thumbnails load automatically.

**Blog posts:** edit `assets/js/posts.js`. Copy an existing post block, paste it at the top of the list, and change the fields.
The `body` uses simple Markdown:

```
## A heading
Normal paragraph with **bold**, *italic* and a [link](https://example.com).

- bullet point
1. numbered point
> a pull quote
```

Set `video` to a YouTube ID to embed that episode at the top of the post and use its thumbnail as the cover.

**Before going live:** replace the placeholder social links and `hello@example.com` in `config.js`.

## Preview locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Publishing (free) with GitHub Pages

1. Merge this branch into `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes the `site/` folder on every push to `main` that changes it.
   Your site will be at `https://<your-username>.github.io/<repo-name>/`.
   A custom domain (e.g. `insightoholix.com`) can be added under the same Settings → Pages screen.

The `site/` folder can also be dragged onto Netlify or Vercel as-is.
