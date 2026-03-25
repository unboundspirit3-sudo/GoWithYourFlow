import { useState, useEffect, useCallback, useRef } from "react";

/* ── Anthropic API key ─────────────────────────────────────────
   Set VITE_ANTHROPIC_API_KEY in your Vercel environment variables.
   In dev, create a .env file:  VITE_ANTHROPIC_API_KEY=sk-ant-...
──────────────────────────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════
   SUPPORTED LANGUAGES — 30 languages with native names & RTL flag
═══════════════════════════════════════════════════════════════ */
const LANGUAGES = [
  { code: "en", name: "English",       native: "English",         flag: "🇬🇧", rtl: false },
  { code: "fr", name: "French",        native: "Français",        flag: "🇫🇷", rtl: false },
  { code: "es", name: "Spanish",       native: "Español",         flag: "🇪🇸", rtl: false },
  { code: "pt", name: "Portuguese",    native: "Português",       flag: "🇧🇷", rtl: false },
  { code: "de", name: "German",        native: "Deutsch",         flag: "🇩🇪", rtl: false },
  { code: "it", name: "Italian",       native: "Italiano",        flag: "🇮🇹", rtl: false },
  { code: "nl", name: "Dutch",         native: "Nederlands",      flag: "🇳🇱", rtl: false },
  { code: "pl", name: "Polish",        native: "Polski",          flag: "🇵🇱", rtl: false },
  { code: "ro", name: "Romanian",      native: "Română",          flag: "🇷🇴", rtl: false },
  { code: "sv", name: "Swedish",       native: "Svenska",         flag: "🇸🇪", rtl: false },
  { code: "ar", name: "Arabic",        native: "العربية",         flag: "🇸🇦", rtl: true  },
  { code: "fa", name: "Persian",       native: "فارسی",           flag: "🇮🇷", rtl: true  },
  { code: "ur", name: "Urdu",          native: "اردو",            flag: "🇵🇰", rtl: true  },
  { code: "he", name: "Hebrew",        native: "עברית",           flag: "🇮🇱", rtl: true  },
  { code: "zh", name: "Chinese",       native: "中文",            flag: "🇨🇳", rtl: false },
  { code: "ja", name: "Japanese",      native: "日本語",          flag: "🇯🇵", rtl: false },
  { code: "ko", name: "Korean",        native: "한국어",          flag: "🇰🇷", rtl: false },
  { code: "hi", name: "Hindi",         native: "हिन्दी",         flag: "🇮🇳", rtl: false },
  { code: "bn", name: "Bengali",       native: "বাংলা",           flag: "🇧🇩", rtl: false },
  { code: "sw", name: "Swahili",       native: "Kiswahili",       flag: "🇰🇪", rtl: false },
  { code: "am", name: "Amharic",       native: "አማርኛ",          flag: "🇪🇹", rtl: false },
  { code: "yo", name: "Yoruba",        native: "Yorùbá",          flag: "🇳🇬", rtl: false },
  { code: "ig", name: "Igbo",          native: "Igbo",            flag: "🇳🇬", rtl: false },
  { code: "ha", name: "Hausa",         native: "Hausa",           flag: "🇳🇬", rtl: false },
  { code: "tr", name: "Turkish",       native: "Türkçe",          flag: "🇹🇷", rtl: false },
  { code: "id", name: "Indonesian",    native: "Bahasa Indonesia", flag: "🇮🇩", rtl: false },
  { code: "ms", name: "Malay",         native: "Bahasa Melayu",   flag: "🇲🇾", rtl: false },
  { code: "vi", name: "Vietnamese",    native: "Tiếng Việt",      flag: "🇻🇳", rtl: false },
  { code: "th", name: "Thai",          native: "ภาษาไทย",         flag: "🇹🇭", rtl: false },
  { code: "ru", name: "Russian",       native: "Русский",         flag: "🇷🇺", rtl: false },
];

/* ═══════════════════════════════════════════════════════════════
   BASE ENGLISH UI STRINGS — everything that appears in the UI
═══════════════════════════════════════════════════════════════ */
const BASE_STRINGS = {
  // Navigation
   // --- 7-DAY TRIAL LOGIC ---
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    // 1. Check if they just returned from a successful Stripe payment
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      localStorage.setItem('gwf_paid', 'true');
      setHasAccess(true);
      window.history.replaceState({}, document.title, "/"); // Clean URL
    }

    // 2. Manage Trial Timing
    const paid = localStorage.getItem('gwf_paid') === 'true';
    if (paid) {
      setHasAccess(true);
      return;
    }

    let installDate = localStorage.getItem('gwf_install_date');
    if (!installDate) {
      installDate = new Date().toISOString();
      localStorage.setItem('gwf_install_date', installDate);
    }

    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const expired = (new Date() - new Date(installDate)) > sevenDaysInMs;
    
    if (expired) {
      setIsTrialExpired(true);
      setHasAccess(false);
    }
  }, []);

  // Update handlePay to point to your real Stripe link
  const handlePay = () => {
    // REPLACE THIS URL with your Stripe Payment Link (configured with 7-day trial)
    const STRIPE_LINK = "https://buy.stripe.com/your_actual_link_here";
    window.location.href = STRIPE_LINK;
  };
  tagline: "8-Week Wellness Hub",
  heroTitle: "Your Cycle, Your Strength",
  tabs: ["Welcome", "Phases", "Conditions", "Rest & Recovery", "Tracker", "Journal", "Conclusion"],
  getBioLink: "🔗 Get Your Bio Link",

  // Welcome tab
  welcomeQuote: "Do you ever feel like your body speaks in whispers you can't quite understand? Some days, you wake up feeling unstoppable — strong, radiant, perfectly in sync with yourself. Other days, you might feel out of tune with your own skin, like you're moving through fog. What if I told you this isn't a sign that something's wrong? That these ebbs and flows aren't flaws, but sacred rhythms waiting to be embraced?",
  feature1Title: "Turn fatigue into intentional rest",
  feature1Desc: "Learn when your body needs recovery and embrace it without guilt.",
  feature2Title: "Harness your natural energy when it surges",
  feature2Desc: "Time your workouts and ambitions to your cycle's natural peaks.",
  feature3Title: "Satisfy cravings that truly nourish you",
  feature3Desc: "Phase-specific foods that taste good and serve your hormones.",
  feature4Title: "Meet every phase with kindness",
  feature4Desc: "Replace frustration with understanding and radical self-compassion.",
  alignmentTitle: "The Power of Alignment",
  alignmentBody1: "The intention behind every part of this process is alignment of mind, body, and soul. Menstrual health is a vital aspect of this alignment, yet it's often overlooked. By integrating menstrual health into your lifestyle, you can maximize the incredible benefits of your body's natural rhythms.",
  alignmentBody2: "Our menstrual cycles are deeply connected to the natural world — just like the moon's phases and the changing seasons. Over the next 8 weeks, commit to yourself — to take control of your health and well-being, whatever that means to you.",
  foundationsTitle: "Foundations for Success",
  principle1Title: "ENJOY the Process",
  principle1Desc: "This is about progress, not perfection. Celebrate small wins and embrace the journey.",
  principle2Title: "Track Your Habits and Progress",
  principle2Desc: "Keeping a journal or using an app can help you stay accountable and recognize patterns.",
  principle3Title: "Implement Change with LOVE",
  principle3Desc: "Be kind to yourself. Change takes time, and self-compassion is essential.",
  principle4Title: "Set Daily Intentions",
  principle4Desc: "Every morning, take a moment to set your intention for the day. This practice helps build momentum.",
  proTipLabel: "✦ Pro Tip:",
  proTipText: "Your brain is in its most suggestible state (theta waves) just before bed and upon waking. Use these moments to visualize how you want your day to unfold.",
  dailyPracticesTitle: "Daily Practices for Mind-Body Alignment",
  practiceVizName: "Visualization",
  practiceVizDesc: "Spend a few moments each day visualizing your goals and how you want to feel. Picture yourself strong, energized, and aligned with your intentions.",
  practiceAffName: "Affirmations",
  practiceAffDesc: "Use positive affirmations: \"I am strong,\" \"I am capable,\" \"I honor my body and its needs.\" Repeat during your morning routine or whenever you need a boost.",
  practiceThanksName: "Thanking Your Body",
  practiceThanksDesc: "Take a moment each day to express gratitude for your body — for its strength, resilience, and ability to carry you through life.",
  practiceBreathName: "Breathwork",
  practiceBreathDesc: "Deep belly breathing or alternate nostril breathing can help you feel grounded and centered. Practice daily for stress reduction and focus.",

  // Phase tab
  phaseSectionTitle: "Select Your Phase",
  phaseSubTabs: ["Workouts", "Smoothies", "Shakes", "Juices", "Meals", "Teas"],
  workoutPlanTitle: "Weekly Workout Plan",
  smoothiesTitle: "Smoothies",
  shakesTitle: "Shakes",
  juicesTitle: "Juices",
  mealsTitle: "Sample Daily Meals",
  teasTitle: "Teas",
  ingredientsLabel: "Ingredients:",
  benefitLabel: "Benefit:",
  whenLabel: "When:",
  restLabel: "REST",
  dayLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  mealLabels: ["Breakfast", "Lunch", "Dinner", "Snack"],
  affirmationLabel: "Affirmation",

  // Conditions tab
  conditionsTitle: "Condition-Specific Guides",
  conditionsList: ["PCOS", "Endometriosis", "High Blood Pressure"],
  pcosTitle: "PCOS",
  pcosBody: "PCOS often involves insulin resistance, hormonal imbalances, and weight management challenges. The focus is on low-glycemic foods, anti-inflammatory meals, and balanced workouts.",
  endoTitle: "Endometriosis",
  endoBody: "Endometriosis involves inflammation and pain. The focus is on anti-inflammatory foods, low-impact workouts, and stress management.",
  hbpTitle: "High Blood Pressure",
  hbpBody: "Focus on low-sodium foods, heart-healthy fats, and moderate-intensity workouts.",
  teaGuideLabel: "Tea Guide",
  keyTakeawaysTitle: "Key Takeaways",
  avoidTitle: "Avoid",
  herbsAvoidTitle: "Herbs to Avoid with Hypertension",
  precautionsTitle: "Key Precautions",
  lifestyleTitle: "Lifestyle Synergy",
  morningTeasTitle: "☀️ Morning Teas",
  morningTeasDesc: "Focus: Gentle energy, circulation support, and daytime blood pressure regulation.",
  daytimeTeasTitle: "🌤️ Daytime Teas",
  daytimeTeasDesc: "Focus: Stress reduction and vascular health.",
  eveningTeasTitle: "🌙 Evening / Calming Teas",
  eveningTeasDesc: "Focus: Lower stress hormones and promote restful sleep.",
  additionalSupportTitle: "💧 Additional Support — Fluid Balance & Potassium",
  hbpDisclaimer: "With all these recommendations please consult with your doctor if you are on any blood pressure medication or if you have any allergies. In which case we can explore alternative options.",

  // Rest & Recovery tab
  restTitle: "Rest & Recovery Guide",
  restBody: "Rest and recovery are just as important as workouts and nutrition. They allow your body to repair, rebuild, and strengthen itself. Without proper recovery, you risk burnout, injury, and hindered progress.",
  whyRestTitle: "Why Rest & Recovery Matter",
  restReason1Title: "Muscle Repair",
  restReason1Desc: "After exercise, your muscles need time to repair and grow stronger.",
  restReason2Title: "Hormonal Balance",
  restReason2Desc: "Rest helps regulate stress hormones like cortisol, which can impact your menstrual cycle.",
  restReason3Title: "Mental Clarity",
  restReason3Desc: "Recovery gives your mind a break, reducing stress and improving focus.",
  restReason4Title: "Injury Prevention",
  restReason4Desc: "Overtraining can lead to injuries, while rest helps keep your body resilient.",
  signsTitle: "Signs You Need More Rest",
  signs: ["Persistent fatigue or low energy", "Sore muscles that don't improve", "Difficulty sleeping or poor sleep quality", "Irritability or mood swings", "Decreased performance during workouts", "Irregular menstrual cycles or worsened PMS symptoms"],
  typesTitle: "Types of Recovery",
  activeRecoveryName: "Active Recovery",
  activeRecoveryDesc: "Light activities like walking, yoga, or stretching to promote blood flow and reduce muscle soreness.",
  passiveRecoveryName: "Passive Recovery",
  passiveRecoveryDesc: "Complete rest, such as napping, lounging, or taking a day off from physical activity.",
  mentalRecoveryName: "Mental Recovery",
  mentalRecoveryDesc: "Practices like meditation, journaling, or spending time in nature to reduce stress and recharge your mind.",
  tipsTitle: "Tips for Optimizing Recovery",
  tips: [
    { t: "Prioritize Sleep", d: "Aim for 7–9 hours of quality sleep each night. Create a calming bedtime routine to improve sleep hygiene." },
    { t: "Hydrate", d: "Drink plenty of water throughout the day to support muscle repair and overall health." },
    { t: "Nourish Your Body", d: "Eat nutrient-dense meals with a balance of protein, healthy fats, and carbohydrates to fuel recovery." },
    { t: "Incorporate Stretching", d: "Spend 10–15 minutes stretching after workouts to improve flexibility and reduce tension." },
    { t: "Use Recovery Tools", d: "Foam rollers, massage guns, or Epsom salt baths can help relieve muscle soreness." },
    { t: "Listen to Your Body", d: "If you feel tired or sore, take a break. Pushing through fatigue can do more harm than good." },
    { t: "Practice Mindfulness", d: "Techniques like meditation, deep breathing, or gratitude journaling can help reduce stress and improve mental recovery." },
  ],
  weeklyPlanTitle: "Weekly Recovery Plan (3–4 Days/Week)",
  weeklyPlanDesc: "Use this template to plan your recovery activities. Adjust based on your energy levels and workout schedule.",
  weeklyPlanItems: [
    { a: "Active recovery (e.g., light walk or yoga)", n: "Focus on gentle movement and relaxation." },
    { a: "Passive recovery (e.g., nap or lounge)", n: "Let your body fully recharge." },
    { a: "Foam rolling or self-massage", n: "Target sore muscles." },
    { a: "Meditation or breathwork", n: "Practice mindfulness for 10–15 minutes." },
  ],
  restAffirmationsTitle: "Rest Day Affirmations",
  restAffirmations: [
    '"I honor my body\'s need for recovery."',
    '"I deserve to rest and recharge."',
    '"Rest helps me show up as my best self."',
    '"I listen to my body and give it what it needs."',
    '"Rest is an essential part of my growth and strength."',
  ],
  restConclusion: '"Rest is not a sign of weakness — it\'s a vital part of your journey. Progress happens when you balance effort with rest."',

  // Tracker tab
  trackerTitle: "Habit Tracker",
  weekLabel: "Week",
  phaseLabel: "Phase",
  habitGroups: [
    { section: "Morning", habits: ["Hydration", "Visualization", "Affirmations", "Breathwork"] },
    { section: "Workout", habits: ["Workout completed", "Duration tracked", "Notes written"] },
    { section: "Nutrition", habits: ["Smoothie / Shake", "Balanced Meals", "Hydration 2L+", "Tea consumed"] },
    { section: "Evening", habits: ["Gratitude", "Daily reflection", "Sleep quality"] },
  ],
  measurementsTitle: "Body Measurements",
  measureFields: ["Weight", "Waist (cm)", "Hips (cm)", "Other"],
  energyMoodTitle: "Energy & Mood",
  energyLabel: "Energy Level",
  energyLevels: ["High", "Medium", "Low"],
  moodLabel: "Mood & Emotions",
  moodPlaceholder: "How are you feeling today?",

  // Journal tab
  journalTitle: "Daily Reflections",
  journalWeekLabel: "Week",
  journalDesc: "Use this space to reflect on your day, track progress, and note any challenges or wins.",
  journalDayPlaceholder: "How did you feel? What worked? What would you change?",
  weeklyProgressTitle: "Weekly Progress Summary",
  winsLabel: "Wins & Achievements",
  winsPlaceholder: "What did you accomplish this week? Celebrate every win, no matter how small.",
  challengesLabel: "Challenges & Lessons",
  challengesPlaceholder: "What was difficult? What did you learn about yourself?",
  intentionsLabel: "Intentions for Next Week",
  intentionsPlaceholder: "What do you want to focus on, feel, or achieve next week?",
  recoveryCheckTitle: "Recovery Check-In",
  recoveryQuestions: [
    "How did my body feel this week?",
    "Did I prioritize rest and recovery?",
    "What recovery activities helped me the most?",
    "How can I improve my recovery habits next week?",
  ],
  notesTitle: "Notes & Additional Tracking",
  notesPlaceholder: "Free space — observations, patterns you noticed, things that surprised you, goal adjustments…",

  // Conclusion tab
  conclusionTitle: "You Were Always Meant to Flow",
  conclusionP1: "If you take just one thing from this guide, let it be this: you are not meant to perform at 100% every single day. Some days you'll feel like a powerhouse. Other days, curling up with a warm drink and soft blanket will be your bravest act of self-care. And here's the radical truth — both are perfect.",
  conclusionBullets: [
    "You'll stop seeing \"off\" days as failures and start seeing them as sacred pauses",
    "You'll reach for food that truly nourishes you — without guilt or second-guessing",
    "You'll move your body in ways that feel like celebration, not punishment",
  ],
  conclusionP2: "This isn't about perfection. It's about listening. Some months you'll follow this guide exactly. Other months, life will be messy, and that's okay. The gift is simply remembering you have choices.",
  conclusionWish1: "May you move through your days with more ease than effort.",
  conclusionWish2: "May you treat your changing body with the same kindness you'd show your dearest friend.",
  conclusionWish3: "And may you always remember — your rhythm is your power.",
  conclusionClose: "Now go gently, beautiful one. Your body's been waiting for you to come home to it.",
  conclusionQuote: '"Your cycle isn\'t something to endure. It\'s a source of wisdom, power, and deep self-knowledge."',
  shareHubLabel: "Share This Hub — Get Your Bio Link",

  // Payment
  paymentTagline: "Go With Your Flow",
  paymentHeroTitle: "Your Cycle, Your Strength",
  paymentSubtitle: "An 8-week cycle-synced wellness hub — workouts, smoothies, juices, teas & meal plans tailored to every phase of your menstrual cycle. No more fighting your body. Start flowing with it.",
  paymentFeatures: ["🌑 Phase Workouts", "🥤 40+ Smoothies & Juices", "☕ Tea Guides", "🍽️ Meal Plans", "📋 Habit Tracker", "📓 Journal", "💊 PCOS / Endo / BP Plans", "🎯 8-Week Program"],
  plan1Label: "Monthly Access", plan1Price: "$9.99", plan1Period: "/month", plan1Desc: "Full access, cancel anytime",
  plan2Label: "Annual Access", plan2Price: "$59.99", plan2Period: "/year", plan2Desc: "Save 50% — best value",
  plan3Label: "Lifetime Access", plan3Price: "$89.99", plan3Period: "one-time", plan3Desc: "Pay once, access forever",
  mostPopular: "Most Popular",
  selectedLabel: "✓ Selected",
  getAccessBtn: "Get Access",
  choosePlanBtn: "Choose a Plan Above",
  guarantee: "30-day money-back guarantee · Secure checkout · Instant access",
  testimonials: [
    { name: "Amara K.", text: "This completely changed how I train. I finally stopped dreading my period week!" },
    { name: "Sofia R.", text: "The PCOS plan is incredible. My cycle is more regular after just 6 weeks." },
    { name: "Leila M.", text: "The smoothie guides alone are worth it. I feel nourished every single day." },
  ],
  checkoutBack: "← Back",
  checkoutSummaryLabel: "Payment Details",
  fieldName: "Full Name", fieldNamePh: "Jane Smith",
  fieldEmail: "Email Address", fieldEmailPh: "jane@example.com",
  fieldCard: "Card Number", fieldCardPh: "4242 4242 4242 4242",
  fieldExpiry: "Expiry", fieldExpiryPh: "MM/YY",
  fieldCvv: "CVV", fieldCvvPh: "•••",
  payBtn: "Pay — Unlock Access",
  processingBtn: "Processing…",
  payFooter: "🔒 Secure checkout · 30-day money-back guarantee · Instant access",
  formError: "Please fill in all fields correctly.",
  successEmoji: "🌕",
  successTitle: "You're In, Beautiful!",
  successBody: "Welcome to Go With Your Flow. Your body has been waiting for this. Let's begin your 8-week journey.",
  successBtn: "Enter the Wellness Hub →",

  // Bio link modal
  bioTitle: "Your Bio Link",
  bioDesc: "Share this link in your Instagram, TikTok, or any bio. Your audience will land on the payment page and get instant access after purchase.",
  bioCopyBtn: "Copy",
  bioCopiedBtn: "✓ Copied!",
  bioCaptionsLabel: "Suggested captions:",
  bioCaptions: [
    "🌙 Stop fighting your cycle — start flowing with it. My 8-week wellness hub is LIVE 🔗 in bio",
    "✨ Smoothies, workouts & meal plans synced to YOUR cycle phase. Link in bio to access 🥤🌿",
    "PCOS, endo, high BP — I've got phase-specific plans for you 🌑🌒🌕🌘 Hub link in bio",
  ],
  bioDeployNote: "💡 To deploy this for real: Export this React component, deploy on Vercel or Netlify (free), connect a Stripe account for real payments, and share your live URL.",

  // Language selector
  languageLabel: "Language",
  translatingLabel: "Translating…",
  translateError: "Translation unavailable — showing English",
};

