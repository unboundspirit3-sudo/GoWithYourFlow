import { useState, useEffect, useCallback, useRef } from "react";

/* ── Anthropic API key ─────────────────────────────────────────
   Set VITE_ANTHROPIC_API_KEY in your Vercel environment variables.
   In dev, create a .env file:  VITE_ANTHROPIC_API_KEY=sk-ant-...
──────────────────────────────────────────────────────────────── */
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? "";

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
   AI TRANSLATION ENGINE using Claude API
   — chunked into 3 parts to stay within token limits
   — includes required browser-access header
═══════════════════════════════════════════════════════════════ */
const translationCache = {};

async function callClaude(payload, targetLang, targetName) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20251001",
      max_tokens: 8000,
      system: `You are a professional translator for health and wellness content. Translate the JSON object into ${targetName} (code: ${targetLang}).
STRICT RULES:
- Return ONLY a valid JSON object. No markdown, no code fences, no explanation.
- Keep every key name unchanged. Only translate the values.
- Keep emojis exactly as-is.
- Do NOT translate: PCOS, LH/FSH, EGCG, RTL, Ashwagandha, Chasteberry, Vitex, Spearmint, Hibiscus, Matcha.
- Translate ingredient names naturally into ${targetName}.
- For RTL languages (Arabic, Hebrew, Persian, Urdu) write text naturally right-to-left.`,
      messages: [{ role: "user", content: `Translate to ${targetName}:\n${payload}` }],
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const raw = data.content?.[0]?.text || "";
  const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(clean);
}

