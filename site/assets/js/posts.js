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
     coverText optional short headline for the designed cover (when no image/video)
     body      the post in simple Markdown:
               ## Heading, **bold**, *italic*, [link](url), - list, 1. list,
               > quote (add a last line "> — Name" to credit the speaker),
               ![alt](image-url), blank line between paragraphs
               Boxes for long articles:  :::summary Title  /  :::context Title  /
               :::takeaways Title  /  :::note Title   …text…   :::
   ========================================================================== */

window.POSTS = [
  {
    slug: "why-upsc-aspirants-fail",
    title: "Why 90% of UPSC Aspirants Fail — and What the Other 10% Do Differently",
    date: "2026-10-15",
    category: "Episode Notes",
    excerpt:
      "Our longest conversation yet, with former IAS officer Aditya Nath Das. The big themes, the uncomfortable truths, and who should watch it.",
    cover: "",
    video: "dM9CqdQ6ApI",
    body: `
Lakhs of aspirants appear for the civil services exam every year. Only a tiny fraction make it to the final list. We wanted to understand why — from former IAS officer Aditya Nath Das, who has seen the system from the inside.

## The questions we asked

- Is it really about intelligence, or about strategy and stamina?
- How much does coaching actually matter?
- When should someone keep going — and when is it brave to stop?

## Themes that came up again and again

1. **Consistency over intensity.** Preparation is a multi-year marathon, not a sprint before prelims.
2. **Answer writing is a skill.** Knowing something and expressing it well in limited time are two different abilities.
3. **Mental health is part of the syllabus.** Isolation, family pressure and repeated attempts take a real toll.
4. **Have a Plan B — without guilt.** A backup isn't a lack of commitment; it's what lets you commit without fear.

## Who should watch

Aspirants, obviously. But also parents of aspirants — understanding the pressure is the first step towards easing it.

> Clearing the exam is one path to serving. It is not the only measure of a meaningful life.

Watch the full conversation above, and share it with someone who's in the middle of their preparation.
`,
  },
  {
    slug: "birth-date-and-success",
    lang: "hi",
    title: "क्या आपकी जन्मतिथि तय करती है आपकी सफलता? अंकों की भाषा पर संदीप बजाज से बातचीत",
    date: "2026-10-12",
    category: "Episode Notes",
    excerpt:
      "नाम की स्पेलिंग, मूलांक-भाग्यांक, कुआ नंबर और लो शू ग्रिड: न्यूमरोलॉजिस्ट संदीप बजाज के साथ हमारी बातचीत के पाँच अहम पहलू, और आज की दुनिया में इनकी जगह।",
    cover: "",
    video: "_TPYlhVhpy4",
    body: `
अगर कोई सिर्फ़ आपकी जन्मतिथि देखकर बता दे कि पैसा आपके पास टिकता क्यों नहीं, रिश्ते बार-बार क्यों टूटते हैं, या बिज़नेस आगे क्यों नहीं बढ़ता, तो क्या आप सुनना चाहेंगे? हमारे इस एपिसोड की शुरुआत इसी सवाल से हुई। मेहमान थे न्यूमरोलॉजिस्ट **संदीप बजाज**, जिनका कहना है कि यह "न कोई संयोग है, न कोई जादू। यह सिर्फ़ और सिर्फ़ नंबर्स का खेल है।"

यह बातचीत ऐसे समय में हुई है जब भारत में ज्योतिष और अंक ज्योतिष एक बड़ा कारोबार बन चुका है। एस्ट्रोलॉजी ऐप Astrotalk की कुल आय वित्त वर्ष 2025 में करीब ₹1,214 करोड़ रही, यानी एक साल में लगभग 85% की बढ़त, और कंपनी के मुताबिक़ इसका बड़ा हिस्सा बड़े (टियर-1) शहरों से आया। यानी यह अब सिर्फ़ छोटे शहरों या पुरानी पीढ़ी की बात नहीं रही।

:::summary इस बातचीत में
- भविष्य जानने से ज़्यादा ज़रूरी है "आज" को बेहतर बनाना
- नाम की स्पेलिंग और "डिस्प्ले नेम" का असर
- ड्राइवर, कंडक्टर और 40 की उम्र के बाद का "असली खेल"
- कुआ नंबर, एंजल नंबर और स्विच कोड
- लो शू ग्रिड: जो अंक आपकी जन्मतिथि में नहीं हैं
:::

## 1. भविष्य नहीं, "आज" सबसे अहम

बातचीत का पहला सवाल सीधा था: क्या न्यूमरोलॉजी भविष्य बता सकती है? संदीप जी का जवाब चौंकाने वाला था। उनके मुताबिक़ भविष्य जानना उतना ज़रूरी ही नहीं है।

> "कृष्ण भगवान ने भी तो कहा कि ना यस्टरडे आपके हाथ में है, ना टुमारो आपके हाथ में है। सिर्फ़ आज आपके हाथ में है। जितना आज बेटर होगा, कल मेरा अपने आप ही बेटर हो जाएगा।"
> — संदीप बजाज

उनका कहना है कि भगवान ने हमें चार "पिलर" दिए हैं: नाम की स्पेलिंग, सिग्नेचर, बैंक अकाउंट नंबर और मोबाइल नंबर। जब तक ये जन्मतिथि के साथ "अलाइन" नहीं होते, आगे बढ़ना मुश्किल है। साथ ही उन्होंने एक साफ़ बात भी कही: अगर किसी ने जुआ-सट्टा खेलने की ठान ही ली है, तो कोई अंक उसे नहीं बचा सकता।

अपना अनुभव बताते हुए उन्होंने कहा कि शुरुआत में वे टीवी पर दिखने वाले बड़े-बड़े ज्योतिषियों के पास गए, यहाँ तक कि पत्नी के गहने बेचकर कंसल्टेशन लिया, लेकिन ज्योतिष और लाल किताब से उन्हें फ़ायदा नहीं हुआ। उन्हें "अंकों की भाषा" समझ में आई।

:::context बड़ी तस्वीर
होस्ट ललित शर्मा ने एक दिलचस्प बात उठाई: AI के दौर में, जब नई पीढ़ी तर्क और विज्ञान से सोचती है, तब भी अंक ज्योतिष में रुचि बढ़ रही है। दुनिया भर के सर्वे भी कुछ ऐसा ही दिखाते हैं। अमेरिका में EduBirdie के एक सर्वे (जिसे Fortune ने रिपोर्ट किया) के मुताबिक़ लगभग 80% Gen Z और मिलेनियल्स ज्योतिष में विश्वास रखते हैं।

हालाँकि विशेषज्ञ याद दिलाते हैं कि "कैज़ुअल इंटरेस्ट" और "गहरे विश्वास" में फ़र्क़ है। कई युवा इसे जीवन-दर्शन की तरह नहीं, बल्कि मज़े या आत्म-चिंतन के एक ज़रिये की तरह देखते हैं।

आप अंकों में विश्वास करें या न करें, "आज पर ध्यान दो" वाली सीख पर शायद ही कोई असहमत होगा।
:::

## 2. नाम में क्या रखा है? संदीप जी के अनुसार, बहुत कुछ

एक आम सवाल यह है: अगर एक ही तारीख़ को हज़ारों बच्चे पैदा होते हैं, तो जन्मतिथि "यूनिक" कैसे हुई? संदीप जी का जवाब है कि तारीख़ एक हो सकती है, नाम नहीं। "कोई ललित नारंग बन गया, कोई ललित कुमार बन गया, कोई ललित कोहली बन गया।" वे इसे "राम से बड़ा राम का नाम" वाली पुरानी कहावत से जोड़ते हैं।

दिलचस्प बात यह है कि उनके हिसाब से वाइब्रेशन बोले गए नाम में नहीं, बल्कि लिखे गए नाम, यानी "डिस्प्ले नेम", में होती है। ज़्यादातर लोगों को तो वैसे भी "सर", "मैडम", "भैया" या "गुरुजी" कहकर ही बुलाया जाता है।

> "डेट ऑफ़ बर्थ कभी चेंज नहीं हो सकती। नेम की स्पेलिंग जब मर्ज़ी आप चेंज कर लो।"
> — संदीप बजाज

उन्होंने माता-पिता को सलाह दी कि टीवी सीरियल से प्रेरित होकर बच्चों के नाम रखने से पहले उनकी "वाइब्रेशन" जाँच लें। उनके मुताबिक़ न्यूमरोलॉजी एक "वन-टाइम प्रोसेस" है: एक बार नाम की स्पेलिंग, मोबाइल नंबर और अकाउंट नंबर ठीक करवा लें। इसके उलट लाल किताब में हर साल नया टेवा बनवाना पड़ता है।

:::context बड़ी तस्वीर
नाम की स्पेलिंग बदलने का चलन बॉलीवुड में खूब दिखता है। आयुष्मान खुराना का जन्म का नाम निशांत था, और रिपोर्ट्स के अनुसार उनके ज्योतिषी पिता ने अंक ज्योतिष के हिसाब से उनका नाम और उसकी स्पेलिंग बदली।

पर यहाँ एक सवाल पूछना भी ज़रूरी है: हम उन्हीं कहानियों को याद रखते हैं जहाँ नाम बदलने के बाद सफलता मिली। जिन्होंने नाम बदला और कुछ नहीं बदला, उनकी कहानियाँ कोई नहीं सुनाता। मनोविज्ञान में इसे "सर्वाइवरशिप बायस" कहा जाता है।
:::

## 3. ड्राइवर, कंडक्टर और 40 के बाद का "असली खेल"

संदीप जी के मुताबिक़ ज़्यादातर न्यूमरोलॉजिस्ट सिर्फ़ **मूलांक** की बात करते हैं, जबकि हर जन्मतिथि में दो अंक होते हैं:

- **मूलांक (ड्राइवर नंबर):** जन्म की तारीख़ के अंकों का जोड़
- **भाग्यांक (कंडक्टर या डेस्टिनी नंबर):** पूरी जन्मतिथि, यानी तारीख़, महीने और साल के अंकों का जोड़

उनका दावा है कि "असली खेल 40 की उम्र के बाद शुरू होता है", जब भाग्यांक सक्रिय होता है। अपनी ही जन्मतिथि (17 नवंबर 1971) का उदाहरण देते हुए उन्होंने समझाया कि 1 + 7 = 8 उनका मूलांक है, और पूरी तारीख़ का जोड़ 28, यानी 1, उनका भाग्यांक। उनके अनुसार 8 शनि का और 1 सूर्य का अंक है, जो "पिता और पुत्र हैं, पर सबसे बड़े दुश्मन भी", और इसीलिए 42 साल की उम्र तक उनका "लक फ़ैक्टर" लगभग शून्य रहा।

"ड्राइवर" और "कंडक्टर" शब्द उन्होंने अपने गुरु **अरविंद सूद** से सीखे, जिन्होंने उनके मुताबिक़ इन शब्दों को रजिस्टर भी करवाया है। दिसंबर 2011 में शनिवार-रविवार की कक्षाओं वाला छह महीने का कोर्स करने के बाद उन्होंने सबसे पहला बदलाव अपने नाम की स्पेलिंग में किया। नाम का जोड़ 37 से 41 पर ले जाया गया, ताकि उसमें 5 का अंक आ जाए। उनके शब्दों में, "5 नंबर एक ऐसा नंबर है जो हर एक को सपोर्ट करता है।"

> "मेरे पास बहुत कुछ था, पर हाथ में कुछ नहीं था।"
> — संदीप बजाज

उन्होंने अपनी कहानी खुलकर सुनाई। पिता इनकम टैक्स में असिस्टेंट कमिश्नर पद से रिटायर हुए थे, परिवार में सब कुछ था, फिर भी एक समय ऐसा आया जब बेटे की स्कूल फ़ीस (करीब ₹1.5 लाख सालाना) भरने के पैसे नहीं थे। तीन साल तक यह फ़ीस उनकी सास ने भरी। आज वे बताते हैं कि उनके पास पाँच फ़्लैट, पाँच गाड़ियाँ और दो दुकानें हैं, और इसका श्रेय वे इस विद्या और अपने गुरु को देते हैं।

:::context बड़ी तस्वीर
आज के दौर में, जब बहुत से लोग अपनी सफलता का पूरा श्रेय ख़ुद को देते हैं, संदीप जी का हर मंच पर अपने गुरु को धन्यवाद देना अलग दिखता है। भारतीय परंपरा में गुरु-शिष्य संबंध की यही भावना रही है, और यह बात अंक ज्योतिष से परे हर क्षेत्र पर लागू होती है।

साथ ही यह ध्यान रखना भी ज़रूरी है कि किसी की ज़िंदगी में बदलाव के कई कारण होते हैं: अनुभव, मेहनत, नेटवर्क और सही समय। किसी एक बदलाव को पूरी सफलता का कारण मान लेना आसान है, पर उसे साबित करना मुश्किल।
:::

## 4. कुआ नंबर, एंजल नंबर और स्विच कोड

संदीप जी एक और अंक की बात करते हैं जिसे दुनिया भर में **कुआ नंबर** कहा जाता है, और वे इसे "एंजल नंबर" मानते हैं। उनका बताया फ़ॉर्मूला यह है:

- जन्म के साल के अंकों को जोड़कर एक अंक तक लाएँ (1971 → 1+9+7+1 = 18 → 9)
- **पुरुषों के लिए:** 11 में से यह अंक घटाएँ (11 − 9 = **2**)
- **महिलाओं के लिए:** इसमें 4 जोड़ें (9 + 4 = 13 → **4**)

उनकी सलाह है कि यह अंक हरे रंग के पेन से बाएँ हाथ पर लिखें, क्योंकि उनके अनुसार "एक कलर ऐसा है जिसका कोई दुश्मन नहीं है, वो है ग्रीन"। इसे पर्स, रुमाल, गाड़ी की सीट या तकिये पर भी लिखा जा सकता है।

इसके अलावा वे "स्विच कोड" की बात करते हैं, जिन्हें वे ख़ुद हाथ पर लिखते हैं: बड़ी रक़म के लिए अंगूठे के नीचे **897** ("इमरजेंसी कोड"), और रोज़ के खर्चों के लिए **15**। उदाहरण के तौर पर उन्होंने बताया कि नोएडा में एक प्लॉट के लिए फ़ंड जुटाने के इरादे से वे ये अंक लिख रहे हैं।

:::context बड़ी तस्वीर
"कुआ नंबर" की जड़ें चीनी फ़ेंगशुई में हैं, जहाँ इसका इस्तेमाल घर की दिशाएँ तय करने में होता है। वहीं "एंजल नंबर्स" (जैसे 111, 222, 444) पिछले कुछ सालों में इंस्टाग्राम और टिकटॉक पर "मैनिफ़ेस्टेशन" ट्रेंड का बड़ा हिस्सा बन गए हैं।

मनोविज्ञान की नज़र से देखें तो हाथ पर कोई अंक या लक्ष्य लिखना एक "रिमाइंडर" की तरह काम कर सकता है, जो ध्यान को उस लक्ष्य पर बनाए रखता है। लेकिन अंक ख़ुद पैसा आकर्षित करते हैं, इसका कोई वैज्ञानिक प्रमाण अब तक नहीं है।
:::

:::note पैसों से जुड़े फ़ैसले
प्रॉपर्टी, निवेश या कर्ज़ जैसे बड़े फ़ैसले किसी योग्य वित्तीय सलाहकार की राय और अपनी ठोस योजना के आधार पर ही लें।
:::

## 5. लो शू ग्रिड: जो अंक आपकी जन्मतिथि में नहीं हैं

लो शू ग्रिड 3×3 का एक खाना है जिसमें जन्मतिथि के अंक भरे जाते हैं। ज़्यादातर लोगों की जन्मतिथि में 1 से 9 तक के सारे अंक नहीं होते, और संदीप जी के अनुसार हर "मिसिंग" अंक का अपना असर होता है:

- **1 न हो:** कम्युनिकेशन और लीडरशिप की कमी
- **2 न हो:** अंतर्ज्ञान (इंट्यूशन) कमज़ोर, सामने वाले को परखने में ग़लतियाँ
- **3 न हो:** कल्पनाशक्ति (इमेजिनेशन) की कमी
- **4 न हो:** अनुशासन की कमी; "उसके रूम में जाके देखोगे तो सारा रूम तहस-नहस होगा"
- **5 न हो:** स्थिरता (स्टेबिलिटी) की कमी; उनके अनुसार 85% लोगों में यह अंक नहीं होता
- **6 न हो:** पैसे और परिवार से जुड़ी चुनौतियाँ, शादी में देरी
- **7 न हो:** रिसर्च और उच्च शिक्षा में रुकावट
- **8 न हो:** ज़्यादा गुस्सा, तनाव और बाधाएँ
- **9 न हो:** "मानवता" की कमी, यानी सिर्फ़ अपनी दुनिया से मतलब

सबसे चर्चित दावा अंक 1 को लेकर था। संदीप जी के अनुसार 2000 के बाद पैदा हुए कई बच्चों की जन्मतिथि में 1 नहीं होता, और वे इसे बच्चों के देर से बोलना शुरू करने से जोड़ते हैं।

> "5 नंबर मिसिंग का मतलब है स्टेबिलिटी मिसिंग हो गई। हर दो-ढाई साल बाद या तो मेरी जॉब चली जाती थी या मैं खुद रिज़ाइन दे देता था।"
> — संदीप बजाज

:::context बड़ी तस्वीर
लो शू ग्रिड की कहानी प्राचीन चीन से आती है। किंवदंती है कि लो नदी से निकले एक कछुए की पीठ पर 3×3 का ऐसा "मैजिक स्क्वेयर" बना था जिसकी हर पंक्ति, हर कॉलम और दोनों विकर्णों का जोड़ 15 आता है। गणित के लिहाज़ से यह सचमुच एक सुंदर पैटर्न है।

लेकिन व्यक्तित्व से जुड़े ऐसे विवरणों पर एक मनोवैज्ञानिक नज़र भी ज़रूरी है। 1948 में मनोवैज्ञानिक बर्ट्रम फ़ोरर ने अपने सभी छात्रों को एक ही "पर्सनैलिटी रिपोर्ट" दी, और ज़्यादातर ने उसे अपने बारे में बेहद सटीक बताया। इसे "बार्नम इफ़ेक्ट" कहते हैं: "आपका कमरा बिखरा रहता है" या "आपको ज़िंदगी में स्थिरता चाहिए" जैसी बातें ज़्यादातर लोगों पर कुछ हद तक लागू हो जाती हैं। 2025 में भारत में हुए एक अध्ययन में भी लोगों में इस असर के प्रति मध्यम से ऊँची संवेदनशीलता पाई गई।
:::

:::note बच्चों के देर से बोलने पर
अगर आपका बच्चा अपनी उम्र के हिसाब से देर से बोलना शुरू कर रहा है, तो इसे अंकों से जोड़ने के बजाय किसी बाल रोग विशेषज्ञ (पीडियाट्रिशियन) या स्पीच थेरेपिस्ट से सलाह लें। ऐसे मामलों में जल्दी मदद मिलना सबसे ज़्यादा फ़र्क़ डालता है।
:::

## विश्वास, विज्ञान और बीच का रास्ता

अंक ज्योतिष पर राय बँटी हुई है, और शायद बँटी ही रहेगी। एक तरफ़ संदीप बजाज जैसे लोग हैं, जिनकी ज़िंदगी में, उनके अपने शब्दों में, इसने बड़ा बदलाव लाया। दूसरी तरफ़ विज्ञान है, जिसके पास अब तक ऐसे नियंत्रित अध्ययन नहीं हैं जो दिखाएँ कि अंक भविष्य या व्यक्तित्व के बारे में कोई ठोस जानकारी देते हैं। ज़्यादातर शोध यह समझाता है कि ऐसी रीडिंग्स हमें सही *क्यों लगती* हैं, जैसे बार्नम इफ़ेक्ट और कन्फ़र्मेशन बायस (जो बात हमारी धारणा से मेल खाए, उसी पर ध्यान जाना)।

शायद सबसे काम की बात बीच में है। इस बातचीत की कई सीखें, जैसे आज पर ध्यान देना, अनुशासन, स्थिरता और अपने गुरुओं के प्रति आभार, अंकों में विश्वास किए बिना भी अपनाई जा सकती हैं।

:::takeaways मुख्य बातें
1. संदीप बजाज के अनुसार भविष्य जानने से ज़्यादा ज़रूरी "आज" को बेहतर बनाना है।
2. न्यूमरोलॉजी में बोले गए नाम से ज़्यादा लिखे गए नाम (स्पेलिंग) को अहम माना जाता है।
3. मूलांक (ड्राइवर) के साथ भाग्यांक (कंडक्टर) को भी समझें; उनके अनुसार 40 के बाद इसका असर बढ़ता है।
4. कुआ नंबर और स्विच कोड को वे "आशीर्वाद" की तरह इस्तेमाल करने की सलाह देते हैं।
5. विश्वास जो भी हो, सेहत, बच्चों के विकास और पैसों के बड़े फ़ैसले विशेषज्ञ की सलाह से ही लें।
:::

:::note
यह लेख एपिसोड में मेहमान के रखे गए विचारों का सार है। Insightoholix इन दावों की वैज्ञानिक पुष्टि नहीं करता; "बड़ी तस्वीर" वाले हिस्से केवल संदर्भ के लिए हैं।
:::

## स्रोत

- [Astrotalk की FY25 आय (Outlook Business)](https://www.outlookbusiness.com/start-up/news/astrotalk-reports-85-revenue-growth-in-fy25-as-tier-i-cities-boost-platform-activity)
- [Gen Z, मिलेनियल्स और ज्योतिष पर सर्वे (Fortune)](https://www.fortune.com/2024/08/22/gen-z-millenails-astrology-career-advice)
- [कैज़ुअल इंटरेस्ट बनाम गहरा विश्वास (Oxford Brookes University)](https://www.brookes.ac.uk/about-brookes/news/news-from-2025/05/expert-comment-why-is-gen-z-looking-to-the-stars-f)
- [आयुष्मान खुराना का नाम बदलना (Republic World)](https://www.republicworld.com/entertainment/bollywood/did-you-know-ayushmann-khurranas-astrologer-father-changed-his-name-due-to-numerology)
- [राशिफल और न्यूमरोलॉजी सटीक क्यों लगते हैं (Business Today)](https://www.businesstoday.in/science/story/why-horoscopes-and-numerology-feel-so-accurate-the-science-of-the-thats-me-effect-549422-2026-08-16)
- [न्यूमरोलॉजी और कन्फ़र्मेशन बायस (Skeptoid)](https://skeptoid.com/episodes/626)
- [बार्नम इफ़ेक्ट पर 2025 का भारतीय अध्ययन (IJIP)](https://ijip.in/wp-content/uploads/2025/09/18.01.337.20251303.pdf)
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
    title: "Losing ₹3 Lakhs in 3 Months: The Lessons Worth More Than the Money",
    date: "2026-09-28",
    category: "Episode Notes",
    excerpt:
      "Trading looks easy on Instagram. This is the honest companion post to one of our most personal videos.",
    cover: "",
    video: "sDGD1Q-FGDk",
    body: `
Nobody posts their losses. That's exactly why we made this video.

## Why it's so easy to start

Apps make it frictionless, reels make it look glamorous, and a couple of early wins make it feel like skill. That combination is dangerous.

## Lessons that stuck

1. **Decide your maximum loss before you enter a trade** — not during it.
2. **Never trade money you need.** Rent, EMIs and emergency funds are off-limits.
3. **Emotions are the real opponent.** Revenge trading after a loss is how small losses become big ones.
4. **Learn before you earn.** Paper trade until your process is boring.
5. **Write things down.** A trading journal shows patterns your memory hides.

## The bigger point

Losing money hurts. Losing it *without learning anything* hurts twice. If this post saves even one person from repeating the same mistakes, sharing it was worth it.

*This is a personal story, not financial advice. Please speak to a registered advisor before making investment decisions.*
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
    slug: "womens-health-series",
    title: "Why We Made a Two-Part Women's Health Series",
    date: "2026-09-10",
    category: "Episode Notes",
    excerpt:
      "Periods, PCOS, IVF, pregnancy, postpartum and menopause — topics that affect half the population and still get whispered about.",
    cover: "",
    video: "LAlagU6xhUE",
    body: `
When we started planning this episode, it was meant to be one conversation. It turned into two, because there was simply too much that people never get told.

## Why it matters

Many women grow up learning about their own bodies through hesitant conversations, forwarded messages and guesswork. That silence has real consequences — symptoms ignored, questions never asked, help sought too late.

## What the series covers

- **Part 1:** periods, PCOS, fertility and IVF
- **Part 2:** pregnancy, postpartum and menopause

## What we hope you take away

Ask questions. Track your symptoms. Find a doctor you feel comfortable talking to — and share these episodes with the women in your life, *and* the men.

*This post and the episodes are for awareness only and are not a substitute for professional medical advice.*

Watch [Part 2 here](https://www.youtube.com/watch?v=XcICUW9XrS4).
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
    slug: "sweden-dream-vs-reality",
    title: "Sweden: Dream Destination or Harsh Reality?",
    date: "2026-08-25",
    category: "Episode Notes",
    excerpt:
      "High taxes, happy people, work-life balance and real challenges. A guide to our Sweden series for anyone thinking of moving abroad.",
    cover: "",
    video: "dYmflUeeVqM",
    body: `
Our Sweden series is one of the most-discussed things we've made. It started with one long conversation with an Indian who moved there, and grew into a set of short explainers.

## Where to start

- **The full episode** (above) — the honest, long-form conversation
- [Transitioning to Sweden: a personal story](https://www.youtube.com/watch?v=utPEPfy6IIY)
- [50% tax, yet people are happy — why?](https://www.youtube.com/watch?v=bI-i9UV9bDs)
- [Why Sweden's healthcare system is considered special](https://www.youtube.com/watch?v=dX6pkZH3qu0)
- [Work-life balance: a dream for Indians?](https://www.youtube.com/watch?v=jfF8LIeWjuI)

## Why we wanted to tell both sides

Most content about moving abroad is either a highlight reel or a horror story. Real life is in between — and anyone making a life-changing move deserves the full picture.

> Every dream destination is somebody's ordinary Monday.
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
