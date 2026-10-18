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
    title: "Women's Health, Honestly: A Gynaecologist on Periods, PCOS, Fertility, Pregnancy and Menopause",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Irregular periods, PCOS, infertility, C-sections, postpartum depression, menopause: half the population still learns about their own bodies through guesswork. Dr. Poonam Gupta's two-part masterclass, brought together in one guide.",
    cover: "",
    video: "LAlagU6xhUE",
    parts: [
      { id: "LAlagU6xhUE", label: "Part 1 · Periods, PCOS, fertility and IVF", title: "Women's Health Secrets Doctors Rarely Tell You | Part 1" },
      { id: "XcICUW9XrS4", label: "Part 2 · Pregnancy, postpartum and menopause", title: "Women's Health Secrets Doctors Rarely Tell You | Part 2" },
    ],
    body: `
A teenager who thinks her irregular periods mean something is wrong with her. A young woman told her painful cramps are "normal" and to just take a pill. A couple quietly trying for a baby for two years, too embarrassed to ask anyone. A new mother who can't stop crying, while everyone tells her she should be happy. A woman in her fifties who stops going out because of a problem she can't bring herself to name.

These are not rare stories. They are what happens when half the population grows up learning about their own bodies through hesitant conversations, forwarded messages and guesswork. **Women's health is still surrounded by taboos, myths and half-knowledge.** And the cost is real: symptoms ignored, questions never asked, help sought too late.

That's why this became a two-part series. We sat down with **Dr. Poonam Gupta, an obstetrician and gynaecologist**, to walk through every stage of a woman's life, from the first period to menopause, in plain language. She chose this field because she loved surgery, and because her parents dreamt of her becoming a "lady doctor". Like most gynaecologists, she can be called in at any hour of any day, and she credits her family and husband for helping her balance it all.

This article brings both episodes together in one place.

:::summary In this two-part series
- **Part 1:** your cycle, PCOS, painful periods, planning a pregnancy, egg freezing, infertility and IVF
- **Part 2:** pregnancy care, normal delivery vs C-section, recovery and food myths, breastfeeding, postpartum depression, menopause and cervical cancer
:::

[[part Part 1 · Periods, PCOS, fertility and IVF]]

## 1. Your cycle, decoded: what "normal" actually means

Getting your first period, called **menarche**, is a milestone in a girl's growth. What follows every month is a carefully timed conversation between the brain, the ovaries and the uterus. Dr. Poonam explained it in four phases:

1. **Menstrual phase.** The inner lining of the uterus (the endometrium) sheds, and bleeding begins. At the same time, the ovaries start recruiting a group of small new eggs.
2. **Proliferative phase.** Those small follicles produce **oestrogen**, which makes the uterine lining thicken again.
3. **Ovulation.** One follicle becomes dominant and releases an egg.
4. **Secretory phase.** What's left of the follicle (the corpus luteum) produces oestrogen and **progesterone**, making the lining thicker and spongier, ready to receive a pregnancy. If no pregnancy happens, the lining sheds and the cycle starts again.

And the number most women worry about? There is no magic "28 days".

> "A normal cycle isn't exactly 28 or 30 days. It varies from woman to woman, anywhere between 21 and 35 days. If it comes every 21 days regularly, that's normal for her. If it comes every 35 days, that's normal for her."
> — Dr. Poonam Gupta

What matters is a change from *your* normal, or cycles that are consistently **shorter than 21 days or longer than 35 days**. Those need a doctor's evaluation.

**Why do periods go irregular?** In the first two to three years after menarche, some irregularity is common because the hormonal control system between the brain and ovaries (the HPO axis) is still maturing. A teenager may even skip a few months. Later in life, the common causes are:

- Hormonal imbalance, especially **PCOS**
- **Thyroid** problems or high **prolactin**
- Excessive weight gain, or excessive weight loss
- **Stress**, physical or emotional

> "Stress has an important role to play. It affects the HPO axis, which leads to irregular ovulation and irregular periods."
> — Dr. Poonam Gupta

## 2. PCOS: from a small textbook column to a new-age epidemic

When Dr. Poonam was a student, PCOD was a tiny column in her textbook. "Now it's a huge topic," she said. She calls it **"a new-age pandemic"**.

**PCOD and PCOS are not two different diseases.** They are points on the same spectrum. In the ovary, many small follicles form, often in a typical "necklace" pattern, but none of them matures properly. So ovulation doesn't happen regularly, and periods become irregular. When **metabolic problems** are added, such as weight gain and insulin resistance, it is called **PCOS (polycystic ovary syndrome)**. That can bring acne, excess hair growth, abnormal cholesterol, and a higher risk of **diabetes and high blood pressure** later in life.

Why is it rising so fast? Our host asked whether it was lifestyle, and Dr. Poonam agreed. Processed food full of high-glycaemic carbohydrates and fats, sedentary routines and stress (which often means stress-eating) drive weight gain and insulin resistance, which in turn disrupt ovulation. "It's a vicious circle," she said, "and we need to break it."

**How do you break it?** Medicines can regularise periods, but they don't fix the root cause. The cornerstone of treatment is lifestyle:

- **Fibre-rich food** and mindful eating
- **Moderate exercise, at least five days a week for 30 to 45 minutes**
- **Yoga**, which helps release feel-good chemicals like dopamine, serotonin and endorphins, lifting mood and lowering stress
- **Enough sleep, on time**, and less stress
- Medication when needed, on top of these, not instead of them

:::context The bigger picture
The World Health Organization estimates that PCOS affects around **1 in 10 women of reproductive age** worldwide, and that **up to 70% of women with PCOS are undiagnosed**. Indian studies report figures across a wide range depending on the criteria used, but doctors across the country describe the same trend: more young women, at younger ages. Because PCOS raises long-term risks like diabetes, an early diagnosis is about far more than periods.
:::

## 3. Painful or heavy periods: when it's more than "normal"

Too many women are told to just take a painkiller and carry on. Dr. Poonam explained that painful periods (**dysmenorrhoea**) come in two types.

**Primary dysmenorrhoea** has no underlying disease. Chemicals called **prostaglandins** cause the muscles and blood vessels of the uterus to spasm, giving that cramping pain, often with backache. A hot water bag, a warm bath and moderate exercise help, and if they don't, a doctor may prescribe anti-inflammatory painkillers or hormonal pills.

**Secondary dysmenorrhoea** is caused by a problem in or around the uterus, such as **endometriosis, pelvic infection (PID) or fibroids**, and the bleeding is often heavy too. Treatment then depends on the cause.

:::help See a doctor if your period...
- Is so painful or heavy that it **interferes with your daily routine**
- **Lasts more than seven days**
- Needs a **pad change every one to two hours**
- Makes you **wake up two or three times a night** to change pads
- Is leaving you **anaemic**, tired or breathless
- Isn't relieved by simple measures like heat, rest and exercise
:::

## 4. Planning a baby? Start three months before

Most women first see a gynaecologist after they're already pregnant. Dr. Poonam wishes more couples came earlier, for **preconception counselling**.

> "If they come before they conceive, that's a very good thing. We can check their health, their lifestyle, their weight, and prepare them, so the outcome is good for the mother and for a healthy baby."
> — Dr. Poonam Gupta

What a preconception visit can include:

- **Folic acid, started three months before trying.** This B vitamin helps the baby's brain and spinal cord form properly. By the time most women discover they're pregnant (at six to eight weeks), the nervous system has already started forming, which is why it needs to be in your body *before* you conceive.
- **Iron** if you're anaemic, so you go into pregnancy with good haemoglobin.
- **Weight management**, if needed.
- **Blood sugar testing**, especially as more women plan pregnancies later and diabetes is more common.
- **Vaccinations** due before pregnancy.
- **Genetic counselling** if there is a family history of conditions like thalassaemia or Down syndrome.

:::context The bigger picture
Taking folic acid before and in early pregnancy is one of the simplest, cheapest steps in all of medicine. Health agencies estimate it can prevent **up to 70% of neural tube defects**, serious birth defects of the brain and spine. India still has one of the higher rates of these defects in the world, which is why doctors keep repeating this advice.
:::

**Finding your fertile window.** The most common myth is that every woman ovulates on day 14. In fact, ovulation usually happens **about 14 days before your next period**. It is the first half of the cycle that varies.

- **28-day cycle:** ovulation around day 14
- **21-day cycle:** ovulation around day 7
- **35-day cycle:** ovulation around day 21

An egg survives for only **12 to 24 hours** after release, while sperm can survive for **three, and sometimes up to five, days**. So the days just before and around ovulation are your fertile window, when the chances of conceiving are highest. Tracking your own average cycle length is the first step.

## 5. The biological clock, egg freezing and ovarian reserve

Today, many women marry in their late twenties or thirties and plan a baby even later, putting their education and careers first. Dr. Poonam was clear that she isn't telling anyone to give that up. But she wants couples to plan with the facts.

> "There is a biological clock in women which is ticking day by day. Of course, prioritise your career. But take this into consideration too."
> — Dr. Poonam Gupta

Biologically, she says, **the twenties and early thirties** are the ideal time for a pregnancy. Here's why the clock matters:

- A baby girl is born with roughly **1 to 2 million eggs**, and that's all she will ever have. The ovaries can't make new ones.
- By puberty, that falls to roughly **3 to 5 lakh**.
- Over a lifetime, only about **300 to 500** are actually ovulated.
- After **35**, and especially after 40, both the **number and the quality** of eggs fall. Conception becomes harder, the risk of **miscarriage** rises, and so does the chance of **chromosomal problems** in the baby.

**Egg freezing.** For married couples, freezing embryos is well established. **Egg freezing**, sometimes called "social egg freezing", is newer and, Dr. Poonam says, a very good option for women who want to delay motherhood, especially single women focused on their careers. It effectively pauses the clock on those eggs.

> "If you freeze your eggs at 25, the age of the egg will be 25, not 40, when you use it."
> — Dr. Poonam Gupta

Some important details from the conversation:

- **When:** ideally between **25 and 30**, when egg quantity and quality are good. Don't wait until 35 or 40.
- **How:** the ovaries are stimulated with medicines, the eggs are collected in a minor procedure with a fine needle, and they're frozen in liquid nitrogen at **minus 196°C**.
- **How long:** in India, eggs can typically be stored for up to about **10 years**.
- **Cost (approximate):** around **₹1.2 to 1.5 lakh per cycle**, plus about **₹30,000 to ₹40,000 a year for storage**. Older women may need two or three cycles to collect enough eggs.
- **Recovery:** a few days of rest, not weeks. There may be some pain or bleeding.

Some global companies now even cover egg freezing as an employee benefit.

**Ovarian reserve test.** If you want to know where you stand, a simple combination of tests can estimate how many eggs you have left: an **AMH (anti-Müllerian hormone) blood test**, an **FSH test** on day two or three of your period, and an **ultrasound for the antral follicle count (AFC)**. Read together with your age, they help you decide whether to plan sooner, freeze eggs, or expect to need help later.

**When the ovaries stop early.** If the ovaries slow down before the age of 40, it's called **premature ovarian insufficiency** (or failure, if they stop completely). The symptoms are like menopause but often more intense: hot flushes, mood changes, anxiety, vaginal dryness and urinary problems, along with infertility and higher risks to **bone and heart health**. Lifestyle plays a part here too. Chemicals in cigarette smoke, such as nicotine and carbon monoxide, are toxic to the ovaries, and **smokers tend to reach menopause earlier**. Alcohol disturbs hormones as well.

Other causes of ovulation stopping include PCOS, thyroid problems, uncontrolled diabetes, stress, extreme weight gain or loss, over-exercising, and, Dr. Poonam added, increasingly, environmental toxins such as microplastics and the chemicals in some non-stick cookware.

## 6. Infertility and IVF: when to seek help, and the myths to drop

Our host said what many young couples feel: very few people around her seem to be conceiving naturally. So when should you see a doctor?

:::help When to seek medical help for conceiving
- **Under 35:** after **12 months** of regular unprotected sex without conceiving
- **35 or older:** after **6 months**
- **Straight away** if there is a known problem, such as irregular periods, PCOS, a thyroid condition or previous pelvic surgery
:::

Seeing a doctor does **not** mean jumping to IVF. Dr. Poonam described a step-by-step ladder:

1. **Evaluate both partners.** That includes a **semen analysis for the man**. Fertility is a couple's issue, not just the woman's.
2. **Fix what's fixable.** Sometimes couples simply don't know their fertile days. Losing weight can restart ovulation. Correcting a thyroid problem can be enough for a natural pregnancy.
3. **Ovulation induction**, with medicines that help the ovaries release an egg.
4. **IUI (intrauterine insemination)**, where washed, good-quality sperm is placed directly in the uterus.
5. **IVF**, as the last step, unless the cause demands it earlier. For example, if **both fallopian tubes are blocked**, the egg can't reach the uterus, so IVF is the only route.

**The IVF myths, busted**

- **"IVF is 100% successful."** No. Even in the best hands, success is around **40 to 60%** per attempt, depending largely on age.
- **"If the first IVF fails, the next will too."** Not true. Some couples need **two or three cycles**.
- **"IVF always means twins."** Twins are more common with IVF, but not guaranteed.
- **"IVF babies are abnormal."** Not true. The risk of genetic problems depends mainly on the mother's age and egg quality, not on IVF itself. Every pregnancy carries a small background risk, which is why screening is done during pregnancy.

IVF pregnancies are treated as more closely monitored, "precious" pregnancies, with more frequent check-ups, especially if the mother is older or has diabetes, high blood pressure or PCOS. When IVF babies need extra care, it's usually because of prematurity or twin pregnancies, not because of IVF itself.

IVF also takes a heavy **emotional and financial toll**. Before starting, Dr. Poonam sits down with every couple to explain three things: the realistic success rate, the full cost, and why IVF is needed in their particular case. Then the couple makes an **informed decision**.

And stress? It's the advice everyone hates hearing, but Dr. Poonam has seen it play out: couples who stop treatment for a few months, relax, and then conceive naturally. Her tips are simple: protect your work-life balance, sleep well, eat well, and make space for yoga or meditation.

:::context The bigger picture
According to the WHO, around **1 in 6 adults worldwide** experiences infertility at some point in their lives. It is not rare, and it is not "a woman's problem": male factors contribute to a large share of cases. India's **ART (Regulation) Act, 2021** now regulates IVF clinics and egg and embryo banks, so it's worth checking that any clinic you choose is registered.
:::

[[watch:LAlagU6xhUE]]

[[part Part 2 · Pregnancy, delivery, postpartum and menopause]]

## 7. Pregnancy: normal life, with a little extra care

The first thing Dr. Poonam wants every expecting mother to hear is reassuring: **pregnancy is a natural, physiological process, not an illness.** Most women can carry on with most of their routine, with a few small changes.

- See a doctor as soon as you know you're pregnant.
- Start **folic acid** immediately if you haven't already.
- Rest well, avoid stress, and eat a **balanced diet, mindfully**.
- **No smoking and no alcohol**, at any stage of pregnancy.
- **Walking** is the best exercise during pregnancy.

**How much weight should you gain?** There is no single number. It depends on your weight *before* pregnancy:

- **Underweight:** about 12 to 18 kg
- **Normal weight:** about 10 to 15 kg
- **Overweight:** about 6 to 10 kg
- **Obese:** about 5 to 7 kg

Gaining much more than this needs attention, because it can come with risks like **high blood pressure**. The fix is usually simple: fewer fatty foods, good protein, mindful portions and a daily walk.

**The first trimester (weeks 1 to 12)** is when the body adjusts to a flood of hormones. Some women barely notice. Others struggle with:

- **Tiredness**, the most common symptom: "I want to sleep all the time"
- Constipation and frequent urination
- Food cravings and aversions
- Breast discomfort
- **Morning sickness**, which, despite its name, can strike at any time of day

For mild symptoms, Dr. Poonam's advice is to understand that they come from hormonal changes, stay positive, eat **small, frequent meals** of whatever you can manage, and lean on your husband and family. But if vomiting is severe and you can't keep food or fluids down (a condition called *hyperemesis gravidarum*), you need medical attention.

Iron supplements usually start **after** the first trimester, because they can make nausea worse. If they cause constipation, whole grains, fibre and plenty of fluids help, and your doctor can change the preparation.

**Your check-ups and tests, trimester by trimester**

- **First trimester:** an ultrasound at around six to eight weeks to confirm the pregnancy is viable and the heartbeat has started. Blood tests for blood group (if the mother is Rh negative, the husband's is checked too), haemoglobin, sugar, thyroid, HIV, hepatitis B, urine, and **thalassaemia screening**. Then, between **11 and 13 weeks**, the **NT scan and double marker** test.
- **Second trimester (13 to 28 weeks):** a detailed **level 2 anomaly scan**, a **foetal echo** to check the baby's heart (around 20 to 24 weeks), **diabetes screening** and another haemoglobin check. Visits are usually every three to four weeks.
- **Third trimester:** growth scans as needed, another haemoglobin check, and **weekly visits after 36 weeks**.

Dr. Poonam calls the second trimester **"the golden period of pregnancy"**. Morning sickness has usually passed, appetite returns, and it's the best time to travel if you want to.

:::context The bigger picture
Anaemia is one of the biggest threats to Indian mothers. According to the National Family Health Survey (NFHS-5, 2019–21), **more than half of pregnant women in India are anaemic**. That's why haemoglobin is checked again and again through pregnancy, and why iron and a good diet matter so much for both mother and baby.
:::

**Two practical questions every mother asks**

**Where is my placenta, and does it matter?** The placenta is a temporary organ that carries oxygen and nutrients from mother to baby and takes waste away. It normally attaches in the upper part of the uterus. In early pregnancy, it's often low, and usually moves up as the uterus grows, so a "low-lying placenta" on an early scan is a word of caution, not a cause for panic. If it is still low **after eight months**, it's called **placenta previa**. It can cause serious bleeding, and if it covers the mouth of the uterus, a normal delivery is impossible, so a **C-section is the only safe option**. Another condition, **placental abruption**, is when the placenta separates from the wall early, which can also cause bleeding and reduce the baby's supply.

**Why sleep on your left side?** Two major blood vessels run along your back. When you lie flat, the weight of the uterus presses on them, especially the main vein returning blood from the legs. Lying on your **left side** shifts that weight, improves circulation to you and to the baby, and also reduces swelling in the feet.

## 8. Normal delivery or C-section? The honest answer

Our host didn't hold back here. The WHO has long suggested that caesarean rates above about **15%** don't bring extra benefits to mothers and babies. Yet in many private hospitals in India, rates have crossed **40%**. Why?

Dr. Poonam explained that there are real reasons behind part of the rise: women are becoming mothers later, and with age come more **diabetes, high blood pressure** and growth problems in the baby. Diabetes can also mean a very large baby, which makes a normal delivery riskier.

**Normal (vaginal) delivery is the preferred mode in most cases**, and it has many advantages:

- Faster recovery and a shorter hospital stay
- Fewer complications in general
- Better early **bonding and breastfeeding**
- The baby is exposed to the mother's good bacteria, which supports immunity
- Fewer breathing problems for the baby

It can also have complications, such as a prolonged labour, the need for instruments, or tears.

**A C-section becomes necessary when a normal delivery isn't possible, or would put the mother or baby at risk:**

- **Foetal distress**, when the baby's heartbeat drops
- Labour that doesn't progress in the expected time
- **Cord prolapse**, when the umbilical cord slips down first
- The baby is **breech** (bottom first) or lying sideways
- **Placenta previa**
- The baby is too big for the mother's pelvis (**cephalopelvic disproportion**)

A C-section is major surgery, with risks from the operation and anaesthesia, urinary or wound infection, a longer stay, harder early breastfeeding, and possible problems in future pregnancies.

**So, are doctors pushing C-sections for profit?** Dr. Poonam answered directly:

> "This is not right. That's why, from the very start of pregnancy, I counsel my patients on how to stay active so they can deliver normally. And I explain, to the husband and family too, the situations in which, despite everything being normal, something can arise during labour that makes a C-section necessary."
> — Dr. Poonam Gupta

She also sees many women **asking** for a C-section, out of fear of labour pain, wanting a scheduled date, worry about risk to the baby, or a bad previous birth. There is even a medical term for it: *caesarean on maternal request*. Her approach is to explain the benefits of a natural birth, and to perform a C-section when there is a genuine need.

And she had a firm message for anyone who judges a mother for having one:

> "A normal birth is seen as more natural, more feminine. Sometimes a woman is judged, as if she couldn't bear the pain. That negative judgment is not right."
> — Dr. Poonam Gupta

:::context The bigger picture
According to NFHS-5, about **1 in 5 births in India** is now a caesarean, but the gap between hospitals is striking: around **14% in public facilities versus about 47% in private ones**. Some C-sections save lives. But the gap is a good reason to ask your doctor early about their approach, and about what would make a C-section necessary in your case.
:::

## 9. After the birth: panjiri, food myths and recovery

**Do the traditional laddoos and panjiri really help?** Dr. Poonam was all praise for this age-old Indian tradition, with one condition.

The ingredients each have a purpose. **Desi ghee** is concentrated energy and nourishes the nervous system. **Dry fruits** give protein, omega-3 fatty acids and nutrients. **Jaggery** contains iron, which helps make up for blood loss. **Gond** (edible gum) supports bones and joints, which loosen during pregnancy. **Ginger and turmeric** help digestion.

> "Every component has a defined role, and it's a very good snack. But moderation is the key. Control the portion, stay a little active, and it's good. Eat too much, and of course you'll gain weight."
> — Dr. Poonam Gupta

**"Don't eat roti or rice, it'll upset the baby."** This is a myth. Whole-grain roti is actually good, because it's rich in fibre. A breastfeeding mother needs **good calories and every food group**. Many households give new mothers only dalia and khichdi for weeks, and, as Dr. Poonam put it, "nobody can live on that for long." If the mother eats well, the baby gets good nutrition through her milk.

**When can you get moving again?** Gentle walking and normal routine activities, including caring for the baby, can start soon after delivery, gradually, whether it was a normal birth or a C-section. Formal **exercise can begin after about six to eight weeks**, slowly. And the most underrated advice of all: **when the baby sleeps, you sleep.**

**"My back pain is because of the C-section injection."** Another myth. Back pain is just as common after normal deliveries. During pregnancy, the body's centre of gravity shifts forward, the spine changes shape to compensate, and the ligaments and pelvic joints loosen to prepare for delivery. Posture, gentle massage, a good diet and exercise help, not blaming the spinal anaesthesia.

## 10. Breastfeeding, bonding and postpartum depression

**Skin-to-skin contact**, placing the baby directly on the mother's (or father's) bare chest after birth, has many benefits. It keeps the baby warm, steadies its breathing and heart rate, starts breastfeeding earlier, helps the baby sleep better, and lowers stress for both mother and baby.

And fathers should absolutely join in:

> "When the father is involved in baby care, father-infant bonding is better, the mother feels more confident, and it really helps a husband grow into the role of a father."
> — Dr. Poonam Gupta

**Exclusive breastfeeding for six months.** That means **nothing else**: no water, honey or *ghutti*. Breast milk is a complete food, and its antibodies protect the baby from common illnesses like **diarrhoea and chest infections**. It helps the mother too, with weight loss, a lower chance of the "baby blues", and **a lower risk of breast cancer** in women who breastfeed longer. It also offers some natural protection against pregnancy by suppressing ovulation, though Dr. Poonam stressed it is **not a reliable method of contraception** on its own.

**Struggling with low milk supply?** The most powerful signal is the simplest: **feed the baby every one to two hours**. Every time the breast is emptied, the brain gets the message to make more milk. Fibre-rich food, whole grains, **ajwain, jeera or saunf water**, and a little ginger and garlic in the diet also help. And no, moderate exercise doesn't reduce milk supply.

**Postpartum depression.** Our host raised something many families miss. A new mother feeding every two hours, barely sleeping and getting no time for herself can begin to struggle, and it shows in her behaviour. Dr. Poonam described three levels:

1. **Baby blues**, the mildest: anxiety, frequent crying, poor sleep. With support from the husband and family, most women overcome it.
2. **Postpartum depression**: intense anxiety and sadness, crying spells, and sometimes thoughts of harming herself or the baby. Counselling and family support are essential, and medicines may be needed.
3. **Postpartum psychosis**, the most severe form, which needs urgent medical treatment.

> "We need to understand that the mother is also new. She's struggling with motherhood and baby care too."
> — Dr. Poonam Gupta

Balanced food, gentle walks and moderate exercise help by releasing "happy hormones". But this is not a phase to "push through" alone.

:::help If you, or a new mother you know, is struggling
- Talk about it openly with your partner, family and doctor. **It is not weakness, and it is not your fault.**
- Seek help immediately if there are thoughts of self-harm or harming the baby.
- In India, you can call the free government mental health helpline **Tele-MANAS on 14416** (or 1-800-891-4416), any time, in multiple languages.
:::

:::context The bigger picture
Postpartum depression is far more common than most families realise. Studies in India have estimated that it affects **around one in five new mothers**, and much of it goes undiagnosed because it's dismissed as tiredness or "mood". A partner who notices and steps in can make all the difference.
:::

**It's not the mother who decides "boy or girl".** Sitting on our forum, Dr. Poonam wanted to send one message loud and clear. In many Indian homes, the mother is blamed when a girl is born. Biology says the exact opposite. A mother's egg always carries an **X** chromosome. The father's sperm carries **either an X or a Y**. X from the father means a girl. Y means a boy.

> "It is the husband who decides whether the child will be a girl or a boy. The mother has just gone through labour, delivery and breastfeeding. This is the time to give her love and care, not blame."
> — Dr. Poonam Gupta

## 11. Menopause, cervical cancer and the taboos we must break

**Menopause** usually arrives between **45 and 50**. It's confirmed when periods have stopped for **12 months in a row**, so it can only be diagnosed looking back. The years leading up to it, which can last **two to eight years**, are called **perimenopause**, when changes begin.

Common symptoms include **hot flushes, mood swings, brain fog, vaginal dryness and urinary problems**, along with longer-term risks to **bone strength (osteoporosis) and the heart**.

**The menopause myths Dr. Poonam wants to bust:**

- "There's no treatment for the symptoms." There is.
- "Weight gain after menopause is unavoidable." It isn't.
- "Your active life ends with menopause." It doesn't.
- "Hormone therapy is always dangerous." Menopausal hormone therapy is a valid option for many women, and the decision should be made with a doctor, based on your own risks.

:::context The bigger picture
Indian women tend to reach menopause a few years earlier than women in the West, often in their mid to late forties. With life expectancy rising, many women will now spend **a third of their lives after menopause**, which is exactly why it deserves open conversation and good care, not silence.
:::

**Cervical cancer: preventable, yet still common.** Cancer of the cervix, the mouth of the uterus, is one of the most common cancers in Indian women. Because it develops in a hidden part of the body, it's often found late. That's why screening matters so much:

- **Pap smear** (or liquid-based cytology): every **three years**, from about age **21**
- **Co-testing with an HPV test** after **30**: every **five years**
- Continue screening until about **65**

And there is a vaccine. The **HPV vaccine** prevents most cervical cancers. It works best when given between **9 and 15**, can be given up to **26**, and in some cases up to **45**. It's now recommended for **boys as well as girls**, since HPV affects both.

:::context The bigger picture
Cervical cancer is the **second most common cancer among Indian women**, with well over a lakh new cases and tens of thousands of deaths every year. Most of these are preventable. India now has its own HPV vaccine, and the WHO has said a single dose can offer strong protection for girls. If you have a daughter between 9 and 14, it's worth asking your doctor about it today.
:::

**The taboos that still hurt women**

**Menstrual shame.** Periods are still treated as impure, hidden behind code words. Dr. Poonam wants girls, their peers and their parents to be educated so a girl can manage her periods **with confidence**, and for schools and public places to provide sanitary pads and proper disposal.

> "There is nothing shameful about menstruation. It is a normal part of a girl's growth."
> — Dr. Poonam Gupta

**Urinary incontinence**, the involuntary leaking of urine, is another silent struggle. It comes in two forms: **urgency** (you can't reach the washroom in time) and **stress incontinence** (a few drops leak when you cough, sneeze or laugh). It's common after childbirth and after menopause. Many women feel something is wrong with them, hide it even from close family, and gradually stop going out.

It is treatable. **Pelvic floor (Kegel) exercises**, weight loss if needed, and cutting down on **caffeine** often help. Beyond that, there's physiotherapy, laser therapy and medication, with surgery as the last resort. The first step, though, is simply talking about it.

Asked which myth about women's health she most wants to break, Dr. Poonam answered:

> "No one size fits all, and no one size defines women's health. A woman can be fit, confident and empowered at any age and any size."
> — Dr. Poonam Gupta

## The one thing to remember

If there's a single thread running through both conversations, it's this: **most of the suffering comes from silence, not from the conditions themselves.** PCOS can be managed. Painful periods can be treated. Infertility often has a fixable cause. Postpartum depression gets better with support. Cervical cancer can be prevented. Incontinence can be treated. But only if someone speaks up.

So ask the questions. Track your cycle. See a doctor before you plan a pregnancy, not just after. Support the new mother in your home. Get your daughter vaccinated. And share these episodes with the women in your life, **and the men**.

:::thanks A heartfelt thank you
Dr. Poonam Gupta gave us two long conversations' worth of her time and decades of experience, and explained some of the most sensitive topics in medicine with remarkable warmth and clarity. She didn't dodge the hard questions, from C-section rates to the blame mothers face for having a girl, and she used our platform to send messages that many families need to hear. Thank you, Doctor, for making this knowledge so accessible. This series will help many women, and many families, ask the right questions at the right time.
:::

:::takeaways Key takeaways
1. A normal cycle is anywhere from 21 to 35 days. See a doctor if yours falls outside that, or changes from your normal.
2. PCOS is rising fast. Diet, exercise, sleep and stress control are the foundation of treatment, not just pills.
3. Start folic acid three months before trying to conceive, and know your fertile window.
4. Fertility falls after 35. Under 35, seek help after a year of trying; over 35, after six months. Egg freezing works best between 25 and 30.
5. IVF is a last step, not a first. It's not 100% successful, and IVF babies are not "abnormal".
6. Normal delivery is preferred in most cases, but a needed C-section is nothing to be judged for.
7. Breastfeed exclusively for six months, eat well (roti included), and enjoy the panjiri in moderation.
8. Postpartum depression is real and treatable. Call Tele-MANAS (14416) if a mother is struggling.
9. It's the father's chromosome that decides a baby's sex. Never blame the mother.
10. Get regular Pap or HPV screening, and vaccinate children against HPV between 9 and 15.
:::

:::note
This article summarises the views our guest shared on the show and is for awareness only. It is not a substitute for professional medical advice, diagnosis or treatment. Every woman's body and history is different, so please consult a qualified doctor about your own health. Quotes are translated and lightly condensed from the original conversations.
:::
`,
  },
  {
    slug: "what-is-satsang",
    title: "What Is Satsang, Really? 38 Years on the Radha Soami Path",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Spiritual escape or waste of time? A follower of 38 years on what satsang actually means, the three disciplines, balancing family and a demanding job, and why contentment beats the endless chase for more.",
    cover: "",
    video: "Wlg7mH0H8mo",
    body: `
Look around any office, metro coach or family WhatsApp group today and you'll see the same thing: people who have more information, more options and more comforts than any generation before them, and less peace. We scroll to relax and end up more restless. We earn more and still feel it isn't enough. We have hundreds of contacts and almost nobody to sit with quietly.

This isn't just a feeling. In an Ipsos survey, **one in two urban Indians (53%)** said they had experienced stress severe enough to affect their daily life in the past year.

So people go looking. Some try apps and retreats. Some return to the temple or the gurdwara. And many, often quietly, end up at a **satsang**. To outsiders, satsang is a bit of a mystery. Some call it a spiritual escape. Some call it a waste of time. Some assume it is only for the very religious or the very old.

To understand what actually happens there, host Lalit Sharma sat down with a guest who has been attending satsang for **38 years**, since 1986. He follows the **Radha Soami Satsang Beas** path, worked for decades in a demanding job that took him through audit postings and transfers far from home, and is now retired. He spoke with complete sincerity, and at times with so much emotion that he had to pause.

:::summary In this conversation
- What "satsang" actually means
- How he found it, and why he never walked away
- The three disciplines, and how the practice differs from ritual
- Balancing family, a demanding job and spiritual life
- Stress, karma and the meaning of contentment
:::

[[watch]]

## 1. What "satsang" actually means

Our guest started with the word itself. **Sat** means truth, and **sang** means company. Satsang is "the company of truth".

And in his understanding, only one thing is truly permanent:

> "Everything you can see with these eyes will perish one day. The only truth is the Supreme. It was there before creation, it is here now, and it will be there when everything else is gone."
> — Our guest

Whatever you call it, God, Naam, Shabd or the Supreme, satsang for him means keeping company with that truth, and with people who are trying to live by it.

The gathering itself is simple. A speaker reads a hymn or verse from one of the saints, explains what it means, and relates it to everyday life. People listen, often in silence. There is no performance and no spectacle.

:::context The bigger picture
Radha Soami Satsang Beas traces its roots to 1891, when its main centre was established on the banks of the Beas river in Punjab. Today it holds meetings in more than 90 countries. It describes itself as open to people of every caste, colour and creed, and places strong emphasis on meditation and *seva*, or selfless service.
:::

## 2. How he found satsang, and why he never left

His journey began with doubt, not devotion. His elder brother, who worked at State Bank of India, had started going to satsang first. The two never discussed it, and what our guest heard second-hand put him off completely. He'd been told that satsang taught people that only the Guru mattered, and that parents, brothers and sisters meant nothing. He was firmly against that idea.

And yet, one day, he decided to go. He walked his brother to the railway station just to tell him, in a two-minute conversation on the way, "This time, I'll come to satsang too."

He went, stood in line, registered for initiation (called *naam daan*), and has never looked back. In nearly four decades, he says, he never once felt like quitting.

> "When you get benefit from something, when you feel peace inside, your attachment to it grows on its own."
> — Our guest

His explanation was surprisingly practical. A child learns by following a teacher. A new businessman succeeds more often when he learns from someone experienced and follows the rules. Spiritual practice is the same: if you meditate for the time, in the posture and in the way you've been taught, he says, you begin to see the results you were promised.

In 1995, he also began **seva**, volunteering at satsang gatherings that can draw lakhs of people. Seva means doing whatever work you are given, without choosing what you like:

> "No seva is small and no seva is big. The main purpose of seva is to end your own ego."
> — Our guest

:::context The bigger picture
Modern research tends to agree with something spiritual traditions have long said about service. Studies on volunteering consistently link regularly giving your time to others with lower stress, a stronger sense of purpose and greater life satisfaction.
:::

## 3. The three disciplines, and a practice without ritual

Lalit asked about the core principles. Our guest explained them with a doctor's analogy. When you're ill, the doctor gives you medicine and tells you what to avoid. Take both seriously and you recover faster. Skip either and recovery takes longer.

On his path, there are three things to avoid:

1. **No intoxicants** of any kind, including alcohol.
2. **No meat or non-vegetarian food**, in any form.
3. **An upright, moral life.**

Alongside these comes the "medicine": daily meditation, done in the way it is taught at initiation.

He also explained how the practice differs from what many people grow up with. On this path, he said, there is no emphasis on idol worship, pilgrimages, paid offerings or ritual bathing to "cut" bad karma. The practice is entirely inward. Money is never compulsory either:

> "Any work needs money, we know that. But nobody is told you must give this much, or that you must give at all. If you give, fine. If you don't, that's fine too."
> — Our guest

Lalit was candid that on some of these comparisons, the two of them would simply see things differently, and moved on. That felt like the right spirit for the whole conversation: understanding, not converting.

His one piece of caution was worth hearing for anyone who is searching. Many people in pain, he said, go wherever someone promises a quick fix in exchange for money, and too often, the problem doesn't get solved. A place that pressures you to pay is not one he would trust.

## 4. Family first, then satsang: the balance

One of the biggest misconceptions about spiritual paths is that they ask you to give up the world. Our guest was emphatic that satsang says the opposite.

> "Satsang never says leave your home, stop earning, go to the jungle and become a sadhu. You can live with your family and still progress beautifully on the spiritual path."
> — Our guest

The priorities, as he lives them, are clear:

- **Your family comes first.** If a family member needs a doctor at the same time as satsang, you go to the doctor. "Satsang is for your whole life. If you miss one, you miss one."
- **Your livelihood comes next.** "A job is how we put food on the table. Leaving your family hungry to go to satsang would be foolish."
- **Honest earnings.** He was taught to earn only by honest means, and never in a way that hurts anyone else.

His own career tested this. As a clerk, getting leave was easy. After promotion, it got harder. Postings in audit work, with constant deadlines, and a transfer to faraway Gujarat meant he often couldn't attend. His answer was simple acceptance: apply for leave, request it, and if it isn't granted, don't go. "That is the balance."

He sees the same pattern across his family. Unusually, satsang came "upwards" in his home: first his elder brother, then him, then his parents, then his younger brother. Today, he says, more than 70% of his relatives follow the path, and **nobody was ever pressured**, not his children, neighbours, friends or relatives.

> "The teaching is the same for everyone: father, son, grandfather, grandson. What differs is how much each person takes in."
> — Our guest

## 5. Stress, karma and the stories that moved him to tears

How does satsang help people who are stressed and distracted? For our guest, the answer lies in how he understands suffering. In his view, both our joys and our difficulties are the results of our own past karma. Understanding that, he says, doesn't make the pain disappear, but it lets you go through it with acceptance, and even with a smile.

He also believes deeply that people come to satsang when the time is right for them, not because someone persuaded them. Sometimes it is the people who criticised it the loudest who end up finding peace there.

He shared stories that followers on his path tell, and became visibly emotional telling them. In one, a poor widow in Rajasthan wanted to travel to satsang but couldn't afford the bus fare. Her only possession worth selling was a stack of cow-dung cakes she used for fuel, and nobody would buy it, until, at the last moment, a stranger came and paid more than she asked. When she reached satsang and saw the Master, she cried out that he was the man who had bought her dung cakes.

In another, a daily-wage labourer who couldn't find work joined volunteers at a satsang centre, thinking it was a paid job. For three days he worked, was fed, and was never paid, because the "Malik" (as followers call the Master) never came. On the third night he went home to find a month's rations delivered to his family by a stranger, whose photograph, the next day, his wife recognised hanging at the gate of the satsang centre.

Lalit gently raised the obvious question: couldn't some of this be coincidence? Our guest didn't argue. "You can call it coincidence, or call it anything you like," he said. For him, these experiences are what assure him that his Guru is with him, and if he started listing them, he said, it would take days.

:::context The bigger picture
Whatever your view of faith, the effects of a regular, quiet inner practice are well studied. A large review in *JAMA Internal Medicine*, covering 47 trials, found moderate evidence that meditation programmes can help reduce anxiety, depression and pain. Researchers also point to community and a sense of meaning as strong protectors against stress and loneliness.
:::

## Contentment: the real measure

Lalit closed by asking how our guest defines fulfilment. His answer is perhaps the most useful line of the whole conversation, whatever your beliefs:

> "Desire is never satisfied. The man with a thousand thinks two thousand is big. The man with a lakh looks at the crorepati, and the crorepati looks at the billionaire. Fulfil one wish, and the next one starts."
> — Our guest

Psychologists have a name for this, the "hedonic treadmill": we quickly get used to every gain and start chasing the next. Our guest's answer to it is contentment. Those who follow satsang seriously, he says, feel they have received what they needed, and more.

> "I know what my ability is, and how much I could have achieved without satsang. What I have received is far more than that."
> — Our guest

:::thanks A heartfelt thank you
It isn't easy to speak about faith on camera, especially about experiences that are deeply personal and that others may question. Our guest did so with complete honesty, without trying to convince anyone, and with emotion he didn't try to hide. At the end, he apologised for getting sentimental. There was nothing to apologise for. Thank you for sharing 38 years of your journey with us, and for reminding us that peace is something you practise, not something you buy.
:::

:::takeaways Key takeaways
1. Satsang means "the company of truth": listening, reflecting and meditating together.
2. On the Radha Soami path, the disciplines are no intoxicants, no meat and an upright moral life, along with daily meditation.
3. The focus is inward practice, not rituals, idol worship or paid offerings, and giving money is never compulsory.
4. Spiritual life doesn't mean leaving the world: family comes first, honest work next.
5. Seva, or selfless service, is meant to dissolve the ego, and no seva is big or small.
6. Real fulfilment comes from contentment, not from the next thing on the list.
:::

:::note
This article summarises the personal beliefs and experiences our guest shared on the show. The stories in it are told as he shared them, and the article does not promote any organisation or ask anyone to change their faith. We respect every path. If you are going through a difficult time, please also reach out to people you trust or a qualified professional. Quotes are translated and lightly condensed from the original Hindi conversation.
:::
`,
  },
  {
    slug: "sweden-dream-vs-reality",
    title: "Sweden: Dream Destination or Harsh Reality? An Indian Family's Honest Account",
    date: "2026-10-18",
    category: "Episode Notes",
    excerpt:
      "Free children's healthcare, 4pm finishes and a system you can trust, but also 30% tax, a brutal housing market, gang worries and rules that keep tightening. Dakshesh Sharma on six years of Indian family life in Sweden.",
    cover: "",
    video: "dYmflUeeVqM",
    body: `
Every year, lakhs of Indians make the same quiet calculation. The salary has stopped growing as fast as the rent. The commute eats three hours a day. The boss sends messages at 11pm. The children's school fees keep climbing. And somewhere in the back of the mind, a question keeps returning: **would life be better abroad?**

Then comes the confusion. Instagram shows snow-covered cottages and people cycling to work at 4pm. WhatsApp forwards say Europe is falling apart. Relatives who have never left India have strong opinions either way. Almost nobody gives you a straight answer from someone who has actually done it, with a family, and lived with the consequences.

So we asked someone we trust completely. Host Lalit Sharma sat down with **Dakshesh Sharma**, his childhood friend, an electronics and communications engineer who spent about 12 years in telecom and IT companies in India before moving to **Sweden in 2019**. He has lived there through the pandemic, through a change of government and through some of the biggest changes in Swedish immigration rules in decades. He brought his family, built a life there, and was refreshingly honest about both sides.

:::summary In this conversation
- Moving to Sweden: the paperwork, the first month and the housing struggle
- Healthcare and what 30% tax actually buys you
- Work-life balance: why he chose Sweden over Canada
- Safety, gangs and a country that is changing
- Why some Indians are leaving, and the new rules every applicant should know
:::

[[watch]]

## 1. Moving to Sweden: easier than you think, until you look for a house

Dakshesh moved on an **intra-company transfer**. His employer handled the visa and work permit, which is how a large share of Indian tech professionals arrive. What surprised him was how quickly the rest fell into place.

Within about **20 days** of landing, he was entered into the Swedish population register, which gave him his personal identity number. That single number connects everything: tax, healthcare, banking and the children's schooling. And from the moment you are registered, you are covered by the public healthcare system.

> "Within twenty days everything was done: registration, tax, healthcare. From day one, you are part of the system."
> — Dakshesh Sharma

Daily life runs on two quiet pieces of infrastructure that Indians often fall in love with:

- **BankID**, a digital identity on your phone, used to log into your bank, sign contracts, file taxes, book doctor appointments and even sign a rental agreement.
- **One transit card** for buses, metro, trams and local trains. A single ticket is valid for about an hour, so you can switch between them without paying twice. It isn't cheap (a single ride costs around 40 kronor), but it works, and it runs on time.

**Housing is the hard part.** Long-term rentals in cities like Stockholm are notoriously scarce. Much of the rental stock sits in long waiting queues, and many apartments are owned through housing associations (called BRFs) that limit how long an owner can sublet, often to around two years. That means many newcomers move from one short contract to the next.

Buying is a different story. Dakshesh says property sells quickly and the process is clean. When he moved, mortgage rates were extraordinarily low, around **1 to 1.5%** in 2020–21. They have since risen to roughly **3.5%**, which has changed the maths for many families.

:::context The bigger picture
Stockholm's rental shortage is well documented. The city's official housing queue has hundreds of thousands of people registered, and waits for a first-hand contract in central areas can run to many years. That is why most newcomers rent second-hand at first, and why many eventually buy.
:::

## 2. Healthcare, and what 30% tax actually buys you

Indians often hear one thing about Sweden: the taxes are brutal. Dakshesh pays around **30 to 33%** of his income in tax, depending on income and municipality. The question is what you get back, and his answer was the most compelling part of the conversation.

**Children's healthcare is free.** When a friend's young daughter broke her arm, she was treated at Karolinska, one of Europe's best-known hospitals. Dakshesh remembers the details that stayed with the family: cartoons playing, a clown visiting the ward, an artist painting with the children. Nobody asked for a card at the counter.

> "The child was in pain, but the hospital made it feel like a playground. And the bill was zero."
> — Dakshesh Sharma

For adults, visits cost a **small fixed fee**, with tests usually included. Most care starts at your local health centre, the **vårdcentral**. And there is a safety net that Indian families can only dream of: Sweden's **high-cost protection** caps what you pay in a year. Once you hit the limit (around 1,450 kronor for visits and about 2,950 kronor for prescription medicines in 2026, though exact amounts can vary by region), the rest of the year's care within that scheme is free.

Is it perfect? No. Waits for non-urgent care can be long, which is why some people, including some companies' employees, use private insurance for faster appointments and more choice. But nobody goes bankrupt because someone fell ill.

The taxes also pay for things you notice every day:

- **No road tolls** on ordinary roads.
- **Free education** from school through to a master's degree for residents, with **free school lunches**.
- Heavily subsidised **preschool**.
- **Unemployment support** if you lose your job.
- And a detail Dakshesh found moving: legal residents can **vote in municipal elections** after three years, even without citizenship.

> "You pay a lot, but you can see where it goes. Your child's school, your hospital, your road. That changes how you feel about tax."
> — Dakshesh Sharma

## 3. Work-life balance: why he chose Sweden over Canada

Before Sweden, Dakshesh had an offer from Canada. He chose Sweden, and the reason was simple: **time**.

A typical office day runs roughly from **8am to 4pm**. Managers trust people to do their work, without constant check-ins or micromanagement. Most employees get **around 25 to 30 days** of paid leave a year, and taking a long summer break is normal, not a career risk.

> "Nobody watches over your shoulder. You are trusted to do your work, and then you go home to your family."
> — Dakshesh Sharma

That time showed up in his health. With shorter workdays and long summer evenings, when it stays light until almost midnight, he started training regularly and went from **89 kg to 72 kg**.

Culture takes adjusting to. Swedish society runs on **high trust**: people follow rules, keep promises and assume the best of each other. Dakshesh says he has personally never faced racism. But Swedes are quiet and private, and Indians, he laughs, are loud. Phone calls on the train, big family gatherings and dropping by unannounced are things you quickly learn to tone down.

:::context The bigger picture
Sweden regularly ranks among the top ten countries in the World Happiness Report, and OECD data consistently shows Swedish employees working far fewer long hours than the global average. Statutory annual leave is 25 days, and many employers offer more.
:::

## 4. Safety, gangs and a country that is changing

This was the part of the conversation where Dakshesh was most careful, and most honest. Sweden is still a safe country for most people going about their daily lives. But over the past decade it has faced a serious problem with **organised gang crime**, and he didn't want to pretend otherwise.

His biggest worry as a parent is how criminal networks **recruit young teenagers**, sometimes as young as 12 to 14, because children that age face lighter legal consequences. Sweden's strict privacy rules also mean far less CCTV than Indians are used to. He has also noticed more organised burglaries in some areas, and a police force that, in his view, is stretched thin.

:::context The bigger picture
Swedish authorities have openly acknowledged the problem. Prosecutors reported a sharp rise in children under 15 suspected in serious violent cases, and police have described gangs recruiting minors through social media. Sweden has responded with tougher laws, more police funding, wider camera surveillance and stronger powers against gang recruitment. Reported shootings fell sharply in 2025 from their 2022 peak. For most residents, everyday life remains calm, but it is a real issue worth understanding before you move.
:::

Politics has shifted too. The government elected in 2022 has taken a **much harder line on immigration**, and that has changed the mood for many foreigners, including skilled workers who arrived legally and pay full taxes. Dakshesh's view was fair-minded:

> "It's not fair to put every immigrant in the same box. People who come here, work, pay taxes and follow the rules are part of this country too."
> — Dakshesh Sharma

## 5. Why some Indians are leaving, and the new rules you must know

In 2024, headlines in India talked about an "exodus" of Indians from Sweden. The numbers are real: according to Statistics Sweden, the number of Indians leaving rose from about **1,600 in 2022 to about 4,500 in 2024**, while new arrivals fell. (Some of that jump came from a clean-up of the population register, which recorded people who had already left years earlier.)

Dakshesh sees several reasons behind the trend:

- **Salaries back home have caught up.** Since around 2021, senior tech salaries in India have grown fast. With a lower cost of living and household help, many families are financially better off returning.
- **A glass ceiling.** Some Indians feel they reach a point where moving into senior leadership is hard without fluent Swedish and local networks.
- **You do everything yourself.** There are no maids, drivers or cooks on tap. A nanny can cost around **15,000 to 16,000 kronor a month**, so most families manage cooking, cleaning and childcare on their own.
- **The pull of the US.** Some use Sweden as a stepping stone to America.
- **Tighter rules** that make the future feel less certain.

And the rules really have tightened. If you are thinking about Sweden now, these are the changes that matter most:

- **Higher salary thresholds for work permits.** Dakshesh remembers when the minimum was around 13,000 kronor a month. It then rose to 80% of the national median salary, and since **June 2026 new applicants generally need at least 90% of the median, about 33,000 kronor a month**, with some exempted occupations at a lower level. Salaries must also match collective agreements, and unions play a role in checking contracts. Part of the reason, Dakshesh explained, was to close a loophole where some workers were brought in on low-paid jobs and then exploited.
- **A longer road to citizenship.** From June 2026, the general residence requirement for citizenship rose from **five years to eight**, with new requirements on self-sufficiency, conduct, and Swedish language and civics tests being phased in.
- **Swedish is becoming a job requirement.** Dakshesh has noticed more IT job adverts listing Swedish as required, not just "nice to have".

His practical advice: **start learning Swedish early**. The free state-run **SFI (Swedish for Immigrants)** classes, many held in the evenings, are one of the best investments a newcomer can make.

:::context The bigger picture
Sweden is not alone. Several European countries, from Denmark and the Netherlands to Germany, have tightened migration and citizenship rules in recent years, while simultaneously competing for skilled tech and healthcare workers. For Indian professionals, the message is the same everywhere: skills get you in, but language and integration decide how far you go.
:::

## So, dream or reality?

The honest answer from this conversation is: **both**. Sweden gives you time, trust, clean air, free schools and healthcare that won't bankrupt your family. It also asks for high taxes, long dark winters, a tough housing market, doing your own chores, and learning a new language and new rules that keep changing.

> "It depends on what you want from life. If you want time with your family and a system you can trust, Sweden gives you that. If you want to grow fast and live comfortably with help at home, India may be the better choice today."
> — Dakshesh Sharma

:::thanks A heartfelt thank you
Most people who move abroad share only the good parts. Dakshesh shared everything: the paperwork and the healthcare, the taxes and the trust, but also the worries he carries as a parent and the reasons some of his friends have packed up and gone home. He did it without any agenda, simply so that Indian families making this big decision can make it with open eyes. Thank you, Dakshesh, for your honesty and for giving so freely of your time.
:::

:::takeaways Key takeaways
1. An intra-company transfer is one of the smoothest routes into Sweden. Registration, tax and healthcare can be sorted within weeks.
2. Housing is the hardest part. Expect short rental contracts at first, and plan your budget around it.
3. Taxes of around 30% buy free children's healthcare, capped annual medical costs, free education and real social security.
4. Work-life balance is the biggest draw: shorter days, little micromanagement and around five weeks of leave.
5. Gang crime is a real issue Sweden is actively tackling. Research your neighbourhood carefully.
6. Rules have tightened: a work permit now generally needs about 90% of the median salary, and citizenship needs eight years. Start learning Swedish early.
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
      "Back pain at 19, sleepless scrolling, children glued to phones and worry that won't switch off. Neurosurgeon Dr. Arun Tungaria on what our screens are doing to our brains, and what actually helps.",
    cover: "",
    video: "Db8uUA9dlYA",
    body: `
You go to bed tired but lie awake, scrolling. You wake up with a stiff neck and a heavy head. Your mind keeps running through things that haven't happened yet. Your child won't eat unless a video is playing. And when someone asks how you are, you say "fine", because saying anything else feels like admitting something is wrong with you.

If any of that sounds familiar, you're far from alone. India's National Mental Health Survey found that roughly one in ten adults lives with a mental health condition, and that for common problems like anxiety and depression, more than 80% never get any treatment.

In this episode, host Lalit Sharma sat down with **Dr. Arun Tungaria**, a senior neurosurgeon with over 15 years of experience and more than 5,000 surgeries behind him. He runs Shri Krishna Neurospine Hospital in Bikaner and spends his spare time explaining brain and spine health in plain language through his channel, *Neuromate Talks*. He has seen these modern problems turn up in his own clinic, in patients who are getting younger every year.

:::summary In this conversation
- Back pain at 19 and the headache that isn't "just a headache"
- The dopamine "bomb blast": how our phones feed anxiety
- When worry won't switch off: the link between anxiety and depression
- Children and screens: when does normal use become addiction?
- Sleep: the most underrated medicine we have
:::

[[watch]]

## 1. Back pain at 19, and the headache that isn't "just a headache"

Fifteen or twenty years ago, Dr. Tungaria's spine patients were mostly older people whose discs and joints had worn down with age. That has changed.

> "In the last few years, young patients — college-going students, young working adults — have started coming very commonly. In the last five years I've operated on five or six patients who were under 20, for back pain and disc problems."
> — Dr. Arun Tungaria

The reasons he sees are depressingly ordinary: very little physical activity, long hours sitting in front of screens, poor posture, fast food, not drinking enough water, and furniture that isn't built for the body. Neck pain from bending over phones is now the second most common complaint.

**Signs your spine needs attention:**

- Back or neck pain that keeps coming back
- Pain that travels from the lower back into the buttocks, the back of the thighs or the legs
- Tingling or numbness in the hands or feet

He has also seen brain strokes and brain haemorrhages become more common.

Then there's migraine. Migraine is one of the most common conditions in the world, affecting roughly one in seven people, and Lalit pointed to surveys showing it is common among teenagers and young adults in India too. Dr. Tungaria believes rising screen time is making it worse: bright screens and loud music through earphones are classic triggers.

**How to tell it might be migraine:** headache comes in attacks, often with nausea, vomiting, flashing lights or visual disturbances, or numbness, and then goes away completely. It's called *aadha seesi* (half-head) in Hindi, but he stresses it can affect the whole head too.

**What helps:**

- Watch the **"three Cs"**: chocolate, coffee and cheese (especially cheese that isn't fresh).
- Avoid smoking and alcohol.
- Drink 3 to 4 litres of water a day.
- Never stay on an empty stomach for long. Skipped meals and long fasts trigger attacks.

If attacks become frequent, see a doctor. There are medicines that can control them.

## 2. The dopamine "bomb blast": how our phones feed anxiety

Every notification, every like and every new reel gives your brain a small hit of dopamine, the chemical behind the feeling of instant reward. Dr. Tungaria compares it with the "slow dopamine" we used to get from cleaning the house, working in the fields, reading a book or spending time in nature.

> "What's happening now is a kind of bomb blast of dopamine, with constant notifications, short content and reels one after another. It is disturbing the brain's balance. Our anxiety is increasing, mental stress is increasing, and procrastination has gone up enormously, because people get so much gratification from the phone that they don't want to do any real work."
> — Dr. Arun Tungaria

In his clinic, the effects show up as stress, anxiety, low mood, headaches, spine problems and, especially in students, an inability to focus.

He's realistic: nobody can give up their phone entirely today. His practical "dopamine detox":

- Delete the apps you overuse, or set timers on them.
- Decide in advance how much time social media gets, and give the rest of your time to real work, physical activity and people.

He's equally worried about what he calls **social health**. "The parks in front of our houses are beautiful, but you don't see children in them anymore. Fifteen or twenty years ago they were full; kids fought over who would play cricket where." He reminds us that the WHO defines health as physical, mental *and* social well-being.

:::context The bigger picture
Governments are starting to act. Dr. Tungaria pointed to India's Fit India Movement, and to Australia, where a law banning social media accounts for children under 16 came into force in December 2025. Platforms there, including Instagram, TikTok, Snapchat and YouTube, now have to verify users' ages.

But he puts just as much responsibility on families and schools: "In our schools, all the competition is about marks: 90%, above 90%. Physical fitness gets almost no attention. Children should learn how to strengthen their back and neck muscles from the very beginning. People are discovering the gym at 30 or 40. That should have started in childhood."
:::

## 3. When worry won't switch off: anxiety and depression

Stress, he explains, is a broad term, and a small amount of it helps us grow. Anxiety is one part of it, and it becomes a problem when worry is constant and starts to affect your body and your daily life.

**Early signs of anxiety:**

- Restlessness and an inability to be at peace
- Constant worry about real or imagined situations
- Fast breathing, a racing heart, a dry throat and a sense of panic

> "They say 90% of the things we worry about never actually happen. Anxiety is an exaggeration of that."
> — Dr. Arun Tungaria

Lalit raised research showing that around half of people with chronic anxiety also experience depression. Dr. Tungaria explained the vicious circle. Constant fear chips away at your self-confidence and self-esteem. You start to feel worthless, and that low feeling in turn creates more anxiety. Chronic back pain works the same way: he cited a large US study in which around 40% of people with long-term low back pain also had depression, each condition making the other worse.

**Signs of depression:**

- Feeling low and sad most of the time
- Losing joy in things you used to enjoy
- Sleeping much more than usual, or much less
- Eating more than usual, and gaining weight
- In major depression, suicidal thoughts

**His three tools for anxiety** (which also help with depression):

1. **Journaling.** Write down exactly what you fear, and the pros and cons of each outcome. A student anxious about a result, for example, should write down every possible rank, college or branch, and what they'd do in each case, including the options if it doesn't work out.
2. **Mindfulness.** Stay in the present moment. "If I sit here worrying about tomorrow's brain tumour surgery, I'll ruin this conversation, and I won't be able to do tomorrow's work any better."
3. **Meditation.** It helps regulate your mental and emotional health, and he believes it can dramatically improve how well your brain works.

When symptoms are serious, doctors often prescribe a combination of anti-anxiety and antidepressant medicines, alongside these habits.

**If suicidal thoughts appear:** tell someone you trust right away, whether family or a friend if family feels hard to talk to, and get professional help. "Mental health is the most neglected part of health in our society. There's so much taboo that people get labelled *paagal* (mad) far too quickly."

:::help If you are struggling right now
You don't have to go through it alone. Call **Tele-MANAS on 14416** (or 1-800-891-4416). It is the Government of India's free, confidential mental health helpline, open 24×7 in many Indian languages. If you or someone near you is in immediate danger, call **112**.
:::

## 4. Children and screens: when does normal use become addiction?

Lalit described a scene many of us know: young parents playing videos on a phone just to get a toddler to sit still and eat. Dr. Tungaria didn't soften his answer.

A child's brain is still building its pathways, which is called neuroplasticity. Fill those years with fast, loud, colourful short content (and sometimes vulgar content no parent can fully control), and the results show up early: **poor focus**, weak social skills and early spectacles. "Give them a storybook, and they'd rather watch the film made from it."

His own view is strict: ideally no screens before the age of 10, and after that only limited, supervised use with parental controls, restricted mode and app timers switched on.

**Normal use vs. addiction.** He compares screens to food: a balanced amount keeps you healthy, too much shows up in your body. A little gaming can keep a child's brain active and even improve hand-eye coordination. But watch for these signs:

- Grades falling below the child's usual level
- Less time with friends and outdoor play
- Talking less with parents
- Sleep problems or late nights with the phone
- More processed food and sugary drinks
- Constantly demanding the phone the moment homework is done

**What parents can do:**

- **Be aware first.** If you're both on your phones at dinner, your child is learning from you.
- **Be firm when needed.** Treat overuse as seriously as you would any other harmful habit.
- **Give a basic keypad phone** for staying in touch, instead of a smartphone.
- **Most of all, give your time.** "If we don't make ourselves available to our children, they'll seek that time and attention elsewhere, and today the easiest place is the phone."

He shared a recent case. A 15- or 16-year-old came to him with frequent headaches and falling grades. Gently questioning the family revealed that the teenager was taking the phone to bed every night without the parents realising. Once they took firm steps, the headaches eased and the grades started coming back.

:::context The bigger picture
Dr. Tungaria's age-10 view is stricter than the formal guidance, but the direction is the same. The Indian Academy of Pediatrics recommends no screen exposure at all for children under 2, at most one hour a day of supervised screen time between ages 2 and 5, and less than two hours a day between 5 and 10. It also says screens must never replace outdoor play, sleep, family time or study.
:::

## 5. Sleep: the most underrated medicine we have

Lalit cited the National Sleep Foundation's guidance: 8 to 10 hours of sleep for teenagers and 7 to 9 for adults. Dr. Tungaria explained why that sleep is non-negotiable.

Sleep repairs the body, the muscles, bones and joints you've used all day, and it's when the brain **consolidates what you learned**. That's why the all-nighter doesn't work:

> "If you think you'll study 16 hours and sleep 5, you won't remember what you studied. Five hours of focused study with proper sleep will help you far more."
> — Dr. Arun Tungaria

Nature built in a simple switch. When it gets dark, the pineal gland releases melatonin, the hormone that makes us sleepy. But we've overridden it: lights stay on until 11 p.m., and when they finally go off, the phone screen lights up.

> "As long as light keeps reaching the brain through our eyes, the signal that brings on sleep will not switch on."
> — Dr. Arun Tungaria

**His sleep prescription:**

- Take an evening walk somewhere with dim light, so your brain registers that night has come.
- Sleep in a completely dark room. Even a small night light can disturb sleep.
- Avoid tea and coffee for six to seven hours before bed.
- Don't rely on sleeping pills. "Our society has developed a knee-jerk reaction of asking for a pill for everything. There is no magic pill." Sleep medicines should be taken only on prescription and under a doctor's supervision, because the biggest risk is dependence. Lifestyle changes last.

Many of his patients find that once their sleep is fixed, their concentration improves, and even long-standing body pain eases.

## Put your own oxygen mask on first

Lalit's last question was practical: what should someone do first if they're worried about their brain, spine or mental health?

Not Google, says Dr. Tungaria, and not ChatGPT or unqualified "health influencers". He suggests going to a qualified doctor, in person or through one of the many online consultation platforms now available. "Twenty years ago we said *neem hakeem khatra-e-jaan* (a half-trained healer is a danger to life). The same applies to social media today."

His final message was about priorities.

:::context The bigger picture
He pointed to Zerodha co-founder Nithin Kamath, a famously fit entrepreneur who shared in 2024 that he'd had a mild stroke. Kamath himself suggested that poor sleep, exhaustion, dehydration and overexertion may have played a part. It was a reminder that chasing short-term goals at the cost of health can stop you from reaching them at all.
:::

> "When the oxygen level drops on a plane, you put the mask on yourself first. Only then can you help others. Your parents, your spouse, your children depend on you. Be a responsible person: make your health your top priority — physical, mental, social and emotional."
> — Dr. Arun Tungaria

And don't wait until you're very ill to see a doctor. Early signs are reason enough.

:::takeaways Key takeaways
1. Back and neck pain in your teens or twenties is a warning sign, not a normal part of studying or work.
2. Phones deliver constant "fast dopamine". Set limits, and make room for slow, real-world rewards.
3. Anxiety and depression feed each other. Journaling, mindfulness and meditation help, and professional help is not a weakness.
4. Children need your time more than they need a screen. Watch for slipping grades, sleep and friendships.
5. Darkness, no late caffeine and a phone-free bedroom do more for sleep than any pill.
6. Check symptoms with a qualified doctor, not with Google or influencers.
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
- Names, spellings and the Lo Shu grid
- Willpower, manifestation and the "sensitive" generation
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

:::context The bigger picture
That's a striking admission, and a reassuring one for couples who've been told their match is "too low". Low guna scores and manglik status are still among the most common reasons families reject a proposal. Hearing an astrologer say her own 12-guna marriage is working is a reminder that a chart describes tendencies, not a final judgement on two people.
:::

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

## 4. Names, spellings and the Lo Shu grid

Ayushmann Khurrana's extra "n" and "r" are well known. Lalit also mentioned the numerologist Arviend Sud, who changed both his first name and surname spellings. So should you change yours?

Usually not, says Nitisha. In her estimate, around **70% of people don't need a name change** at all. Only if your name number clashes with your driver and conductor numbers (the numbers from your birth date) does she recommend a change, and she warns strongly against adding letters just because it's fashionable: "The whole equation changes."

She's also a firm believer in giving children names with meaning, including names of gods, because she feels the qualities behind a name like Ram (dignity, acceptance, patience) shape a child.

**The Lo Shu grid.** She walked through how to build one from any date of birth. The classic 3×3 square always has the numbers in the same positions:

:::loshu
4 9 2
3 5 7
8 1 6
The Lo Shu square: every row, column and diagonal adds up to 15
---
4 - 22
- - -
8 - -
Her example, 2 August 2004: 2 appears twice, 4 and 8 once; the rest are missing
:::

You write each digit of your birth date into its square, repeating a number as many times as it appears, and leave the missing ones empty. Zeros are ignored. In her system, each missing number points to something to work on, and she gave a practical, non-ritual way to "activate" many of them:

- **Missing 1** (leadership, confidence): be disciplined, wake early, respect and serve your father
- **Missing 2** (emotional balance): love your mother, help others, meditate
- **Missing 3** (knowledge, expression): read and write something every day
- **Missing 4** (time management): commit to doing one thing for a fixed hour, and do it
- **Missing 5** (communication): speak up and express yourself, in a balanced way

Notice how many of these are simply good habits.

:::context The bigger picture
On the question of a name for the country, Nitisha said she prefers "Bharat". It's worth knowing that India's Constitution already uses both. Article 1 begins: *"India, that is Bharat, shall be a Union of States."* Both names have been official since the Constitution was adopted.
:::

## 5. Willpower, manifestation and the "sensitive" generation

The theme Nitisha returned to most was willpower, and she's worried about today's young people. In her view, Gen Z and Gen Alpha dream big but give up quickly when challenges come. Smaller families and single-child homes, she believes, have led to more pampering and more emotional sensitivity.

She was also clear about what manifestation is not:

> "Manifestation is not saying 'I'll become rich, I'll become rich' and expecting it to happen. It is how attentive you are, practically, to the thing you want to achieve."
> — Nitisha Malhotra

Her example was Shah Rukh Khan, who she says kept working through years of being called over-the-top or childish, and kept updating himself until his dream came true. The contrast she drew is painfully relevant: some people face a flop or a failure and turn to addiction, or even suicide. "How strong your willpower is *after* you lose is what decides everything."

She spoke from experience. As a woman entering astrology, she was told it was "*₹11 wali kamai*" (a pittance), and called a *jaadugarni* (sorceress). "If we had cried that day and quit, where would we be? We cried, and then we said: let them talk. We'll do it anyway."

Her everyday advice was refreshingly practical: sleep on time, wake up early, build discipline, and stop waiting for the stars to do the work.

:::help If you're going through a hard time
Nitisha spoke about people who give up after a failure. If you or someone you know is struggling, please reach out. Call **Tele-MANAS on 14416**, India's free, confidential, 24×7 mental health helpline. In an emergency, call **112**.
:::

## What we took away

You may come to this episode as a believer, a skeptic, or simply curious, and you'll leave with something either way. What stood out to us wasn't a prediction. It was an astrologer telling people to stop being afraid: of mangal dosh, of low guna scores, of astrologers who demand money for fear-based remedies, and of a future that, in her own words, is only 40% written.

:::takeaways Key takeaways
1. In Nitisha's view, destiny is only part of the story. Effort, willpower and choices count for more.
2. Don't cancel a relationship over guna scores alone. Her own 12-guna marriage is working.
3. Be wary of any astrologer who frightens you, prescribes remedies for all nine planets, or simply asks for money.
4. Ask "Can I become this, and how?" instead of "What's my future?"
5. Most people don't need a name change. Never change a spelling just because it's fashionable.
6. Manifestation means practical, consistent effort, not repeating wishes.
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
- Why so many Indians still don't trust insurance
- Health insurance first: what one illness can do to a family
- How to buy health insurance without getting your claim rejected
- Term insurance: the policy nobody wants to talk about
:::

[[watch]]

## 1. Why so many Indians still don't trust insurance

Ask most people to name an insurance company and they'll say LIC. Ravi says that's part of the problem: for decades, armies of agents in every town sold insurance **as an investment**, promising returns, and so people never understood what insurance is actually for.

His definition is beautifully simple. Imagine 100 houses in your neighbourhood. Every year, on average, one of them catches fire. If all 100 families contribute a small amount each year, the one family that suffers the loss can be paid in full.

> "In simple words: when you suffer a loss, insurance makes it good, because you paid the premium."
> — Ravi

That's it. Insurance isn't meant to "give back" money. It's meant to stop one bad event from wrecking your finances.

**The two big families of insurance:**

- **Life insurance:** pays your dependants if you die.
- **Non-life (general) insurance:** everything else, including health, motor, property, fire, marine, accident and crop insurance.

**A quick word on motor insurance.** Third-party cover, for damage you cause to other people or their property, is mandatory under the Motor Vehicles Act; without it you'll be fined. Comprehensive cover, which pays for damage to your own vehicle, isn't mandatory, but Ravi strongly recommends it: even a broken bumper, windscreen or fender can take a real bite out of a middle-class budget.

## 2. Health insurance first: what one illness can do to a family

Lalit asked the practical question: if you're middle class or lower middle class, which insurance should you buy first?

Ravi's answer was clear: **health insurance, before anything else.** Picture a family earning ₹40,000–50,000 a month. A parent or grandparent falls ill, and a "small" treatment costs ₹3–4 lakh. That hits hard. The same family paying ₹10,000–15,000 a year in premium would barely feel it.

He also pointed to a cost that's easy to miss: without insurance, people **compromise**. They pick a cheaper hospital or delay treatment. With insurance, he says, you can choose the best care available.

For people who run their own business, he's even firmer. Salaried employees usually get some group cover from their employer. Business owners and small traders get nothing unless they buy it, so for them health insurance should be the very first financial goal.

:::context The bigger picture
For families who can't afford a premium at all, the government's **Ayushman Bharat PM-JAY** scheme offers free hospital cover of up to ₹5 lakh a year to eligible economically weaker families. Since October 2024, it has also covered **every Indian aged 70 and above**, regardless of income, through the **Ayushman Vay Vandana** card.

Ravi called it one of the most important health initiatives in the country, especially because private insurers rarely sell new policies to people that age. If someone in your family is 70 or older, help them enrol. It's free, through the Ayushman app, beneficiary.nha.gov.in or a Common Service Centre.
:::

## 3. How to buy health insurance without getting your claim rejected

The most heartbreaking insurance stories are the ones where people *did* pay their premiums, and the claim was still rejected. Ravi's advice is aimed squarely at avoiding that.

**1. Tell the whole truth.** Many people hide an existing illness or their real weight to reduce the premium, sometimes on an agent's advice. Then, during a hospital stay, the doctor writes that you've been on blood pressure medicine for four years. The insurer sees you didn't declare it, and the claim is rejected. Declare every pre-existing condition, and let the premium be what it should be.

**2. Don't under-insure.** "₹3 lakh feels like a lot, until a single day in a private hospital ICU costs ₹1 lakh." For cancer treatment, chemotherapy and repeated tests, costs climb fast. His rule of thumb: **at least ₹10 lakh of health cover today.**

**3. Read the fine print.** Look for:

- **Room-rent caps.** A limit of ₹5,000 or ₹10,000 a day can reduce your entire claim if you take a better room.
- **Waiting periods.** Usually 30 days for new illnesses, and longer for pre-existing ones.
- **Riders and add-ons.** Maternity cover, for example, if you're planning a family.
- **Network hospitals.** Check that the hospitals near you are on the list.
- **Claim settlement track record.** Choose an insurer that actually pays.

**4. Use the free-look period.** If you realise soon after buying that the policy isn't right for you, you can cancel it and get your premium back.

**The smart move most salaried people miss: a top-up.** If your employer already gives you ₹3–5 lakh of cover, you don't need to buy a brand-new ₹10 lakh policy. A **top-up or super top-up** plan covers costs above a threshold you choose (the "deductible"), and because the insurer only pays above that level, the premium is far lower. Ravi estimates around ₹4,000 a year, compared with ₹20,000 or more for a full fresh policy.

Here's how it works, using Lalit's example:

- Your base policy covers **₹2 lakh**. You buy a top-up of **₹3 lakh** with a **₹2 lakh deductible**.
- You're hospitalised and the bill comes to **₹5 lakh**.
- Your base policy pays the first ₹2 lakh. The top-up pays the remaining ₹3 lakh.

It works for family floater policies too. Ravi's own family has a ₹5 lakh floater plus a super top-up of ₹20 lakh with a ₹5 lakh deductible, which means ₹25 lakh of peace of mind at a fraction of the cost.

:::context The bigger picture
The rules have moved in policyholders' favour since this conversation. Under IRDAI's 2024 reforms:

- The **free-look period is now 30 days** (earlier 15 days) to cancel a policy that isn't right for you.
- The **maximum waiting period for pre-existing diseases is 3 years**, down from 4.
- After **5 continuous years** of cover (the "moratorium"), an insurer can't reject a claim for non-disclosure unless there is proven fraud.
- Insurers must decide on **cashless approval within an hour** of the hospital's request.

Always check your own policy wording, but these changes make honest, continuous cover more valuable than ever.
:::

## 4. Term insurance: the policy nobody wants to talk about

If health insurance is the first priority, Ravi says term insurance comes second, and only if someone depends on you.

**Who needs it?** If you're young, single, and your parents are financially secure (say, with government pensions), you may not need term cover yet. But once you have a spouse who isn't earning, children, or parents who rely on your income, it becomes essential. If something happens to you, a ₹50 lakh, ₹1 crore or ₹2 crore payout can keep your family afloat.

**Why do so few people buy it?** Partly because nobody likes a salesperson saying "If you die tomorrow…". And partly because people ask, "If nothing happens, what do I get back?"

That question is exactly why Ravi is so firm about this:

> "Insurance and investment should never be mixed. The people selling them mixed together are doing something very wrong."
> — Ravi

Endowment plans and ULIPs bundle insurance with investment. In his experience, endowment plans have rarely returned more than around 6% historically, and the bundling leaves you with too little cover *and* poor returns. His alternative is simple: **buy a pure term plan for protection, and invest separately**, for example through mutual funds, for growth. You get a far bigger cover for the premium, and better returns on your investments.

**How much cover?** A common rule of thumb is **8 to 10 times your annual income**, but Ravi says your lifestyle and dependants matter more. If your family spends ₹1 lakh a month and you want them to keep living the same way, your cover needs to reflect that. A middle-class earner with fewer dependants will need much less.

**Choosing a plan.** Look for an insurer with a long track record and a strong claim settlement ratio, and balance that against the premium. Then two things decide whether your family actually gets paid:

- **Declare everything honestly**, just like with health insurance.
- **Get the nominee right**, so the money reaches the right person quickly, without legal tangles.

When a claim is paid, it's usually a **lump sum**. Ravi's advice to families: work with a qualified financial adviser to invest it, so it covers monthly expenses *and* future goals.

:::context The bigger picture
India's insurance penetration, meaning premiums as a share of GDP, is just **3.7%**, roughly half the global average of about 7%. Life insurance penetration is only **2.8%**, and even that includes many investment-style policies rather than pure protection. Ravi believes the biggest gap is understanding: insurance pays when something goes wrong, not as a return on money spent.
:::

## Protect first, invest later

What we took from this conversation is a simple order of priorities. **Health insurance first**, because one illness can undo years of savings. **Term insurance next**, if anyone depends on you. Investing comes after you're protected, and it should never be bundled into an insurance policy.

:::takeaways Key takeaways
1. Insurance compensates you for a loss. It isn't an investment, so don't expect "returns".
2. Buy health insurance first, with at least ₹10 lakh of cover. Use a top-up if you already have employer cover.
3. Declare every pre-existing condition honestly. Hiding one is the fastest route to a rejected claim.
4. Check room-rent caps, waiting periods, network hospitals and the insurer's claim record.
5. Buy a pure term plan if someone depends on you, invest separately, and name your nominee correctly.
6. Seniors 70+ can get free cover of up to ₹5 lakh through Ayushman Vay Vandana.
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
      "He failed prelims, then mains, quit a secure bank job before his last attempt, and later survived 59 rounds of gunfire as a Collector. Aditya Nath Das on what UPSC aspirants really go through, and what the job is really like.",
    cover: "",
    video: "dM9CqdQ6ApI",
    body: `
You've given it two years. Maybe four. Your friends have jobs, salaries and weekends. Relatives ask "kab clear hoga?" at every wedding. Every time a result comes out without your name on it, something quietly shrinks inside you, and it isn't just your rank. It's how you see yourself.

That is the reality for a huge number of young Indians. Over 13 lakh people applied for the Civil Services Examination in 2024. About 14,600 cleared prelims, and only around a thousand made it to the final list. Former RBI Governor Duvvuri Subbarao recently called the current system of up to six attempts a "colossal waste of productive years".

So for our Independence Day special, we didn't want a topper's highlight reel. We wanted someone who had failed and still made it, and who has spent nearly four decades inside the system those aspirants are trying to enter.

**Aditya Nath Das** joined the Indian Administrative Service in 1987, served as Chief Secretary of Andhra Pradesh, and today advises the Irrigation Department of the Government of Telangana. He is also a poet. His collection *Dancing with Dreams* carries a line that sums up this conversation: *whatever life unfolds for you, welcome it with a smile.*

:::summary In this conversation
- "I didn't even clear prelims": failing twice, and learning to judge yourself honestly
- The bank job he quit: Plan B, family pressure and knowing yourself
- Burnout, coaching and information overload
- 59 rounds of gunfire: the ambush that gave him a "second life"
- Power, pressure and ethics: what the job is really like
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

## 2. The bank job he quit: Plan B, family pressure and knowing yourself

Here's a part of his story most aspirants never hear. Before the IAS, he cleared the Probationary Officer exam for two or three banks and actually joined one.

He quickly realised the work wasn't for him. So, with only his final UPSC attempt left, he resigned.

> "Many people asked me, 'Have you gone mad, leaving such a good job?' I said: I don't know what will happen. But I know what I don't like, and I'm acting on what I know."
> — Aditya Nath Das

His advice to anyone without a clear roadmap is to start with yourself, not with what society calls a good job. Figure out what you enjoy, what you're good at and where you fall short, because "finally, you have to live with yourself." Get stuck in the wrong place, he warns, and it becomes very hard to get out.

When our host pushed back, saying many young people take jobs they don't love to support their families, he agreed it's a real factor. But he held his ground on one thing: "If you aren't happy yourself, you can't keep anyone else happy."

On Plan B, he was clear-eyed. This is a competitive exam, which means it's an elimination process: "You're not allowed to make mistakes." That's exactly why your sense of who you are can't depend on it.

:::context The bigger picture
His point about public service runs deeper than career advice. He insists that every level of public service matters: "Somebody working lower in the hierarchy is still contributing." For an aspirant who doesn't make the final list, that's a reminder that there are many ways to serve, and many respectable paths out of the preparation cycle.
:::

## 3. Burnout, coaching and information overload

Burnout is one of the most common struggles aspirants describe, and his explanation of where it comes from was striking.

> "Burnout happens because you're running towards a goal, running and running, and the goal doesn't come. Pass the exam, get the job: it all gets stacked up in your mind, and every time you can't reach it, you see despair."
> — Aditya Nath Das

His answer is counter-intuitive: **stop preparing for the exam, and start preparing to understand.** When you study with the exam in mind, he says, you remember only the last thing you read. When you study to understand, your mind naturally keeps what matters and lets go of the rest, which is also the answer to today's information overload, when every topic has a thousand YouTube videos.

His practical habits:

- **Recall, don't reread.** Study a topic, close the book, take a sheet of paper and see how much you can recall.
- **Stop when understanding stops.** "Your eyes are still on the book, but your mind isn't working." That's the moment for a cup of tea.
- **Don't cut off your social life.** When it gets too much, go out, meet friends, then come back and reassess. Isolation makes everything worse.
- **Compete with yourself.** "You're not going to beat anybody. You're going to do yourself better. That's all."
- **Choose your own path.** The most common mistake, he says, is listening to others, "even to us". Pick subjects on what you enjoy and score well in, and make mid-course corrections when needed.

On coaching, he's neither for nor against. Preparing in complete isolation is hard, and being around other aspirants helps ideas flow. "The only danger is that you get stuck in a pattern. Coaching tries to fit you into a slot. Don't get slotted."

The same goes for the interview. Boards can tell when answers are over-rehearsed. What they look for is sincerity, honesty and a candidate who is at ease. "Don't sit on the edge of the chair as if you're about to fall off. Don't try to bluff the board. Everyone makes mistakes. Let them see who you are."

:::context The bigger picture
For many aspirants, preparation means moving to a coaching hub and living in cramped rooms, often far from family. The risks of that life became painfully visible in July 2024, when three aspirants died after a coaching centre's basement library in Delhi's Old Rajinder Nagar flooded. It set off a national conversation about the conditions young people endure in pursuit of this one exam.

That's why his advice about balance isn't a soft extra. A healthy routine, friends and a life outside the syllabus are part of preparing well.
:::

## 4. 59 rounds of gunfire: the ambush that gave him a "second life"

Between 1999 and 2001, he served as Collector of Warangal, then a district badly affected by Naxalite violence. One evening in 2001, returning from a tribal-development council meeting deep in the forest, his car came under fire.

Around 59 to 60 rounds hit the vehicle. A splinter struck him in the back. His driver was shot in the leg, and that driver saved his life. Bleeding, he pressed the accelerator down with his hand, slumped over the steering wheel, and kept the car moving until they were out of the firing zone.

They later learned there had been two squads waiting, and claymore mines had been laid on the road. The person holding the trigger didn't press it, because the Collector wasn't the target. The Naxalites later sent an apology.

Even in that moment, there was a decision to make. A nurse at a primary health centre gave them first aid. Back in Warangal, he sent his badly injured driver to a better-equipped hospital rather than taking him along to the same one, so the driver would get full attention. Doctors later said that decision saved the driver's leg. The driver went on to spend nearly two years in treatment and grafting.

> "It is like a second life for me. It changed my perception of a lot of things. I realised how much time we waste on small things that we make into very big things."
> — Aditya Nath Das

He says the experience left him less stressed, not more, and much clearer about what's important and what isn't.

## 5. Power, pressure and ethics: what the job is really like

The IAS is heavily glorified in India by the media, by families and by coaching ads. So we asked directly: what are the real perks and powers?

His answer is worth printing on every aspirant's wall:

> "Power is like an electric bulb. You get power, and you give light. If you can't do that, you'll burst. Power is always for others. It is not for yourself."
> — Aditya Nath Das

The facilities officers get, he explains, exist only to help them do a job that runs 24×7: train accidents, floods and law-and-order emergencies at any hour. People don't resent those facilities when the work gets done. Resentment begins when they're misused.

**Work-life balance.** By the time officers reach a district, many have working spouses and young children. His formula: stay physically active, meet people, clear your work every day so it doesn't pile up, and above all, decide. "Being stuck between yes and no, to be or not to be, is what increases stress. Our job is to take a call."

**Political pressure.** He doesn't pretend it doesn't exist, nor does he demonise it. A bureaucracy's legitimacy comes from elected representatives, and politicians often bring accurate information from the ground. But: "Nobody holds your hand and makes you sign. Applying pressure is their dharma. Doing your work well is yours."

**When you're asked to do something wrong,** his method is simple and practical:

1. Say clearly that it isn't right, and explain the harm.
2. If they insist, ask for the instruction in writing, and reply in writing with your objection.
3. If it could cause serious, irreversible damage, be ready to walk away from that post.

Often, he says, the matter is dropped long before step three. He gave his own juniors the same freedom: question any oral instruction, and ask for it in writing if they disagree. And he takes ownership at the top: "When I sign, the responsibility of everyone below me ends. If I can't defend it, why should I sign it?"

The most satisfying moments of his career had nothing to do with power. In Shillong, he was sent, somewhat unwillingly, to a medical institute that simply wasn't getting off the ground; today it is a fully working institute. As Principal Secretary of Education, his goal was that no teacher should have to run around the secretariat to get a problem solved, and that teachers be allowed to teach instead of being pulled into every other government duty.

:::context The bigger picture
The conversation also turned to the economy facing today's young graduates. India produces around 1.5 million engineering graduates a year, yet many struggle to find work in their field. Mr Das points to uneven college quality, the need to stream students towards ITIs, polytechnics or degrees from Class 12, a manufacturing sector that isn't yet strong enough, and the case for giving states more economic autonomy to attract investment.

And on global headwinds: around the time of recording, the US had announced a 25% tariff on Indian goods over India's purchases of Russian oil. Later in August 2025, a further 25% took the combined rate to 50%. His view: tariffs have become a tool of coercive diplomacy, India's rise is making bigger powers nervous, and the answer is an economy robust enough to withstand it, along with a bureaucracy that is decisive, fair and unbiased enough to attract investment.
:::

## "Don't make the exam bigger than yourself"

We closed by asking for one piece of advice for someone just starting out. His answer covered the practical and the personal.

Prepare with a calm mind. Know your capacity. Build a daily routine. Read one newspaper every day, especially the editorials, because they show how to make many points precisely and concisely. And understand an issue before you criticise it: "When we become critical first, we take a position, and our preparation becomes lopsided."

Then came the line that, for us, defined the whole episode:

> "Don't make the exam bigger than yourself. An exam is an exam. Don't let the balance sheet of your life rest on it. Nothing in life is bigger than you. Everything begins after you."
> — Aditya Nath Das

If you're in the middle of your preparation, or watching someone you love go through it, this is a conversation worth an hour of your time.

:::takeaways Key takeaways
1. Failing prelims or mains isn't the end. Calibrate yourself honestly and fix the specific gap.
2. Know yourself before choosing a path. He walked away from a secure bank job because it wasn't right for him.
3. Study to understand, not to "crack the exam". It's the best defence against burnout and information overload.
4. Don't isolate yourself, and compete only with who you were yesterday.
5. Power is for others. In the job, decide clearly, act ethically and ask for wrong instructions in writing.
6. Nothing in life, including this exam, is bigger than you.
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
      "Money that never stays, a job that keeps slipping away, school fees he couldn't pay. Numerologist Sanddeep Bajaj on the years when nothing worked, and the five ideas he says turned his life around.",
    cover: "",
    video: "_TPYlhVhpy4",
    body: `
Why does money never seem to stay? Why do relationships keep breaking down? Why won't the business grow, no matter how hard you push? Why do you feel restless inside even when nothing is visibly wrong?

These are the questions many of us carry quietly and rarely say out loud. They are also exactly where this episode began. Our guest, numerologist **Sanddeep Bajaj**, didn't arrive with theory. He arrived with a story of years when nothing worked.

His father retired as an Assistant Commissioner of Income Tax. On paper, the family had everything. In reality, he says, there came a time when he couldn't pay his son's school fees of about ₹1.5 lakh a year. For three years, his mother-in-law paid them. He sold his wife's jewellery to pay for consultations with famous astrologers he had seen on TV. Every two or two and a half years, he either lost his job or resigned.

> "I had a lot, but nothing in my hands."
> — Sanddeep Bajaj

Today, he says, he owns five flats, five cars and two shops, and he credits numerology and his teacher for the turnaround. Whatever you make of numerology, what makes this conversation worth your time is how openly it deals with things most people never admit: debt, borrowed school fees, a career that keeps slipping away.

:::context The bigger picture
Sanddeep's story is personal, but the pressure behind it is widespread. In the ManipalCigna–YouGov *India Health Quotient 2026*, 82% of urban Indians said they experience stress, and financial well-being scored lowest of all five dimensions measured. Aditya Birla Sun Life's *A-Nishchit Index 2024* found that 59% of working professionals feel uncertain about their own and their family's well-being. And school fees, the very thing Sanddeep couldn't pay, keep climbing: in a 2025 LocalCircles survey, over 80% of private-school parents reported fee hikes above 10% in a single year.

When people feel that squeeze, many go looking for answers anywhere they can. Astrology app Astrotalk's income rose about 85% in FY25 to roughly ₹1,214 crore, with most activity coming from India's biggest cities.
:::

:::summary In this conversation
- When the future feels frightening, start with today
- Same birthday, different lives: why he says your name matters
- The "luck factor" that stayed at zero until 42
- Kua numbers, angel numbers and "switch codes"
- The missing numbers: stability, discipline and a child who speaks late
:::

[[watch]]

## 1. When the future feels frightening, start with today

Most people who walk into a numerologist's office want one thing: to know what's coming. Host Lalit Sharma opened with exactly that question: can numerology predict the future?

Sanddeep's answer surprised us. He believes knowing the future matters far less than fixing the present.

> "Even Lord Krishna said it: yesterday isn't in your hands, and tomorrow isn't in your hands. Only today is in your hands. The better today gets, the better tomorrow becomes on its own."
> — Sanddeep Bajaj

In his view, everyone is given four "pillars" to work with today: the spelling of their name, their signature, their bank account number and their mobile number. Until these are aligned with your date of birth, he says, it's hard to move forward. He was also refreshingly blunt about the limits: if someone has decided to gamble or bet on horses, no number on earth can save them.

:::context The bigger picture
Lalit raised a fair point: in the age of AI, when a younger generation prides itself on logic and science, interest in numerology seems to be growing, not shrinking. Surveys abroad tell a similar story. A US survey by EduBirdie, reported by Fortune, found that around 80% of Gen Z and millennials say they believe in astrology.

Researchers add an important caveat: there's a difference between casual interest and deep belief. Many young people use these systems less as a rulebook and more as a way to reflect on their lives. Either way, "focus on what you can change today" is advice almost anyone can use.
:::

## 2. Same birthday, different lives: why he says your name matters

Here's a question that bothers a lot of people: thousands of babies are born on the same day, so why do their lives turn out so differently? Sanddeep's answer is that the date may be shared, but the name never is. "One became Lalit Narang, another Lalit Kumar, another Lalit Kohli."

He ties this to the old saying *"Ram se bada Ram ka naam"*: the name of Ram is greater than Ram himself. Interestingly, he argues that the vibration isn't in the name people call you. Most of us are addressed as "sir", "ma'am", "bhaiya" or "guruji" anyway. It's in the name you write: your display name.

> "Your date of birth can never change. The spelling of your name, you can change whenever you like."
> — Sanddeep Bajaj

He urged parents to think twice before naming a child after a favourite TV-serial character without checking the name's "vibration". And unlike Lal Kitab astrology, where he says you need a fresh reading every year, he describes numerology as a one-time process: fix your name spelling, mobile number and account number once, and you're done.

:::context The bigger picture
Name-spelling changes are hardly rare in India's film industry. Ayushmann Khurrana was born Nishant, and reports say his astrologer father changed both his name and its spelling for numerological reasons.

But it's worth asking a harder question too. We remember the stories where a new spelling was followed by success. We rarely hear from the people who changed their names and saw nothing change. Psychologists call this survivorship bias.
:::

## 3. The "luck factor" that stayed at zero until 42

Plenty of people feel they work hard and still can't catch a break. Sanddeep says he felt exactly that, and that numerology gave him an explanation.

Most numerologists, he says, only talk about the **driver number** (the *mulank*), but every date of birth carries two numbers:

- **Driver number (mulank):** the sum of the digits of the day you were born
- **Conductor number (bhagyank, or destiny number):** the sum of every digit in your full date of birth

"The real game starts after 40," he says, because that's when, in his view, the conductor number takes over. Using his own birthday, 17 November 1971, he explained: 1 + 7 gives a driver of 8, and the full date adds up to 28, which reduces to a conductor of 1. In numerology, 8 belongs to Saturn and 1 to the Sun: "father and son, but the biggest enemies." That clash, he believes, is why his luck stayed close to zero until he was 42.

He learned the terms "driver" and "conductor" from his teacher, **Arviend Sud**, who he says has registered both terms. After a six-month weekend course that began in December 2011, his first change was to the spelling of his own name, moving its total from 37 to 41 to bring in the number 5. "Five is a number that supports everyone," he says.

What stood out to us was how openly he thanks his teacher, in every interview he gives.

> "People say, 'We paid for the course, why should we thank anyone?' Thanks matter because I've seen both situations, then and now."
> — Sanddeep Bajaj

:::context The bigger picture
At a time when success stories are often told as solo journeys, publicly crediting a teacher, again and again, is unusual. It echoes the old Indian guru–shishya tradition, and it's a habit worth keeping in any field.

It's also worth remembering that real turnarounds usually have many causes: experience, persistence, relationships and timing. It's easy to credit a single change for everything, and much harder to prove it.
:::

## 4. Kua numbers, angel numbers and "switch codes"

For anyone running a business, the pressure is daily: rent, salaries, suppliers. Sanddeep, who runs his own business, says this is where he leans on two more tools.

The first is what's known worldwide as the **Kua number**, which he treats as an "angel number". His formula:

- Add up the digits of your birth year until you get a single digit (1971 → 1+9+7+1 = 18 → 9)
- **For men:** subtract that from 11 (11 − 9 = **2**)
- **For women:** add 4 to it (9 + 4 = 13 → **4**)

He writes this number on his left hand in green ink, because "green is the one colour with no enemy". He suggests writing it on your wallet, handkerchief, car seat or pillow too.

The second tool is **switch codes**, which he writes on his own hand: **897** under the thumb, which he calls an "emergency code" for large sums, and **15** for everyday cash flow. As an example, he said he is currently using them while trying to raise funds to buy a plot in Noida.

:::context The bigger picture
The Kua number comes from Chinese feng shui, where it is traditionally used to choose favourable directions in a home. "Angel numbers" like 111, 222 and 444 have become a staple of the "manifestation" trend on Instagram and TikTok.

From a psychology point of view, writing a number or goal on your hand can work as a constant reminder that keeps your attention on what you're working towards. There is, however, no scientific evidence that numbers themselves attract money.
:::

:::note On money decisions
Big decisions such as buying property, investing or taking on debt deserve a proper plan and advice from a qualified financial adviser.
:::

## 5. The missing numbers: stability, discipline and a child who speaks late

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

Personality descriptions deserve a closer look, though. In 1948, psychologist Bertram Forer gave all his students the same "personality report", and most rated it as remarkably accurate for them personally. This is now called the Barnum effect: statements like "your room is often messy" or "you crave stability" fit most people to some degree. A 2025 study in India found moderate to high susceptibility to this effect.
:::

:::note If your child is speaking late
Please don't put it down to numbers. Speak to a paediatrician or a speech therapist. With speech delays, getting help early makes the biggest difference.
:::

## Why conversations like this matter

You may finish this episode a believer, a skeptic or somewhere in between. Science still has no controlled studies showing that numbers can predict the future or describe personality, and most research explains why readings *feel* accurate (the Barnum effect, and confirmation bias, our tendency to notice what fits what we already believe).

But that isn't really the point of this conversation. The point is a man sitting across the table and talking honestly about the years when nothing worked: borrowed school fees, sold jewellery, jobs that kept slipping away. These are struggles millions of families live with and almost never talk about. Insightoholix exists for conversations like that.

And several of the lessons here, such as focusing on today, building discipline, looking for stability and thanking the people who taught you, work whether or not you believe in numbers.

:::takeaways Key takeaways
1. According to Sanddeep Bajaj, fixing today matters more than predicting tomorrow.
2. In numerology, the name you write (its spelling) counts for more than the name people call you.
3. Look beyond your driver number; he believes the conductor number shapes life after 40.
4. He uses Kua numbers and switch codes as daily "blessings" and reminders.
5. Whatever you believe, take health, child-development and big money decisions with expert advice.
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

We asked him to tell the whole story honestly: the excitement, the panic, the mistakes he's embarrassed about, and what finally helped him stop the bleeding. He did. That's what makes this conversation worth your time.

:::summary In this conversation
- How it starts: a ₹1,500 YouTube class and an "easy" first week
- The week it turned, and the moment he realised he knew nothing
- The traps: revenge trading, greed and a ₹79,000 margin shock
- The silent killer: brokerage, charges and overtrading
- Climbing back: smaller size, fewer trades, more patience
:::

[[watch]]

## 1. How it starts: a ₹1,500 class and an "easy" first week

After retiring from his bank job, he suddenly had empty days. He first tried selling life insurance, but people soon stopped picking up his calls, and even relatives began to avoid him. Trading seemed perfect: work from home, keep the mind busy, and, he told himself, never sell a stock at a loss.

In stocks, it worked. He bought companies with steadily rising quarterly and yearly profits, and by June he was about **₹4 lakh in profit**.

Then he found options. He watched a YouTube creator, paid ₹1,500 for a weekly online class, and learned two or three "strategies". What he really learned, he admits, was only how to press *buy* and *sell*. He bought weekly-expiry Nifty options, sold them a few minutes later for 10 or 15 points, and in the first week he made **₹17,000–18,000**.

> "I thought: this needs less money, and there's profit every single day. Why not leave stocks and just do options?"
> — Our guest

:::context The bigger picture
That first-week high is exactly what makes options so dangerous for beginners. A small amount of money controls a large position, and quick early wins feel like skill rather than luck. SEBI's three-year study (FY22 to FY24) found that **93% of individual F&O traders lost money, an average of about ₹2 lakh each, adding up to more than ₹1.8 lakh crore**. Only 1% made a profit of more than ₹1 lakh after costs.
:::

## 2. The week it turned, and the moment he realised he knew nothing

In the second week, he lost **₹49,000**.

For the next three months, July, August and September, he lost **more than ₹1 lakh every single month**. By October, the ₹4 lakh he had built up in stocks was gone.

Part of it was pure guesswork. If the market had risen 50 or 70 points, he'd assume it "couldn't go higher" and bet on a fall, and then watch it run another 200 points. He didn't know what support or resistance meant. Some losses came from mistakes he'd rather forget: the trading app defaulted to *buy*, and more than once he swiped to place an order and ended up buying when he meant to sell.

The turning point came from another YouTube video. The trader on screen listed what every options trader must know: stop-loss, swing high, swing low and a few other terms.

> "He said: 'If you don't know these, then *bhagwan maalik* (God help you). I can't even teach you.' And I realised I didn't know any of it."
> — Our guest

He admits he still doesn't always set a proper stop-loss or target. That honesty is the point: most people who lose money in options are not reckless gamblers. They are ordinary, intelligent people who entered a professional arena with a few YouTube videos.

## 3. The traps: revenge trading, greed and a ₹79,000 margin shock

Three patterns caused most of his biggest losses. Anyone who has traded will recognise them.

**Trap 1: Doubling up to "recover" a loss.** After a few small losing trades, say ₹2,000 down, he'd think: "If I buy 1,000 quantity, just 3 points will make it back." Sometimes it did. Often, he lost twice as much.

**Trap 2: Selling options without understanding margin.** When buying two or four lots was making ₹2,000–3,000 a trade, he decided to go bigger and *sell* 300 quantity of calls. He had no idea how much margin selling requires. In minutes, almost his entire balance was blocked, and that day closed with a **₹79,000 loss**.

**Trap 3: Greed on the way up, fear on the way down.** He described one trade with painful precision:

> "₹5,000 profit, I'm happy. ₹10,000, very happy. ₹11,000, let it go higher. Then it dropped to ₹8,000, ₹7,000, ₹5,000. I said, I'll exit at ₹10,000. It came back to zero. Then I said, at least let the commission come out. Then it went into loss."
> — Our guest

And the mirror image, exiting too early out of fear: he'd buy at ₹110, panic at ₹103 because 1,000 quantity meant a ₹7,000 loss, cut the trade, and watch it rise to ₹120.

> "Of course my heart goes *dhak-dhak*. Once the loss crossed ₹2,000, it would start. Past ₹5,000, I'd cut the trade."
> — Our guest

Without a plan decided *before* entering a trade, every decision is made by fear or greed in the middle of it.

:::context The bigger picture
His instinct to keep going after big losses is common too. SEBI found that **more than 75% of loss-making traders continued trading** despite losing money year after year. And his age didn't protect him: in SEBI's FY26 data, around **81% of traders above 60 still lost money**. Older traders do better than the under-30s (about 89% of whom lose), but four out of five losing is hardly a safe bet for retirement savings.
:::

## 4. The silent killer: brokerage, charges and overtrading

This might be the most eye-opening part of the conversation.

He'd heard that brokerage was "just ₹20 a trade", so he didn't worry about it. One day he made **29 trades**, buying and selling 58 times, and ended the day ₹6,500 up. He was thrilled. The next day, 24 trades and ₹4,500 up. The day after, ₹11,000 down.

He didn't even know how to check his options P&L until three days later. When he finally did, the picture changed completely:

- **Day 1:** ₹6,500 profit, about ₹5,000 in charges, so roughly **₹1,500** left
- **Day 2:** ₹4,500 profit, about ₹5,500 in charges, so actually **₹1,000 lost**
- **Day 3:** ₹11,000 loss plus ₹4,500 in charges, so **₹15,500 lost**

Brokerage is only one part. Exchange fees, taxes and other charges add up on every single trade, and the more often you trade, the faster they eat whatever you make.

:::context The bigger picture
SEBI's data shows exactly the same pattern at national scale. Between FY22 and FY24, individual F&O traders spent **about ₹50,000 crore on transaction costs** alone, around ₹26,000 per trader in FY24.

Meanwhile, the money doesn't disappear; it moves. In FY24, proprietary trading firms and foreign portfolio investors made gross trading profits of about ₹33,000 crore and ₹28,000 crore respectively, and **over 96% of those profits came from algorithmic trading**. When a retail trader taps *buy* on a phone, the person on the other side is very often a machine.
:::

## 5. Climbing back: smaller size, fewer trades, more patience

After losing ₹1 lakh in the first week of October alone, he stopped trading for three days. Then he started changing things, one at a time:

- **Cut position size:** from 1,000 quantity to 500, and later to a maximum of 200 (8 lots).
- **Capped trades:** no more than five trades a day.
- **Kept it simple:** only Nifty, no jumping between Nifty and Bank Nifty.
- **Stopped double-trading** on the same big candle.

October still ended with a loss, but a much smaller one. In December, at the time of recording, he was **in profit** for the month.

His new philosophy came from a learning video, and it's the opposite of what drew him in:

> "Whether you trade three times a month, five or ten, make them quality trades. If you trade five days and sit out the other 25, that's also good for you. And that's exactly what happened with me."
> — Our guest

:::context The bigger picture
Regulators have also stepped in. From November 2024, SEBI raised the minimum size of index derivative contracts from ₹5 lakh to ₹15 lakh, allowed each exchange only one weekly-expiry index, and required option premiums to be paid upfront. In the quarters that followed, the number of individual F&O traders fell by about 20% to 30%. Even so, losses remained huge: total individual losses still rose to ₹1.06 lakh crore in FY25.
:::

## Before you place your first options trade

We asked what he would tell anyone, of any age, who is thinking of starting. His advice was simple:

> "First sit with someone for at least six months and understand it. My mistake was taking too much quantity at the start. If I'd started with one or two lots, I'd have lasted six or seven months instead of losing it all in three."
> — Our guest

Here is what his story teaches, in plain terms:

1. **Learn before you earn.** Understand price action, trends, stop-loss, targets and margin before risking real money, and paper-trade first.
2. **Decide your exit before you enter.** Know your stop-loss and target in advance, and stick to them.
3. **Start tiny.** One or two lots. If you can't handle a small loss calmly, you can't handle a big one.
4. **Never trade money you need.** Retirement savings, emergency funds, school fees and EMIs are off-limits.
5. **Count every cost.** Check your real P&L, after brokerage and charges, every single day.
6. **Fewer, better trades.** Overtrading feeds the broker, not you.
7. **Take a break after a big loss.** Revenge trading is how small losses become big ones.

:::note Important
This article shares one person's real experience and publicly available SEBI data. It is not investment advice. F&O trading carries a high risk of loss. Please speak to a SEBI-registered investment adviser before making financial decisions.
:::

## The real lesson

What stayed with us after this conversation wasn't the size of the losses. It was how ordinary the path was: a retired man with free time, a ₹1,500 online course, one lucky week, and then three months of learning the hardest way possible.

He's still trading, more carefully now. If you know someone who has just discovered options trading, a parent, a friend, a young colleague, this is the conversation to send them.

:::thanks A heartfelt thank you
People rarely talk about money they've lost. Losses are hidden from friends, kept from family, and almost never shared in public. Our guest did the opposite. When we asked him to tell his story, he agreed without a second thought, and then spoke openly about every painful detail: the ₹60,000 afternoon, the margin shock, the trades he wishes he'd never placed, even the mistakes he worried his family might be upset to hear about.

He didn't do it for attention. He did it so that someone else might recognise the trap before falling into it. That takes real courage and real generosity. Thank you, sir, for trusting us with your story. It will save someone a lot of money and a lot of heartache.
:::

:::takeaways Key takeaways
1. About 9 in 10 individual F&O traders in India lose money. Assume you will be one of them until you've proven otherwise.
2. A few winning days in options mean very little. Early wins often lead to bigger bets.
3. Doubling up to recover, selling options without understanding margin, and holding on out of greed caused his biggest losses.
4. Brokerage and charges quietly ate most of his profits on high-trade days.
5. Smaller size, a daily trade limit and patience helped him stop the losses.
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
