/* ==========================================================================
   JOURNAL / BLOG POSTS — add a new object to the TOP of this list to publish.

   Fields:
     slug      unique, URL-friendly id (used in post.html?p=slug)
     lang      optional: "hi" for a Hindi article (Hindi fonts, dates and labels)
     title     post title
     date      "YYYY-MM-DD"
     category  "Episode Notes" | "Everyday" (or any label you like)
     excerpt   one or two sentences for the cards
     cover     optional image URL; leave "" to use the episode thumbnail
               (if `video` is set) or a designed cover
     video     optional YouTube ID to embed at the top of the post
     [[watch]] on its own line in the body places a "Watch on YouTube" card there
               (one is always added at the end of posts that have a video)
     coverText optional short headline for the designed cover (when no image/video)
     body      the post in simple Markdown:
               ## Heading, **bold**, *italic*, [link](url), - list, 1. list,
               > quote (add a last line "> — Name" to credit the speaker),
               ![alt](image-url), blank line between paragraphs
               Boxes for long articles:  :::summary Title  /  :::context Title  /
               :::takeaways Title  /  :::note Title  /  :::help Title   …text…   :::
   ========================================================================== */

window.POSTS = [
  {
    slug: "womens-health-series",
    title: "Women's Health, Honestly: A Gynaecologist on Periods, PCOS, Fertility and Motherhood",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Irregular periods, PCOS, C-sections and postpartum depression: half the population still learns about their own bodies through guesswork. Dr. Poonam Gupta's two-part conversation on women's health, brought together in one guide.",
    cover: "",
    video: "LAlagU6xhUE",
    parts: [
      { id: "LAlagU6xhUE", label: "Part 1 · Periods, PCOS, fertility and IVF", title: "Women's Health Secrets Doctors Rarely Tell You | Part 1" },
      { id: "XcICUW9XrS4", label: "Part 2 · Pregnancy, postpartum and menopause", title: "Women's Health Secrets Doctors Rarely Tell You | Part 2" },
    ],
    body: `
A teenager who thinks her irregular periods mean something is wrong with her. A couple quietly trying for a baby for two years, too embarrassed to ask anyone. A new mother who can't stop crying while everyone tells her she should be happy.

These stories are not rare. **Women's health is still surrounded by taboos, myths and half-knowledge**, and the cost is real: symptoms ignored, questions never asked, help sought too late.

So host Vandana sat down with **Dr. Poonam Gupta, an obstetrician and gynaecologist**, for a two-part conversation covering every stage of a woman's life. This article brings both parts together.

:::summary In this two-part series
- **Part 1:** what a normal period looks like, PCOS, and when to seek help for conceiving
- **Part 2:** normal delivery vs C-section, and postpartum depression
:::

[[part Part 1 · Periods, PCOS, fertility and IVF]]

## 1. What a "normal" period really looks like

The most common worry is that a cycle should be exactly 28 days. It doesn't have to be.

> "A normal cycle varies from woman to woman, anywhere between 21 and 35 days. If it comes every 21 days regularly, that's normal for her. If it comes every 35 days, that's normal for her."
> — Dr. Poonam Gupta

What matters is a change from *your* normal, or cycles that are regularly **shorter than 21 or longer than 35 days**. The usual causes are **PCOS, thyroid problems, high prolactin, sudden weight gain or loss, and stress**.

:::help See a doctor if your period...
- Is so painful or heavy that it **disrupts your daily routine**
- **Lasts more than seven days**, or needs a **pad change every one to two hours**
- Makes you **wake at night** to change pads, or leaves you **anaemic** and tired
:::

## 2. PCOS: from a textbook footnote to a "new-age pandemic"

When Dr. Poonam was a student, PCOD was a tiny column in her textbook. "Now it's a huge topic," she said.

**PCOD and PCOS are the same condition at different points on a spectrum.** Many small follicles form in the ovary, but none matures properly, so ovulation and periods become irregular. When weight gain and **insulin resistance** join in, it's called PCOS, with a higher risk of **diabetes and high blood pressure** later in life.

Medicines can regularise periods, but they don't fix the root cause. The cornerstone of treatment is lifestyle: **fibre-rich food**, **moderate exercise five days a week for 30 to 45 minutes**, yoga, good sleep and less stress.

:::context The bigger picture
The World Health Organization estimates that PCOS affects around **1 in 10 women of reproductive age** worldwide, and that **up to 70% of them are undiagnosed**.
:::

## 3. Trying for a baby: when to seek help

:::help When to see a doctor about conceiving
- **Under 35:** after **12 months** of trying without success
- **35 or older:** after **6 months**
- **Straight away** if you have irregular periods, PCOS, a thyroid problem or another known issue
:::

Seeing a doctor doesn't mean jumping to IVF. The first step is **testing both partners**, including a **semen analysis**, because fertility is a couple's issue. Often the fix is simple, and IVF is the **last step**, not the first. Even then, it isn't a guarantee: in the best hands, success is around **40 to 60%** per attempt.

[[watch:LAlagU6xhUE]]

[[part Part 2 · Pregnancy, delivery, postpartum and menopause]]

## 4. Normal delivery or C-section? The honest answer

Vandana asked the question many families whisper: the WHO suggests caesarean rates above about **15%** bring no extra benefit, yet in many private hospitals in India they've crossed **40%**. Why?

Part of the rise is real: women are becoming mothers later, with more **diabetes, high blood pressure** and growth problems in the baby. But Dr. Poonam was clear that **normal delivery is preferred in most cases**: faster recovery, fewer complications, and better bonding and breastfeeding.

On whether doctors push C-sections for profit, she answered directly:

> "This is not right. From the very start of pregnancy, I counsel my patients on how to stay active so they can deliver normally. And I explain, to the husband and family too, when a C-section may become necessary despite everything being normal."
> — Dr. Poonam Gupta

She also had a firm message for anyone who judges a mother for having one: the idea that she "couldn't bear the pain" is unfair and wrong.

:::context The bigger picture
According to NFHS-5, about **1 in 5 births in India** is a caesarean, but the gap is striking: around **14% in public hospitals versus about 47% in private ones**.
:::

## 5. The new mother is new too

A new mother feeding every two hours, barely sleeping and getting no time for herself can struggle badly. Dr. Poonam described a range, from mild **baby blues** to **postpartum depression**, sometimes with thoughts of self-harm, and rarely **postpartum psychosis**, which needs urgent treatment.

> "We need to understand that the mother is also new. She's struggling with motherhood and baby care too."
> — Dr. Poonam Gupta

:::help If a new mother is struggling
- Talk openly with family and the doctor. **It is not weakness, and not her fault.**
- Seek help immediately if there are thoughts of harming herself or the baby.
- In India, call the free government mental health helpline **Tele-MANAS on 14416**, any time.
:::

And one message for every family: it's the **father**, not the mother, who determines the baby's sex.

> "The mother has just gone through labour, delivery and breastfeeding. This is the time to give her love and care, not blame."
> — Dr. Poonam Gupta

What does it cost to freeze your eggs, and what's the best age to do it? Dr. Poonam answers that in Part 1.

:::thanks A heartfelt thank you
Dr. Poonam Gupta gave us two long conversations and decades of experience, explaining some of the most sensitive topics in medicine with warmth and clarity. She didn't dodge the hard questions, from C-section rates to the blame mothers face for having a girl. Thank you, Doctor.
:::

:::takeaways Key takeaways
1. A normal cycle is 21 to 35 days. See a doctor if yours falls outside that or changes suddenly.
2. PCOS is managed mainly through diet, exercise, sleep and stress control.
3. Under 35, seek help after a year of trying; over 35, after six months. Test both partners.
4. Normal delivery is preferred, but a necessary C-section is nothing to be judged for.
5. Postpartum depression is real and treatable (Tele-MANAS: 14416).
6. It's the father's chromosome that decides a baby's sex. Never blame the mother.
:::

:::note
This article summarises the views our guest shared on the show and is for awareness only. It is not a substitute for professional medical advice. Please consult a qualified doctor about your own health. Quotes are translated and lightly condensed from the original conversations.
:::
`,
  },
  {
    slug: "what-is-satsang",
    title: "What Is Satsang, Really? 38 Years on the Radha Soami Path",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Spiritual escape or waste of time? A follower of 38 years on what satsang actually means, balancing family with spiritual life, and why contentment beats the endless chase for more.",
    cover: "",
    video: "Wlg7mH0H8mo",
    body: `
Look around any office, metro coach or family WhatsApp group today and you'll see the same thing: people who have more information, more options and more comforts than any generation before them, and less peace. We earn more and still feel it isn't enough.

This isn't just a feeling. In an Ipsos survey, **one in two urban Indians (53%)** said they had experienced stress severe enough to affect their daily life in the past year.

So people go looking, and many, often quietly, end up at a **satsang**. To outsiders, it's a bit of a mystery. Some call it a spiritual escape. Some call it a waste of time.

To understand what actually happens there, host Lalit Sharma sat down with a guest who has been attending satsang for **38 years**, since 1986. He follows the **Radha Soami Satsang Beas** path, worked for decades in a demanding job, and is now retired. He spoke with complete sincerity, and at times with so much emotion that he had to pause.

:::summary In this conversation
- What "satsang" actually means
- How he found it, and why he never walked away
- Family first, then satsang: the balance
- Contentment, the real measure
:::

[[watch]]

## 1. What "satsang" actually means

**Sat** means truth, and **sang** means company. Satsang is "the company of truth". And in our guest's understanding, only one thing is truly permanent:

> "Everything you can see with these eyes will perish one day. The only truth is the Supreme. It was there before creation, it is here now, and it will be there when everything else is gone."
> — Our guest

The gathering itself is simple. A speaker reads a hymn or verse from one of the saints, explains what it means, and relates it to everyday life. People listen, often in silence.

:::context The bigger picture
Radha Soami Satsang Beas traces its roots to 1891, when its main centre was established on the banks of the Beas river in Punjab. Today it holds meetings in more than 90 countries. It describes itself as open to people of every caste, colour and creed, and places strong emphasis on meditation and *seva*, or selfless service.
:::

## 2. How he found satsang, and why he never left

His journey began with doubt, not devotion. His elder brother had started going first, and what our guest heard second-hand put him off completely: that satsang taught people that parents, brothers and sisters meant nothing. He was firmly against that idea.

And yet, one day, he walked his brother to the railway station just to tell him, in a two-minute conversation on the way, "This time, I'll come to satsang too." In nearly four decades since, he says, he never once felt like quitting.

> "When you get benefit from something, when you feel peace inside, your attachment to it grows on its own."
> — Our guest

In 1995, he also began **seva**, volunteering at gatherings that can draw lakhs of people:

> "No seva is small and no seva is big. The main purpose of seva is to end your own ego."
> — Our guest

## 3. Family first, then satsang

One of the biggest misconceptions about spiritual paths is that they ask you to give up the world. Our guest was emphatic that satsang says the opposite.

> "Satsang never says leave your home, stop earning, go to the jungle and become a sadhu. You can live with your family and still progress beautifully on the spiritual path."
> — Our guest

If a family member needs a doctor at the same time as satsang, you go to the doctor. "Satsang is for your whole life. If you miss one, you miss one." And a job comes before it too: "Leaving your family hungry to go to satsang would be foolish."

His own career tested this. As a clerk, getting leave was easy. After promotion, postings in audit work and a transfer to faraway Gujarat meant he often couldn't attend. His answer was simple acceptance: apply for leave, request it, and if it isn't granted, don't go. "That is the balance."

Today, he says, more than 70% of his relatives follow the path, and **nobody was ever pressured**.

## 4. Contentment: the real measure

Lalit closed by asking how our guest defines fulfilment. His answer is useful whatever your beliefs:

> "Desire is never satisfied. The man with a thousand thinks two thousand is big. The man with a lakh looks at the crorepati, and the crorepati looks at the billionaire. Fulfil one wish, and the next one starts."
> — Our guest

Psychologists call this the "hedonic treadmill". Our guest's answer to it is contentment.

> "I know what my ability is, and how much I could have achieved without satsang. What I have received is far more than that."
> — Our guest

And the story of a poor widow who wanted to reach satsang but had nothing to sell except her cow-dung cakes? It's one he could barely finish without tears.

:::thanks A heartfelt thank you
It isn't easy to speak about faith on camera. Our guest did so with complete honesty, without trying to convince anyone, and with emotion he didn't try to hide. Thank you for sharing 38 years of your journey with us, and for reminding us that peace is something you practise, not something you buy.
:::

:::takeaways Key takeaways
1. Satsang means "the company of truth": listening, reflecting and meditating together.
2. Seva, or selfless service, is meant to dissolve the ego, and no seva is big or small.
3. Spiritual life doesn't mean leaving the world: family comes first, honest work next.
4. Real fulfilment comes from contentment, not from the next thing on the list.
:::

:::note
This article summarises the personal beliefs and experiences our guest shared on the show, and does not promote any organisation or ask anyone to change their faith. We respect every path. If you are going through a difficult time, please also reach out to people you trust or a qualified professional. Quotes are translated and lightly condensed from the original Hindi conversation.
:::
`,
  },
  {
    slug: "sweden-dream-vs-reality",
    title: "Sweden: Dream Destination or Harsh Reality? An Indian Family's Honest Account",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Free children's healthcare, 4pm finishes and a system you can trust, but also 30% tax, doing everything yourself and rules that keep tightening. Dakshesh Sharma on Indian family life in Sweden.",
    cover: "",
    video: "dYmflUeeVqM",
    body: `
Every year, lakhs of Indians make the same quiet calculation. The salary has stopped growing as fast as the rent. The commute eats three hours a day. The boss sends messages at 11pm. And somewhere in the back of the mind, a question keeps returning: **would life be better abroad?**

Then comes the confusion. Instagram shows people cycling home at 4pm. WhatsApp forwards say Europe is falling apart. Almost nobody gives you a straight answer from someone who has actually done it, with a family.

So we asked someone we trust completely. Host Lalit Sharma sat down with **Dakshesh Sharma**, his childhood friend, an electronics and communications engineer who spent about 12 years in telecom and IT companies in India before moving to **Sweden in 2019** with his family.

:::summary In this conversation
- Healthcare, and what 30% tax actually buys you
- Work-life balance: why he chose Sweden over Canada
- Why some Indians are leaving, and the new rules every applicant should know
:::

[[watch]]

## 1. Healthcare, and what 30% tax actually buys you

Indians often hear one thing about Sweden: the taxes are brutal. Dakshesh pays around **30 to 33%** of his income in tax. The question is what you get back.

**Children's healthcare is free.** When a friend's young daughter broke her arm, she was treated at Karolinska, one of Europe's best-known hospitals, with cartoons playing, a clown visiting the ward and an artist painting with the children.

> "The child was in pain, but the hospital made it feel like a playground. And the bill was zero."
> — Dakshesh Sharma

For adults, visits cost a **small fixed fee**, and Sweden's **high-cost protection** caps what you pay in a year (around 1,450 kronor for visits and about 2,950 kronor for prescription medicines in 2026). Nobody goes bankrupt because someone fell ill.

The taxes also pay for **free education** through to a master's degree, with **free school lunches**, subsidised **preschool**, **unemployment support**, and no road tolls. And a detail Dakshesh found moving: legal residents can **vote in municipal elections** after three years, even without citizenship.

> "You pay a lot, but you can see where it goes. Your child's school, your hospital, your road. That changes how you feel about tax."
> — Dakshesh Sharma

## 2. Work-life balance: why he chose Sweden over Canada

Before Sweden, Dakshesh had an offer from Canada. He chose Sweden for one reason: **time**.

A typical office day runs roughly from **8am to 4pm**. Managers trust people to do their work, and most employees get **around 25 to 30 days** of paid leave a year.

> "Nobody watches over your shoulder. You are trusted to do your work, and then you go home to your family."
> — Dakshesh Sharma

That time showed up in his health. With shorter workdays and long summer evenings, he started training regularly and went from **89 kg to 72 kg**.

Culture takes adjusting to. Swedish society runs on **high trust**: people follow rules, keep promises and assume the best of each other. Dakshesh says he has personally never faced racism. But Swedes are quiet and private, and Indians, he laughs, are loud. Phone calls on the train and dropping by unannounced are things you quickly learn to tone down.

:::context The bigger picture
Sweden regularly ranks among the top ten countries in the World Happiness Report, and OECD data consistently shows Swedish employees working far fewer long hours than the global average. Statutory annual leave is 25 days, and many employers offer more.
:::

## 3. Why some Indians are leaving, and the new rules you must know

In 2024, headlines in India talked about an "exodus" of Indians from Sweden. According to Statistics Sweden, the number of Indians leaving rose from about **1,600 in 2022 to about 4,500 in 2024**, while new arrivals fell.

Dakshesh sees a few reasons: **salaries in India have caught up** since around 2021; some feel a **glass ceiling** without fluent Swedish; and **you do everything yourself**, since a nanny can cost around **15,000 to 16,000 kronor a month**.

The rules have tightened too:

- **Higher salary thresholds for work permits.** Since **June 2026**, new applicants generally need at least **90% of the median salary, about 33,000 kronor a month**.
- **A longer road to citizenship.** The general residence requirement rose from **five years to eight**, with language and civics tests being phased in.
- **Swedish is becoming a job requirement**, even in many IT job adverts.

His practical advice: **start learning Swedish early**, through the free **SFI (Swedish for Immigrants)** classes.

> "It depends on what you want from life. If you want time with your family and a system you can trust, Sweden gives you that. If you want to grow fast and live comfortably with help at home, India may be the better choice today."
> — Dakshesh Sharma

And why does he call finding a home the hardest part of moving to Sweden? He explains it in the conversation.

:::thanks A heartfelt thank you
Most people who move abroad share only the good parts. Dakshesh shared everything, without any agenda, simply so that Indian families making this big decision can make it with open eyes. Thank you, Dakshesh, for your honesty and for giving so freely of your time.
:::

:::takeaways Key takeaways
1. Taxes of around 30% buy free children's healthcare, capped annual medical costs and free education.
2. Work-life balance is the biggest draw: shorter days, little micromanagement and around five weeks of leave.
3. Indian salaries catching up and doing everything yourself are real reasons some families return.
4. A work permit now generally needs about 90% of the median salary, and citizenship needs eight years.
5. Start learning Swedish early.
:::

:::note
This article summarises the personal experience and views our guest shared on the show and is for awareness only. It is not immigration or legal advice. Swedish rules, salary thresholds and fees change regularly, so always check the Swedish Migration Agency (Migrationsverket) and official sources before making any decision. Quotes are translated and lightly condensed from the original Hindi conversation.
:::
`,
  },
  {
    slug: "screens-sleep-and-mental-health",
    title: "Why Are We So Anxious? A Neurosurgeon on Screens, Sleep and the Mental Health We Ignore",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Endless reels, worry that won't switch off and children glued to phones. Neurosurgeon Dr. Arun Tungaria on what our screens are doing to our brains, and what actually helps.",
    cover: "",
    video: "Db8uUA9dlYA",
    body: `
You go to bed tired but lie awake, scrolling. Your mind keeps running through things that haven't happened yet. Your child won't eat unless a video is playing. And when someone asks how you are, you say "fine", because saying anything else feels like admitting something is wrong with you.

If any of that sounds familiar, you're far from alone. India's National Mental Health Survey found that roughly one in ten adults lives with a mental health condition, and that for common problems like anxiety and depression, more than 80% never get any treatment.

In this episode, host Lalit Sharma sat down with **Dr. Arun Tungaria**, a senior neurosurgeon with over 15 years of experience and more than 5,000 surgeries behind him. He runs Shri Krishna Neurospine Hospital in Bikaner and spends his spare time explaining brain and spine health in plain language through his channel, *Neuromate Talks*. He has seen these modern problems turn up in his own clinic, in patients who are getting younger every year.

:::summary In this conversation
- The dopamine "bomb blast": how our phones feed anxiety
- When worry won't switch off: the link between anxiety and depression
- Children and screens: when does normal use become addiction?
:::

[[watch]]

## 1. The dopamine "bomb blast": how our phones feed anxiety

Every notification, every like and every new reel gives your brain a small hit of dopamine, the chemical behind the feeling of instant reward. Dr. Tungaria compares it with the "slow dopamine" we used to get from cleaning the house, working in the fields, reading a book or spending time in nature.

> "What's happening now is a kind of bomb blast of dopamine, with constant notifications, short content and reels one after another. It is disturbing the brain's balance. Our anxiety is increasing, mental stress is increasing, and procrastination has gone up enormously, because people get so much gratification from the phone that they don't want to do any real work."
> — Dr. Arun Tungaria

In his clinic, the effects show up as stress, anxiety, low mood, headaches, spine problems and, especially in students, an inability to focus.

He's realistic: nobody can give up their phone entirely today. His practical "dopamine detox":

- Delete the apps you overuse, or set timers on them.
- Decide in advance how much time social media gets, and give the rest of your time to real work, physical activity and people.

He's equally worried about what he calls **social health**. "The parks in front of our houses are beautiful, but you don't see children in them anymore." He reminds us that the WHO defines health as physical, mental *and* social well-being.

## 2. When worry won't switch off: anxiety and depression

Stress, he explains, is a broad term, and a small amount of it helps us grow. Anxiety is one part of it, and it becomes a problem when worry is constant and starts to affect your body and your daily life.

**Early signs of anxiety:**

- Restlessness and an inability to be at peace
- Constant worry about real or imagined situations
- Fast breathing, a racing heart, a dry throat and a sense of panic

> "They say 90% of the things we worry about never actually happen. Anxiety is an exaggeration of that."
> — Dr. Arun Tungaria

Lalit raised research showing that around half of people with chronic anxiety also experience depression. Dr. Tungaria explained the vicious circle. Constant fear chips away at your self-confidence and self-esteem. You start to feel worthless, and that low feeling in turn creates more anxiety.

**Signs of depression:**

- Feeling low and sad most of the time
- Losing joy in things you used to enjoy
- Sleeping or eating much more, or much less, than usual
- In major depression, suicidal thoughts

**His three tools for anxiety** (which also help with depression):

1. **Journaling.** Write down exactly what you fear, and the pros and cons of each outcome, including the options if it doesn't work out.
2. **Mindfulness.** Stay in the present moment. "If I sit here worrying about tomorrow's brain tumour surgery, I'll ruin this conversation, and I won't be able to do tomorrow's work any better."
3. **Meditation.** It helps regulate your mental and emotional health.

**If suicidal thoughts appear:** tell someone you trust right away, whether family or a friend, and get professional help. "Mental health is the most neglected part of health in our society. There's so much taboo that people get labelled *paagal* (mad) far too quickly."

:::help If you are struggling right now
You don't have to go through it alone. Call **Tele-MANAS on 14416** (or 1-800-891-4416). It is the Government of India's free, confidential mental health helpline, open 24×7 in many Indian languages. If you or someone near you is in immediate danger, call **112**.
:::

## 3. Children and screens: when does normal use become addiction?

Lalit described a scene many of us know: young parents playing videos on a phone just to get a toddler to sit still and eat. Dr. Tungaria didn't soften his answer.

A child's brain is still building its pathways, which is called neuroplasticity. Fill those years with fast, loud, colourful short content, and the results show up early: **poor focus**, weak social skills and early spectacles. "Give them a storybook, and they'd rather watch the film made from it."

His own view is strict: ideally no screens before the age of 10, and after that only limited, supervised use with parental controls and app timers switched on.

**Warning signs that use is becoming addiction:**

- Grades falling below the child's usual level
- Less time with friends and outdoor play, and less talking with parents
- Sleep problems or late nights with the phone
- Constantly demanding the phone the moment homework is done

**What parents can do:** notice your own habits first (if you're both on your phones at dinner, your child is learning from you), be firm when needed, consider a basic keypad phone for staying in touch, and most of all, give your time. "If we don't make ourselves available to our children, they'll seek that time and attention elsewhere, and today the easiest place is the phone."

:::context The bigger picture
Dr. Tungaria's age-10 view is stricter than the formal guidance, but the direction is the same. The Indian Academy of Pediatrics recommends no screen exposure at all for children under 2, at most one hour a day of supervised screen time between ages 2 and 5, and less than two hours a day between 5 and 10. It also says screens must never replace outdoor play, sleep, family time or study.
:::

In the episode, Dr. Tungaria also explains why studying for 16 hours on five hours of sleep backfires, and the simple bedtime switch our phones have quietly broken.

:::takeaways Key takeaways
1. Phones deliver constant "fast dopamine". Set limits, and make room for slow, real-world rewards.
2. Anxiety and depression feed each other. Watch for the early signs in yourself and others.
3. Journaling, mindfulness and meditation help, and professional help is not a weakness.
4. Children need your time more than they need a screen. Watch for slipping grades, sleep and friendships.
:::

:::note
This article is based on our conversation with Dr. Arun Tungaria and is for awareness only. It is not a substitute for medical advice, diagnosis or treatment. Quotes are translated and lightly condensed from the original Hindi conversation.
:::
`,
  },
  {
    slug: "can-destiny-be-changed",
    title: "Can Destiny Be Changed? An Astrologer on Mangal Dosh, Matching Gunas and the Fear Trade",
    date: "2026-10-17",
    category: "Episode Notes",
    excerpt:
      "Mangal dosh, low guna scores, endless remedies and astrologers who scare you into paying. Astrologer Nitisha Malhotra on what destiny really decides, and why she married with just 12 gunas.",
    cover: "",
    video: "4ojqBPlD0Jo",
    body: `
"Your kundli has *mangal dosh*." For countless families in India, those few words have delayed a wedding, ended a relationship, or kept a young woman anxious for years. Others spend thousands on stones, *havans* and "remedies" prescribed by whichever astrologer they happened to find on TV or YouTube, without ever knowing whether that person was any good.

In this episode, host Lalit Sharma asked the questions so many people quietly carry. Can destiny really be changed? Should a love marriage be stopped because the *gunas* don't match? How do you tell a genuine astrologer from one who's just frightening you into paying?

Our guest was **Nitisha Malhotra**, an astrologer, numerologist, tarot reader and vastu consultant who says she approaches these subjects not as superstition but as awareness. Her answers were often surprising, and some of the most useful ones were warnings about her own field.

:::summary In this conversation
- Can destiny be changed? Her "40% destiny" answer
- Mangal dosh, matching gunas and love marriages
- How to spot a good astrologer, and a bad one
:::

[[watch]]

## 1. Can destiny be changed? Her "40% destiny" answer

Lalit opened with the question behind every consultation: can *kismat* really be changed?

Her answer was yes and no. In her view, your birth chart or numerology grid sets the field you play on, and you can't step outside it. But within it, she believes there is a lot you can do, using the example of nature itself: we eat *bajra* and dry fruits in winter for warmth, and *khus* and *bel* in summer to cool down. Stones, metals and remedies, she says, work on the same principle, strengthening the planets that are weak for you.

Then she said something that surprised us coming from an astrologer:

> "Destiny is only 40%. To become a Shah Rukh Khan or a Prime Minister, your willpower is working too. If you had to describe the earth in one word, it would be *karm pradhan*: here, whoever does the work moves ahead."
> — Nitisha Malhotra

The rest, as she breaks it down, comes from your willpower and from whether you're willing to take on challenges at all. Someone happy and settled in a comfortable job, she says, simply won't chase the challenges that would activate a strong chart. "If I'm satisfied, what *rajyog*?"

:::context The bigger picture
Interest in astrology isn't fading in modern India; it's booming. Astrology app Astrotalk reported income of about ₹1,214 crore in FY25, up roughly 85% in a year, with most of its activity coming from India's biggest cities.

Whatever your view of astrology, it's worth noticing that one of its practitioners puts most of the weight on effort and choices. That's a message almost everyone can agree with.
:::

## 2. Mangal dosh, matching gunas and love marriages

Few things cause more fear in Indian families than *mangal dosh*. Some astrologers now claim it doesn't exist at all. Nitisha disagrees. She believes the effects can be seen in real charts, even if the classical sages didn't describe it as a "dosh". But her overall approach to marriage matching was more relaxed than many people expect.

**Should a love marriage still be matched?** Yes, she says, but not to stop it. Matching shows what challenges each partner's chart carries, so they can be addressed early. In her view, one partner's strengths can even balance what's missing in the other's chart.

**What about gunas?** Guna matching, she explains, shows chemistry and compatibility of temperament, such as one partner being an early riser and calm, the other a night owl and louder. It is not a verdict on whether the marriage will survive.

> "I'd say people with 36 gunas become too alike, and more problems come up. Even 20 to 30 gunas is very good. My husband and I match only 12 gunas. Any astrologer would say don't marry. But our marriage is working."
> — Nitisha Malhotra

What keeps a marriage going, she says, is confidence, understanding and the values you stand on, not a number on a chart.


## 3. How to spot a good astrologer, and a bad one

With so many astrologers on YouTube and TV, Lalit asked how ordinary people can know whom to trust. Nitisha's answer doubled as a checklist:

- **A good astrologer doesn't scare you.** Fear-based predictions are a red flag.
- **Beware of "just pay me" remedies.** Be wary of anyone who says you don't need to change anything, "just give us money and we'll do a *havan*, and you'll be fine."
- **Nobody has all nine planets "bad".** At most two or three need attention, she says. If someone prescribes remedies for all nine, walk away.
- **Small remedies work fastest.** Simple, consistent habits matter more than expensive rituals.
- **Test them on your past.** "An astrologer who can tell you your past can predict your future." If they get around 80% of your past right, she'd trust them. Around 40–50% is just average.

And perhaps her most practical advice:

> "Don't go to an astrologer and ask, 'How is my future?' Ask, 'I want to become this. Can I? And if I can, what should I do?'"
> — Nitisha Malhotra

She even shared a story from the Puranas: when Narad predicted Parvati's future husband would be an ash-smeared ascetic living in cremation grounds, her mother Mainavati was so upset that she said astrology should never be *so* accurate that it frightens a person. Nitisha says an astrologer's job is to guide, not to terrify.

:::context The bigger picture
Psychologists offer one more test worth adding. In 1948, Bertram Forer gave all his students the same "personality report", and most rated it as remarkably accurate for them personally. This tendency to see ourselves in general statements is called the Barnum effect. It's a good reason to ask any reader for specific, checkable facts about your past, exactly as Nitisha suggests, rather than vague descriptions that could fit anyone.
:::

In the episode, Nitisha also shows how to draw your own Lo Shu grid from your date of birth, and the simple habits she believes can "activate" each missing number.

:::takeaways Key takeaways
1. In Nitisha's view, destiny is only part of the story. Effort, willpower and choices count for more.
2. Don't cancel a relationship over guna scores alone. Her own 12-guna marriage is working.
3. Be wary of any astrologer who frightens you, prescribes remedies for all nine planets, or simply asks for money.
4. Ask "Can I become this, and how?" instead of "What's my future?"
:::

:::note
This article summarises the views our guest shared on the show. Quotes are translated and lightly condensed from the original Hindi conversation. Insightoholix does not scientifically endorse astrological or numerological claims, and nothing here should replace professional medical, financial or legal advice.
:::
`,
  },
  {
    slug: "health-and-term-insurance",
    title: "One Hospital Bill Away: Health and Term Insurance Explained Without the Jargon",
    date: "2026-10-16",
    category: "Episode Notes",
    excerpt:
      "A single illness can wipe out years of savings, and a hidden pre-existing condition can get your claim rejected. Insurance professional Ravi Ashok on what to buy first, how much cover you need, and how to make sure your family actually gets paid.",
    cover: "",
    video: "YwBDPUkqKVk",
    body: `
It usually starts with a phone call. A parent has collapsed, or there's been an accident. Within days, the hospital bill crosses ₹3 or ₹4 lakh, and a family that has spent years saving carefully watches it disappear. Some sell jewellery. Some borrow from relatives. Some choose a cheaper hospital, or delay treatment, because there is simply no other option.

This isn't rare. Even today, around **39% of all health spending in India comes directly out of people's own pockets**, and one widely cited study estimated that medical costs pushed **55 million Indians into poverty in a single year**. Meanwhile, medical costs in India have been rising by around **13% a year**, roughly twice as fast as general inflation.

During this conversation, host Lalit Sharma put it in one line that stayed with us:

> "The difference between being middle class and being poor is often health insurance."
> — Lalit Sharma

To make sense of health and term insurance, without the sales pitch, Lalit spoke to **Ravi Ashok**, his batchmate from MBA days, who has spent 12 years in the insurance industry, much of it in rural and micro insurance.

:::summary In this conversation
- Health insurance first: what one illness can do to a family
- How to avoid getting your claim rejected
- Term insurance: the policy nobody wants to talk about
:::

[[watch]]

## 1. Health insurance first: what one illness can do to a family

Lalit asked the practical question: if you're middle class or lower middle class, which insurance should you buy first?

Ravi's answer was clear: **health insurance, before anything else.** Picture a family earning ₹40,000–50,000 a month. A parent or grandparent falls ill, and a "small" treatment costs ₹3–4 lakh. That hits hard. The same family paying ₹10,000–15,000 a year in premium would barely feel it.

He also pointed to a cost that's easy to miss: without insurance, people **compromise**. They pick a cheaper hospital or delay treatment. With insurance, he says, you can choose the best care available.

For people who run their own business, he's even firmer. Salaried employees usually get some group cover from their employer. Business owners and small traders get nothing unless they buy it, so for them health insurance should be the very first financial goal.

:::context The bigger picture
For families who can't afford a premium at all, the government's **Ayushman Bharat PM-JAY** scheme offers free hospital cover of up to ₹5 lakh a year to eligible economically weaker families. Since October 2024, it has also covered **every Indian aged 70 and above**, regardless of income, through the **Ayushman Vay Vandana** card.

Ravi called it one of the most important health initiatives in the country, especially because private insurers rarely sell new policies to people that age. If someone in your family is 70 or older, help them enrol. It's free, through the Ayushman app, beneficiary.nha.gov.in or a Common Service Centre.
:::

## 2. How to avoid getting your claim rejected

The most heartbreaking insurance stories are the ones where people *did* pay their premiums, and the claim was still rejected. Ravi's advice is aimed squarely at avoiding that.

**1. Tell the whole truth.** Many people hide an existing illness or their real weight to reduce the premium, sometimes on an agent's advice. Then, during a hospital stay, the doctor writes that you've been on blood pressure medicine for four years. The insurer sees you didn't declare it, and the claim is rejected. Declare every pre-existing condition, and let the premium be what it should be.

**2. Don't under-insure.** "₹3 lakh feels like a lot, until a single day in a private hospital ICU costs ₹1 lakh." For cancer treatment, chemotherapy and repeated tests, costs climb fast. His rule of thumb: **at least ₹10 lakh of health cover today.**

**3. Read the fine print.** Look for:

- **Room-rent caps.** A limit of ₹5,000 or ₹10,000 a day can reduce your entire claim if you take a better room.
- **Waiting periods.** Usually 30 days for new illnesses, and longer for pre-existing ones.
- **Network hospitals.** Check that the hospitals near you are on the list.
- **Claim settlement track record.** Choose an insurer that actually pays.

## 3. Term insurance: the policy nobody wants to talk about

If health insurance is the first priority, Ravi says term insurance comes second, and only if someone depends on you.

**Who needs it?** If you're young, single, and your parents are financially secure (say, with government pensions), you may not need term cover yet. But once you have a spouse who isn't earning, children, or parents who rely on your income, it becomes essential. If something happens to you, a ₹50 lakh, ₹1 crore or ₹2 crore payout can keep your family afloat.

**Why do so few people buy it?** Partly because nobody likes a salesperson saying "If you die tomorrow…". And partly because people ask, "If nothing happens, what do I get back?"

That question is exactly why Ravi is so firm about this:

> "Insurance and investment should never be mixed. The people selling them mixed together are doing something very wrong."
> — Ravi

Endowment plans and ULIPs bundle insurance with investment. In his experience, endowment plans have rarely returned more than around 6% historically, and the bundling leaves you with too little cover *and* poor returns. His alternative is simple: **buy a pure term plan for protection, and invest separately**, for example through mutual funds, for growth. You get a far bigger cover for the premium, and better returns on your investments.

**Choosing a plan.** Look for an insurer with a long track record and a strong claim settlement ratio, and balance that against the premium. Then two things decide whether your family actually gets paid:

- **Declare everything honestly**, just like with health insurance.
- **Get the nominee right**, so the money reaches the right person quickly, without legal tangles.

## Protect first, invest later

What we took from this conversation is a simple order of priorities. **Health insurance first**, because one illness can undo years of savings. **Term insurance next**, if anyone depends on you. Investing comes after you're protected, and it should never be bundled into an insurance policy.

In the episode, Ravi also walks through the low-cost top-up trick that can multiply a salaried family's health cover for a few thousand rupees a year.

:::takeaways Key takeaways
1. Buy health insurance first, with at least ₹10 lakh of cover.
2. Declare every pre-existing condition honestly. Hiding one is the fastest route to a rejected claim.
3. Check room-rent caps, waiting periods, network hospitals and the insurer's claim record.
4. Buy a pure term plan if someone depends on you, invest separately, and name your nominee correctly.
5. Seniors 70+ can get free cover of up to ₹5 lakh through Ayushman Vay Vandana.
:::

:::note
This article summarises the views our guest shared on the show and is for awareness only. It is not financial or insurance advice. Insurance rules and products change, so always read your policy wording, check IRDAI's guidelines, and speak to a licensed adviser before buying. Quotes are translated and lightly condensed from the original Hindi conversation.
:::
`,
  },
  {
    slug: "why-upsc-aspirants-fail",
    title: "Don't Make the Exam Bigger Than You: Aditya Nath Das on Failing UPSC, Burnout and the Real IAS",
    date: "2026-10-15",
    category: "Episode Notes",
    excerpt:
      "He failed prelims, then mains, and still made it to the IAS. Former Chief Secretary Aditya Nath Das on judging yourself honestly, beating burnout, and why the exam should never be bigger than you.",
    cover: "",
    video: "dM9CqdQ6ApI",
    body: `
You've given it two years. Maybe four. Your friends have jobs, salaries and weekends. Relatives ask "kab clear hoga?" at every wedding. Every time a result comes out without your name on it, something quietly shrinks inside you, and it isn't just your rank. It's how you see yourself.

That is the reality for a huge number of young Indians. Over 13 lakh people applied for the Civil Services Examination in 2024. About 14,600 cleared prelims, and only around a thousand made it to the final list. Former RBI Governor Duvvuri Subbarao recently called the current system of up to six attempts a "colossal waste of productive years".

So for our Independence Day special, we didn't want a topper's highlight reel. We wanted someone who had failed and still made it, and who has spent nearly four decades inside the system those aspirants are trying to enter.

**Aditya Nath Das** joined the Indian Administrative Service in 1987, served as Chief Secretary of Andhra Pradesh, and today advises the Irrigation Department of the Government of Telangana. He is also a poet. His collection *Dancing with Dreams* carries a line that sums up this conversation: *whatever life unfolds for you, welcome it with a smile.*

:::summary In this conversation
- "I didn't even clear prelims": failing twice, and learning to judge yourself honestly
- Burnout, coaching and information overload
- Why the exam should never be bigger than you
:::

[[watch]]

## 1. "I didn't even clear prelims"

His path was anything but smooth. He studied at Sainik School Lucknow, finished school in Dehradun and enrolled at Banaras Hindu University for a BSc (Hons) in Geology. His real dream was the Indian Forest Service. He loved hills and nature.

Then life intervened. The early 1980s were politically charged at BHU, and the university kept shutting down. A course meant to take two years stretched to three, and then to almost five. When the Forest Service exam finally came around, he fell ill and couldn't sit it. He moved to Jawaharlal Nehru University to study International Studies, where "everybody was writing civil services, so I also wrote civil services."

- **First attempt:** he didn't clear prelims.
- **Second attempt:** he cleared prelims but missed mains by a small margin.
- **Last attempt:** he cleared everything and joined the IAS.

What changed between attempts two and three wasn't luck. It was something he calls self-calibration.

> "After you write the mains, give yourself marks for every paper. When your actual marks come, see how close you were. I had calibrated myself well. I knew I was writing well, but I lacked substance. I wasn't putting in the facts."
> — Aditya Nath Das

So he fixed exactly that. With facts added to the way he already wrote, he got through.

:::context The bigger picture
The number of attempts is now a live national debate. In 2025, Subbarao proposed cutting attempts to three and lowering the upper age limit to 27, arguing that candidates fall into a "sunk cost" trap: having invested so much, they feel unable to quit.

Mr Das is more cautious. He says we can't fault young people for chasing the civil services; our history, our society and the respect the job carries all push them towards it. But he worries about what repeated failure does to a young mind, because with every failed attempt, a candidate's worth in their own eyes goes down.

He welcomed a recent UPSC step in that direction. In June 2025 the Commission launched *Pratibha Setu*, which lets verified employers, including private companies, see the profiles of candidates who cleared every stage but missed the final list. Within weeks, over 100 organisations had signed up.
:::

> "This exam doesn't capture your whole life story. There's a lot still to come. Don't let one examination become the marker of your future."
> — Aditya Nath Das

## 2. Burnout, coaching and information overload

Burnout is one of the most common struggles aspirants describe, and his explanation of where it comes from was striking.

> "Burnout happens because you're running towards a goal, running and running, and the goal doesn't come. Pass the exam, get the job: it all gets stacked up in your mind, and every time you can't reach it, you see despair."
> — Aditya Nath Das

His answer is counter-intuitive: **stop preparing for the exam, and start preparing to understand.** When you study with the exam in mind, he says, you remember only the last thing you read. When you study to understand, your mind naturally keeps what matters and lets go of the rest, which is also the answer to today's information overload, when every topic has a thousand YouTube videos.

His practical habits:

- **Recall, don't reread.** Study a topic, close the book, take a sheet of paper and see how much you can recall.
- **Stop when understanding stops.** "Your eyes are still on the book, but your mind isn't working." That's the moment for a cup of tea.
- **Don't cut off your social life.** When it gets too much, go out, meet friends, then come back and reassess. Isolation makes everything worse.
- **Compete with yourself.** "You're not going to beat anybody. You're going to do yourself better. That's all."

On coaching, he's neither for nor against. Preparing in complete isolation is hard, and being around other aspirants helps ideas flow. "The only danger is that you get stuck in a pattern. Coaching tries to fit you into a slot. Don't get slotted."

## 3. "Don't make the exam bigger than yourself"

We asked for one piece of advice for someone just starting out. Prepare with a calm mind, he said. Know your capacity. Build a daily routine. Read one newspaper every day, especially the editorials, because they show how to make many points precisely and concisely.

Then came the line that, for us, defined the whole episode:

> "Don't make the exam bigger than yourself. An exam is an exam. Don't let the balance sheet of your life rest on it. Nothing in life is bigger than you. Everything begins after you."
> — Aditya Nath Das

In the episode, he also tells the story of the evening in 2001 when around 59 rounds of gunfire hit his car in Warangal, and what his injured driver did that saved both their lives.

:::takeaways Key takeaways
1. Failing prelims or mains isn't the end. Calibrate yourself honestly and fix the specific gap.
2. Study to understand, not to "crack the exam". It's the best defence against burnout and information overload.
3. Don't isolate yourself, and compete only with who you were yesterday.
4. Use coaching if it helps, but don't let it slot you into a pattern.
5. Nothing in life, including this exam, is bigger than you.
:::

:::note
This article is based on our conversation with Aditya Nath Das. His quotes are translated and lightly condensed from a conversation in Hindi and English, and the views are his own.
:::
`,
  },
  {
    slug: "birth-date-and-success",
    title: "When Nothing Seems to Work: Sanddeep Bajaj on Numbers, Struggle and Starting Over at 42",
    date: "2026-10-12",
    category: "Episode Notes",
    excerpt:
      "Money that never stays, a job that keeps slipping away, school fees he couldn't pay. Numerologist Sanddeep Bajaj on the years when nothing worked, why he says your name matters, and what the numbers missing from your birth date reveal.",
    cover: "",
    video: "_TPYlhVhpy4",
    body: `
Why does money never seem to stay? Why do relationships keep breaking down? Why won't the business grow, no matter how hard you push? Why do you feel restless inside even when nothing is visibly wrong?

These are the questions many of us carry quietly and rarely say out loud. They are also exactly where this episode began. Our guest, numerologist **Sanddeep Bajaj**, didn't arrive with theory. He arrived with a story of years when nothing worked.

His father retired as an Assistant Commissioner of Income Tax. On paper, the family had everything. In reality, he says, there came a time when he couldn't pay his son's school fees of about ₹1.5 lakh a year. For three years, his mother-in-law paid them. He sold his wife's jewellery to pay for consultations with famous astrologers he had seen on TV. Every two or two and a half years, he either lost his job or resigned.

> "I had a lot, but nothing in my hands."
> — Sanddeep Bajaj

Whatever you make of numerology, what makes this conversation worth your time is how openly it deals with things most people never admit: debt, borrowed school fees, a career that keeps slipping away.

:::context The bigger picture
Sanddeep's story is personal, but the pressure behind it is widespread. In the ManipalCigna–YouGov *India Health Quotient 2026*, 82% of urban Indians said they experience stress, and financial well-being scored lowest of all five dimensions measured. And school fees, the very thing Sanddeep couldn't pay, keep climbing: in a 2025 LocalCircles survey, over 80% of private-school parents reported fee hikes above 10% in a single year.
:::

:::summary In this conversation
- When the future feels frightening, start with today
- Same birthday, different lives: why he says your name matters
- The missing numbers: stability, discipline and a child who speaks late
:::

[[watch]]

## 1. When the future feels frightening, start with today

Most people who walk into a numerologist's office want one thing: to know what's coming. Host Lalit Sharma opened with exactly that question: can numerology predict the future?

Sanddeep's answer surprised us. He believes knowing the future matters far less than fixing the present.

> "Even Lord Krishna said it: yesterday isn't in your hands, and tomorrow isn't in your hands. Only today is in your hands. The better today gets, the better tomorrow becomes on its own."
> — Sanddeep Bajaj

In his view, everyone is given four "pillars" to work with today: the spelling of their name, their signature, their bank account number and their mobile number. Until these are aligned with your date of birth, he says, it's hard to move forward. He was also refreshingly blunt about the limits: if someone has decided to gamble or bet on horses, no number on earth can save them.

## 2. Same birthday, different lives: why he says your name matters

Here's a question that bothers a lot of people: thousands of babies are born on the same day, so why do their lives turn out so differently? Sanddeep's answer is that the date may be shared, but the name never is. "One became Lalit Narang, another Lalit Kumar, another Lalit Kohli."

He ties this to the old saying *"Ram se bada Ram ka naam"*: the name of Ram is greater than Ram himself. Interestingly, he argues that the vibration isn't in the name people call you. Most of us are addressed as "sir", "ma'am", "bhaiya" or "guruji" anyway. It's in the name you write: your display name.

> "Your date of birth can never change. The spelling of your name, you can change whenever you like."
> — Sanddeep Bajaj

He urged parents to think twice before naming a child after a favourite TV-serial character without checking the name's "vibration".

## 3. The missing numbers: stability, discipline and a child who speaks late

Some of the most relatable moments in the episode came from the Lo Shu grid, a 3×3 square filled in with the digits of your date of birth. Each number always sits in the same position, and you write in every digit of your birth date (ignoring zeros):

:::loshu
4 9 2
3 5 7
8 1 6
The Lo Shu square
---
- 9 -
- - 77
- 11111 -
Sanddeep's own date of birth, 17 November 1971: no 5
:::

Almost nobody has every number from 1 to 9, and according to Sanddeep, each missing number shows up as a specific struggle:

- **Missing 1:** weak communication and leadership
- **Missing 2:** weak intuition, misjudging people
- **Missing 3:** less imagination
- **Missing 4:** little discipline; "go into that child's room and it will be turned upside down"
- **Missing 5:** no stability; he says 85% of people lack this number
- **Missing 6:** money and family struggles, delayed marriage
- **Missing 7:** obstacles in research and higher education
- **Missing 8:** more anger, tension and hurdles
- **Missing 9:** less compassion; "only interested in their own world"

Missing 5 is the one he connects to his own past:

> "Missing five means stability goes missing. Every two or two and a half years, either I lost my job or I resigned myself."
> — Sanddeep Bajaj

His most talked-about claim was about the number 1. Many children born after 2000 don't have a 1 in their date of birth, he says, and he links this to children starting to speak late.

:::context The bigger picture
The Lo Shu grid comes from an ancient Chinese legend about a turtle that emerged from the Lo river with a 3×3 "magic square" on its shell, in which every row, column and diagonal adds up to 15. Mathematically, it really is a beautiful pattern.

Personality descriptions deserve a closer look, though. In 1948, psychologist Bertram Forer gave all his students the same "personality report", and most rated it as remarkably accurate for them personally. This is now called the Barnum effect: statements like "your room is often messy" or "you crave stability" fit most people to some degree.
:::

:::note If your child is speaking late
Please don't put it down to numbers. Speak to a paediatrician or a speech therapist. With speech delays, getting help early makes the biggest difference.
:::

You may finish this episode a believer, a skeptic or somewhere in between. But the real point is a man talking honestly about the years when nothing worked, struggles millions of families live with and almost never talk about. And lessons like focusing on today and looking for stability work whether or not you believe in numbers.

In the episode, he also explains why he believes his own "luck factor" stayed close to zero until he turned 42.

:::takeaways Key takeaways
1. According to Sanddeep Bajaj, fixing today matters more than predicting tomorrow.
2. In numerology, the name you write (its spelling) counts for more than the name people call you.
3. The Lo Shu grid, he says, shows which numbers are missing from your birth date, and each points to a struggle.
4. Whatever you believe, take health, child-development and big money decisions with expert advice.
:::

:::note
This article summarises the views our guest shared on the show. Quotes are translated from the original Hindi conversation. Insightoholix does not scientifically endorse these claims; the "bigger picture" sections are there for context.
:::
`,
  },
  {
    slug: "behind-the-mic-recording-day",
    title: "Behind the Mic: What a Recording Day Really Looks Like",
    date: "2026-10-05",
    category: "Everyday",
    excerpt:
      "Two cameras, three mics, one guest and a lot of chai. A look at everything that happens before you press play.",
    cover: "",
    video: "",
    body: `
A 50-minute episode looks simple on screen: two people, two chairs, one conversation. Here's what it actually takes.

## The week before

We research the guest, watch their old interviews, and write far more questions than we'll ever use. The goal isn't a script — it's to know enough to go off-script confidently.

## Morning of

- Lights up, cameras white-balanced, audio levels checked (twice)
- Phones on silent, door signs up, the AC switched off so it doesn't hum on the mics
- A pot of chai, because nobody opens up on an empty stomach

## The conversation

The first ten minutes are usually the stiffest. Then something shifts — a laugh, a story nobody planned to tell — and that's when the real episode begins.

## After

Backups first, always. Then edits, teaser cuts, thumbnails and titles. One recording day becomes roughly a week of work.

> The best moments are never on the question list.
`,
  },
  {
    slug: "lost-3-lakhs-trading-lessons",
    title: "₹3 Lakh Gone in 3 Months: A Retired Banker on the Options Trap That Catches 9 in 10 Traders",
    date: "2026-09-28",
    category: "Episode Notes",
    excerpt:
      "A ₹1,500 YouTube class, one lucky week, then three months of losing over ₹1 lakh a month. A retired banker's brutally honest story of options trading, and what SEBI's data says about why 91% of traders lose.",
    cover: "",
    video: "sDGD1Q-FGDk",
    body: `
The position was down ₹60,000. He couldn't bear to watch it anymore, so he cut the trade, put the phone down, and lay face-down on the bed.

Fifteen minutes later he picked up the phone again. Had he held on, the loss would have been only ₹12,000. By 3:30 p.m., the market had closed at exactly the price where he had entered. The trade that cost him ₹60,000 would have cost him nothing.

That is one afternoon from the story of our guest: a retired bank employee who, in just three months of options trading, lost more than ₹3 lakh, including every rupee of the ₹4 lakh profit he had patiently made in stocks.

His story isn't rare. It's the norm. According to SEBI's own study, **91% of individual traders in India's futures and options (F&O) market lost money in FY25**, with combined losses of about **₹1.06 lakh crore**, roughly ₹1.1 lakh per trader. Put simply, only about 9 out of every 100 make money.

:::summary In this conversation
- How it starts: a ₹1,500 YouTube class and an "easy" first week
- The traps: revenge trading, greed and a ₹79,000 margin shock
- The silent killer: brokerage, charges and overtrading
:::

[[watch]]

## 1. How it starts: a ₹1,500 class and an "easy" first week

After retiring from his bank job, he suddenly had empty days. Trading seemed perfect: work from home, keep the mind busy, and, he told himself, never sell a stock at a loss.

In stocks, it worked. He bought companies with steadily rising quarterly and yearly profits, and by June he was about **₹4 lakh in profit**.

Then he found options. He watched a YouTube creator, paid ₹1,500 for a weekly online class, and learned two or three "strategies". What he really learned, he admits, was only how to press *buy* and *sell*. He bought weekly-expiry Nifty options, sold them a few minutes later for 10 or 15 points, and in the first week he made **₹17,000–18,000**.

> "I thought: this needs less money, and there's profit every single day. Why not leave stocks and just do options?"
> — Our guest

In the second week, he lost **₹49,000**. For the next three months, he lost **more than ₹1 lakh every single month**.

:::context The bigger picture
That first-week high is exactly what makes options so dangerous for beginners. A small amount of money controls a large position, and quick early wins feel like skill rather than luck. SEBI's three-year study (FY22 to FY24) found that **93% of individual F&O traders lost money, an average of about ₹2 lakh each, adding up to more than ₹1.8 lakh crore**. Only 1% made a profit of more than ₹1 lakh after costs.
:::

## 2. The traps: revenge trading, greed and a ₹79,000 margin shock

Three patterns caused most of his biggest losses. Anyone who has traded will recognise them.

**Trap 1: Doubling up to "recover" a loss.** After a few small losing trades, say ₹2,000 down, he'd think: "If I buy 1,000 quantity, just 3 points will make it back." Sometimes it did. Often, he lost twice as much.

**Trap 2: Selling options without understanding margin.** When buying two or four lots was making ₹2,000–3,000 a trade, he decided to go bigger and *sell* 300 quantity of calls. He had no idea how much margin selling requires. In minutes, almost his entire balance was blocked, and that day closed with a **₹79,000 loss**.

**Trap 3: Greed on the way up, fear on the way down.** He described one trade with painful precision:

> "₹5,000 profit, I'm happy. ₹10,000, very happy. ₹11,000, let it go higher. Then it dropped to ₹8,000, ₹7,000, ₹5,000. I said, I'll exit at ₹10,000. It came back to zero. Then I said, at least let the commission come out. Then it went into loss."
> — Our guest

And the mirror image, exiting too early out of fear:

> "Of course my heart goes *dhak-dhak*. Once the loss crossed ₹2,000, it would start. Past ₹5,000, I'd cut the trade."
> — Our guest

Without a plan decided *before* entering a trade, every decision is made by fear or greed in the middle of it.

## 3. The silent killer: brokerage, charges and overtrading

This might be the most eye-opening part of the conversation.

He'd heard that brokerage was "just ₹20 a trade", so he didn't worry about it. One day he made **29 trades**, buying and selling 58 times, and ended the day ₹6,500 up. He was thrilled. The next day, 24 trades and ₹4,500 up. The day after, ₹11,000 down.

He didn't even know how to check his options P&L until three days later. When he finally did, the picture changed completely:

- **Day 1:** ₹6,500 profit, about ₹5,000 in charges, so roughly **₹1,500** left
- **Day 2:** ₹4,500 profit, about ₹5,500 in charges, so actually **₹1,000 lost**
- **Day 3:** ₹11,000 loss plus ₹4,500 in charges, so **₹15,500 lost**

Brokerage is only one part. Exchange fees, taxes and other charges add up on every single trade, and the more often you trade, the faster they eat whatever you make.

His advice to anyone, of any age, thinking of starting:

> "First sit with someone for at least six months and understand it. My mistake was taking too much quantity at the start. If I'd started with one or two lots, I'd have lasted six or seven months instead of losing it all in three."
> — Our guest

In the episode, he also shares the three simple rules that helped him stop the bleeding and end December in profit.

:::note Important
This article shares one person's real experience and publicly available SEBI data. It is not investment advice. F&O trading carries a high risk of loss. Please speak to a SEBI-registered investment adviser before making financial decisions.
:::

:::thanks A heartfelt thank you
People rarely talk about money they've lost. Our guest did the opposite. When we asked him to tell his story, he agreed without a second thought, and spoke openly about every painful detail: the ₹60,000 afternoon, the margin shock, the trades he wishes he'd never placed.

He did it so that someone else might recognise the trap before falling into it. That takes real courage and real generosity. Thank you, sir, for trusting us with your story. It will save someone a lot of money and a lot of heartache.
:::

:::takeaways Key takeaways
1. About 9 in 10 individual F&O traders in India lose money. Assume you will be one of them until you've proven otherwise.
2. A few winning days in options mean very little. Early wins often lead to bigger bets.
3. Doubling up to recover, selling options without understanding margin, and holding on out of greed caused his biggest losses.
4. Brokerage and charges quietly ate most of his profits on high-trade days.
5. Learn first, start with one or two lots, and never trade money you need.
:::
`,
  },
  {
    slug: "phone-free-mornings",
    title: "We Tried Phone-Free Mornings for Two Weeks",
    date: "2026-09-20",
    category: "Everyday",
    excerpt:
      "After recording our mental health episode, we couldn't stop thinking about our own screen time. So we ran a small experiment.",
    cover: "",
    video: "",
    body: `
Our episode on anxiety, depression and mobile addiction left us a little uncomfortable — in a good way. We realised the first thing we both did every morning was reach for our phones.

## The rule

No phone for the first hour after waking up. Alarm clock in, phone charger out of the bedroom.

## Week one

Honestly? Restless. The urge to "just check" was constant. We filled the hour with a walk, breakfast without a screen and a few pages of a book.

## Week two

Something changed. Mornings felt longer. Ideas for episodes started showing up during walks instead of while scrolling other people's content.

## What we're keeping

- Charging phones outside the bedroom
- A walk before any screen
- Notifications off for everything except people

> You don't need a digital detox retreat. You need one protected hour.

Try it for three days and tell us how it went.
`,
  },
  {
    slug: "gen-alpha-vs-90s-kids",
    title: "Gen Alpha vs 90s Kids: Notes From Our Own Dinner Table",
    date: "2026-09-02",
    category: "Everyday",
    excerpt:
      "Doordarshan and cassette tapes versus iPads and AI homework helpers. Our Children's Day episode started a debate that hasn't ended at home.",
    cover: "",
    video: "ahI9osLXDBY",
    body: `
Our Children's Day special asked a simple question: who's smarter — Gen Alpha or the 90s kids? We expected a fun episode. We didn't expect it to continue at home for a week.

## The case for the 90s

We were bored a lot — and boredom made us inventive. We memorised phone numbers, played outside until the streetlights came on, and waited a whole week for the next episode of anything.

## The case for Gen Alpha

They pick up technology instantly, have access to almost any information, and are far more open about feelings than we ever were at that age.

## Where we landed

Maybe "smarter" is the wrong word. Each generation is shaped by the tools it grows up with. The real question is what we choose to pass on: curiosity, patience, kindness.

> Every generation thinks the next one has it easy. Every generation is wrong.

Which side are you on? Tell us in the comments on the episode.
`,
  },
  {
    slug: "whats-next-for-llms",
    title: "What's Next for AI? A Plain-English Guide to Our LLM Episode",
    date: "2026-08-18",
    category: "Episode Notes",
    excerpt:
      "ChatGPT, Generative AI and \"responsible AI\" — explained without the jargon, alongside our conversation with an ISB alum.",
    cover: "",
    video: "Cy5MKpEZcs0",
    body: `
Everyone is talking about AI. Far fewer people can explain what a large language model actually is. This episode was our attempt to fix that — for ourselves first.

## LLMs in one paragraph

A large language model is a system trained on enormous amounts of text to predict what comes next in a sentence. Do that well enough, at a big enough scale, and it can draft emails, summarise reports, write code and answer questions surprisingly well.

## What "responsible AI" means

- **Accuracy:** models can sound confident and still be wrong, so important answers need checking.
- **Bias:** a model learns from human data, including human prejudices.
- **Privacy:** what you type into a tool may be stored or used — read the policies.
- **Accountability:** a person, not the software, should stay responsible for decisions.

## Will it take our jobs?

The more useful question from the conversation: *which tasks* will change? People who learn to work alongside these tools are likely to have an edge over people who ignore them.

> Don't fear the tool. Learn it, question it, and stay the one making the decisions.

Watch the full episode above, and tell us which AI topic you want us to cover next.
`,
  },
];