async function translateStrings(strings, targetLang, targetName) {
  if (targetLang === "en") return strings;
  if (translationCache[targetLang]) return translationCache[targetLang];

  // Split BASE_STRINGS into 3 smaller chunks so we never exceed token limits
  const {
    // Chunk 1 — navigation, welcome, payment UI
    tagline, heroTitle, tabs, getBioLink,
    welcomeQuote, feature1Title, feature1Desc, feature2Title, feature2Desc,
    feature3Title, feature3Desc, feature4Title, feature4Desc,
    alignmentTitle, alignmentBody1, alignmentBody2,
    foundationsTitle, principle1Title, principle1Desc, principle2Title, principle2Desc,
    principle3Title, principle3Desc, principle4Title, principle4Desc,
    proTipLabel, proTipText, dailyPracticesTitle,
    practiceVizName, practiceVizDesc, practiceAffName, practiceAffDesc,
    practiceThanksName, practiceThanksDesc, practiceBreathName, practiceBreathDesc,
    paymentTagline, paymentHeroTitle, paymentSubtitle, paymentFeatures,
    plan1Label, plan1Price, plan1Period, plan1Desc,
    plan2Label, plan2Price, plan2Period, plan2Desc,
    plan3Label, plan3Price, plan3Period, plan3Desc,
    mostPopular, selectedLabel, getAccessBtn, choosePlanBtn, guarantee,
    testimonials, checkoutBack, checkoutSummaryLabel,
    fieldName, fieldNamePh, fieldEmail, fieldEmailPh,
    fieldCard, fieldCardPh, fieldExpiry, fieldExpiryPh, fieldCvv, fieldCvvPh,
    payBtn, processingBtn, payFooter, formError,
    successEmoji, successTitle, successBody, successBtn,
    bioTitle, bioDesc, bioCopyBtn, bioCopiedBtn, bioCaptionsLabel,
    bioCaptions, bioDeployNote, languageLabel, translatingLabel, translateError,

    // Chunk 2 — phase, conditions, tracker labels
    phaseSectionTitle, phaseSubTabs, workoutPlanTitle, smoothiesTitle, shakesTitle,
    juicesTitle, mealsTitle, teasTitle, ingredientsLabel, benefitLabel, whenLabel,
    restLabel, dayLabels, mealLabels, affirmationLabel,
    conditionsTitle, conditionsList, pcosTitle, pcosBody, endoTitle, endoBody,
    hbpTitle, hbpBody, teaGuideLabel, keyTakeawaysTitle, avoidTitle,
    herbsAvoidTitle, precautionsTitle, lifestyleTitle,
    morningTeasTitle, morningTeasDesc, daytimeTeasTitle, daytimeTeasDesc,
    eveningTeasTitle, eveningTeasDesc, additionalSupportTitle, hbpDisclaimer,
    trackerTitle, weekLabel, phaseLabel, habitGroups,
    measurementsTitle, measureFields, energyMoodTitle, energyLabel,
    energyLevels, moodLabel, moodPlaceholder,

    // Chunk 3 — rest, journal, conclusion
    ...chunk3
  } = strings;

  const chunk1 = {
    tagline, heroTitle, tabs, getBioLink,
    welcomeQuote, feature1Title, feature1Desc, feature2Title, feature2Desc,
    feature3Title, feature3Desc, feature4Title, feature4Desc,
    alignmentTitle, alignmentBody1, alignmentBody2,
    foundationsTitle, principle1Title, principle1Desc, principle2Title, principle2Desc,
    principle3Title, principle3Desc, principle4Title, principle4Desc,
    proTipLabel, proTipText, dailyPracticesTitle,
    practiceVizName, practiceVizDesc, practiceAffName, practiceAffDesc,
    practiceThanksName, practiceThanksDesc, practiceBreathName, practiceBreathDesc,
    paymentTagline, paymentHeroTitle, paymentSubtitle, paymentFeatures,
    plan1Label, plan1Price, plan1Period, plan1Desc,
    plan2Label, plan2Price, plan2Period, plan2Desc,
    plan3Label, plan3Price, plan3Period, plan3Desc,
    mostPopular, selectedLabel, getAccessBtn, choosePlanBtn, guarantee,
    testimonials, checkoutBack, checkoutSummaryLabel,
    fieldName, fieldNamePh, fieldEmail, fieldEmailPh,
    fieldCard, fieldCardPh, fieldExpiry, fieldExpiryPh, fieldCvv, fieldCvvPh,
    payBtn, processingBtn, payFooter, formError,
    successEmoji, successTitle, successBody, successBtn,
    bioTitle, bioDesc, bioCopyBtn, bioCopiedBtn, bioCaptionsLabel,
    bioCaptions, bioDeployNote, languageLabel, translatingLabel, translateError,
  };

  const chunk2 = {
    phaseSectionTitle, phaseSubTabs, workoutPlanTitle, smoothiesTitle, shakesTitle,
    juicesTitle, mealsTitle, teasTitle, ingredientsLabel, benefitLabel, whenLabel,
    restLabel, dayLabels, mealLabels, affirmationLabel,
    conditionsTitle, conditionsList, pcosTitle, pcosBody, endoTitle, endoBody,
    hbpTitle, hbpBody, teaGuideLabel, keyTakeawaysTitle, avoidTitle,
    herbsAvoidTitle, precautionsTitle, lifestyleTitle,
    morningTeasTitle, morningTeasDesc, daytimeTeasTitle, daytimeTeasDesc,
    eveningTeasTitle, eveningTeasDesc, additionalSupportTitle, hbpDisclaimer,
    trackerTitle, weekLabel, phaseLabel, habitGroups,
    measurementsTitle, measureFields, energyMoodTitle, energyLabel,
    energyLevels, moodLabel, moodPlaceholder,
  };

  // Translate all 3 chunks in parallel
  const [t1, t2, t3] = await Promise.all([
    callClaude(JSON.stringify(chunk1), targetLang, targetName),
    callClaude(JSON.stringify(chunk2), targetLang, targetName),
    callClaude(JSON.stringify(chunk3), targetLang, targetName),
  ]);

  const result = { ...t1, ...t2, ...t3 };
  translationCache[targetLang] = result;
  return result;
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
   PAYMENT GATE
═══════════════════════════════════════════════════════════════ */
function PaymentGate({ onUnlock, s, lang }) {
  const [step, setStep] = useState("landing");
  const [plan, setPlan] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const rtl = LANGUAGES.find(l => l.code === lang)?.rtl || false;
  const accent = "#c084fc";

  const plans = [
    { id: "monthly",  label: s.plan1Label, price: s.plan1Price, period: s.plan1Period, desc: s.plan1Desc, popular: false },
    { id: "annual",   label: s.plan2Label, price: s.plan2Price, period: s.plan2Period, desc: s.plan2Desc, popular: true },
    { id: "lifetime", label: s.plan3Label, price: s.plan3Price, period: s.plan3Period, desc: s.plan3Desc, popular: false },
  ];

  const handlePay = () => {
    if (!form.name || !form.email || form.card.replace(/\s/g,"").length < 16 || form.expiry.length < 5 || form.cvv.length < 3) {
      setErr(s.formError); return;
    }
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 2200);
  };

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

  if (step === "checkout") {
    const chosen = plans.find(p => p.id === plan);
    return (
      <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 450, width: "100%", animation: "fadeUp .5s ease" }}>
          <button onClick={() => setStep("landing")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 13, marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>{s.checkoutBack}</button>
          <div style={{ background: `${accent}12`, border: `1px solid ${accent}30`, borderRadius: 16, padding: "13px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{chosen?.label}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{chosen?.desc}</div></div>
            <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{chosen?.price}</div>
          </div>
          <Card>
            <SecTitle color={accent}>{s.checkoutSummaryLabel}</SecTitle>
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
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{ minHeight: "100vh", background: "#07070e", color: "#fff", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle,rgba(192,132,252,.14),transparent 65%)", animation: "glow 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.09),transparent 65%)", animation: "glow 11s ease-in-out infinite reverse" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", padding: "58px 20px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: "rgba(255,255,255,0.22)", textTransform: "uppercase", marginBottom: 13, animation: "fadeUp .7s ease" }}>{s.paymentTagline}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,8vw,62px)", fontStyle: "italic", fontWeight: 600, margin: "0 0 16px", lineHeight: 1.05, background: "linear-gradient(130deg,#fff 30%,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "fadeUp .7s .05s ease both" }}>{s.paymentHeroTitle}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.46)", lineHeight: 1.9, maxWidth: 510, margin: "0 auto 34px", animation: "fadeUp .7s .1s ease both" }}>{s.paymentSubtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 42, animation: "fadeUp .7s .15s ease both" }}>
          {(s.paymentFeatures || BASE_STRINGS.paymentFeatures).map(f => <span key={f} style={{ background: "rgba(192,132,252,0.09)", border: "1px solid rgba(192,132,252,0.22)", borderRadius: 20, padding: "5px 13px", fontSize: 12, color: "rgba(255,255,255,0.68)", fontWeight: 500 }}>{f}</span>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 13, marginBottom: 30, animation: "fadeUp .7s .2s ease both" }}>
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
        <button onClick={() => { if (!plan) setPlan("annual"); setStep("checkout"); }} style={{ background: `linear-gradient(135deg,${accent},#7c3aed)`, border: "none", borderRadius: 15, padding: "15px 46px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: `0 0 28px ${accent}38`, animation: "fadeUp .7s .25s ease both" }}>
          {plan ? `${s.getAccessBtn} — ${plans.find(p => p.id === plan)?.price}` : s.choosePlanBtn}
        </button>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 13 }}>{s.guarantee}</p>
        <div style={{ marginTop: 52, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 13, textAlign: "left", animation: "fadeUp .7s .3s ease both" }}>
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
  const [translating, setTranslating] = useState(false);
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

  const handleLangChange = useCallback(async (code) => {
    if (code === lang) return;
    setLang(code);
    if (code === "en") { setStrings(BASE_STRINGS); return; }
    const langName = LANGUAGES.find(l => l.code === code)?.name || code;
    setTranslating(true);
    setTranslateErr(false);
    try {
      const translated = await translateStrings(BASE_STRINGS, code, langName);
      setStrings(translated);
    } catch (e) {
      console.error("Translation error:", e);
      setTranslateErr(true);
      setStrings(BASE_STRINGS);
    } finally {
      setTranslating(false);
    }
  }, [lang]);

  const toggle = (h, d) => { const k = `${weekNum}-${phaseIdx}-${h}-${d}`; setChecks(p => ({ ...p, [k]: !p[k] })); };

  const HABIT_GROUPS = s.habitGroups || BASE_STRINGS.habitGroups;
  const langObj = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  if (!unlocked) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap'); *{box-sizing:border-box} @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes glow{0%,100%{opacity:.2}50%{opacity:.5}}`}</style>
      {translating && <TranslatingOverlay langName={langObj.native} />}
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

      {translating && <TranslatingOverlay langName={langObj.native} />}
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
