# 🌙 Go With Your Flow — Wellness Hub

> An 8-week cycle-synced wellness hub with workouts, smoothies, juices, teas & meal plans for every phase of your menstrual cycle.

---

## 🚀 Deploy to Vercel in 5 Steps

### Step 1 — Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **"+"** icon → **"New repository"**
3. Name it `gowithyourflow`
4. Leave it **Public**
5. Click **"Create repository"**

---

### Step 2 — Upload Your Files
On the next screen, click **"uploading an existing file"** and drag in this entire folder:

```
gowithyourflow/
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .gitignore
├── README.md
└── src/
    ├── main.jsx
    └── GoWithYourFlow.jsx
```

Click **"Commit changes"**.

---

### Step 3 — Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up free with your GitHub account
2. Click **"Add New Project"**
3. Find and select your `gowithyourflow` repo
4. Vercel auto-detects it as a **Vite** project — no settings to change
5. Click **"Deploy"**

⏱ Takes about 60–90 seconds.

---

### Step 4 — Get Your URL
After deployment, Vercel gives you a URL like:

```
https://gowithyourflow.vercel.app
```

You can also set a **custom domain** (e.g. `gowithyourflow.com`) in Vercel settings for free.

---

### Step 5 — Add Stripe for Real Payments (Optional)
The payment form is currently a mock UI. To collect real payments:

1. Create a free account at [stripe.com](https://stripe.com)
2. Install Stripe: in Vercel's dashboard under "Environment Variables", add:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
   ```
3. Replace the `handlePay` function in `GoWithYourFlow.jsx` with Stripe's `confirmPayment` flow
4. Or use [Stripe Payment Links](https://stripe.com/payments/payment-links) — zero code needed, just paste your Stripe link as the payment URL

---

## 📲 Your Bio Link

Once deployed, your bio link is:
```
https://gowithyourflow.vercel.app
```

Put this in your:
- Instagram bio
- TikTok bio
- Twitter/X bio
- Linktree

---

## 🌍 Languages Supported

The hub supports 30 languages powered by AI translation:
English, French, Spanish, Portuguese, German, Italian, Dutch, Polish, Romanian, Swedish, Arabic, Persian, Urdu, Hebrew, Chinese, Japanese, Korean, Hindi, Bengali, Swahili, Amharic, Yoruba, Igbo, Hausa, Turkish, Indonesian, Malay, Vietnamese, Thai, Russian

---

## 💻 Run Locally (Optional)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
src/
  GoWithYourFlow.jsx   ← Main app (all content + logic)
  main.jsx             ← React entry point
index.html             ← HTML shell
vite.config.js         ← Build config
vercel.json            ← Vercel routing config
package.json           ← Dependencies
```

---

*Built with React + Vite. Deployed on Vercel. Powered by Claude AI for translations.*
