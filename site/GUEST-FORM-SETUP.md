# "Pitch your story" — Google Form setup

The **Pitch your story** button on the website opens a 3-step form in the Insightoholix
colours. When someone submits it, their answers are sent straight into a Google Form,
so every pitch lands in a **Google Sheet** (and, if you turn it on, your inbox).

Visitors never see the Google Form itself — but it's worth styling it anyway, because you can
also share its link directly (WhatsApp groups, LinkedIn DMs, etc.).

Total time: about 10 minutes.

---

## Step 1 — Create the form

Go to **forms.google.com → Blank form**.

**Title:** `Be our next guest 🎙️`

**Description:**
> Insightoholix is a podcast of deep conversations with people who have lived what they talk about —
> doctors, officers, founders, investors, believers and skeptics.
> Got a story our listeners should hear? Tell us in 3 quick steps (about 3 minutes).
> Every pitch is read by the hosts, Lalit and Vandana.

---

## Step 2 — Make it look like Insightoholix

Click the **palette icon (Customize theme)** at the top right:

| Setting | Value |
|---|---|
| **Header image** | Upload `site/assets/img/google-form-header.png` (made for this; 1600 × 400) |
| **Color** | Click **+** (custom) and enter **`#F5B104`** (the saffron from your logo) |
| **Background** | Pick the lightest tint Google offers (warm cream) |
| **Text style → Header** | A bold, condensed font such as *Oswald* if it's in the list; otherwise keep the default |
| **Text style → Question / Text** | Default (Roboto) or *Lato* |

---

## Step 3 — Add the questions

Use **Add section** (the `=` icon in the side toolbar) to split it into 3 pages — just like the website.

> ⚠️ **Type the multiple-choice options exactly as written** (same spelling, capitals and `&`).
> The website sends these exact words, and Google rejects answers that don't match an option.

### Section 1 — About you
*Section description:* `Who's going to be in the chair?`

| # | Question | Type | Required |
|---|---|---|---|
| 1 | Full name | Short answer | ✅ |
| 2 | Email | Short answer → ⋮ **Response validation** → Text → **Email** | ✅ |
| 3 | WhatsApp / phone | Short answer | — |
| 4 | City | Short answer | — |
| 5 | What do you do? | Short answer · *Description:* `e.g. Cardiologist, startup founder, retired IAS officer` | ✅ |
| 6 | LinkedIn, Instagram or website | Short answer → ⋮ **Response validation** → Text → **URL** | ✅ |

### Section 2 — Your story
*Section description:* `The conversation only you can have.`

| # | Question | Type | Required |
|---|---|---|---|
| 7 | Your world | **Multiple choice** with these options:<br>`Health & Medicine`<br>`Money & Investing`<br>`Government & Policy`<br>`Tech & AI`<br>`Business & Startups`<br>`Careers & Education`<br>`Spirituality & Wellbeing`<br>`Arts, Media & Culture`<br>`Something else` | ✅ |
| 8 | If your episode had a title, what would it be? | Short answer | ✅ |
| 9 | Tell us the story | **Paragraph** → ⋮ Response validation → Length → Maximum character count → `800` | ✅ |
| 10 | One thing most people get wrong about your field | Short answer | — |

### Section 3 — The details
*Section description:* `Almost done. Just the practical bits.`

| # | Question | Type | Required |
|---|---|---|---|
| 11 | Languages you're comfortable in | **Checkboxes**: `Hindi` · `English` · `Hinglish` | ✅ |
| 12 | How would you like to record? | **Multiple choice**: `In the studio` · `Remote video call` · `Either works` | ✅ |
| 13 | How did you find us? | **Multiple choice**: `YouTube` · `Instagram` · `LinkedIn` · `A friend` · `Somewhere else` | — |

> Don't mark any *other* question as required — the website only guarantees answers for the ✅ ones.

---

## Step 4 — Settings

**Settings tab:**
- Responses → **Collect email addresses: Do not collect** (question 2 already asks)
- Responses → **Limit to 1 response: OFF** ← important: if this is on, Google demands a sign-in and the website can't submit
- If you're on a Google Workspace account: **Restrict to users in your organisation: OFF**
- Presentation → **Show progress bar: ON**
- Presentation → **Confirmation message:**
  > Thank you! Every pitch is read by the hosts. If your story is a fit for an upcoming episode,
  > we'll reach out by email or WhatsApp. — Lalit & Vandana, Insightoholix

**Responses tab:**
- Click the green **Link to Sheets** icon → *Create a new spreadsheet*.
  Tip: add a column called **Status** (New / Shortlisted / Booked / Not now) to track guests.
- ⋮ → **Get email notifications for new responses** — so you hear about every pitch.

---

## Step 5 — Connect it to the website

1. Click the **⋮ menu (top right) → Get pre-filled link**.
2. Fill **every** question with something (any text; pick any option for the choice questions).
3. Click **Get link** → **Copy link**.
4. **Send that link to Claude** (or paste it below and follow the manual steps).

That one link contains everything the website needs: the form ID and an `entry.123456789`
code for each question.

<details>
<summary>Doing it yourself instead</summary>

The pre-filled link looks like:

```
https://docs.google.com/forms/d/e/1FAIpQLSc…XYZ/viewform?usp=pp_url&entry.111=Asha&entry.222=asha@x.com…
```

In `site/assets/js/config.js`, under `guestForm`:
- `googleFormId` = the long part between `/d/e/` and `/viewform`
- under `entries`, put each question's `entry.NNN` next to its field:
  `name` (Q1), `email` (Q2), `phone` (Q3), `city` (Q4), `role` (Q5), `link` (Q6),
  `industry` (Q7), `title` (Q8), `story` (Q9), `myth` (Q10),
  `language` (Q11), `mode` (Q12), `source` (Q13)

</details>

---

## Until it's connected

The website form already works: with no Google Form connected, pressing **Send my pitch**
opens the visitor's email app with all their answers neatly filled in, addressed to the
`contactEmail` in `config.js`. Connecting the Google Form just makes it one click and
collects everything in a Sheet.

**Handy link:** `yoursite.com/#pitch` opens the pitch form directly — good for your
Instagram bio or the YouTube channel description.
