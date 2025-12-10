# 🤖 Gemini AI Setup Guide

## 📚 Overview

This guide will help you set up Google's Gemini AI to provide intelligent book insights in your Book Store application.

---

## 🎯 What is Gemini AI?

Google's Gemini is a powerful large language model (LLM) that can:
- Analyze book titles and authors
- Generate summaries and plot overviews
- Suggest similar books
- Provide interesting facts
- Answer questions about books

---

## 🔑 Getting Your API Key

### Step 1: Visit Google AI Studio

Go to: **https://makersuite.google.com/app/apikey**

Or navigate:
1. Visit https://ai.google.dev/
2. Click "Get API Key" or "Try in Google AI Studio"
3. Sign in with your Google account

### Step 2: Create API Key

1. Click **"Create API Key"**
2. Select a Google Cloud project (or create a new one)
3. Click **"Create API Key in new/ existing project"**
4. **Copy your API key** (it looks like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

⚠️ **Important**: Keep this key secret! Don't commit it to GitHub.

### Step 3: Test Your Key

You can test it with curl:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY_HERE" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

You should get a JSON response with generated text.

---

## ⚙️ Configure in Your App

### Method 1: Direct in Code (Quick Start)

Edit `src/components/GeminiBookDetails.jsx`:

```javascript
// Line 10-11
const GEMINI_API_KEY = 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // ← Paste your key here
```

### Method 2: Environment Variable (Recommended)

1. **Create `.env` file** in project root:

```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
```

2. **Update `.gitignore`** to exclude it:

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

3. **Update `GeminiBookDetails.jsx`**:

```javascript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE';
```

4. **Restart dev server**:

```bash
npm run dev
```

---

## ✅ Testing the Integration

### Step 1: Start Your App

```bash
npm run dev
```

### Step 2: Login and Navigate

1. Login to your app
2. Go to "Book Store" page
3. Find any book in the table

### Step 3: Click AI Button

1. Click the **💡 AI** button next to any book
2. Modal should open showing book details
3. Wait ~2-5 seconds
4. AI-generated insights should appear!

### Example Output:

```
"The Great Gatsby" by F. Scott Fitzgerald

📖 Plot Overview:
Set in the summer of 1922, The Great Gatsby follows the story of 
Nick Carraway and his mysterious neighbor Jay Gatsby...

👤 Key Characters:
- Jay Gatsby: A wealthy and mysterious man
- Daisy Buchanan: Gatsby's lost love
- Nick Carraway: The narrator

💡 Why It's Important:
This novel is a critique of the American Dream and explores themes 
of wealth, love, and social class in the Jazz Age...

📚 Similar Books:
- "Tender Is the Night" by F. Scott Fitzgerald
- "The Sun Also Rises" by Ernest Hemingway
- "The Beautiful and Damned" by F. Scott Fitzgerald

🎉 Fun Facts:
The novel was not successful when first published in 1925, 
but became a classic after World War II...
```

---

## 🐛 Troubleshooting

### Issue: "API key not configured" warning

**Solution**: 
1. Check that you've replaced `YOUR_GEMINI_API_KEY_HERE`
2. If using `.env`, ensure file exists and key is correct
3. Restart dev server after changing `.env`

### Issue: "Invalid API key" error

**Causes**:
- API key is incorrect (check for typos)
- API key doesn't have permissions
- API key is for wrong Google Cloud project

**Solution**:
1. Regenerate API key in Google AI Studio
2. Make sure you're using **Gemini API**, not other Google APIs
3. Check API key format (starts with `AIzaSy`)

### Issue: "Rate limit exceeded" error

**Cause**: Too many requests in short time

**Solution**:
1. Wait a few minutes
2. Reduce testing frequency
3. Consider upgrading API quota (if in production)

### Issue: "CORS error" in console

**Cause**: Browser blocking cross-origin request

**Solution**: 
This shouldn't happen with Gemini API (it allows CORS), but if it does:
1. Check if you're using correct API endpoint
2. Try using a backend proxy instead

### Issue: Response is always "No response generated"

**Solution**:
1. Check internet connection
2. Verify API endpoint URL is correct
3. Check browser console for error details
4. Ensure the API isn't blocked by firewall/proxy

---

## 💰 Pricing & Limits

### Free Tier (as of 2025)

**Gemini 1.0 Pro**:
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ Free for testing and development

**Gemini 1.5 Flash** (recommended):
- ✅ 15 requests per minute
- ✅ 1,500 requests per day
- ✅ Free for testing

**Note**: Pricing may change. Check: https://ai.google.dev/pricing

### For Production

If deploying to production:
1. Monitor usage in Google Cloud Console
2. Set up billing alerts
3. Consider caching responses
4. Implement rate limiting

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep API keys in `.env` files
- Add `.env` to `.gitignore`
- Use environment variables
- Rotate keys periodically
- Monitor usage in Google Cloud Console

### ❌ DON'T:
- Commit API keys to GitHub
- Share keys publicly
- Use production keys in development
- Hardcode keys in frontend (for production apps)

---

## 🚀 Advanced: Backend Proxy (Optional)

For production apps, use a backend proxy to hide your API key:

### Backend (NestJS example):

```typescript
// gemini.controller.ts
@Post('book-insights')
async getBookInsights(@Body() data: { title: string; author: string }) {
  const apiKey = process.env.GEMINI_API_KEY; // ← Secure!
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      contents: [{
        parts: [{ text: `Tell me about "${data.title}" by ${data.author}` }]
      }]
    }
  );
  return response.data;
}
```

### Frontend:

```javascript
// GeminiBookDetails.jsx
const response = await axios.post('/api/gemini/book-insights', {
  title: book.title,
  author: book.author
});
```

**Benefits**:
- ✅ API key hidden from client
- ✅ Can add rate limiting
- ✅ Can cache responses
- ✅ More secure

---

## 📝 Customizing AI Prompts

Edit the prompt in `GeminiBookDetails.jsx` (line ~33):

```javascript
const prompt = `Give me a detailed summary about the book "${book.title}" by ${book.author}. Include:
1. Brief overview of the plot or main themes
2. Key characters (if applicable)
3. Why this book is important or popular
4. Similar books or authors
5. Fun facts or trivia

Keep it concise but informative (around 200-300 words).`;
```

### Example Customizations:

**Short Summary**:
```javascript
const prompt = `In 2-3 sentences, what is "${book.title}" by ${book.author} about?`;
```

**Recommendation-Focused**:
```javascript
const prompt = `Based on "${book.title}" by ${book.author}, recommend 5 similar books and explain why.`;
```

**Target Audience**:
```javascript
const prompt = `Describe "${book.title}" by ${book.author} and who should read it (age group, interests).`;
```

---

## 🎓 Learning Resources

### Official Documentation
- Gemini API Docs: https://ai.google.dev/docs
- Quickstart Guide: https://ai.google.dev/tutorials/get_started_web
- API Reference: https://ai.google.dev/api

### Video Tutorials
- Google AI Studio Tour: https://www.youtube.com/watch?v=d4yCWBGFCEs
- Building with Gemini API: https://www.youtube.com/watch?v=yp8cYTVxKqU

### Code Examples
- Official Examples: https://github.com/google/generative-ai-docs
- Community Examples: https://ai.google.dev/examples

---

## ✨ What You Get

With Gemini AI integrated, your Book Store app can:

✅ Provide instant book summaries  
✅ Recommend similar books  
✅ Share interesting facts  
✅ Help users discover new reads  
✅ Enhance user engagement  
✅ Stand out from other book apps  

---

## 📊 Expected Behavior

### User Flow:

1. **User clicks AI button** → Modal opens
2. **Loading state shows** → "Asking Gemini AI..."
3. **API request sent** → ~2-5 seconds
4. **Response received** → Formatted text displays
5. **User can regenerate** → Different response each time
6. **User closes modal** → Can click AI on another book

### Response Time:

- **Typical**: 2-5 seconds
- **Slow network**: 5-10 seconds
- **Error**: Immediate error message

---

## 🆘 Getting Help

### Check Logs:

Browser console:
```javascript
// Look for errors like:
// "Gemini API Error: ..."
// "Failed to fetch..."
```

### API Status:

Check if Gemini API is operational:
- https://status.cloud.google.com/

### Common Error Codes:

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check prompt format |
| 401 | Unauthorized | Invalid API key |
| 403 | Forbidden | API key lacks permissions |
| 429 | Too Many Requests | Wait and retry |
| 500 | Server Error | Gemini service issue, try later |

---

## ✅ Final Checklist

Before using in production:

- [ ] API key obtained from Google AI Studio
- [ ] API key stored securely (`.env` file)
- [ ] `.env` added to `.gitignore`
- [ ] Tested with multiple books
- [ ] Error handling works
- [ ] Loading states work
- [ ] Rate limits understood
- [ ] Usage monitored in Google Cloud Console

---

## 🎉 You're Ready!

Your Book Store now has AI-powered insights! Users can:
- Learn about any book instantly
- Discover similar recommendations
- Enjoy a premium feature

This makes your app stand out and provides real value to users.

**Happy Coding with AI! 🤖✨**