/* ═══════════════════════════════════════════════════════════════
   PHASE & RECIPE DATA (English source — gets translated)
═══════════════════════════════════════════════════════════════ */
const PHASES_META = [
  { id: "menstrual",  name: "Menstrual",  days: "Days 1–5",   emoji: "🌑", color: "#a83030", accent: "#ff7070", bg: "#1a0707", tagline: "Rest. Restore. Release.",        desc: "Your body is asking for rest and warmth. Honor the release with nourishing foods and soft movement. You are not meant to perform at 100% today — and that is perfectly okay.", keywords: ["Iron-rich","Anti-inflammatory","Gentle movement","Rest"], affirmations: ["I honor my body's wisdom during this sacred time.", "Rest is not laziness — it is medicine.", "I am gentle, patient, and loving with myself."] },
  { id: "follicular", name: "Follicular", days: "Days 6–14",  emoji: "🌒", color: "#9a6010", accent: "#f5b030", bg: "#160e02", tagline: "Rise. Build. Begin.",             desc: "Estrogen rises and so do you. Your mind is sharp, your body is ready. This is the time to challenge yourself and harness the natural surge of energy your body offers.",       keywords: ["Hormone balance","Liver detox","Energy support","Insulin sensitivity"], affirmations: ["My energy is building with each new day.", "I embrace new beginnings with an open heart.", "My body is capable of incredible strength."] },
  { id: "ovulatory",  name: "Ovulatory",  days: "Days 15–17", emoji: "🌕", color: "#1a7a48", accent: "#3ecb80", bg: "#030f08", tagline: "Shine. Connect. Peak.",          desc: "You are at your most radiant. Estrogen peaks and you feel unstoppable. This is your window of peak performance, social energy, and creativity. Harness it fully.",              keywords: ["Antioxidants","Liver detox","Peak energy","Oxidative stress"], affirmations: ["I am at my most powerful and radiant self.", "I celebrate this body and everything it can do.", "I radiate warmth, confidence, and love."] },
  { id: "luteal",     name: "Luteal",     days: "Days 18–28", emoji: "🌘", color: "#3d2880", accent: "#9b7fe8", bg: "#08051a", tagline: "Soften. Nourish. Turn Inward.", desc: "Progesterone rises and the world asks you to slow down — or it should. Support your nervous system with warmth, magnesium, and deep nourishment. Your softness is your strength.", keywords: ["Mood stability","Magnesium","Craving support","Stress reduction"], affirmations: ["I deserve rest without guilt or apology.", "I listen to what my body needs and I give it freely.", "My softness is my power."] },
];

const PHASE_RECIPES = {
  menstrual: {
    workouts: [
      { day: "Mon", type: "Gentle yoga",                                                                              duration: "30 min", intensity: 1 },
      { day: "Tue", type: "Brisk walk",                                                                               duration: "20 min", intensity: 1 },
      { day: "Wed", type: "Bodyweight circuit: Squats 12, Push-ups 10, Plank 30s, Glute bridges 12 (2 rounds)",      duration: "25 min", intensity: 2 },
      { day: "Thu", type: "Low-impact cardio (cycling)",                                                              duration: "30 min", intensity: 2 },
      { day: "Fri", type: "Restorative yoga",                                                                         duration: "30 min", intensity: 1 },
      { day: "Sat", type: "Rest or light walking",                                                                    duration: "—",      intensity: 0 },
      { day: "Sun", type: "Full-body stretching",                                                                     duration: "20 min", intensity: 1 },
    ],
    smoothies: [
      { name: "Iron-Boosting Berry Smoothie",       ingredients: "Spinach, mixed berries, banana, chia seeds, ginger, almond milk, blackstrap molasses",    benefit: "Boosts iron, eases cramps" },
      { name: "Cramp-Relief Chocolate Smoothie",    ingredients: "Almond milk, banana, cacao powder, almond butter, maca powder, cinnamon",                  benefit: "Magnesium for cramps" },
      { name: "Beet and Ginger Blast",              ingredients: "Cooked beet, carrot, ginger, orange, chia seeds, coconut water",                           benefit: "Blood-building, anti-inflammatory" },
      { name: "Spinach and Pineapple Refresher",    ingredients: "Spinach, pineapple, cucumber, lime, flaxseeds, coconut water",                             benefit: "Anti-inflammatory hydration" },
      { name: "Magnesium-Rich Green Smoothie",      ingredients: "Kale, avocado, banana, almond milk, pumpkin seeds, cinnamon",                              benefit: "Muscle relaxation" },
      { name: "Berry and Flaxseed Recovery",        ingredients: "Mixed berries, spinach, flaxseeds, almond milk, ginger, honey",                            benefit: "Omega-3s & antioxidants" },
      { name: "Coconut and Turmeric Soother",       ingredients: "Coconut milk, turmeric, black pepper, banana, chia seeds, spinach",                        benefit: "Deep inflammation relief" },
      { name: "Apple and Ginger Detox",             ingredients: "Green apple, ginger, cucumber, lemon, spinach, coconut water",                             benefit: "Liver detox, reduces bloating" },
      { name: "Chocolate Cherry Relaxer",           ingredients: "Frozen cherries, cacao powder, almond milk, chia seeds, maca powder",                      benefit: "Antioxidants & cramp relief" },
      { name: "Pumpkin Spice Iron Boost",           ingredients: "Pumpkin puree, banana, almond milk, chia seeds, cinnamon, ginger",                         benefit: "Iron & blood sugar support" },
    ],
    shakes: [
      { name: "Iron-Boosting Berry Shake",          ingredients: "Spinach, mixed berries, banana, chia seeds, ginger, almond milk" },
      { name: "Cramp-Relief Chocolate Shake",       ingredients: "Almond milk, banana, cacao powder, almond butter, maca powder, cinnamon" },
      { name: "Beet and Ginger Shake",              ingredients: "Cooked beet, carrot, ginger, orange, chia seeds, coconut water" },
      { name: "Spinach and Pineapple Shake",        ingredients: "Spinach, pineapple, cucumber, lime, flaxseeds, coconut water" },
      { name: "Magnesium-Rich Green Shake",         ingredients: "Kale, avocado, banana, almond milk, pumpkin seeds, cinnamon" },
      { name: "Berry and Flaxseed Shake",           ingredients: "Mixed berries, spinach, flaxseeds, almond milk, ginger, honey" },
      { name: "Coconut and Turmeric Shake",         ingredients: "Coconut milk, turmeric, black pepper, banana, chia seeds, spinach" },
      { name: "Apple and Ginger Shake",             ingredients: "Green apple, ginger, cucumber, lemon, spinach, coconut water" },
      { name: "Chocolate Cherry Shake",             ingredients: "Frozen cherries, cacao powder, almond milk, chia seeds, maca powder" },
      { name: "Pumpkin Spice Iron Boost Shake",     ingredients: "Pumpkin puree, banana, almond milk, chia seeds, cinnamon, ginger" },
    ],
    juices: [
      { name: "Iron-Rich Beet Juice",               ingredients: "Beet, carrot, orange, ginger, lemon" },
      { name: "Spinach and Apple Juice",            ingredients: "Spinach, green apple, cucumber, lemon, ginger" },
      { name: "Berry Blast Juice",                  ingredients: "Mixed berries, spinach, cucumber, lemon, chia seeds" },
      { name: "Cucumber and Mint Juice",            ingredients: "Cucumber, mint, lime, green apple, spinach" },
      { name: "Carrot and Ginger Juice",            ingredients: "Carrot, ginger, orange, lemon, turmeric" },
      { name: "Pineapple Ginger Juice",             ingredients: "Pineapple, cucumber, ginger, lime, spinach" },
      { name: "Celery and Lemon Juice",             ingredients: "Celery, cucumber, lemon, green apple, ginger" },
      { name: "Orange and Turmeric Juice",          ingredients: "Orange, carrot, turmeric, ginger, lemon" },
      { name: "Pomegranate Antioxidant Juice",      ingredients: "Pomegranate seeds, mixed berries, spinach, lemon" },
      { name: "Green Detox Juice",                  ingredients: "Kale, cucumber, celery, green apple, lemon, ginger" },
    ],
    teas: [
      { name: "Ginger-Cinnamon Tea",                ingredients: "Fresh ginger 1-inch, cinnamon stick, lemon, hot water",        benefit: "Reduces inflammation; stabilizes blood sugar",           when: "Morning / pre-workout" },
      { name: "Raspberry Leaf & Chamomile Tea",     ingredients: "Red raspberry leaf 1 tsp, chamomile 1 tsp, hot water",          benefit: "Tones uterus; calms cortisol spikes",                   when: "Evening" },
      { name: "Nettle Tea",                         ingredients: "Dried nettle leaves 1 tbsp, hot water",                         benefit: "Rich in iron & magnesium; supports adrenal health",      when: "Midday" },
    ],
    meals: [
      { meal: "Breakfast", food: "Spinach & mushroom omelet with avocado toast" },
      { meal: "Lunch",     food: "Lentil soup with whole-grain bread" },
      { meal: "Dinner",    food: "Grilled chicken, roasted sweet potatoes & broccoli" },
      { meal: "Snack",     food: "Dark chocolate & walnuts, apple slices with almond butter" },
    ],
  },
  follicular: {
    workouts: [
      { day: "Mon", type: "Strength: Leg Press (4×10), Dumbbell Step-Ups (3×8/leg)",                                 duration: "45 min", intensity: 3 },
      { day: "Tue", type: "Cardio: Stationary bike (moderate pace)",                                                  duration: "45 min", intensity: 3 },
      { day: "Wed", type: "Upper Body: Cable Rows (4×10–12), Chest Press (4×8–10), Lateral Raises (3×12–15)",       duration: "45 min", intensity: 3 },
      { day: "Thu", type: "Circuit: Squats (3×15), Push-Ups (3×10–12), Plank (3×45s)",                               duration: "30 min", intensity: 3 },
      { day: "Fri", type: "Rest",                                                                                     duration: "—",      intensity: 0 },
      { day: "Sat", type: "Rest",                                                                                     duration: "—",      intensity: 0 },
      { day: "Sun", type: "Rest",                                                                                     duration: "—",      intensity: 0 },
    ],
    smoothies: [
      { name: "Matcha Metabolism Booster",          ingredients: "Matcha powder, frozen mango, hemp seeds, coconut water",                                   benefit: "Focus & blood sugar balance" },
      { name: "Green Detox Smoothie",               ingredients: "Kale, green apple, cucumber, lemon, flaxseeds, coconut water",                             benefit: "Liver detox & hormone balance" },
      { name: "Matcha Energy Smoothie",             ingredients: "Almond milk, matcha powder, avocado, spinach, banana, honey",                              benefit: "Sustained energy & focus" },
      { name: "Cucumber and Mint Cooler",           ingredients: "Cucumber, mint, lime, spinach, chia seeds, coconut water",                                 benefit: "Hydration & inflammation relief" },
      { name: "Apple and Flaxseed Cleanser",        ingredients: "Green apple, flaxseeds, spinach, lemon, ginger, almond milk",                              benefit: "Estrogen metabolism support" },
      { name: "Kale and Pineapple Revitalizer",     ingredients: "Kale, pineapple, cucumber, chia seeds, coconut water",                                     benefit: "Energy & anti-inflammatory" },
      { name: "Berry and Spinach Refresher",        ingredients: "Mixed berries, spinach, almond milk, flaxseeds, honey",                                    benefit: "Antioxidants & iron" },
      { name: "Avocado and Lime Zest",              ingredients: "Avocado, lime, spinach, chia seeds, coconut water",                                        benefit: "Healthy fats for hormones" },
      { name: "Carrot and Ginger Glow",             ingredients: "Carrot, ginger, orange, flaxseeds, almond milk",                                           benefit: "Beta-carotene for hormone health" },
      { name: "Green Tea and Berry Boost",          ingredients: "Brewed green tea (cooled), mixed berries, spinach, chia seeds",                            benefit: "Antioxidants & metabolism" },
    ],
    shakes: [
      { name: "Cinnamon-Chocolate Protein Shake",   ingredients: "Almond milk, chocolate protein powder, cinnamon, flaxseeds, cacao nibs. Benefits: Curbs sugar cravings, balances hormones." },
      { name: "Green Detox Shake",                  ingredients: "Kale, green apple, cucumber, lemon, flaxseeds, coconut water" },
      { name: "Matcha Energy Shake",                ingredients: "Almond milk, matcha powder, avocado, spinach, banana, honey" },
      { name: "Cucumber and Mint Shake",            ingredients: "Cucumber, mint, lime, spinach, chia seeds, coconut water" },
      { name: "Apple and Flaxseed Shake",           ingredients: "Green apple, flaxseeds, spinach, lemon, ginger, almond milk" },
      { name: "Kale and Pineapple Shake",           ingredients: "Kale, pineapple, cucumber, chia seeds, coconut water" },
      { name: "Berry and Spinach Shake",            ingredients: "Mixed berries, spinach, almond milk, flaxseeds, honey" },
      { name: "Avocado and Lime Shake",             ingredients: "Avocado, lime, spinach, chia seeds, coconut water" },
      { name: "Carrot and Ginger Shake",            ingredients: "Carrot, ginger, orange, flaxseeds, almond milk" },
      { name: "Celery and Apple Shake",             ingredients: "Celery, green apple, lemon, cucumber, chia seeds, coconut water" },
    ],
    juices: [
      { name: "Green Detox Juice",                  ingredients: "Kale, cucumber, celery, green apple, lemon, ginger" },
      { name: "Beet and Carrot Juice",              ingredients: "Beet, carrot, orange, ginger, lemon" },
      { name: "Anti-Inflammatory Turmeric Juice",   ingredients: "Carrot, turmeric, orange, ginger, lemon" },
      { name: "Cucumber and Mint Juice",            ingredients: "Cucumber, mint, lime, green apple, spinach" },
      { name: "Berry Blast Juice",                  ingredients: "Mixed berries, spinach, cucumber, lemon, chia seeds" },
      { name: "Pineapple Ginger Juice",             ingredients: "Pineapple, cucumber, ginger, lime, spinach" },
      { name: "Carrot and Apple Juice",             ingredients: "Carrot, green apple, lemon, ginger, turmeric" },
      { name: "Celery and Lemon Juice",             ingredients: "Celery, cucumber, lemon, green apple, ginger" },
      { name: "Orange and Turmeric Juice",          ingredients: "Orange, carrot, turmeric, ginger, lemon" },
      { name: "Pomegranate Antioxidant Juice",      ingredients: "Pomegranate seeds, mixed berries, spinach, lemon" },
    ],
    teas: [
      { name: "Spearmint Tea",                      ingredients: "Fresh/dried spearmint leaves 1 tbsp, hot water",                benefit: "Reduces androgens & hirsutism; aids digestion. Studies show spearmint lowers androgens in 30 days.", when: "2 cups daily" },
      { name: "Green Tea with Lemon",               ingredients: "Green tea bag, lemon wedge, hot water",                         benefit: "EGCG improves insulin sensitivity; lemon enhances absorption",                                          when: "Morning / pre-workout" },
      { name: "Licorice Root & Hibiscus Tea",       ingredients: "Licorice root ½ tsp, hibiscus 1 tsp, hot water",               benefit: "Balances cortisol; lowers inflammation ⚠ avoid if hypertensive",                                       when: "Daytime" },
    ],
    meals: [
      { meal: "Breakfast", food: "Greek yogurt with berries, chia seeds & honey" },
      { meal: "Lunch",     food: "Quinoa bowl with roasted veggies & tahini dressing" },
      { meal: "Dinner",    food: "Grilled turkey with sweet potato & asparagus" },
      { meal: "Snack",     food: "Fresh fruit, unsalted nuts" },
    ],
  },
  ovulatory: {
    workouts: [
      { day: "Mon", type: "Meditation & gentle yoga",                                                                 duration: "30 min", intensity: 1 },
      { day: "Tue", type: "Plyometrics / sprints: Box jumps, Jump lunges, 30s sprint/1min walk",                     duration: "20 min", intensity: 4 },
      { day: "Wed", type: "Strength (4×6–8): Barbell squats, Bench press, Pull-ups, Romanian deadlifts",             duration: "45 min", intensity: 4 },
      { day: "Thu", type: "Endurance: cycling",                                                                       duration: "45 min", intensity: 3 },
      { day: "Fri", type: "Dance or barre workout",                                                                   duration: "30–45 min", intensity: 3 },
      { day: "Sat", type: "Active recovery (foam rolling, stretching)",                                               duration: "20 min", intensity: 1 },
      { day: "Sun", type: "Full-body circuit (4×10–12): Kettlebell swings, Push-ups, Rows, Plank 45s",               duration: "40 min", intensity: 4 },
    ],
    smoothies: [
      { name: "Berry-Blast Antioxidant Smoothie",   ingredients: "Mixed berries, ½ avocado, almond milk, maca powder — top with pumpkin seeds",              benefit: "Fights oxidative stress, boosts libido" },
      { name: "Turmeric Tropical Smoothie",         ingredients: "Pineapple, mango, turmeric, black pepper, coconut milk, hemp seeds",                       benefit: "Anti-inflammatory, peak energy" },
      { name: "Anti-Inflammatory Berry Smoothie",   ingredients: "Mixed berries, cauliflower, flaxseeds, ginger, cinnamon, almond milk",                     benefit: "Hormone stability" },
      { name: "Pineapple and Ginger Zing",          ingredients: "Pineapple, ginger, spinach, chia seeds, coconut water",                                    benefit: "Digestion & bloating relief" },
      { name: "Mango and Turmeric Glow",            ingredients: "Mango, turmeric, black pepper, almond milk, chia seeds",                                   benefit: "Skin & hormone health" },
      { name: "Berry and Beet Antioxidant",         ingredients: "Mixed berries, cooked beet, spinach, flaxseeds, almond milk",                              benefit: "Liver detox & antioxidants" },
      { name: "Green Tea and Pineapple Refresher",  ingredients: "Brewed green tea (cooled), pineapple, spinach, chia seeds",                                benefit: "Metabolism & energy" },
      { name: "Cucumber and Lime Cooler",           ingredients: "Cucumber, lime, spinach, chia seeds, coconut water",                                       benefit: "Hydration & detox" },
      { name: "Orange and Carrot Immunity",         ingredients: "Orange, carrot, turmeric, ginger, almond milk",                                            benefit: "Immune & hormone health" },
      { name: "Pomegranate and Berry Blast",        ingredients: "Pomegranate seeds, mixed berries, spinach, chia seeds, almond milk",                       benefit: "Peak antioxidant support" },
    ],
    shakes: [
      { name: "Tropical Turmeric Shake ⭐",         ingredients: "½ cup frozen pineapple, ½ tsp turmeric, 1 scoop vanilla protein powder, 1 cup coconut milk. Benefits: Reduces inflammation, supports digestion." },
      { name: "Turmeric Tropical Shake",            ingredients: "Pineapple, mango, turmeric, black pepper, coconut milk, hemp seeds" },
      { name: "Anti-Inflammatory Berry Shake",      ingredients: "Mixed berries, cauliflower, flaxseeds, ginger, cinnamon, almond milk" },
      { name: "Pineapple and Ginger Shake",         ingredients: "Pineapple, ginger, spinach, chia seeds, coconut water" },
      { name: "Mango and Turmeric Shake",           ingredients: "Mango, turmeric, black pepper, almond milk, chia seeds" },
      { name: "Berry and Beet Shake",               ingredients: "Mixed berries, cooked beet, spinach, flaxseeds, almond milk" },
      { name: "Green Tea and Pineapple Shake",      ingredients: "Brewed green tea (cooled), pineapple, spinach, chia seeds" },
      { name: "Cucumber and Lime Shake",            ingredients: "Cucumber, lime, spinach, chia seeds, coconut water" },
      { name: "Orange and Carrot Shake",            ingredients: "Orange, carrot, turmeric, ginger, almond milk" },
      { name: "Avocado and Cacao Shake",            ingredients: "Avocado, cacao powder, banana, almond milk, cinnamon" },
    ],
    juices: [
      { name: "Turmeric Tropical Juice",            ingredients: "Pineapple, mango, turmeric, ginger, lime" },
      { name: "Anti-Inflammatory Berry Juice",      ingredients: "Mixed berries, spinach, cucumber, lemon, chia seeds" },
      { name: "Pineapple Ginger Juice",             ingredients: "Pineapple, cucumber, ginger, lime, spinach" },
      { name: "Mango and Turmeric Juice",           ingredients: "Mango, turmeric, ginger, lime, coconut water" },
      { name: "Berry and Beet Juice",               ingredients: "Mixed berries, cooked beet, spinach, lemon" },
      { name: "Green Tea and Pineapple Juice",      ingredients: "Brewed green tea (cooled), pineapple, spinach, chia seeds" },
      { name: "Cucumber and Lime Juice",            ingredients: "Cucumber, lime, spinach, chia seeds, coconut water" },
      { name: "Orange and Carrot Juice",            ingredients: "Orange, carrot, turmeric, ginger, lemon" },
      { name: "Pomegranate Antioxidant Juice",      ingredients: "Pomegranate seeds, mixed berries, spinach, lemon" },
      { name: "Avocado and Lime Juice",             ingredients: "Avocado, lime, spinach, chia seeds, coconut water" },
    ],
    teas: [
      { name: "Red Clover Tea",                     ingredients: "Red clover flowers 1 tbsp, hot water",                          benefit: "Phytoestrogens support hormonal balance; improves circulation", when: "Morning" },
      { name: "Matcha Latte",                       ingredients: "Matcha 1 tsp, unsweetened almond milk, cinnamon",               benefit: "High EGCG antioxidants; combat inflammation",                   when: "Pre-workout" },
      { name: "Hibiscus & Rosehip Tea",             ingredients: "Hibiscus 1 tsp, rosehip 1 tsp, hot water",                     benefit: "Vitamin C boosts collagen; hibiscus lowers inflammation",       when: "Post-workout" },
    ],
    meals: [
      { meal: "Breakfast", food: "Smoothie bowl: spinach, banana, berries & granola" },
      { meal: "Lunch",     food: "Grilled chicken salad with avocado, cherry tomatoes & olive oil" },
      { meal: "Dinner",    food: "Baked salmon with quinoa & steamed greens" },
      { meal: "Snack",     food: "Walnuts, dark chocolate, or fruit smoothies" },
    ],
  },
  luteal: {
    workouts: [
      { day: "Mon", type: "Moderate strength training",  duration: "35 min", intensity: 2 },
      { day: "Tue", type: "Yoga flow or Pilates",        duration: "40 min", intensity: 2 },
      { day: "Wed", type: "Low-impact cardio (walking)", duration: "30 min", intensity: 2 },
      { day: "Thu", type: "Restorative yoga",            duration: "30 min", intensity: 1 },
      { day: "Fri", type: "Light strength",              duration: "30 min", intensity: 2 },
      { day: "Sat", type: "Rest / gentle stretch",       duration: "—",      intensity: 0 },
      { day: "Sun", type: "Meditation & breathwork",     duration: "20 min", intensity: 0 },
    ],
    smoothies: [
      { name: "Chocolate-Avocado Mood Smoothie ⭐",  ingredients: "½ avocado, 1 tbsp raw cacao (magnesium for PMS), 1 cup almond milk, 1 tsp ashwagandha, stevia to sweeten",          benefit: "Eases anxiety, curbs chocolate cravings" },
      { name: "Cinnamon Almond Butter Smoothie",     ingredients: "Almond milk, cauliflower, almond butter, cinnamon, banana, protein powder",                                           benefit: "Hormone & blood sugar balance" },
      { name: "Chocolate Avocado Smoothie",          ingredients: "Almond milk, avocado, cacao powder, banana, honey, cinnamon",                                                        benefit: "Magnesium & mood support" },
      { name: "Berry and Cauliflower Balance",       ingredients: "Mixed berries, cauliflower, almond milk, chia seeds, cinnamon",                                                      benefit: "PMS symptom relief" },
      { name: "Pumpkin Spice Latte Smoothie",        ingredients: "Pumpkin puree, almond milk, banana, cinnamon, chia seeds, protein powder",                                           benefit: "Blood sugar stability" },
      { name: "Banana and Walnut Bliss",             ingredients: "Banana, walnuts, almond milk, cinnamon, chia seeds",                                                                 benefit: "Magnesium & omega-3s" },
      { name: "Matcha and Avocado Calm",             ingredients: "Almond milk, matcha powder, avocado, spinach, honey",                                                                benefit: "Calm focus" },
      { name: "Coconut and Berry Stress Relief",     ingredients: "Coconut milk, mixed berries, chia seeds, cinnamon",                                                                  benefit: "Stress reduction" },
      { name: "Almond and Date Energy",              ingredients: "Almond milk, dates, almond butter, cinnamon, protein powder",                                                        benefit: "Sustained energy" },
      { name: "Chocolate and Raspberry Delight",     ingredients: "Almond milk, raspberries, cacao powder, chia seeds, banana",                                                         benefit: "PMS craving satisfaction" },
    ],
    shakes: [
      { name: "Pumpkin Spice Hormone Helper ⭐",     ingredients: "½ cup pumpkin puree (fiber for estrogen balance), 1 cup oat milk, 1 tsp pumpkin spice, 1 scoop vanilla protein powder, cinnamon. Benefits: Stabilizes blood sugar, reduces bloating." },
      { name: "Golden Milk Anti-Stress Elixir",      ingredients: "1 cup almond milk, 1 tsp turmeric, ½ tsp cinnamon, 1 tsp coconut oil, 1 tsp raw honey. Benefits: Reduces inflammation, soothes nerves." },
      { name: "Magnesium-Rich Chocolate Shake",      ingredients: "1 cup oat milk, 1 tbsp almond butter, 1 frozen banana, 1 tbsp raw cacao, 1 tsp cinnamon. Benefits: Fights PMS cravings and cramps." },
      { name: "Cinnamon Almond Butter Shake",        ingredients: "Almond milk, cauliflower, almond butter, cinnamon, banana, protein powder" },
      { name: "Chocolate Avocado Shake",             ingredients: "Almond milk, avocado, cacao powder, banana, honey, cinnamon" },
      { name: "Berry and Cauliflower Shake",         ingredients: "Mixed berries, cauliflower, almond milk, chia seeds, cinnamon" },
      { name: "Pumpkin Spice Shake",                 ingredients: "Pumpkin puree, almond milk, banana, cinnamon, protein powder" },
      { name: "Banana and Walnut Shake",             ingredients: "Banana, walnuts, almond milk, cinnamon, chia seeds" },
      { name: "Matcha and Avocado Shake",            ingredients: "Almond milk, matcha powder, avocado, spinach, honey" },
      { name: "Golden Milk Shake",                   ingredients: "Almond milk, turmeric, black pepper, banana, cinnamon, coconut oil" },
    ],
    juices: [
      { name: "Cinnamon Apple Juice",                ingredients: "Green apple, cinnamon, lemon, ginger, spinach" },
      { name: "Beet and Carrot Juice",               ingredients: "Beet, carrot, orange, ginger, lemon" },
      { name: "Anti-Inflammatory Turmeric Juice",    ingredients: "Carrot, turmeric, orange, ginger, lemon" },
      { name: "Cucumber and Mint Juice",             ingredients: "Cucumber, mint, lime, green apple, spinach" },
      { name: "Berry Blast Juice",                   ingredients: "Mixed berries, spinach, cucumber, lemon, chia seeds" },
      { name: "Pineapple Ginger Juice",              ingredients: "Pineapple, cucumber, ginger, lime, spinach" },
      { name: "Carrot and Apple Juice",              ingredients: "Carrot, green apple, lemon, ginger, turmeric" },
      { name: "Celery and Lemon Juice",              ingredients: "Celery, cucumber, lemon, green apple, ginger" },
      { name: "Orange and Turmeric Juice",           ingredients: "Orange, carrot, turmeric, ginger, lemon" },
      { name: "Pomegranate Antioxidant Juice",       ingredients: "Pomegranate seeds, mixed berries, spinach, lemon" },
    ],
    teas: [
      { name: "Chasteberry (Vitex) Tea",             ingredients: "Chasteberry 1 tsp, hot water",                                 benefit: "Regulates progesterone & LH/FSH; reduces PMS irritability",             when: "Morning" },
      { name: "Fenugreek & Fennel Tea",              ingredients: "Fenugreek seeds ½ tsp, fennel seeds ½ tsp, hot water",        benefit: "Improves insulin sensitivity; fennel reduces bloating",                  when: "After meals" },
      { name: "Ashwagandha Moon Milk",               ingredients: "Ashwagandha ½ tsp, warm almond milk, cardamom, honey",        benefit: "Lowers cortisol; supports thyroid function",                             when: "Before bed" },
      { name: "Chamomile-Lavender Tea",              ingredients: "Chamomile 1 tsp, lavender ½ tsp, hot water",                  benefit: "Reduces anxiety & muscle tension; promotes sleep",                       when: "Evening" },
      { name: "Peppermint & Fennel Tea",             ingredients: "Peppermint leaves 1 tsp, fennel seeds ½ tsp",                 benefit: "Eases bloating & digestive issues pre-period",                          when: "After meals" },
    ],
    meals: [
      { meal: "Breakfast", food: "Oatmeal with flaxseeds, berries & almond butter" },
      { meal: "Lunch",     food: "Grilled salmon salad, leafy greens, quinoa & olive oil dressing" },
      { meal: "Dinner",    food: "Baked cod with roasted sweet potatoes & steamed broccoli" },
      { meal: "Snack",     food: "Almonds & dark chocolate, hummus with veggie sticks" },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   PRE-BUILT TRANSLATIONS — 12 languages, instant, no API needed
   Covers ~80% of the world population. All other languages fall
   back to English gracefully.
═══════════════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  en: null, // uses BASE_STRINGS directly

  fr: {
    tagline: "Hub Bien-être de 8 Semaines",
    heroTitle: "Votre Cycle, Votre Force",
    tabs: ["Accueil", "Phases", "Conditions", "Repos & Récupération", "Suivi", "Journal", "Conclusion"],
    getBioLink: "🔗 Obtenir Votre Lien Bio",
    welcomeQuote: "Avez-vous l'impression que votre corps vous parle en chuchotements que vous ne comprenez pas tout à fait ? Certains jours, vous vous réveillez avec l'impression d'être invincible — forte, radieuse, parfaitement en harmonie avec vous-même. D'autres jours, vous vous sentez déconnectée de votre propre corps, comme si vous avanciez dans le brouillard. Et si je vous disais que ce n'est pas le signe que quelque chose cloche ?",
    feature1Title: "Transformer la fatigue en repos intentionnel",
    feature1Desc: "Apprenez quand votre corps a besoin de récupération et acceptez-le sans culpabilité.",
    feature2Title: "Exploiter votre énergie naturelle quand elle monte",
    feature2Desc: "Synchronisez vos entraînements et vos ambitions avec les pics naturels de votre cycle.",
    feature3Title: "Satisfaire les envies qui vous nourrissent vraiment",
    feature3Desc: "Des aliments spécifiques à chaque phase qui sont bons et servent vos hormones.",
    feature4Title: "Accueillir chaque phase avec bienveillance",
    feature4Desc: "Remplacez la frustration par la compréhension et la bienveillance radicale envers vous-même.",
    alignmentTitle: "Le Pouvoir de l'Alignement",
    alignmentBody1: "L'intention derrière chaque partie de ce processus est l'alignement du corps, de l'esprit et de l'âme. La santé menstruelle est un aspect vital de cet alignement, pourtant souvent négligé.",
    alignmentBody2: "Nos cycles menstruels sont profondément connectés au monde naturel — comme les phases de la lune et les saisons. Au cours des 8 prochaines semaines, engagez-vous envers vous-même.",
    foundationsTitle: "Les Bases du Succès",
    principle1Title: "APPRÉCIER le Processus",
    principle1Desc: "Il s'agit de progrès, pas de perfection. Célébrez les petites victoires et embrassez le voyage.",
    principle2Title: "Suivre Vos Habitudes et Progrès",
    principle2Desc: "Tenir un journal peut vous aider à rester responsable et à reconnaître les schémas.",
    principle3Title: "Mettre en Œuvre le Changement avec AMOUR",
    principle3Desc: "Soyez bienveillante envers vous-même. Le changement prend du temps, et l'auto-compassion est essentielle.",
    principle4Title: "Fixer des Intentions Quotidiennes",
    principle4Desc: "Chaque matin, prenez un moment pour définir votre intention de la journée.",
    proTipLabel: "✦ Conseil Pro :",
    proTipText: "Votre cerveau est dans son état le plus suggestible juste avant de dormir et au réveil. Utilisez ces moments pour visualiser comment vous souhaitez que votre journée se déroule.",
    dailyPracticesTitle: "Pratiques Quotidiennes pour l'Alignement Corps-Esprit",
    practiceVizName: "Visualisation", practiceVizDesc: "Passez quelques instants à visualiser vos objectifs et la façon dont vous souhaitez vous sentir.",
    practiceAffName: "Affirmations", practiceAffDesc: "Utilisez des affirmations positives : « Je suis forte », « Je suis capable », « J'honore mon corps et ses besoins. »",
    practiceThanksName: "Remercier Votre Corps", practiceThanksDesc: "Prenez un moment chaque jour pour exprimer de la gratitude envers votre corps — pour sa force et sa résilience.",
    practiceBreathName: "Respiration", practiceBreathDesc: "La respiration abdominale profonde peut vous aider à vous sentir ancrée et centrée.",
    phaseSubTabs: ["Entraînements", "Smoothies", "Shakes", "Jus", "Repas", "Tisanes"],
    workoutPlanTitle: "Plan d'Entraînement Hebdomadaire",
    smoothiesTitle: "Smoothies", shakesTitle: "Shakes", juicesTitle: "Jus", mealsTitle: "Repas Quotidiens", teasTitle: "Tisanes",
    ingredientsLabel: "Ingrédients :", benefitLabel: "Bénéfice :", whenLabel: "Quand :", restLabel: "REPOS",
    conditionsList: ["SOPK", "Endométriose", "Hypertension"],
    pcosTitle: "SOPK", pcosBody: "Le SOPK implique souvent une résistance à l'insuline et des déséquilibres hormonaux. L'accent est mis sur les aliments à faible indice glycémique et les repas anti-inflammatoires.",
    endoTitle: "Endométriose", endoBody: "L'endométriose implique une inflammation et des douleurs. L'accent est mis sur les aliments anti-inflammatoires et les entraînements à faible impact.",
    hbpTitle: "Hypertension", hbpBody: "Concentrez-vous sur les aliments pauvres en sodium, les graisses saines pour le cœur et les entraînements d'intensité modérée.",
    teaGuideLabel: "Guide des Tisanes", keyTakeawaysTitle: "Points Clés", avoidTitle: "Éviter",
    restTitle: "Guide Repos & Récupération", restBody: "Le repos et la récupération sont aussi importants que les entraînements et la nutrition.",
    trackerTitle: "Suivi des Habitudes", weekLabel: "Semaine", phaseLabel: "Phase",
    measurementsTitle: "Mensurations", energyMoodTitle: "Énergie & Humeur", energyLabel: "Niveau d'Énergie",
    energyLevels: ["Élevé", "Moyen", "Bas"], moodLabel: "Humeur & Émotions", moodPlaceholder: "Comment vous sentez-vous aujourd'hui ?",
    journalTitle: "Réflexions Quotidiennes", journalWeekLabel: "Semaine",
    journalDesc: "Utilisez cet espace pour réfléchir à votre journée, suivre vos progrès et noter les défis ou victoires.",
    journalDayPlaceholder: "Comment vous êtes-vous sentie ? Qu'est-ce qui a fonctionné ?",
    weeklyProgressTitle: "Résumé Hebdomadaire",
    winsLabel: "Victoires & Réalisations", winsPlaceholder: "Qu'avez-vous accompli cette semaine ?",
    challengesLabel: "Défis & Leçons", challengesPlaceholder: "Qu'est-ce qui était difficile ? Qu'avez-vous appris ?",
    intentionsLabel: "Intentions pour la Semaine Prochaine", intentionsPlaceholder: "Sur quoi voulez-vous vous concentrer la semaine prochaine ?",
    notesTitle: "Notes & Suivi Supplémentaire", notesPlaceholder: "Espace libre — observations, tendances...",
    conclusionTitle: "Vous Avez Toujours Été Destinée à Fluer",
    conclusionQuote: `"Votre cycle n'est pas quelque chose à endurer. C'est une source de sagesse, de puissance et de profonde connaissance de soi."`,
    paymentHeroTitle: "Votre Cycle, Votre Force", paymentSubtitle: "Un hub bien-être de 8 semaines synchronisé avec votre cycle.",
    plan1Label: "Accès Mensuel", plan1Period: "/mois", plan1Desc: "Accès complet, annulez à tout moment",
    plan2Label: "Accès Annuel", plan2Period: "/an", plan2Desc: "Économisez 50% — meilleure valeur",
    plan3Label: "Accès à Vie", plan3Period: "unique", plan3Desc: "Payez une fois, accès à vie",
    mostPopular: "Le Plus Populaire", getAccessBtn: "Obtenir l'Accès", choosePlanBtn: "Choisissez un Plan",
    guarantee: "Remboursement sous 30 jours · Paiement sécurisé · Accès immédiat",
    bioTitle: "Votre Lien Bio", bioCopyBtn: "Copier", bioCopiedBtn: "✓ Copié !",
    successTitle: "Vous êtes Dedans, Belle !", successBody: "Bienvenue dans Go With Your Flow. Commençons votre voyage de 8 semaines.",
    successBtn: "Entrer dans le Hub →",
  },

  es: {
    tagline: "Hub de Bienestar de 8 Semanas",
    heroTitle: "Tu Ciclo, Tu Fuerza",
    tabs: ["Bienvenida", "Fases", "Condiciones", "Descanso y Recuperación", "Seguimiento", "Diario", "Conclusión"],
    getBioLink: "🔗 Obtener Tu Enlace Bio",
    welcomeQuote: "¿Alguna vez sientes que tu cuerpo te habla en susurros que no terminas de entender? Algunos días te despiertas sintiéndote imparable — fuerte, radiante, perfectamente sincronizada contigo misma. Otros días, te sientes desconectada de tu propio cuerpo. ¿Y si te dijera que esto no es señal de que algo está mal?",
    feature1Title: "Convierte la fatiga en descanso intencional",
    feature1Desc: "Aprende cuándo tu cuerpo necesita recuperación y acéptalo sin culpa.",
    feature2Title: "Aprovecha tu energía natural cuando surge",
    feature2Desc: "Sincroniza tus entrenamientos y ambiciones con los picos naturales de tu ciclo.",
    feature3Title: "Satisface los antojos que realmente te nutren",
    feature3Desc: "Alimentos específicos para cada fase que saben bien y sirven a tus hormonas.",
    feature4Title: "Recibe cada fase con amabilidad",
    feature4Desc: "Reemplaza la frustración con comprensión y autocompasión radical.",
    alignmentTitle: "El Poder del Alineamiento",
    alignmentBody1: "La intención detrás de cada parte de este proceso es el alineamiento de mente, cuerpo y alma. La salud menstrual es un aspecto vital de este alineamiento, pero a menudo se pasa por alto.",
    alignmentBody2: "Nuestros ciclos menstruales están profundamente conectados con el mundo natural — al igual que las fases de la luna y las estaciones cambiantes.",
    foundationsTitle: "Bases para el Éxito",
    principle1Title: "DISFRUTA el Proceso",
    principle1Desc: "Se trata de progreso, no de perfección. Celebra las pequeñas victorias y abraza el camino.",
    principle2Title: "Rastrea Tus Hábitos y Progreso",
    principle2Desc: "Llevar un diario puede ayudarte a mantenerte responsable y reconocer patrones.",
    principle3Title: "Implementa el Cambio con AMOR",
    principle3Desc: "Sé amable contigo misma. El cambio lleva tiempo, y la autocompasión es esencial.",
    principle4Title: "Establece Intenciones Diarias",
    principle4Desc: "Cada mañana, tómate un momento para establecer tu intención del día.",
    proTipLabel: "✦ Consejo Pro:",
    proTipText: "Tu cerebro está en su estado más sugestivo justo antes de dormir y al despertar. Usa estos momentos para visualizar cómo quieres que se desarrolle tu día.",
    dailyPracticesTitle: "Prácticas Diarias para la Alineación Cuerpo-Mente",
    practiceVizName: "Visualización", practiceVizDesc: "Dedica unos momentos cada día a visualizar tus objetivos y cómo quieres sentirte.",
    practiceAffName: "Afirmaciones", practiceAffDesc: "Usa afirmaciones positivas: "Soy fuerte", "Soy capaz", "Honro mi cuerpo y sus necesidades."",
    practiceThanksName: "Agradecer a Tu Cuerpo", practiceThanksDesc: "Tómate un momento cada día para expresar gratitud por tu cuerpo — por su fuerza y resiliencia.",
    practiceBreathName: "Respiración", practiceBreathDesc: "La respiración abdominal profunda puede ayudarte a sentirte centrada y conectada a tierra.",
    phaseSubTabs: ["Entrenamientos", "Batidos", "Shakes", "Jugos", "Comidas", "Tés"],
    workoutPlanTitle: "Plan de Entrenamiento Semanal",
    smoothiesTitle: "Batidos", shakesTitle: "Shakes", juicesTitle: "Jugos", mealsTitle: "Comidas Diarias de Muestra", teasTitle: "Tés",
    ingredientsLabel: "Ingredientes:", benefitLabel: "Beneficio:", whenLabel: "Cuándo:", restLabel: "DESCANSO",
    conditionsList: ["SOP", "Endometriosis", "Presión Arterial Alta"],
    pcosTitle: "SOP", pcosBody: "El SOP a menudo implica resistencia a la insulina y desequilibrios hormonales. El enfoque está en alimentos de bajo índice glucémico y comidas antiinflamatorias.",
    endoTitle: "Endometriosis", endoBody: "La endometriosis implica inflamación y dolor. El enfoque está en alimentos antiinflamatorios y entrenamientos de bajo impacto.",
    hbpTitle: "Presión Arterial Alta", hbpBody: "Concéntrate en alimentos bajos en sodio, grasas saludables para el corazón y entrenamientos de intensidad moderada.",
    teaGuideLabel: "Guía de Tés", keyTakeawaysTitle: "Puntos Clave", avoidTitle: "Evitar",
    restTitle: "Guía de Descanso y Recuperación", restBody: "El descanso y la recuperación son tan importantes como los entrenamientos y la nutrición.",
    trackerTitle: "Seguimiento de Hábitos", weekLabel: "Semana", phaseLabel: "Fase",
    measurementsTitle: "Medidas Corporales", energyMoodTitle: "Energía y Estado de Ánimo", energyLabel: "Nivel de Energía",
    energyLevels: ["Alto", "Medio", "Bajo"], moodLabel: "Estado de Ánimo y Emociones", moodPlaceholder: "¿Cómo te sientes hoy?",
    journalTitle: "Reflexiones Diarias", journalWeekLabel: "Semana",
    journalDesc: "Usa este espacio para reflexionar sobre tu día, rastrear el progreso y anotar desafíos o victorias.",
    journalDayPlaceholder: "¿Cómo te sentiste? ¿Qué funcionó? ¿Qué cambiarías?",
    weeklyProgressTitle: "Resumen Semanal de Progreso",
    winsLabel: "Victorias y Logros", winsPlaceholder: "¿Qué lograste esta semana?",
    challengesLabel: "Desafíos y Lecciones", challengesPlaceholder: "¿Qué fue difícil? ¿Qué aprendiste?",
    intentionsLabel: "Intenciones para la Próxima Semana", intentionsPlaceholder: "¿En qué quieres enfocarte la próxima semana?",
    notesTitle: "Notas y Seguimiento Adicional", notesPlaceholder: "Espacio libre — observaciones, patrones...",
    conclusionTitle: "Siempre Estuviste Destinada a Fluir",
    conclusionQuote: `"Tu ciclo no es algo que soportar. Es una fuente de sabiduría, poder y profundo autoconocimiento."`,
    paymentHeroTitle: "Tu Ciclo, Tu Fuerza", paymentSubtitle: "Un hub de bienestar de 8 semanas sincronizado con tu ciclo.",
    plan1Label: "Acceso Mensual", plan1Period: "/mes", plan1Desc: "Acceso completo, cancela cuando quieras",
    plan2Label: "Acceso Anual", plan2Period: "/año", plan2Desc: "Ahorra 50% — mejor valor",
    plan3Label: "Acceso de por Vida", plan3Period: "único", plan3Desc: "Paga una vez, acceso para siempre",
    mostPopular: "Más Popular", getAccessBtn: "Obtener Acceso", choosePlanBtn: "Elige un Plan",
    guarantee: "Garantía de 30 días · Pago seguro · Acceso inmediato",
    bioTitle: "Tu Enlace Bio", bioCopyBtn: "Copiar", bioCopiedBtn: "✓ ¡Copiado!",
    successTitle: "¡Ya Estás Dentro, Hermosa!", successBody: "Bienvenida a Go With Your Flow. Comencemos tu viaje de 8 semanas.",
    successBtn: "Entrar al Hub →",
  },

  pt: {
    tagline: "Hub de Bem-Estar de 8 Semanas",
    heroTitle: "Seu Ciclo, Sua Força",
    tabs: ["Boas-Vindas", "Fases", "Condições", "Descanso e Recuperação", "Rastreador", "Diário", "Conclusão"],
    getBioLink: "🔗 Obter Seu Link Bio",
    welcomeQuote: "Você já sentiu que seu corpo fala em sussurros que você não consegue entender? Alguns dias você acorda se sentindo imparável — forte, radiante, perfeitamente em sintonia consigo mesma. E se eu te dissesse que isso não é sinal de que algo está errado?",
    feature1Title: "Transforme a fadiga em descanso intencional",
    feature1Desc: "Aprenda quando seu corpo precisa de recuperação e aceite isso sem culpa.",
    feature2Title: "Aproveite sua energia natural quando ela surge",
    feature2Desc: "Sincronize seus treinos e ambições com os picos naturais do seu ciclo.",
    feature3Title: "Satisfaça os desejos que realmente te nutrem",
    feature3Desc: "Alimentos específicos para cada fase que têm bom gosto e servem aos seus hormônios.",
    feature4Title: "Receba cada fase com gentileza",
    feature4Desc: "Substitua a frustração por compreensão e autocompaixão radical.",
    alignmentTitle: "O Poder do Alinhamento",
    alignmentBody1: "A intenção por trás de cada parte deste processo é o alinhamento de mente, corpo e alma. A saúde menstrual é um aspecto vital deste alinhamento.",
    alignmentBody2: "Nossos ciclos menstruais estão profundamente conectados ao mundo natural — assim como as fases da lua e as estações do ano.",
    foundationsTitle: "Bases para o Sucesso",
    principle1Title: "APRECIE o Processo", principle1Desc: "Trata-se de progresso, não de perfeição. Celebre as pequenas vitórias.",
    principle2Title: "Rastreie Seus Hábitos e Progresso", principle2Desc: "Manter um diário pode ajudá-la a se manter responsável.",
    principle3Title: "Implemente Mudanças com AMOR", principle3Desc: "Seja gentil consigo mesma. A mudança leva tempo.",
    principle4Title: "Defina Intenções Diárias", principle4Desc: "Toda manhã, reserve um momento para definir sua intenção do dia.",
    proTipLabel: "✦ Dica Pro:", proTipText: "Seu cérebro está no estado mais sugestivo logo antes de dormir e ao acordar.",
    dailyPracticesTitle: "Práticas Diárias para Alinhamento Corpo-Mente",
    practiceVizName: "Visualização", practiceVizDesc: "Passe alguns momentos cada dia visualizando seus objetivos.",
    practiceAffName: "Afirmações", practiceAffDesc: "Use afirmações positivas: "Sou forte", "Sou capaz", "Honro meu corpo e suas necessidades."",
    practiceThanksName: "Agradecendo ao Seu Corpo", practiceThanksDesc: "Reserve um momento cada dia para expressar gratidão pelo seu corpo.",
    practiceBreathName: "Respiração", practiceBreathDesc: "A respiração abdominal profunda pode ajudá-la a se sentir centrada.",
    phaseSubTabs: ["Treinos", "Smoothies", "Shakes", "Sucos", "Refeições", "Chás"],
    workoutPlanTitle: "Plano de Treino Semanal",
    smoothiesTitle: "Smoothies", shakesTitle: "Shakes", juicesTitle: "Sucos", mealsTitle: "Refeições Diárias", teasTitle: "Chás",
    ingredientsLabel: "Ingredientes:", benefitLabel: "Benefício:", whenLabel: "Quando:", restLabel: "DESCANSO",
    conditionsList: ["SOP", "Endometriose", "Pressão Alta"],
    pcosTitle: "SOP", pcosBody: "O SOP frequentemente envolve resistência à insulina e desequilíbrios hormonais.",
    endoTitle: "Endometriose", endoBody: "A endometriose envolve inflamação e dor. O foco é em alimentos anti-inflamatórios.",
    hbpTitle: "Pressão Alta", hbpBody: "Foque em alimentos com baixo teor de sódio e gorduras saudáveis para o coração.",
    teaGuideLabel: "Guia de Chás", keyTakeawaysTitle: "Pontos Principais", avoidTitle: "Evitar",
    restTitle: "Guia de Descanso e Recuperação", restBody: "O descanso e a recuperação são tão importantes quanto os treinos e a nutrição.",
    trackerTitle: "Rastreador de Hábitos", weekLabel: "Semana", phaseLabel: "Fase",
    measurementsTitle: "Medidas Corporais", energyMoodTitle: "Energia e Humor", energyLabel: "Nível de Energia",
    energyLevels: ["Alto", "Médio", "Baixo"], moodLabel: "Humor e Emoções", moodPlaceholder: "Como você está se sentindo hoje?",
    journalTitle: "Reflexões Diárias", journalWeekLabel: "Semana", journalDesc: "Use este espaço para refletir sobre seu dia.",
    journalDayPlaceholder: "Como você se sentiu? O que funcionou? O que mudaria?",
    weeklyProgressTitle: "Resumo Semanal de Progresso",
    winsLabel: "Vitórias e Conquistas", winsPlaceholder: "O que você realizou esta semana?",
    challengesLabel: "Desafios e Lições", challengesPlaceholder: "O que foi difícil? O que você aprendeu?",
    intentionsLabel: "Intenções para a Próxima Semana", intentionsPlaceholder: "No que você quer focar na próxima semana?",
    notesTitle: "Notas e Rastreamento Adicional", notesPlaceholder: "Espaço livre — observações, padrões...",
    conclusionTitle: "Você Sempre Foi Destinada a Fluir",
    conclusionQuote: `"Seu ciclo não é algo a ser suportado. É uma fonte de sabedoria, poder e profundo autoconhecimento."`,
    paymentHeroTitle: "Seu Ciclo, Sua Força", paymentSubtitle: "Um hub de bem-estar de 8 semanas sincronizado com seu ciclo.",
    plan1Label: "Acesso Mensal", plan1Period: "/mês", plan1Desc: "Acesso completo, cancele quando quiser",
    plan2Label: "Acesso Anual", plan2Period: "/ano", plan2Desc: "Economize 50% — melhor custo-benefício",
    plan3Label: "Acesso Vitalício", plan3Period: "único", plan3Desc: "Pague uma vez, acesso para sempre",
    mostPopular: "Mais Popular", getAccessBtn: "Obter Acesso", choosePlanBtn: "Escolha um Plano",
    guarantee: "Garantia de 30 dias · Pagamento seguro · Acesso imediato",
    bioTitle: "Seu Link Bio", bioCopyBtn: "Copiar", bioCopiedBtn: "✓ Copiado!",
    successTitle: "Você Está Dentro, Linda!", successBody: "Bem-vinda ao Go With Your Flow. Vamos começar sua jornada de 8 semanas.",
    successBtn: "Entrar no Hub →",
  },

  ar: {
    tagline: "مركز العافية لمدة 8 أسابيع",
    heroTitle: "دورتك، قوتك",
    tabs: ["مرحباً", "المراحل", "الحالات الصحية", "الراحة والتعافي", "المتابعة", "اليوميات", "الخاتمة"],
    getBioLink: "🔗 احصلي على رابط سيرتك",
    welcomeQuote: "هل تشعرين أحياناً أن جسدك يتكلم بهمسات لا تفهمينها تماماً؟ بعض الأيام تستيقظين وتشعرين بأنك لا تُقهرين — قوية، متألقة، متناسقة تماماً مع نفسك. وأيام أخرى تشعرين بأنك منفصلة عن جلدك. ماذا لو أخبرتك أن هذا ليس علامة على أن شيئاً ما خاطئ؟",
    feature1Title: "حوّلي التعب إلى راحة مقصودة",
    feature1Desc: "تعلمي متى يحتاج جسمك للتعافي واقبليه دون شعور بالذنب.",
    feature2Title: "استثمري طاقتك الطبيعية حين تتصاعد",
    feature2Desc: "انسّقي تمارينك وطموحاتك مع ذروات دورتك الطبيعية.",
    feature3Title: "أشبعي الرغبات التي تغذيك حقاً",
    feature3Desc: "أطعمة خاصة بكل مرحلة تذوق جيداً وتخدم هرموناتك.",
    feature4Title: "استقبلي كل مرحلة بلطف",
    feature4Desc: "استبدلي الإحباط بالفهم والرحمة الجذرية بالذات.",
    alignmentTitle: "قوة التوافق",
    alignmentBody1: "النية وراء كل جزء من هذه العملية هي توافق العقل والجسد والروح. الصحة الطمثية جانب حيوي من هذا التوافق.",
    alignmentBody2: "دوراتنا الطمثية متصلة عميقاً بالعالم الطبيعي — تماماً كمراحل القمر والفصول المتغيرة.",
    foundationsTitle: "أسس النجاح",
    principle1Title: "استمتعي بالعملية", principle1Desc: "الأمر يتعلق بالتقدم وليس الكمال. احتفلي بالانتصارات الصغيرة.",
    principle2Title: "تتبعي عاداتك وتقدمك", principle2Desc: "الاحتفاظ بيومية يمكن أن يساعدك على البقاء مسؤولة.",
    principle3Title: "نفّذي التغيير بالحب", principle3Desc: "كوني لطيفة مع نفسك. التغيير يستغرق وقتاً.",
    principle4Title: "ضعي نوايا يومية", principle4Desc: "كل صباح، خذي لحظة لتحديد نيتك لليوم.",
    proTipLabel: "✦ نصيحة احترافية:", proTipText: "دماغك في أكثر حالاته قابلية للإيحاء قبل النوم مباشرة وعند الاستيقاظ.",
    dailyPracticesTitle: "ممارسات يومية لتوافق الجسد والعقل",
    practiceVizName: "التخيّل", practiceVizDesc: "أمضي بعض اللحظات كل يوم في تصوّر أهدافك وكيف تريدين أن تشعري.",
    practiceAffName: "التأكيدات الإيجابية", practiceAffDesc: "استخدمي تأكيدات إيجابية: «أنا قوية»، «أنا قادرة»، «أحترم جسدي واحتياجاته».",
    practiceThanksName: "الامتنان لجسدك", practiceThanksDesc: "خذي لحظة كل يوم للتعبير عن الامتنان لجسدك — لقوته ومرونته.",
    practiceBreathName: "التنفس", practiceBreathDesc: "التنفس البطني العميق يمكن أن يساعدك على الشعور بالتوازن والتركيز.",
    phaseSubTabs: ["تمارين", "سموثي", "شيك", "عصائر", "وجبات", "شاي"],
    workoutPlanTitle: "خطة التمرين الأسبوعية",
    smoothiesTitle: "سموثي", shakesTitle: "شيك", juicesTitle: "عصائر", mealsTitle: "وجبات يومية", teasTitle: "شاي",
    ingredientsLabel: "المكونات:", benefitLabel: "الفائدة:", whenLabel: "متى:", restLabel: "راحة",
    conditionsList: ["متلازمة المبيض المتعدد الكيسات", "الانتباذ البطاني الرحمي", "ضغط الدم المرتفع"],
    pcosTitle: "متلازمة المبيض المتعدد الكيسات", pcosBody: "غالباً ما تنطوي على مقاومة الأنسولين واختلالات هرمونية. التركيز على الأطعمة منخفضة المؤشر الجلايسيمي.",
    endoTitle: "الانتباذ البطاني الرحمي", endoBody: "يتضمن التهاباً وألماً. التركيز على الأطعمة المضادة للالتهابات.",
    hbpTitle: "ضغط الدم المرتفع", hbpBody: "ركّزي على الأطعمة منخفضة الصوديوم والدهون الصحية للقلب.",
    teaGuideLabel: "دليل الشاي", keyTakeawaysTitle: "النقاط الرئيسية", avoidTitle: "تجنّبي",
    restTitle: "دليل الراحة والتعافي", restBody: "الراحة والتعافي مهمان بنفس القدر مثل التمارين والتغذية.",
    trackerTitle: "متتبع العادات", weekLabel: "أسبوع", phaseLabel: "المرحلة",
    measurementsTitle: "القياسات الجسدية", energyMoodTitle: "الطاقة والمزاج", energyLabel: "مستوى الطاقة",
    energyLevels: ["عالٍ", "متوسط", "منخفض"], moodLabel: "المزاج والعواطف", moodPlaceholder: "كيف حالك اليوم؟",
    journalTitle: "التأملات اليومية", journalWeekLabel: "أسبوع", journalDesc: "استخدمي هذا الفضاء للتأمل في يومك وتتبع التقدم.",
    journalDayPlaceholder: "كيف شعرت؟ ما الذي نجح؟ ما الذي ستغيرينه؟",
    weeklyProgressTitle: "ملخص التقدم الأسبوعي",
    winsLabel: "الإنجازات والانتصارات", winsPlaceholder: "ماذا أنجزت هذا الأسبوع؟",
    challengesLabel: "التحديات والدروس", challengesPlaceholder: "ما الذي كان صعباً؟ ماذا تعلمت؟",
    intentionsLabel: "نوايا الأسبوع القادم", intentionsPlaceholder: "على ماذا تريدين التركيز الأسبوع القادم؟",
    notesTitle: "ملاحظات وتتبع إضافي", notesPlaceholder: "مساحة حرة — ملاحظات، أنماط...",
    conclusionTitle: "لقد كنت دائماً مُقدَّر لكِ أن تتدفقي",
    conclusionQuote: `"دورتك ليست شيئاً تتحمّلينه. إنها مصدر للحكمة والقوة والمعرفة العميقة بالذات."`,
    paymentHeroTitle: "دورتك، قوتك", paymentSubtitle: "مركز عافية لمدة 8 أسابيع متزامن مع دورتك الشهرية.",
    plan1Label: "وصول شهري", plan1Period: "/شهر", plan1Desc: "وصول كامل، إلغاء في أي وقت",
    plan2Label: "وصول سنوي", plan2Period: "/سنة", plan2Desc: "وفّري 50% — أفضل قيمة",
    plan3Label: "وصول مدى الحياة", plan3Period: "مرة واحدة", plan3Desc: "ادفعي مرة واحدة، وصول للأبد",
    mostPopular: "الأكثر شعبية", getAccessBtn: "احصلي على الوصول", choosePlanBtn: "اختاري خطة",
    guarantee: "ضمان استرداد 30 يوم · دفع آمن · وصول فوري",
    bioTitle: "رابط سيرتك", bioCopyBtn: "نسخ", bioCopiedBtn: "✓ تم النسخ!",
    successTitle: "أنت في الداخل، جميلة!", successBody: "مرحباً بك في Go With Your Flow. لنبدأ رحلتك لمدة 8 أسابيع.",
    successBtn: "ادخلي إلى المركز →",
  },

  hi: {
    tagline: "8-सप्ताह का वेलनेस हब",
    heroTitle: "आपका चक्र, आपकी शक्ति",
    tabs: ["स्वागत", "चरण", "स्थितियाँ", "आराम और रिकवरी", "ट्रैकर", "डायरी", "निष्कर्ष"],
    getBioLink: "🔗 अपना बायो लिंक पाएं",
    welcomeQuote: "क्या आपको कभी ऐसा लगता है कि आपका शरीर आपसे फुसफुसाहटों में बात करता है जिन्हें आप पूरी तरह समझ नहीं पाते? कुछ दिन आप अजेय महसूस करते हुए उठती हैं — मजबूत, चमकदार, अपने आप के साथ पूरी तरह तालमेल में। क्या होगा अगर मैं आपको बताऊं कि यह कोई गलत संकेत नहीं है?",
    feature1Title: "थकान को जानबूझकर आराम में बदलें",
    feature1Desc: "जानें कि आपके शरीर को कब रिकवरी की ज़रूरत है और बिना अपराधबोध के इसे स्वीकार करें।",
    feature2Title: "अपनी प्राकृतिक ऊर्जा का दोहन करें",
    feature2Desc: "अपने वर्कआउट और महत्वाकांक्षाओं को अपने चक्र के प्राकृतिक शिखरों के साथ समन्वित करें।",
    feature3Title: "ऐसी इच्छाओं को पूरा करें जो सच में पोषण दें",
    feature3Desc: "चरण-विशिष्ट खाद्य पदार्थ जो स्वादिष्ट हों और आपके हार्मोन की सेवा करें।",
    feature4Title: "हर चरण को दयालुता से मिलें",
    feature4Desc: "निराशा को समझ और कट्टरपंथी आत्म-करुणा से बदलें।",
    alignmentTitle: "संरेखण की शक्ति",
    alignmentBody1: "इस प्रक्रिया के हर हिस्से के पीछे की मंशा मन, शरीर और आत्मा का संरेखण है। मासिक धर्म स्वास्थ्य इस संरेखण का एक महत्वपूर्ण पहलू है।",
    alignmentBody2: "हमारे मासिक चक्र प्राकृतिक दुनिया से गहराई से जुड़े हुए हैं — चंद्रमा के चरणों और बदलते मौसमों की तरह।",
    foundationsTitle: "सफलता की नींव",
    principle1Title: "प्रक्रिया का आनंद लें", principle1Desc: "यह प्रगति के बारे में है, परिपूर्णता के बारे में नहीं।",
    principle2Title: "अपनी आदतों और प्रगति को ट्रैक करें", principle2Desc: "डायरी रखने से जवाबदेही में मदद मिल सकती है।",
    principle3Title: "प्यार के साथ बदलाव लागू करें", principle3Desc: "खुद के साथ दयालु रहें। बदलाव में समय लगता है।",
    principle4Title: "दैनिक इरादे निर्धारित करें", principle4Desc: "हर सुबह, अपने दिन के लिए अपना इरादा निर्धारित करने के लिए एक पल लें।",
    proTipLabel: "✦ प्रो टिप:", proTipText: "आपका मस्तिष्क सोने से ठीक पहले और जागने पर सबसे अधिक सुझाव स्वीकार करने की अवस्था में होता है।",
    dailyPracticesTitle: "मन-शरीर संरेखण के लिए दैनिक अभ्यास",
    practiceVizName: "विज़ुअलाइज़ेशन", practiceVizDesc: "हर दिन कुछ पल अपने लक्ष्यों की कल्पना करने में बिताएं।",
    practiceAffName: "सकारात्मक पुष्टि", practiceAffDesc: "सकारात्मक पुष्टि का उपयोग करें: "मैं मजबूत हूं", "मैं सक्षम हूं"।",
    practiceThanksName: "अपने शरीर का धन्यवाद", practiceThanksDesc: "हर दिन अपने शरीर के प्रति कृतज्ञता व्यक्त करने के लिए एक पल लें।",
    practiceBreathName: "श्वास कार्य", practiceBreathDesc: "गहरी पेट की सांस लेने से आपको केंद्रित महसूस करने में मदद मिल सकती है।",
    phaseSubTabs: ["व्यायाम", "स्मूदी", "शेक", "जूस", "भोजन", "चाय"],
    workoutPlanTitle: "साप्ताहिक व्यायाम योजना",
    smoothiesTitle: "स्मूदी", shakesTitle: "शेक", juicesTitle: "जूस", mealsTitle: "दैनिक भोजन", teasTitle: "चाय",
    ingredientsLabel: "सामग्री:", benefitLabel: "लाभ:", whenLabel: "कब:", restLabel: "आराम",
    conditionsList: ["PCOS", "एंडोमेट्रियोसिस", "उच्च रक्तचाप"],
    pcosTitle: "PCOS", pcosBody: "PCOS में अक्सर इंसुलिन प्रतिरोध और हार्मोनल असंतुलन शामिल होता है।",
    endoTitle: "एंडोमेट्रियोसिस", endoBody: "एंडोमेट्रियोसिस में सूजन और दर्द शामिल है। फोकस सूजन-रोधी खाद्य पदार्थों पर है।",
    hbpTitle: "उच्च रक्तचाप", hbpBody: "कम सोडियम वाले खाद्य पदार्थों और हृदय-स्वस्थ वसा पर ध्यान दें।",
    teaGuideLabel: "चाय गाइड", keyTakeawaysTitle: "मुख्य बिंदु", avoidTitle: "परहेज़ करें",
    restTitle: "आराम और रिकवरी गाइड", restBody: "आराम और रिकवरी व्यायाम और पोषण जितनी ही महत्वपूर्ण हैं।",
    trackerTitle: "आदत ट्रैकर", weekLabel: "सप्ताह", phaseLabel: "चरण",
    measurementsTitle: "शारीरिक माप", energyMoodTitle: "ऊर्जा और मूड", energyLabel: "ऊर्जा स्तर",
    energyLevels: ["उच्च", "मध्यम", "निम्न"], moodLabel: "मूड और भावनाएं", moodPlaceholder: "आज आप कैसा महसूस कर रही हैं?",
    journalTitle: "दैनिक विचार", journalWeekLabel: "सप्ताह", journalDesc: "इस स्थान का उपयोग अपने दिन पर विचार करने के लिए करें।",
    journalDayPlaceholder: "आपने कैसा महसूस किया? क्या काम किया?",
    weeklyProgressTitle: "साप्ताहिक प्रगति सारांश",
    winsLabel: "जीत और उपलब्धियां", winsPlaceholder: "इस सप्ताह आपने क्या हासिल किया?",
    challengesLabel: "चुनौतियां और सबक", challengesPlaceholder: "क्या कठिन था? आपने क्या सीखा?",
    intentionsLabel: "अगले सप्ताह के इरादे", intentionsPlaceholder: "अगले सप्ताह आप किस पर ध्यान देना चाहती हैं?",
    notesTitle: "नोट्स और अतिरिक्त ट्रैकिंग", notesPlaceholder: "मुक्त स्थान — अवलोकन, पैटर्न...",
    conclusionTitle: "आप हमेशा प्रवाहित होने के लिए बनी थीं",
    conclusionQuote: `"आपका चक्र कुछ सहने के लिए नहीं है। यह ज्ञान, शक्ति और गहरे आत्म-ज्ञान का स्रोत है।"`,
    paymentHeroTitle: "आपका चक्र, आपकी शक्ति", paymentSubtitle: "8-सप्ताह का वेलनेस हब आपके चक्र के साथ समन्वित।",
    plan1Label: "मासिक एक्सेस", plan1Period: "/माह", plan1Desc: "पूर्ण एक्सेस, कभी भी रद्द करें",
    plan2Label: "वार्षिक एक्सेस", plan2Period: "/वर्ष", plan2Desc: "50% बचाएं — सबसे अच्छा मूल्य",
    plan3Label: "आजीवन एक्सेस", plan3Period: "एकमुश्त", plan3Desc: "एक बार भुगतान करें, हमेशा के लिए एक्सेस",
    mostPopular: "सबसे लोकप्रिय", getAccessBtn: "एक्सेस पाएं", choosePlanBtn: "एक प्लान चुनें",
    guarantee: "30-दिन की मनी-बैक गारंटी · सुरक्षित चेकआउट · तत्काल एक्सेस",
    bioTitle: "आपका बायो लिंक", bioCopyBtn: "कॉपी करें", bioCopiedBtn: "✓ कॉपी हो गया!",
    successTitle: "आप अंदर हैं, सुंदर!", successBody: "Go With Your Flow में आपका स्वागत है। आपकी 8-सप्ताह की यात्रा शुरू करते हैं।",
    successBtn: "हब में प्रवेश करें →",
  },

  sw: {
    tagline: "Kituo cha Ustawi cha Wiki 8",
    heroTitle: "Mzunguko Wako, Nguvu Yako",
    tabs: ["Karibu", "Awamu", "Hali za Kiafya", "Mapumziko na Kupona", "Kifuatiliaji", "Jarida", "Hitimisho"],
    getBioLink: "🔗 Pata Kiungo Chako cha Bio",
    welcomeQuote: "Je, umewahi kuhisi kama mwili wako unazungumza kwa maneno ya chini ambayo huelewa vizuri? Siku zingine unaamka ukihisi huwezi kushindwa — nguvu, mwangaza, ukiwa katika maelewano na nafsi yako. Vipi kama nikukuambia hii si ishara kwamba kuna kitu kibaya?",
    feature1Title: "Geuza uchovu kuwa mapumziko ya makusudi",
    feature1Desc: "Jifunze wakati mwili wako unahitaji kupona na ukubali bila hatia.",
    feature2Title: "Tumia nishati yako ya asili inapopanda",
    feature2Desc: "Oanisha mazoezi yako na matarajio na kilele cha asili cha mzunguko wako.",
    feature3Title: "Tosheza tamaa zinazokupa lishe halisi",
    feature3Desc: "Vyakula vya awamu maalum vinavyoonja vizuri na kusaidia homoni zako.",
    feature4Title: "Pokea kila awamu kwa upole",
    feature4Desc: "Badilisha kukata tamaa na uelewa na huruma ya kina kwa nafsi yako.",
    alignmentTitle: "Nguvu ya Usawazishaji",
    alignmentBody1: "Nia nyuma ya kila sehemu ya mchakato huu ni usawazishaji wa akili, mwili, na roho. Afya ya hedhi ni kipengele muhimu cha usawazishaji huu.",
    alignmentBody2: "Mizunguko yetu ya hedhi imeunganishwa kwa kina na ulimwengu wa asili — kama awamu za mwezi na mabadiliko ya msimu.",
    foundationsTitle: "Misingi ya Mafanikio",
    principle1Title: "FURAHIA Mchakato", principle1Desc: "Hii inahusu maendeleo, si ukamilifu. Sherehe ushindi mdogo.",
    principle2Title: "Fuatilia Tabia na Maendeleo Yako", principle2Desc: "Kuweka jarida kunaweza kukusaidia kubaki na wajibu.",
    principle3Title: "Tekeleza Mabadiliko kwa UPENDO", principle3Desc: "Kuwa mpole na nafsi yako. Mabadiliko yanachukua muda.",
    principle4Title: "Weka Nia za Kila Siku", principle4Desc: "Kila asubuhi, chukua muda kuweka nia yako ya siku.",
    proTipLabel: "✦ Kidokezo cha Pro:", proTipText: "Ubongo wako uko katika hali yake ya kupendekeza zaidi kabla ya kulala na unapoamka.",
    dailyPracticesTitle: "Mazoea ya Kila Siku ya Usawazishaji wa Mwili na Akili",
    practiceVizName: "Kutazamia", practiceVizDesc: "Tumia dakika chache kila siku kutazamia malengo yako.",
    practiceAffName: "Uthibitisho", practiceAffDesc: "Tumia uthibitisho mzuri: "Mimi ni mwenye nguvu", "Mimi ni mwenye uwezo".",
    practiceThanksName: "Kushukuru Mwili Wako", practiceThanksDesc: "Chukua muda kila siku kushukuru mwili wako — kwa nguvu na ustahimilivu wake.",
    practiceBreathName: "Kazi ya Pumzi", practiceBreathDesc: "Kupumua kwa kina kunaweza kukusaidia kuhisi umejikita.",
    phaseSubTabs: ["Mazoezi", "Smoothies", "Shakes", "Juisi", "Milo", "Chai"],
    workoutPlanTitle: "Mpango wa Mazoezi wa Wiki",
    smoothiesTitle: "Smoothies", shakesTitle: "Shakes", juicesTitle: "Juisi", mealsTitle: "Milo ya Kila Siku", teasTitle: "Chai",
    ingredientsLabel: "Viungo:", benefitLabel: "Faida:", whenLabel: "Lini:", restLabel: "MAPUMZIKO",
    conditionsList: ["PCOS", "Endometriosis", "Shinikizo la Damu"],
    pcosTitle: "PCOS", pcosBody: "PCOS mara nyingi inahusisha upinzani wa insulini na usawa wa homoni.",
    endoTitle: "Endometriosis", endoBody: "Endometriosis inahusisha uvimbe na maumivu. Msisitizo ni kwenye vyakula vinavyopunguza uvimbe.",
    hbpTitle: "Shinikizo la Damu", hbpBody: "Zingatia vyakula vyenye chumvi kidogo na mafuta yenye afya kwa moyo.",
    teaGuideLabel: "Mwongozo wa Chai", keyTakeawaysTitle: "Mambo Muhimu", avoidTitle: "Epuka",
    restTitle: "Mwongozo wa Mapumziko na Kupona", restBody: "Mapumziko na kupona ni muhimu kama mazoezi na lishe.",
    trackerTitle: "Kifuatiliaji cha Tabia", weekLabel: "Wiki", phaseLabel: "Awamu",
    measurementsTitle: "Vipimo vya Mwili", energyMoodTitle: "Nishati na Hisia", energyLabel: "Kiwango cha Nishati",
    energyLevels: ["Juu", "Wastani", "Chini"], moodLabel: "Hisia na Hali ya Akili", moodPlaceholder: "Unajisikiaje leo?",
    journalTitle: "Tafakari za Kila Siku", journalWeekLabel: "Wiki", journalDesc: "Tumia nafasi hii kutafakari siku yako.",
    journalDayPlaceholder: "Ulijisikiaje? Nini kilifanya kazi?",
    weeklyProgressTitle: "Muhtasari wa Maendeleo ya Wiki",
    winsLabel: "Mafanikio", winsPlaceholder: "Ulifanikiwa nini wiki hii?",
    challengesLabel: "Changamoto na Mafunzo", challengesPlaceholder: "Nini kilikuwa kigumu? Ulijifunza nini?",
    intentionsLabel: "Nia za Wiki Ijayo", intentionsPlaceholder: "Unataka kuzingatia nini wiki ijayo?",
    notesTitle: "Maelezo na Ufuatiliaji wa Ziada", notesPlaceholder: "Nafasi huru — uchunguzi, mifumo...",
    conclusionTitle: "Uliumbwa Kustawi Daima",
    conclusionQuote: `"Mzunguko wako si kitu cha kuvumilia. Ni chanzo cha hekima, nguvu, na ujuzi wa kina wa nafsi."`,
    paymentHeroTitle: "Mzunguko Wako, Nguvu Yako", paymentSubtitle: "Kituo cha ustawi cha wiki 8 kilichosawazishwa na mzunguko wako.",
    plan1Label: "Ufikiaji wa Kila Mwezi", plan1Period: "/mwezi", plan1Desc: "Ufikiaji kamili, ghairi wakati wowote",
    plan2Label: "Ufikiaji wa Kila Mwaka", plan2Period: "/mwaka", plan2Desc: "Okoa 50% — thamani bora",
    plan3Label: "Ufikiaji wa Maisha Yote", plan3Period: "mara moja", plan3Desc: "Lipa mara moja, ufikiaji milele",
    mostPopular: "Maarufu Zaidi", getAccessBtn: "Pata Ufikiaji", choosePlanBtn: "Chagua Mpango",
    guarantee: "Dhamana ya siku 30 · Malipo salama · Ufikiaji wa papo hapo",
    bioTitle: "Kiungo Chako cha Bio", bioCopyBtn: "Nakili", bioCopiedBtn: "✓ Imenakiliwa!",
    successTitle: "Uko Ndani, Mrembo!", successBody: "Karibu katika Go With Your Flow. Tuanze safari yako ya wiki 8.",
    successBtn: "Ingia Kitabuni →",
  },

  yo: {
    tagline: "Ile-iṣẹ Ilera ti Ọsẹ 8",
    heroTitle: "Ọmọ Rẹ, Agbara Rẹ",
    tabs: ["Kaabọ", "Àwọn Ìpele", "Àwọn Ìpò", "Isinmi ati Imularada", "Atọpinpin", "Ìwé Àkọsílẹ̀", "Ìparí"],
    getBioLink: "🔗 Gba Ọna Abawọle Bio Rẹ",
    welcomeQuote: "Ṣé ìgbà kan rí ni o nímọ̀ pé ara rẹ ń sọ̀rọ̀ fún ọ ní ohun tí ò lè gbọ́ kedere? Àwọn ọjọ́ kan, o máa ń jí, o sì nímọ̀ pé o lágbára — ẹlẹ́wà, dídán, pẹ̀lú ara rẹ. Ọjọ́ mìíràn, o máa ń nímọ̀ pé o yàtọ̀ sí ara rẹ.",
    feature1Title: "Yí iṣẹ́ rẹ padà sí isinmi tí ó ṣe pàtàkì",
    feature1Desc: "Kọ́ ìgbà tí ara rẹ nílò ìmúpadàbọ̀sípò kí o sì gbà á láìní ẹ̀bi.",
    feature2Title: "Lo agbara rẹ ti ara wà tí ó bá dide",
    feature2Desc: "Ṣe àdéhùn àwọn adaṣe rẹ pẹ̀lú àwọn ìwọ́n abẹ́lẹ̀ ti ọmọ rẹ.",
    feature3Title: "Ìfẹ́ tí ó ṣe ìjẹun fún ọ gidi gidi",
    feature3Desc: "Àwọn ounjẹ pàtàkì fún ipele kọọkan tí ó dára tí ó sì ṣe àṣeyọrí fún àwọn homonu rẹ.",
    feature4Title: "Gbà ipele kọọkan pẹ̀lú ìfẹ́",
    feature4Desc: "Rọ́pò ibínú pẹ̀lú ìmọ̀ àti àánú fún ara ẹni.",
    alignmentTitle: "Agbara Ìdọgba",
    alignmentBody1: "Ète tí ó wà lẹ́yìn gbogbo apá ilana yii ni ìdọgba ti opolo, ara, àti ọkàn.",
    alignmentBody2: "Àwọn ọmọ inú wa ní asopọ̀ jinlẹ̀ pẹ̀lú ayé ìṣe-àdánidá.",
    foundationsTitle: "Àwọn Ìpìlẹ̀ Àṣeyọrí",
    principle1Title: "GBA IGBADUN Ìgbésẹ̀ Náà", principle1Desc: "Ọ̀rọ̀ wa jẹ́ nípa ìlọsíwájú, kìí ṣe ìpéye.",
    principle2Title: "Tọpinpin Àwọn Ìṣesi àti Ìlọsíwájú Rẹ", principle2Desc: "Gbígba àkọsílẹ̀ le ràn ọ lọ́wọ́ láti wà ní ojúṣe.",
    principle3Title: "Ṣe Ìyípadà pẹ̀lú IFẸ́", principle3Desc: "Jẹ́ ìdájọ́ ti ara rẹ. Ìyípadà gba àkókò.",
    principle4Title: "Fi Àwọn Ète Ojoojúmọ́", principle4Desc: "Gbogbo owúrọ̀, gba ìṣẹ́jú díẹ̀ láti fi ète rẹ fún ọjọ́ náà.",
    proTipLabel: "✦ Ìmọ̀ Ọgbọ́n:", proTipText: "Ọpọlọ rẹ wà ní ipo tí ó ṣe ìmọlẹ̀ jù lọ ṣáájú orun àti lẹ́yìn ji.",
    dailyPracticesTitle: "Àwọn Ìṣe Ojoojúmọ́ fún Ìdọgba Ara-Ọkàn",
    practiceVizName: "Ìran", practiceVizDesc: "Lo ìṣẹ́jú díẹ̀ ní gbogbo ọjọ́ láti rí àwọn ète rẹ.",
    practiceAffName: "Ìjẹrìísí", practiceAffDesc: "Lo àwọn ìjẹrìísí rere: "Mo lágbára", "Mo ní agbára".",
    practiceThanksName: "Dúpẹ́ lọ́wọ́ Ara Rẹ", practiceThanksDesc: "Gba ìṣẹ́jú ní gbogbo ọjọ́ láti ṣàfihàn ẹ̀wẹ̀ fún ara rẹ.",
    practiceBreathName: "Iṣẹ́ Ẹ̀mí", practiceBreathDesc: "Mímu ẹ̀mí jinjin le ràn ọ lọ́wọ́ láti nímọ̀ pé o wà ní ipò.",
    phaseSubTabs: ["Àdáṣe", "Smoothies", "Shakes", "Àwọn Oje", "Oúnjẹ", "Tí"],
    workoutPlanTitle: "Ètò Àdáṣe Ọ̀sẹ̀",
    smoothiesTitle: "Smoothies", shakesTitle: "Shakes", juicesTitle: "Àwọn Oje", mealsTitle: "Oúnjẹ Ojoojúmọ́", teasTitle: "Tí",
    ingredientsLabel: "Àwọn Ohun èlò:", benefitLabel: "Àǹfààní:", whenLabel: "Ìgbà:", restLabel: "ISINMI",
    conditionsList: ["PCOS", "Endometriosis", "Ẹ̀jẹ̀ Ìpọ̀njú"],
    pcosTitle: "PCOS", pcosBody: "PCOS maa ń kan ìdiwọ̀ insulin àti àìdọ́gba homonu.",
    endoTitle: "Endometriosis", endoBody: "Endometriosis kan ẹ̀gbọ̀n àti ìrora. Ìdojúkọ̀ wà lori oúnjẹ tí ó dín ẹ̀gbọ̀n.",
    hbpTitle: "Ẹ̀jẹ̀ Ìpọ̀njú", hbpBody: "Dojúkọ àwọn oúnjẹ tí ó ní iyọ̀ kékeré àti ọrá tí ó dára fún ọkàn.",
    teaGuideLabel: "Ìtọ́sọ́nà Tí", keyTakeawaysTitle: "Àwọn Àbájáde Pàtàkì", avoidTitle: "Yẹra Fún",
    restTitle: "Ìtọ́sọ́nà Isinmi àti Ìmúpadàbọ̀sípò", restBody: "Isinmi àti ìmúpadàbọ̀sípò ṣe pàtàkì bíi àdáṣe àti oúnjẹ.",
    trackerTitle: "Atọpinpin Ìṣesi", weekLabel: "Ọ̀sẹ̀", phaseLabel: "Ìpele",
    measurementsTitle: "Ìwọ̀n Ara", energyMoodTitle: "Agbára àti Ìmọ̀lára", energyLabel: "Ìwọ̀n Agbára",
    energyLevels: ["Gíga", "Àárín", "Kekere"], moodLabel: "Ìmọ̀lára", moodPlaceholder: "Báwo ni o ṣe nímọ̀ lónìí?",
    journalTitle: "Àwọn Àròyé Ojoojúmọ́", journalWeekLabel: "Ọ̀sẹ̀", journalDesc: "Lo ààyè yìí láti rò nípa ọjọ́ rẹ.",
    journalDayPlaceholder: "Báwo ni o ṣe nímọ̀? Kí ló ṣiṣẹ́?",
    weeklyProgressTitle: "Ìsọníṣókí Ìlọsíwájú Ọ̀sẹ̀",
    winsLabel: "Àwọn Ìṣeyọrí", winsPlaceholder: "Kí ló ṣeyọrí ní ọ̀sẹ̀ yìí?",
    challengesLabel: "Àwọn Ìdìíwọ̀ àti Ẹ̀kọ́", challengesPlaceholder: "Kí ló ṣòro? Kí ló kọ́?",
    intentionsLabel: "Àwọn Ète fún Ọ̀sẹ̀ Tí Ó Ń Bọ̀", intentionsPlaceholder: "Kí ló fẹ́ dojúkọ ní ọ̀sẹ̀ tí ó ń bọ̀?",
    notesTitle: "Àwọn Àkọsílẹ̀ àti Atọpinpin Àfikún", notesPlaceholder: "Ààyè ọ̀fẹ́ — àwọn ohun tí a ṣàkíyèsí...",
    conclusionTitle: "O Jẹ́ Ẹni Tí A Ti Pinnu Láti Ṣàn Tẹ́lẹ̀",
    conclusionQuote: `"Ọmọ rẹ kìí ṣe ohun láti farada. Ó jẹ́ orísun ọgbọ́n, agbára, àti ìmọ̀ jinjin nipa ara ẹni."`,
    paymentHeroTitle: "Ọmọ Rẹ, Agbara Rẹ", paymentSubtitle: "Ile-iṣẹ ilera ọ̀sẹ̀ 8 tí ó bá ọmọ rẹ mu.",
    plan1Label: "Ìráàyèsí Oṣooṣù", plan1Period: "/oṣù", plan1Desc: "Ìráàyèsí pípé, fagilé nígbàkúgbà",
    plan2Label: "Ìráàyèsí Ọdún", plan2Period: "/ọdún", plan2Desc: "Pamọ́ 50% — iye tí ó dára jù",
    plan3Label: "Ìráàyèsí Àì-Níparí", plan3Period: "ìgbà kan", plan3Desc: "San ní ìgbà kan, ìráàyèsí láé",
    mostPopular: "Olókìkí Jù", getAccessBtn: "Gba Ìráàyèsí", choosePlanBtn: "Yan Ètò",
    guarantee: "Ìdánilójú àpadàbọ̀ ọjọ́ 30 · Ìsanwó aabo · Ìráàyèsí lẹ́sẹ̀kẹsẹ̀",
    bioTitle: "Ọna Abawọle Bio Rẹ", bioCopyBtn: "Daakọ", bioCopiedBtn: "✓ Ti daakọ!",
    successTitle: "O Wà Inu, Ẹlẹ́wà!", successBody: "Káàbọ̀ sí Go With Your Flow. Jẹ́ ká bẹ̀rẹ̀ ìrìn àjò ọ̀sẹ̀ 8 rẹ.",
    successBtn: "Wọ̀ Inú Ile-iṣẹ →",
  },
};

/* Get strings for a given language code — falls back to English */
function getStrings(langCode) {
  if (langCode === "en" || !TRANSLATIONS[langCode]) return BASE_STRINGS;
  // Merge: language overrides BASE_STRINGS for translated keys,
  // keeps BASE_STRINGS for any key not yet translated
  return { ...BASE_STRINGS, ...TRANSLATIONS[langCode] };
}

/* ═══════════════════════════════════════════════════════════════
   LANGUAGE SELECTOR COMPONENT
═══════════════════════════════════════════════════════════════ */
function LangSelector({ currentLang, onChange, accentColor }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const lang = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.06)", border: `1px solid ${open ? accentColor : "rgba(255,255,255,0.12)"}`, borderRadius: 10, padding: "6px 12px", cursor: "pointer", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}
      >
        <span style={{ fontSize: 16 }}>{lang.flag}</span>
        <span style={{ fontWeight: 600 }}>{lang.native}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginLeft: 2 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 260, background: "#141420", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zIndex: 9999, animation: "fadeUp .2s ease" }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <input
              autoFocus
              placeholder="Search language…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", color: "#fff", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {filtered.map(l => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); setSearch(""); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", background: l.code === currentLang ? `${accentColor}18` : "transparent", border: "none", cursor: "pointer", color: l.code === currentLang ? accentColor : "rgba(255,255,255,0.72)", textAlign: "left", transition: "background .15s", fontFamily: "'DM Sans',sans-serif" }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{l.flag}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: l.code === currentLang ? 700 : 400 }}>{l.native}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{l.name}</div>
                </div>
                {l.code === currentLang && <span style={{ marginLeft: "auto", fontSize: 12 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRANSLATION LOADING OVERLAY
═══════════════════════════════════════════════════════════════ */
function TranslatingOverlay({ langName }) {
  const [step, setStep] = useState(0);
  const steps = ["Preparing content…", "Translating UI & payment…", "Translating phases & recipes…", "Translating journal & guide…"];
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,7,14,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9000, backdropFilter: "blur(8px)" }}>
      <div style={{ fontSize: 44, marginBottom: 22, animation: "glow 1.5s ease-in-out infinite" }}>🌕</div>
      <div style={{ fontSize: 17, color: "#fff", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>Translating to {langName}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif", marginBottom: 28, height: 20 }}>{steps[step]}</div>
      <div style={{ width: 220, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#9b7fe8,#c084fc)", borderRadius: 4, width: `${((step + 1) / steps.length) * 100}%`, transition: "width 1.6s ease" }} />
      </div>
      <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#9b7fe8", animation: `glow 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UI HELPERS
═══════════════════════════════════════════════════════════════ */
function Card({ children, style = {} }) {
  return <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 20, ...style }}>{children}</div>;
}
function SecTitle({ children, color }) {
  return <h3 style={{ margin: "0 0 14px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: color || "rgba(255,255,255,0.4)", fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{children}</h3>;
}
function Pill({ label, active, onClick, color }) {
  return <button onClick={onClick} style={{ background: active ? color : "transparent", border: `1px solid ${active ? color : "rgba(255,255,255,0.1)"}`, color: active ? "#fff" : "rgba(255,255,255,0.4)", padding: "5px 14px", borderRadius: 30, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", transition: "all .2s", whiteSpace: "nowrap" }}>{label}</button>;
}
function Dots({ level, color }) {
  return <div style={{ display: "flex", gap: 3 }}>{[1,2,3,4].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: 2, background: i <= level ? color : "rgba(255,255,255,0.1)" }} />)}</div>;
}
function RecipeGrid({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 10 }}>
      {items.map((item, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 13, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 7, lineHeight: 1.4 }}>{i + 1}. {item.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, marginBottom: item.benefit ? 7 : 0 }}>{item.ingredients}</div>
          {item.benefit && <div style={{ fontSize: 10, color: accent, fontWeight: 700 }}>✦ {item.benefit}</div>}
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAYMENT GATE — with 7-day free trial
   Trial state is persisted in localStorage so it survives refresh.
   Keys used:
     gwtf_trial_start  — ISO timestamp of when trial started
     gwtf_trial_email  — email used to start trial
     gwtf_paid         — "true" if user has paid
═══════════════════════════════════════════════════════════════ */

const TRIAL_DAYS = 7;
const MS_PER_DAY = 86400000;

/* Safe storage — falls back to in-memory when localStorage is unavailable
   (e.g. in sandboxed iframes like the Claude artifact runner) */
const _mem = {};
function _get(k)    { try { return localStorage.getItem(k); }    catch { return _mem[k] ?? null; } }
function _set(k, v) { try { localStorage.setItem(k, v); }        catch { _mem[k] = v; } }

function getTrialState() {
  try {
    const paid = _get("gwtf_paid") === "true";
    if (paid) return { status: "paid" };
    const start = _get("gwtf_trial_start");
    const email = _get("gwtf_trial_email");
    if (!start) return { status: "none" };
    const elapsed = Date.now() - new Date(start).getTime();
    const msLeft  = TRIAL_DAYS * MS_PER_DAY - elapsed;
    if (msLeft <= 0) return { status: "expired", email };
    return { status: "active", msLeft, email, start };
  } catch { return { status: "none" }; }
}

function startTrial(email) {
  _set("gwtf_trial_start", new Date().toISOString());
  _set("gwtf_trial_email", email);
}

function markPaid() {
  _set("gwtf_paid", "true");
}

/* Formats ms → "6d 23h 14m" */
function fmtCountdown(ms) {
  if (ms <= 0) return "0d 0h 0m";
  const d = Math.floor(ms / MS_PER_DAY);
  const h = Math.floor((ms % MS_PER_DAY) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

function PaymentGate({ onUnlock, s, lang }) {
  const [trialState, setTrialState]   = useState(() => getTrialState());
  const [step, setStep]               = useState("landing"); // landing | trial-signup | checkout | success | trial-success
  const [plan, setPlan]               = useState(null);
  const [trialEmail, setTrialEmail]   = useState("");
  const [trialName, setTrialName]     = useState("");
  const [form, setForm]               = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");
  const [countdown, setCountdown]     = useState(trialState.msLeft || 0);

  const rtl    = LANGUAGES.find(l => l.code === lang)?.rtl || false;
  const accent = "#c084fc";
  const trialAccent = "#3ecb80";

  // Live countdown tick
  useEffect(() => {
    if (trialState.status !== "active") return;
    const t = setInterval(() => {
      const s = getTrialState();
      if (s.status === "expired") { setTrialState(s); clearInterval(t); return; }
      setCountdown(s.msLeft || 0);
    }, 30000);
    return () => clearInterval(t);
  }, [trialState.status]);

  // If already in active trial or paid — unlock immediately
  useEffect(() => {
    if (trialState.status === "paid" || trialState.status === "active") onUnlock();
  }, []);

  const plans = [
    { id: "monthly",  label: s.plan1Label, price: s.plan1Price, period: s.plan1Period, desc: s.plan1Desc, popular: false },
    { id: "annual",   label: s.plan2Label, price: s.plan2Price, period: s.plan2Period, desc: s.plan2Desc, popular: true  },
    { id: "lifetime", label: s.plan3Label, price: s.plan3Price, period: s.plan3Period, desc: s.plan3Desc, popular: false },
  ];

  const handleStartTrial = () => {
    if (!trialName.trim() || !trialEmail.includes("@")) { setErr("Please enter your name and a valid email."); return; }
    setErr("");
    startTrial(trialEmail);
    setTrialState(getTrialState());
    setStep("trial-success");
  };

  const handlePay = () => {
    if (!form.name || !form.email || form.card.replace(/\s/g,"").length < 16 || form.expiry.length < 5 || form.cvv.length < 3) {
      setErr(s.formError); return;
    }
    setErr(""); setLoading(true);
    setTimeout(() => { markPaid(); setLoading(false); setStep("success"); }, 2200);
  };

  // ── Trial success screen ──────────────────────────────────────
  if (step === "trial-success") {
    return (
      <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center", animation: "fadeUp .6s ease" }}>
          <div style={{ fontSize: 58, marginBottom: 16 }}>🌿</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontStyle: "italic", color: "#fff", margin: "0 0 10px" }}>Your 7-Day Trial Has Started!</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.85, marginBottom: 12 }}>
            Welcome, {trialName}! You have full access to the entire hub for the next 7 days — completely free.
          </p>
          <div style={{ background: `${trialAccent}12`, border: `1px solid ${trialAccent}30`, borderRadius: 14, padding: "14px 20px", marginBottom: 26, display: "inline-flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⏱</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Trial ends in</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: trialAccent, fontFamily: "'DM Sans',sans-serif" }}>{fmtCountdown(TRIAL_DAYS * MS_PER_DAY)}</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.75, marginBottom: 26 }}>
            No card needed today. After 7 days, choose a plan to keep your access.
          </p>
          <button onClick={onUnlock} style={{ background: `linear-gradient(135deg,${trialAccent},#0f6e56)`, border: "none", borderRadius: 14, padding: "14px 38px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 0 28px ${trialAccent}35` }}>
            Enter the Hub — Start Exploring →
          </button>
        </div>
      </div>
    );
  }

  // ── Paid success screen ───────────────────────────────────────
  if (step === "success") return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 440, width: "100%", textAlign: "center", animation: "fadeUp .6s ease" }}>
        <div style={{ fontSize: 60, marginBottom: 18 }}>{s.successEmoji}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontStyle: "italic", color: "#fff", margin: "0 0 12px" }}>{s.successTitle}</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.85, marginBottom: 28 }}>{s.successBody}</p>
        <button onClick={onUnlock} style={{ background: `linear-gradient(135deg,${accent},#7c3aed)`, border: "none", borderRadius: 14, padding: "14px 38px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 0 28px ${accent}40` }}>{s.successBtn}</button>
      </div>
    </div>
  );

  // ── Trial sign-up screen ──────────────────────────────────────
  if (step === "trial-signup") return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 440, width: "100%", animation: "fadeUp .5s ease" }}>
        <button onClick={() => { setStep("landing"); setErr(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "'DM Sans',sans-serif" }}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontStyle: "italic", color: "#fff", margin: "0 0 8px" }}>Start Your Free Trial</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>7 days of full access. No card required. No commitment.</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 22 }}>
          {/* What's included */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700, marginBottom: 10 }}>What's included</div>
            {["✦ Full access to all 4 cycle phases", "✦ 40+ smoothie, shake & juice recipes", "✦ Phase-specific workouts & meal plans", "✦ PCOS, Endometriosis & BP guides", "✦ Habit tracker & journal", "✦ Available in 8 languages"].map((item, i) => (
              <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 6, lineHeight: 1.6 }}>{item}</div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
            {[{ key: "name", label: "Your Name", ph: "Jane Smith", val: trialName, set: setTrialName },
              { key: "email", label: "Email Address", ph: "jane@example.com", val: trialEmail, set: setTrialEmail }].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                <input type={f.key === "email" ? "email" : "text"} placeholder={f.ph} value={f.val}
                  onChange={e => f.set(e.target.value)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "10px 13px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }} />
              </div>
            ))}
            {err && <div style={{ fontSize: 12, color: "#ff7070", marginBottom: 12 }}>⚠ {err}</div>}
            <button onClick={handleStartTrial} style={{ width: "100%", background: `linear-gradient(135deg,${trialAccent},#0f6e56)`, border: "none", borderRadius: 11, padding: "13px 0", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 0 18px ${trialAccent}30` }}>
              Start My Free 7-Day Trial →
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 10 }}>
              No credit card required · Cancel anytime · Full access immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Checkout screen ───────────────────────────────────────────
  if (step === "checkout") {
    const chosen = plans.find(p => p.id === plan);
    const isExpired = trialState.status === "expired";
    return (
      <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 450, width: "100%", animation: "fadeUp .5s ease" }}>
          <button onClick={() => { setStep(isExpired ? "expired" : "landing"); setErr(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>{s.checkoutBack}</button>
          {isExpired && (
            <div style={{ background: "rgba(255,170,50,0.08)", border: "1px solid rgba(255,170,50,0.25)", borderRadius: 12, padding: "10px 16px", marginBottom: 16, fontSize: 13, color: "rgba(255,200,80,0.8)" }}>
              ⏱ Your 7-day trial has ended. Choose a plan to keep access.
            </div>
          )}
          <div style={{ background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "13px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{chosen?.label}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{chosen?.desc}</div></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{chosen?.price}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 800, fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>{s.checkoutSummaryLabel}</div>
            {[
              { key: "name",  label: s.fieldName,  ph: s.fieldNamePh,  type: "text" },
              { key: "email", label: s.fieldEmail, ph: s.fieldEmailPh, type: "email" },
              { key: "card",  label: s.fieldCard,  ph: s.fieldCardPh,  type: "text", maxLen: 19 },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 13 }}>
                <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} maxLength={f.maxLen} value={form[f.key]}
                  onChange={e => { let v = e.target.value; if (f.key === "card") v = v.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19); setForm(p => ({...p,[f.key]:v})); }}
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 13px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[{ key: "expiry", label: s.fieldExpiry, ph: s.fieldExpiryPh, max: 5 }, { key: "cvv", label: s.fieldCvv, ph: s.fieldCvvPh, max: 4 }].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{f.label}</label>
                  <input type="text" placeholder={f.ph} maxLength={f.max} value={form[f.key]}
                    onChange={e => { let v = e.target.value.replace(/\D/g,""); if (f.key === "expiry") v = v.length > 2 ? v.slice(0,2)+"/"+v.slice(2,4) : v; setForm(p => ({...p,[f.key]:v})); }}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 13px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }} />
                </div>
              ))}
            </div>
            {err && <div style={{ fontSize: 12, color: "#ff7070", marginBottom: 12 }}>⚠ {err}</div>}
            <button onClick={handlePay} disabled={loading} style={{ width: "100%", background: loading ? "rgba(192,132,252,0.3)" : `linear-gradient(135deg,${accent},#7c3aed)`, border: "none", borderRadius: 11, padding: "12px 0", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .3s", boxShadow: loading ? "none" : `0 0 18px ${accent}35` }}>
              {loading ? s.processingBtn : `${s.payBtn} ${chosen?.price}`}
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: 10 }}>{s.payFooter}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Expired trial screen ──────────────────────────────────────
  if (trialState.status === "expired" && step !== "checkout") return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", color: "#fff", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ maxWidth: 600, width: "100%", textAlign: "center", animation: "fadeUp .6s ease" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🌑</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontStyle: "italic", color: "#fff", margin: "0 0 10px" }}>Your Free Trial Has Ended</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.85, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
          We hope you loved your 7 days inside the hub. Choose a plan below to keep your full access and continue your cycle-syncing journey.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 13, marginBottom: 28 }}>
          {plans.map(p => (
            <div key={p.id} onClick={() => { setPlan(p.id); setStep("checkout"); }} style={{ background: plan === p.id ? "rgba(192,132,252,0.11)" : "rgba(255,255,255,0.03)", border: `2px solid ${p.popular ? accent : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: 20, cursor: "pointer", transition: "all .25s", position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: accent, borderRadius: 20, padding: "2px 12px", fontSize: 9, fontWeight: 800, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.mostPopular}</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{p.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: accent, marginBottom: 3 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{p.period}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 7 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>{s.guarantee}</p>
      </div>
    </div>
  );

  // ── Main landing page ─────────────────────────────────────────
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", color: "#fff", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle,rgba(192,132,252,.14),transparent 65%)", animation: "glow 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.09),transparent 65%)", animation: "glow 11s ease-in-out infinite reverse" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "58px 20px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "rgba(255,255,255,0.22)", textTransform: "uppercase", marginBottom: 13, animation: "fadeUp .7s ease" }}>{s.paymentTagline}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,62px)", fontStyle: "italic", fontWeight: 600, margin: "0 0 16px", lineHeight: 1.05, background: "linear-gradient(130deg,#fff 30%,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "fadeUp .7s .05s ease both" }}>{s.paymentHeroTitle}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.46)", lineHeight: 1.9, maxWidth: 510, margin: "0 auto 28px", animation: "fadeUp .7s .1s ease both" }}>{s.paymentSubtitle}</p>

        {/* FREE TRIAL HERO BANNER */}
        <div style={{ background: "linear-gradient(135deg,rgba(62,203,128,0.12),rgba(62,203,128,0.05))", border: "1px solid rgba(62,203,128,0.3)", borderRadius: 18, padding: "18px 22px", marginBottom: 28, animation: "fadeUp .7s .12s ease both" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌿</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#3ecb80", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Try it FREE for 7 days</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.75, marginBottom: 14 }}>
            No credit card. No commitment. Full access to the entire hub from day one.
          </div>
          <button onClick={() => { setErr(""); setStep("trial-signup"); }} style={{ background: "linear-gradient(135deg,#3ecb80,#0f6e56)", border: "none", borderRadius: 12, padding: "12px 32px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 0 20px rgba(62,203,128,0.3)" }}>
            Start Free Trial — No Card Needed
          </button>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", marginBottom: 20 }}>— or choose a paid plan below —</div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 28, animation: "fadeUp .7s .15s ease both" }}>
          {(s.paymentFeatures || BASE_STRINGS.paymentFeatures).map(f => <span key={f} style={{ background: "rgba(192,132,252,0.09)", border: "1px solid rgba(192,132,252,0.22)", borderRadius: 20, padding: "5px 13px", fontSize: 12, color: "rgba(255,255,255,0.68)", fontWeight: 500 }}>{f}</span>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 13, marginBottom: 24, animation: "fadeUp .7s .2s ease both" }}>
          {plans.map(p => (
            <div key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? "rgba(192,132,252,0.11)" : "rgba(255,255,255,0.03)", border: `2px solid ${plan === p.id ? accent : p.popular ? "rgba(192,132,252,0.28)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: 20, cursor: "pointer", transition: "all .25s", position: "relative", boxShadow: plan === p.id ? `0 0 22px ${accent}22` : "none" }}>
              {p.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: accent, borderRadius: 20, padding: "2px 12px", fontSize: 9, fontWeight: 800, letterSpacing: 1, color: "#fff", textTransform: "uppercase", whiteSpace: "nowrap" }}>{s.mostPopular}</div>}
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{p.label}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: plan === p.id ? accent : "#fff", marginBottom: 3 }}>{p.price}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{p.period}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", marginTop: 7 }}>{p.desc}</div>
              {plan === p.id && <div style={{ marginTop: 8, fontSize: 11, color: accent, fontWeight: 700 }}>{s.selectedLabel}</div>}
            </div>
          ))}
        </div>
        <button onClick={() => { if (!plan) setPlan("annual"); setStep("checkout"); }} style={{ background: `linear-gradient(135deg,${accent},#7c3aed)`, border: "none", borderRadius: 15, padding: "13px 40px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 0 28px ${accent}38`, animation: "fadeUp .7s .25s ease both" }}>
          {plan ? `${s.getAccessBtn} — ${plans.find(p => p.id === plan)?.price}` : s.choosePlanBtn}
        </button>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 13 }}>{s.guarantee}</p>
        <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 13, textAlign: "left", animation: "fadeUp .7s .3s ease both" }}>
          {(s.testimonials || BASE_STRINGS.testimonials).map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 15 }}>
              <div style={{ fontSize: 12, marginBottom: 5 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 8px", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontWeight: 700 }}>— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════════════════
   BIO LINK MODAL
═══════════════════════════════════════════════════════════════ */
function BioLinkModal({ onClose, accent, s, rtl }) {
  const [copied, setCopied] = useState(false);
  const bioUrl = "https://gowithyourflow.app/hub";
  const copy = () => { try { navigator.clipboard.writeText(bioUrl); } catch(e){} setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 20 }}>
      <div dir={rtl ? "rtl" : "ltr"} style={{ maxWidth: 500, width: "100%", background: "#0f0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: 28, position: "relative", animation: "fadeUp .4s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>✕</button>
        <div style={{ fontSize: 30, marginBottom: 10, textAlign: "center" }}>🔗</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontStyle: "italic", color: "#fff", textAlign: "center", margin: "0 0 8px" }}>{s.bioTitle}</h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", textAlign: "center", margin: "0 0 20px", lineHeight: 1.75 }}>{s.bioDesc}</p>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 11, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#fff", flex: 1, fontFamily: "monospace", wordBreak: "break-all" }}>{bioUrl}</div>
          <button onClick={copy} style={{ background: accent, border: "none", borderRadius: 7, padding: "6px 13px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>{copied ? s.bioCopiedBtn : s.bioCopyBtn}</button>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", margin: "0 0 10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{s.bioCaptionsLabel}</p>
        {(s.bioCaptions || BASE_STRINGS.bioCaptions).map((cap, i) => (
          <div key={i} onClick={() => { try { navigator.clipboard.writeText(cap); } catch(e){} }} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "9px 12px", fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.75, cursor: "pointer", marginBottom: 7 }}>{cap}</div>
        ))}
        <div style={{ marginTop: 16, background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.18)", borderRadius: 11, padding: 13 }}>
          <p style={{ fontSize: 12, color: "rgba(192,132,252,0.75)", margin: 0, lineHeight: 1.75 }}>{s.bioDeployNote}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function GoWithYourFlow() {
  const [unlocked, setUnlocked] = useState(false);
  const [lang, setLang] = useState("en");
  const [strings, setStrings] = useState(BASE_STRINGS);
  const [translateErr, setTranslateErr] = useState(false);
  const [tab, setTab] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [recipeSub, setRecipeSub] = useState("smoothies");
  const [condition, setCondition] = useState("PCOS");
  const [condPhase, setCondPhase] = useState("menstrual");
  const [weekNum, setWeekNum] = useState(1);
  const [checks, setChecks] = useState({});
  const [journal, setJournal] = useState({});
  const [affIdx, setAffIdx] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showBio, setShowBio] = useState(false);

  const phase = PHASES_META[phaseIdx];
  const recipes = PHASE_RECIPES[phase.id];
  const rtl = LANGUAGES.find(l => l.code === lang)?.rtl || false;
  const s = strings;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { const t = setInterval(() => setAffIdx(p => (p + 1) % 3), 5000); return () => clearInterval(t); }, [phaseIdx]);

  // Trial countdown state for in-hub banner
  const [trialMs, setTrialMs] = useState(() => {
    const ts = getTrialState();
    return ts.status === "active" ? (ts.msLeft || 0) : 0;
  });
  const isTrial = trialMs > 0;
  useEffect(() => {
    if (!isTrial) return;
    const t = setInterval(() => {
      const ts = getTrialState();
      if (ts.status !== "active") { setTrialMs(0); clearInterval(t); return; }
      setTrialMs(ts.msLeft || 0);
    }, 60000);
    return () => clearInterval(t);
  }, [isTrial]);

  const handleLangChange = useCallback((code) => {
    if (code === lang) return;
    setLang(code);
    setStrings(getStrings(code));
    setTranslateErr(false);
  }, [lang]);

  const toggle = (h, d) => { const k = `${weekNum}-${phaseIdx}-${h}-${d}`; setChecks(p => ({ ...p, [k]: !p[k] })); };

  const HABIT_GROUPS = s.habitGroups || BASE_STRINGS.habitGroups;
  const langObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  if (!unlocked) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes glow{0%,100%{opacity:.2}50%{opacity:.5}}`}</style>
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9000 }}>
        <LangSelector currentLang={lang} onChange={handleLangChange} accentColor="#c084fc" />
      </div>
      <PaymentGate onUnlock={() => setUnlocked(true)} s={s} lang={lang} />
    </>
  );

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}
        textarea,input,select{outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{opacity:.18}50%{opacity:.45}}
        @keyframes tick{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {showBio && <BioLinkModal onClose={() => setShowBio(false)} accent={phase.accent} s={s} rtl={rtl} />}

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "-15%", width: "65%", height: "65%", borderRadius: "50%", background: `radial-gradient(circle,${phase.color}18,transparent 65%)`, transition: "background 1.2s", animation: "glow 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: `radial-gradient(circle,${phase.accent}0d,transparent 65%)`, transition: "background 1.2s", animation: "glow 12s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* HEADER */}
        <header style={{ textAlign: "center", padding: "36px 20px 18px", animation: mounted ? "fadeUp .8s ease both" : "none" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <LangSelector currentLang={lang} onChange={handleLangChange} accentColor={phase.accent} />
          </div>
          {translateErr && (
            <div style={{ background: "rgba(255,170,80,0.08)", border: "1px solid rgba(255,170,80,0.2)", borderRadius: 10, padding: "8px 14px", marginBottom: 12, fontSize: 12, color: "rgba(255,200,100,0.75)" }}>
              ⚠ {s.translateError}
            </div>
          )}
          {isTrial && (
            <div style={{ background: "rgba(62,203,128,0.08)", border: "1px solid rgba(62,203,128,0.22)", borderRadius: 12, padding: "9px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 12, color: "rgba(62,203,128,0.85)", display: "flex", alignItems: "center", gap: 7 }}>
                <span>🌿</span>
                <span><strong style={{ fontWeight: 700 }}>Free Trial</strong> — {fmtCountdown(trialMs)} remaining</span>
              </div>
              <button onClick={() => setUnlocked(false)} style={{ background: "rgba(62,203,128,0.15)", border: "1px solid rgba(62,203,128,0.3)", borderRadius: 8, padding: "4px 12px", color: "#3ecb80", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
                Upgrade Now
              </button>
            </div>
          )}
          <p style={{ fontSize: 10, letterSpacing: 6, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 700 }}>{s.tagline}</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(28px,6vw,52px)", fontWeight: 600, fontStyle: "italic", margin: "0 0 10px", lineHeight: 1.05, background: `linear-gradient(130deg,#fff 30%,${phase.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", transition: "background 1s" }}>{s.heroTitle}</h1>
          <button onClick={() => setShowBio(true)} style={{ background: "rgba(192,132,252,0.09)", border: "1px solid rgba(192,132,252,0.28)", borderRadius: 20, padding: "5px 16px", color: "#c084fc", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 1, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginTop: 8 }}>{s.getBioLink}</button>
        </header>

        {/* MAIN NAV */}
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 26 }}>
          {(s.tabs || BASE_STRINGS.tabs).map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{ background: tab === i ? phase.color : "transparent", border: `1px solid ${tab === i ? phase.color : "rgba(255,255,255,0.09)"}`, color: tab === i ? "#fff" : "rgba(255,255,255,0.38)", padding: "6px 13px", borderRadius: 30, cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", transition: "all .25s", whiteSpace: "nowrap" }}>{t}</button>
          ))}
        </nav>

        <div key={`${tab}-${lang}`} style={{ animation: "fadeUp .35s ease both" }}>

          {/* ══ TAB 0 — WELCOME ══ */}
          {tab === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <Card style={{ borderColor: `${phase.accent}22` }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(15px,2.5vw,20px)", fontStyle: "italic", color: "rgba(255,255,255,0.8)", lineHeight: 2, margin: 0 }}>"{s.welcomeQuote}"</p>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 11 }}>
                {[{ i: "🌙", t: s.feature1Title, d: s.feature1Desc }, { i: "💪", t: s.feature2Title, d: s.feature2Desc }, { i: "🍓", t: s.feature3Title, d: s.feature3Desc }, { i: "💖", t: s.feature4Title, d: s.feature4Desc }].map(({ i, t, d }) => (
                  <Card key={t}><div style={{ fontSize: 22, marginBottom: 9 }}>{i}</div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 5, lineHeight: 1.4 }}>{t}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.78 }}>{d}</div></Card>
                ))}
              </div>
              <Card>
                <SecTitle color={phase.accent}>{s.alignmentTitle}</SecTitle>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: "0 0 10px" }}>{s.alignmentBody1}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: 0 }}>{s.alignmentBody2}</p>
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.foundationsTitle}</SecTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  {[{ n: "1", t: s.principle1Title, b: s.principle1Desc }, { n: "2", t: s.principle2Title, b: s.principle2Desc }, { n: "3", t: s.principle3Title, b: s.principle3Desc }, { n: "4", t: s.principle4Title, b: s.principle4Desc }].map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 13, flexDirection: rtl ? "row-reverse" : "row" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: phase.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, color: "#fff" }}>{p.n}</div>
                      <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{p.t}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{p.b}</div></div>
                    </div>
                  ))}
                  <div style={{ background: `${phase.color}16`, border: `1px solid ${phase.color}28`, borderRadius: 12, padding: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: phase.accent }}>{s.proTipLabel} </span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", lineHeight: 1.75 }}>{s.proTipText}</span>
                  </div>
                </div>
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.dailyPracticesTitle}</SecTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 11 }}>
                  {[{ n: s.practiceVizName, d: s.practiceVizDesc }, { n: s.practiceAffName, d: s.practiceAffDesc }, { n: s.practiceThanksName, d: s.practiceThanksDesc }, { n: s.practiceBreathName, d: s.practiceBreathDesc }].map((p, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 13 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: phase.accent, marginBottom: 6 }}>{p.n}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>{p.d}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ══ TAB 1 — PHASES ══ */}
          {tab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                {PHASES_META.map((p, i) => (
                  <button key={p.id} onClick={() => { setPhaseIdx(i); setRecipeSub("smoothies"); }} style={{ background: phaseIdx === i ? `radial-gradient(circle at 35% 35%,${p.accent},${p.color})` : "rgba(255,255,255,0.03)", border: `2px solid ${phaseIdx === i ? p.accent : "rgba(255,255,255,0.08)"}`, borderRadius: 15, padding: "11px 15px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "all .3s", boxShadow: phaseIdx === i ? `0 0 22px ${p.color}40` : "none" }}>
                    <span style={{ fontSize: 22 }}>{p.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 800, color: phaseIdx === i ? "#fff" : "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{p.name}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{p.days}</span>
                  </button>
                ))}
              </div>

              {/* Phase hero */}
              <div style={{ background: `linear-gradient(135deg,${phase.bg},rgba(7,7,14,.97))`, border: `1px solid ${phase.color}26`, borderRadius: 20, padding: "20px 20px 16px", position: "relative", overflow: "hidden", animation: "fadeUp .4s ease" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 170, height: 170, background: `radial-gradient(circle,${phase.accent}10,transparent 70%)`, transform: "translate(20%,-20%)", borderRadius: "50%" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: phase.accent, marginBottom: 7, fontWeight: 800 }}>{phase.name} · {phase.days}</div>
                      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(20px,4vw,34px)", fontStyle: "italic", margin: "0 0 10px", color: "#fff", fontWeight: 600 }}>{phase.tagline}</h2>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.46)", lineHeight: 1.85, margin: "0 0 13px", maxWidth: 500 }}>{phase.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{phase.keywords.map(kw => <span key={kw} style={{ background: `${phase.color}20`, border: `1px solid ${phase.color}38`, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: phase.accent, fontWeight: 700 }}>{kw}</span>)}</div>
                    </div>
                    <div style={{ fontSize: 52, opacity: 0.4, flexShrink: 0 }}>{phase.emoji}</div>
                  </div>
                </div>
              </div>

              {/* Affirmation */}
              <div style={{ background: `${phase.color}0e`, border: `1px solid ${phase.color}20`, borderRadius: 12, padding: "12px 18px", textAlign: "center", minHeight: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p key={affIdx} style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: "italic", color: phase.accent, animation: "tick .5s ease" }}>{phase.affirmations[affIdx]}</p>
              </div>

              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(s.phaseSubTabs || BASE_STRINGS.phaseSubTabs).map((t, i) => {
                  const keys = ["workouts","smoothies","shakes","juices","meals","teas"];
                  return <Pill key={keys[i]} label={t} color={phase.color} active={recipeSub === keys[i]} onClick={() => setRecipeSub(keys[i])} />;
                })}
              </div>

              {recipeSub === "workouts" && (
                <Card>
                  <SecTitle color={phase.accent}>🏋️ {s.workoutPlanTitle} — {phase.name}</SecTitle>
                  {recipes.workouts.map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < recipes.workouts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", flexDirection: rtl ? "row-reverse" : "row" }}>
                      <div style={{ width: 34, fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 1, flexShrink: 0 }}>{w.day}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: w.intensity === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>{w.type}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>{w.duration}</div>
                      </div>
                      <div style={{ flexShrink: 0 }}>{w.intensity > 0 ? <Dots level={w.intensity} color={phase.accent} /> : <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", letterSpacing: 1 }}>{s.restLabel}</span>}</div>
                    </div>
                  ))}
                </Card>
              )}
              {recipeSub === "smoothies" && <Card><SecTitle color={phase.accent}>🥤 {s.smoothiesTitle} — {phase.name} ({phase.days})</SecTitle><RecipeGrid items={recipes.smoothies} accent={phase.accent} /></Card>}
              {recipeSub === "shakes"    && <Card><SecTitle color={phase.accent}>🧉 {s.shakesTitle} — {phase.name} ({phase.days})</SecTitle><RecipeGrid items={recipes.shakes} accent={phase.accent} /></Card>}
              {recipeSub === "juices"    && (
                <Card>
                  <SecTitle color={phase.accent}>🍋 {s.juicesTitle} — {phase.name} ({phase.days})</SecTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                    {recipes.juices.map((j, i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 13 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: phase.accent, marginBottom: 6 }}>{i+1}. {j.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", lineHeight: 1.7 }}>{j.ingredients}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              {recipeSub === "meals" && (
                <Card>
                  <SecTitle color={phase.accent}>🍽️ {s.mealsTitle} — {phase.name}</SecTitle>
                  {recipes.meals.map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < recipes.meals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", flexDirection: rtl ? "row-reverse" : "row" }}>
                      <div style={{ width: 74, fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: phase.accent, flexShrink: 0, paddingTop: 2 }}>{m.meal}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", lineHeight: 1.75 }}>{m.food}</div>
                    </div>
                  ))}
                </Card>
              )}
              {recipeSub === "teas" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {recipes.teas.map((tea, i) => (
                    <Card key={i} style={{ borderColor: `${phase.color}20` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8, flexDirection: rtl ? "row-reverse" : "row" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>☕ {tea.name}</div>
                        <span style={{ fontSize: 10, color: phase.accent, background: `${phase.color}18`, borderRadius: 20, padding: "3px 10px", fontWeight: 700 }}>{s.whenLabel} {tea.when}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 6 }}><strong style={{ color: "rgba(255,255,255,0.45)" }}>{s.ingredientsLabel}</strong> {tea.ingredients}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>{tea.benefit}</div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ TAB 2 — CONDITIONS ══ */}
          {tab === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center" }}>
                {(s.conditionsList || BASE_STRINGS.conditionsList).map((c, i) => {
                  const keys = ["PCOS","Endometriosis","High Blood Pressure"];
                  return <Pill key={keys[i]} label={c} color={phase.color} active={condition === keys[i]} onClick={() => setCondition(keys[i])} />;
                })}
              </div>

              {condition === "PCOS" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <Card style={{ borderColor: `${phase.accent}20` }}>
                    <SecTitle color={phase.accent}>{s.pcosTitle || "PCOS"}</SecTitle>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, margin: 0 }}>{s.pcosBody}</p>
                  </Card>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["menstrual","follicular","ovulatory","luteal"].map(cp => (
                      <Pill key={cp} label={cp} color={phase.color} active={condPhase === cp} onClick={() => setCondPhase(cp)} />
                    ))}
                  </div>
                  {/* PCOS Tea guide */}
                  {(() => {
                    const pcosTeas = {
                      menstrual:  [{ n: "Ginger-Cinnamon Tea",          i: "Fresh ginger 1-inch, cinnamon stick, lemon, hot water",         b: "Reduces inflammation; stabilizes blood sugar.",                              w: "Morning / pre-workout" },
                                   { n: "Raspberry Leaf & Chamomile",    i: "Red raspberry leaf 1 tsp, chamomile 1 tsp, hot water",           b: "Tones uterus; calms cortisol spikes.",                                      w: "Evening" },
                                   { n: "Nettle Tea",                    i: "Dried nettle leaves 1 tbsp, hot water",                         b: "Rich in iron & magnesium; supports adrenal health (critical for PCOS).",    w: "Midday" }],
                      follicular: [{ n: "Spearmint Tea",                 i: "Spearmint leaves 1 tbsp, hot water",                            b: "Reduces androgens (testosterone) and hirsutism. Studies show spearmint lowers androgens in 30 days.", w: "2 cups daily" },
                                   { n: "Green Tea with Lemon",          i: "Green tea bag, lemon wedge, hot water",                         b: "EGCG antioxidants improve insulin sensitivity.",                            w: "Morning / pre-workout" },
                                   { n: "Licorice Root & Hibiscus Tea",  i: "Licorice root ½ tsp, hibiscus 1 tsp, hot water",               b: "Balances cortisol; hibiscus lowers inflammation. ⚠ Avoid if hypertensive.", w: "Daytime" }],
                      ovulatory:  [{ n: "Red Clover Tea",                i: "Red clover flowers 1 tbsp, hot water",                          b: "Phytoestrogens support hormonal balance; improves circulation.",            w: "Morning" },
                                   { n: "Matcha Latte",                  i: "Matcha 1 tsp, unsweetened almond milk, cinnamon",               b: "High in antioxidants.",                                                     w: "Pre-workout" },
                                   { n: "Dandelion Root Tea",            i: "Dandelion root 1 tsp, hot water, lemon",                        b: "Detoxifies the liver (key for estrogen metabolism).",                       w: "Evening" }],
                      luteal:     [{ n: "Chasteberry (Vitex) Tea",       i: "Chasteberry 1 tsp, hot water",                                  b: "Regulates progesterone & LH/FSH; reduces PMS irritability.",               w: "Morning" },
                                   { n: "Fenugreek & Fennel Tea",        i: "Fenugreek seeds ½ tsp, fennel seeds ½ tsp, hot water",         b: "Improves insulin sensitivity; fennel reduces bloating.",                   w: "After meals" },
                                   { n: "Ashwagandha Moon Milk",         i: "Ashwagandha ½ tsp, warm almond milk, cardamom, honey",         b: "Lowers cortisol; supports thyroid function.",                              w: "Before bed" }],
                    };
                    const teas = pcosTeas[condPhase] || [];
                    return (
                      <Card>
                        <SecTitle color={phase.accent}>☕ {s.teaGuideLabel || "Tea Guide"} — {condPhase}</SecTitle>
                        {teas.map((tea, i) => (
                          <div key={i} style={{ padding: "11px 0", borderBottom: i < teas.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 5, flexDirection: rtl ? "row-reverse" : "row" }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{tea.n}</span>
                              <span style={{ fontSize: 10, color: phase.accent, fontWeight: 700 }}>{tea.w}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 5 }}><em>{s.ingredientsLabel}</em> {tea.i}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.75 }}>{tea.b}</div>
                          </div>
                        ))}
                      </Card>
                    );
                  })()}
                  <Card>
                    <SecTitle color={phase.accent}>{s.keyTakeawaysTitle || "Key Takeaways"}</SecTitle>
                    {["Menstrual Phase: Prioritize iron, magnesium, and anti-inflammatory ingredients.", "Follicular Phase: Focus on insulin-balancing spices (cinnamon, turmeric).", "Ovulatory Phase: Load up on antioxidants (berries, beets).", "Luteal Phase: Combat PMS with magnesium (cacao, avocado) and adaptogens.", "Consistency is key — try daily for 8–12 weeks to see improvements."].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, flexDirection: rtl ? "row-reverse" : "row" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.accent, flexShrink: 0, marginTop: 6 }} />
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{t}</div>
                      </div>
                    ))}
                  </Card>
                  <Card style={{ borderColor: "rgba(255,80,80,0.15)" }}>
                    <SecTitle color="#ff7070">{s.avoidTitle || "Avoid"}</SecTitle>
                    {["Dairy (inflammatory for many with PCOS)", "Added sugars (opt for stevia or monk fruit)", "Processed carbs (swap for low-glycemic ingredients)", "Excess caffeine, sugary additives, and alcohol"].map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, flexDirection: rtl ? "row-reverse" : "row" }}><span style={{ color: "#ff7070" }}>✕</span><div style={{ fontSize: 13, color: "rgba(255,255,255,0.46)", lineHeight: 1.75 }}>{a}</div></div>
                    ))}
                  </Card>
                </div>
              )}

              {condition === "Endometriosis" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <Card style={{ borderColor: `${phase.accent}20` }}>
                    <SecTitle color={phase.accent}>{s.endoTitle || "Endometriosis"}</SecTitle>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, margin: 0 }}>{s.endoBody}</p>
                  </Card>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["menstrual","follicular","ovulatory","luteal"].map(cp => (
                      <Pill key={cp} label={cp} color={phase.color} active={condPhase === cp} onClick={() => setCondPhase(cp)} />
                    ))}
                  </div>
                  {(() => {
                    const endoTeas = {
                      menstrual:  [{ n: "Ginger-Turmeric Tea",           i: "Fresh ginger 1-inch, turmeric ½ tsp, black pepper (pinch), lemon, honey", b: "Reduces pelvic pain and inflammation; ginger aids digestion and nausea.", w: "Morning / post-workout" },
                                   { n: "Raspberry Leaf & Chamomile",    i: "Raspberry leaf 1 tsp, chamomile 1 tsp, hot water",                         b: "Tones the uterus; chamomile calms nerves and muscles.",                   w: "Evening" },
                                   { n: "Nettle Tea",                    i: "Dried nettle leaves 1 tbsp, hot water",                                     b: "Replenishes iron lost during menstruation; reduces fatigue.",             w: "Midday" }],
                      follicular: [{ n: "Dandelion Root Tea",            i: "Dandelion root 1 tsp, hot water, lemon",                                   b: "Supports liver detox to metabolize excess estrogen.",                     w: "Morning" },
                                   { n: "Green Tea with Mint",           i: "Green tea 1 bag, fresh mint leaves",                                        b: "Antioxidants reduce inflammation; mint aids digestion.",                  w: "Pre-workout" },
                                   { n: "Milk Thistle & Lemon Balm Tea", i: "Milk thistle 1 tsp, lemon balm 1 tsp, hot water",                          b: "Milk thistle detoxifies the liver; lemon balm reduces stress.",           w: "Evening" }],
                      ovulatory:  [{ n: "Red Raspberry Leaf Tea",        i: "Red raspberry leaves 1 tbsp, hot water",                                   b: "Strengthens pelvic muscles; rich in magnesium for cramps.",              w: "Morning / pre-workout" },
                                   { n: "Matcha Latte",                  i: "Matcha 1 tsp, oat milk, cinnamon",                                          b: "High in antioxidants (EGCG) to combat inflammation.",                    w: "Pre-workout" },
                                   { n: "Hibiscus & Rosehip Tea",        i: "Hibiscus 1 tsp, rosehip 1 tsp, hot water",                                 b: "Vitamin C boosts collagen for tissue repair; hibiscus lowers inflammation.", w: "Post-workout" }],
                      luteal:     [{ n: "Chamomile-Lavender Tea",        i: "Chamomile 1 tsp, lavender ½ tsp, hot water",                               b: "Reduces anxiety and muscle tension; promotes sleep.",                     w: "Evening" },
                                   { n: "Peppermint & Fennel Tea",       i: "Peppermint leaves 1 tsp, fennel seeds ½ tsp",                              b: "Eases bloating and digestive issues common pre-period.",                  w: "After meals" },
                                   { n: "Ashwagandha Moon Milk",         i: "Ashwagandha ½ tsp, warm almond milk, cinnamon, honey",                    b: "Lowers cortisol; supports adrenal health.",                               w: "Before bed" }],
                    };
                    const teas = endoTeas[condPhase] || [];
                    return (
                      <Card>
                        <SecTitle color={phase.accent}>☕ {s.teaGuideLabel || "Tea Guide"} — {condPhase}</SecTitle>
                        {teas.map((tea, i) => (
                          <div key={i} style={{ padding: "11px 0", borderBottom: i < teas.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 5 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{tea.n}</span>
                              <span style={{ fontSize: 10, color: phase.accent, fontWeight: 700 }}>{tea.w}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginBottom: 5 }}><em>{s.ingredientsLabel}</em> {tea.i}</div>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.75 }}>{tea.b}</div>
                          </div>
                        ))}
                      </Card>
                    );
                  })()}
                  <Card>
                    <SecTitle color={phase.accent}>{s.keyTakeawaysTitle || "Key Takeaways"}</SecTitle>
                    {["Anti-inflammatory stars: Turmeric, ginger, hibiscus.", "Estrogen detox: Dandelion root, milk thistle.", "Pelvic health: Red raspberry leaf, nettle.", "Avoid: Excessive caffeine (aggravates inflammation) and sugary additives."].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, flexDirection: rtl ? "row-reverse" : "row" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.accent, flexShrink: 0, marginTop: 6 }} />
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{t}</div>
                      </div>
                    ))}
                  </Card>
                </div>
              )}

              {condition === "High Blood Pressure" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <Card style={{ borderColor: `${phase.accent}20` }}>
                    <SecTitle color={phase.accent}>{s.hbpTitle || "High Blood Pressure"}</SecTitle>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.9, margin: 0 }}>{s.hbpBody}</p>
                  </Card>
                  {[
                    { label: s.morningTeasTitle,    desc: s.morningTeasDesc,   teas: [{ n: "Hibiscus Tea",         b: "Rich in antioxidants (anthocyanins), shown to lower systolic/diastolic BP in studies. Brew 1–2 tsp dried petals in hot water.", c: "" }, { n: "Green Tea (Decaf)", b: "Contains catechins (EGCG) that improve endothelial function; opt for decaf to avoid caffeine spikes.", c: "" }, { n: "Lemon Water with Ginger", b: "Ginger improves circulation; lemon provides vitamin C and promotes hydration.", c: "" }] },
                    { label: s.daytimeTeasTitle,    desc: s.daytimeTeasDesc,   teas: [{ n: "Hawthorn Berry Tea",   b: "Supports healthy blood flow, reduces arterial stiffness, and may modestly lower BP.", c: "⚠ Avoid if on heart medications (interacts with beta-blockers, nitrates)." }, { n: "Olive Leaf Tea", b: "Contains oleuropein, which may relax blood vessels and reduce inflammation.", c: "" }, { n: "Cinnamon Tea", b: "Improves insulin sensitivity (linked to BP regulation) and adds warmth without caffeine.", c: "" }] },
                    { label: s.eveningTeasTitle,    desc: s.eveningTeasDesc,   teas: [{ n: "Chamomile Tea",        b: "Reduces anxiety and inflammation; mild sedative effect improves sleep quality.", c: "" }, { n: "Lavender Tea", b: "Calms the nervous system; lowers stress-related BP spikes.", c: "" }, { n: "Passionflower Tea", b: "Mild anxiolytic; supports relaxation without grogginess.", c: "" }] },
                    { label: s.additionalSupportTitle, desc: "",               teas: [{ n: "Dandelion Leaf Tea",   b: "Natural diuretic (reduces fluid retention) and rich in potassium, which counterbalances sodium.", c: "Avoid if on prescription diuretics (e.g., furosemide)." }, { n: "Celery Seed Tea", b: "Contains phthalides, compounds that relax blood vessels.", c: "" }] },
                  ].map(({ label, desc, teas }) => (
                    <Card key={label}>
                      <SecTitle color={phase.accent}>{label}</SecTitle>
                      {desc && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 12px", fontStyle: "italic" }}>{desc}</p>}
                      {teas.map((tea, i) => (
                        <div key={i} style={{ padding: "10px 0", borderBottom: i < teas.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{tea.n}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: tea.c ? 7 : 0 }}>{tea.b}</div>
                          {tea.c && <div style={{ fontSize: 11, color: "#ffaa55", background: "rgba(255,150,50,0.07)", borderRadius: 8, padding: "4px 10px", display: "inline-block" }}>{tea.c}</div>}
                        </div>
                      ))}
                    </Card>
                  ))}
                  <Card style={{ borderColor: "rgba(255,80,80,0.15)" }}>
                    <SecTitle color="#ff7070">{s.herbsAvoidTitle}</SecTitle>
                    {["Licorice Root: Raises BP by causing sodium retention and potassium loss.", "Ephedra/Ma Huang: Stimulant that can dangerously increase heart rate and BP.", "Ginseng (high doses): May elevate BP in some individuals."].map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, flexDirection: rtl ? "row-reverse" : "row" }}><span style={{ color: "#ff7070" }}>✕</span><div style={{ fontSize: 13, color: "rgba(255,255,255,0.46)", lineHeight: 1.75 }}>{h}</div></div>
                    ))}
                  </Card>
                  <Card>
                    <SecTitle color={phase.accent}>{s.precautionsTitle}</SecTitle>
                    {["Monitor Interactions: Hibiscus, hawthorn, and dandelion can interact with BP meds.", "Limit Sodium: Pair teas with a low-sodium, potassium-rich diet (leafy greens, bananas).", "Quality Matters: Use organic, pesticide-free herbs to avoid contaminants.", "Consistency: Herbal effects are gradual; drink daily for 4–6 weeks to assess benefits."].map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, flexDirection: rtl ? "row-reverse" : "row" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.accent, flexShrink: 0, marginTop: 6 }} />
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{p}</div>
                      </div>
                    ))}
                  </Card>
                  <div style={{ background: "rgba(255,170,80,0.06)", border: "1px solid rgba(255,170,80,0.18)", borderRadius: 13, padding: 16 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,200,100,0.75)", lineHeight: 1.85 }}>⚠️ {s.hbpDisclaimer}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ TAB 3 — REST & RECOVERY ══ */}
          {tab === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card><SecTitle color={phase.accent}>{s.restTitle}</SecTitle><p style={{ fontSize: 13, color: "rgba(255,255,255,0.52)", lineHeight: 1.9, margin: 0 }}>{s.restBody}</p></Card>
              <Card>
                <SecTitle color={phase.accent}>{s.whyRestTitle}</SecTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 11 }}>
                  {[{ t: s.restReason1Title, d: s.restReason1Desc }, { t: s.restReason2Title, d: s.restReason2Desc }, { t: s.restReason3Title, d: s.restReason3Desc }, { t: s.restReason4Title, d: s.restReason4Desc }].map((item, i) => (
                    <div key={i} style={{ background: `${phase.color}10`, borderRadius: 12, padding: 13 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: phase.accent, marginBottom: 5 }}>{item.t}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{item.d}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.signsTitle}</SecTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 7 }}>
                  {(s.signs || BASE_STRINGS.signs).map((sign, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", flexDirection: rtl ? "row-reverse" : "row" }}>
                      <span style={{ color: "#ff7070", fontSize: 12, flexShrink: 0 }}>⚠</span>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.52)", lineHeight: 1.65 }}>{sign}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.typesTitle}</SecTitle>
                {[{ n: s.activeRecoveryName, d: s.activeRecoveryDesc }, { n: s.passiveRecoveryName, d: s.passiveRecoveryDesc }, { n: s.mentalRecoveryName, d: s.mentalRecoveryDesc }].map((t, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{t.n}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>{t.d}</div>
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.tipsTitle}</SecTitle>
                {(s.tips || BASE_STRINGS.tips).map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 11, flexDirection: rtl ? "row-reverse" : "row" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: phase.accent, flexShrink: 0, marginTop: 6 }} />
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}><strong style={{ color: "rgba(255,255,255,0.75)" }}>{tip.t}:</strong> {tip.d}</div>
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.weeklyPlanTitle}</SecTitle>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 14px" }}>{s.weeklyPlanDesc}</p>
                {(s.weeklyPlanItems || BASE_STRINGS.weeklyPlanItems).map((row, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", flexWrap: "wrap", flexDirection: rtl ? "row-reverse" : "row" }}>
                    <div style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.66)" }}>{row.a}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{row.n}</div>
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>{s.restAffirmationsTitle}</SecTitle>
                {(s.restAffirmations || BASE_STRINGS.restAffirmations).map((a, i) => (
                  <div key={i} style={{ background: `${phase.color}12`, border: `1px solid ${phase.color}22`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontStyle: "italic", color: phase.accent }}>{a}</div>
                ))}
              </Card>
              <div style={{ background: `${phase.color}0e`, border: `1px solid ${phase.color}28`, borderRadius: 14, padding: 18, textAlign: "center" }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontStyle: "italic", color: phase.accent, margin: 0, lineHeight: 1.85 }}>{s.restConclusion}</p>
              </div>
            </div>
          )}

          {/* ══ TAB 4 — TRACKER ══ */}
          {tab === 4 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {[{ label: s.weekLabel, vals: [1,2,3,4,5,6,7,8].map(n => `${s.weekLabel} ${n}`), val: `${s.weekLabel} ${weekNum}`, set: (v) => setWeekNum(parseInt(v.split(" ").pop())) },
                  { label: s.phaseLabel, vals: PHASES_META.map(p => `${p.name} (${p.days})`), val: `${PHASES_META[phaseIdx].name} (${PHASES_META[phaseIdx].days})`, set: (v) => setPhaseIdx(PHASES_META.findIndex(p => v.startsWith(p.name))) }
                ].map(({ label, vals, val, set }) => (
                  <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "6px 13px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                    <select value={val} onChange={e => set(e.target.value)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                      {vals.map((v, i) => <option key={i} value={v} style={{ background: "#111" }}>{v}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <Card>
                <SecTitle color={phase.accent}>📋 {s.trackerTitle} — {s.weekLabel} {weekNum} · {phase.name}</SecTitle>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: rtl ? "right" : "left", padding: "6px 10px 10px", fontSize: 10, color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>HABIT</th>
                        {["M","T","W","T","F","S","S"].map((d, i) => <th key={i} style={{ padding: "6px 4px 10px", fontSize: 10, color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textAlign: "center", minWidth: 32 }}>{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {HABIT_GROUPS.map(({ section, habits }) => (
                        <>{
                          <tr key={section}>
                            <td colSpan={8} style={{ padding: "12px 10px 5px", fontSize: 9, fontWeight: 800, letterSpacing: 2, color: "rgba(255,255,255,0.18)", textTransform: "uppercase", borderTop: "1px solid rgba(255,255,255,0.05)" }}>{section}</td>
                          </tr>
                        }{habits.map(habit => (
                          <tr key={habit} style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
                            <td style={{ padding: "8px 10px", fontSize: 12, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", textAlign: rtl ? "right" : "left" }}>{habit}</td>
                            {[0,1,2,3,4,5,6].map(di => {
                              const k = `${weekNum}-${phaseIdx}-${habit}-${di}`;
                              const on = checks[k];
                              return (
                                <td key={di} style={{ textAlign: "center", padding: "8px 3px" }}>
                                  <button onClick={() => toggle(habit, di)} style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${on ? phase.accent : "rgba(255,255,255,0.13)"}`, background: on ? phase.accent : "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, transition: "all .18s" }}>{on && "✓"}</button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}</>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 13 }}>
                <Card>
                  <SecTitle color={phase.accent}>📊 {s.measurementsTitle}</SecTitle>
                  {(s.measureFields || BASE_STRINGS.measureFields).map((f, i) => (
                    <div key={i} style={{ marginBottom: 11 }}>
                      <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{f}</label>
                      <input placeholder="—" style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }} />
                    </div>
                  ))}
                </Card>
                <Card>
                  <SecTitle color={phase.accent}>⚡ {s.energyMoodTitle}</SecTitle>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{s.energyLabel}</div>
                    <div style={{ display: "flex", gap: 7 }}>
                      {(s.energyLevels || BASE_STRINGS.energyLevels).map(lvl => <button key={lvl} style={{ flex: 1, padding: "7px 0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 700 }}>{lvl}</button>)}
                    </div>
                  </div>
                  <label style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.moodLabel}</label>
                  <textarea rows={4} placeholder={s.moodPlaceholder} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 11px", color: "rgba(255,255,255,0.72)", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "none", lineHeight: 1.65, direction: rtl ? "rtl" : "ltr" }} />
                </Card>
              </div>
            </div>
          )}

          {/* ══ TAB 5 — JOURNAL ══ */}
          {tab === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card>
                <SecTitle color={phase.accent}>📓 {s.journalTitle} — {s.journalWeekLabel} {weekNum}</SecTitle>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", margin: "0 0 15px" }}>{s.journalDesc}</p>
                {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day, i) => (
                  <div key={day} style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>{day}</label>
                    <textarea value={journal[`${weekNum}-${day}`] || ""} onChange={e => setJournal(p => ({...p,[`${weekNum}-${day}`]:e.target.value}))} placeholder={s.journalDayPlaceholder} rows={2}
                      style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "9px 12px", color: "rgba(255,255,255,0.72)", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "vertical", lineHeight: 1.7, direction: rtl ? "rtl" : "ltr" }} />
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>🌟 {s.weeklyProgressTitle}</SecTitle>
                {[{ l: s.winsLabel, p: s.winsPlaceholder }, { l: s.challengesLabel, p: s.challengesPlaceholder }, { l: s.intentionsLabel, p: s.intentionsPlaceholder }].map(({ l, p }, i) => (
                  <div key={i} style={{ marginBottom: 15 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.52)", marginBottom: 7 }}>{l}</label>
                    <textarea placeholder={p} rows={3} style={{ width: "100%", background: `${phase.color}08`, border: `1px solid ${phase.color}20`, borderRadius: 9, padding: "9px 12px", color: "rgba(255,255,255,0.72)", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "vertical", lineHeight: 1.7, direction: rtl ? "rtl" : "ltr" }} />
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>🔍 {s.recoveryCheckTitle}</SecTitle>
                {(s.recoveryQuestions || BASE_STRINGS.recoveryQuestions).map((q, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 5 }}>{q}</label>
                    <textarea rows={2} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 11px", color: "rgba(255,255,255,0.68)", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "none", lineHeight: 1.65, direction: rtl ? "rtl" : "ltr" }} />
                  </div>
                ))}
              </Card>
              <Card>
                <SecTitle color={phase.accent}>📐 {s.notesTitle}</SecTitle>
                <textarea rows={6} placeholder={s.notesPlaceholder} style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 12px", color: "rgba(255,255,255,0.68)", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "vertical", lineHeight: 1.7, direction: rtl ? "rtl" : "ltr" }} />
              </Card>
            </div>
          )}

          {/* ══ TAB 6 — CONCLUSION ══ */}
          {tab === 6 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div style={{ background: `linear-gradient(135deg,${phase.bg},rgba(7,7,14,.97))`, border: `1px solid ${phase.color}28`, borderRadius: 20, padding: "26px 22px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle,${phase.accent}0e,transparent 70%)`, transform: "translate(20%,-30%)", borderRadius: "50%" }} />
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,5vw,38px)", fontStyle: "italic", fontWeight: 600, color: "#fff", margin: "0 0 20px", lineHeight: 1.15 }}>{s.conclusionTitle}</h2>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.95, margin: "0 0 14px" }}>{s.conclusionP1}</p>
                  <div style={{ marginBottom: 14 }}>
                    {(s.conclusionBullets || BASE_STRINGS.conclusionBullets).map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, flexDirection: rtl ? "row-reverse" : "row" }}><span style={{ flexShrink: 0 }}>✨</span><div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.85 }}>{item}</div></div>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.95, margin: "0 0 14px" }}>{s.conclusionP2}</p>
                  <div style={{ borderLeft: rtl ? "none" : `3px solid ${phase.accent}`, borderRight: rtl ? `3px solid ${phase.accent}` : "none", paddingLeft: rtl ? 0 : 18, paddingRight: rtl ? 18 : 0, marginTop: 18 }}>
                    {[s.conclusionWish1, s.conclusionWish2, s.conclusionWish3].map((w, i) => (
                      <p key={i} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontStyle: "italic", color: i === 2 ? phase.accent : "rgba(255,255,255,0.78)", margin: "0 0 6px", lineHeight: 1.85 }}>{w}</p>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 16, fontWeight: 600 }}>{s.conclusionClose}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 11 }}>
                {PHASES_META.map(p => (
                  <Card key={p.id} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 7 }}>{p.emoji}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: p.accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>{p.tagline}</div>
                  </Card>
                ))}
              </div>
              <div style={{ background: `${phase.color}0e`, border: `1px solid ${phase.color}28`, borderRadius: 15, padding: "20px 22px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(15px,3vw,22px)", fontStyle: "italic", color: phase.accent, margin: 0 }}>{s.conclusionQuote}</p>
              </div>
              <div style={{ textAlign: "center", paddingTop: 6 }}>
                <button onClick={() => setShowBio(true)} style={{ background: `${phase.color}18`, border: `1px solid ${phase.color}35`, borderRadius: 13, padding: "11px 26px", color: phase.accent, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                  🔗 {s.shareHubLabel}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
