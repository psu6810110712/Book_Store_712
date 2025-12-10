# 🤖 Gemini API Models - Compatibility Guide

## ✅ แก้ไขเสร็จแล้ว!

ตอนนี้ใช้ **gemini-pro** model ซึ่งเป็น stable version ที่รองรับกันดีที่สุด

---

## 📊 Gemini Models Comparison

| Model | API Version | Speed | Quality | Free Tier | Status |
|-------|------------|-------|---------|-----------|--------|
| **gemini-pro** | `v1beta` | Fast | Good | ✅ 60 req/min | ✅ **Recommended** |
| gemini-1.5-flash | `v1beta` or `v1` | Very Fast | Good | ✅ 15 req/min | ⚠️ Need permission |
| gemini-1.5-pro | `v1beta` or `v1` | Slower | Excellent | ✅ 2 req/min | ⚠️ Need permission |

---

## 🎯 Current Configuration

### ✅ ใช้ตอนนี้:
```javascript
Model: gemini-pro
API Version: v1beta
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

**รองรับโดย**: API keys ทั้งหมด (ไม่ต้องขออนุญาตพิเศษ)

---

## 🔧 ปัญหาที่เจอและวิธีแก้

### ❌ ปัญหา 1: "gemini-1.5-flash is not found"
**สาเหตุ**: API key ไม่มี access ถึง model รุ่นใหม่  
**วิธีแก้**: ✅ เปลี่ยนเป็น `gemini-pro`

### ❌ ปัญหา 2: "API version v1 not supported"
**สาเหตุ**: Model บางตัวใช้ได้เฉพาะ v1beta  
**วิธีแก้**: ✅ ใช้ `v1beta` endpoint

### ✅ Solution (ใช้ตอนนี้):
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

---

## 🚀 วิธีทดสอบ

### Step 1: Refresh หน้าเว็บ
```
Ctrl + Shift + R
```

### Step 2: ทดสอบ AI Features

**Option A: Book AI Insights**
1. ไปหน้า Book Store
2. คลิกปุ่ม **💡 AI** ข้างๆ หนังสือใดก็ได้
3. รอ 3-5 วินาที
4. ควรเห็นข้อมูลจาก AI!

**Option B: Book Recommendations**
1. คลิกเมนู **⭐ Recommendations**
2. กรอกความชอบ (หรือปล่อยว่างก็ได้)
3. กด "Get AI Recommendations"
4. รอ 5-10 วินาที
5. ควรเห็น 5 หนังสือแนะนำ!

---

## 📝 Expected Response

### จาก Book AI Insights:

```
"The Great Gatsby" by F. Scott Fitzgerald

The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. 
Set in the Jazz Age on Long Island, near New York City, the novel depicts 
first-person narrator Nick Carraway's interactions with mysterious 
millionaire Jay Gatsby...

[AI-generated analysis continues]
```

### จาก Recommendations:

```json
[
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "description": "A gripping tale of racial injustice...",
    "reason": "Based on your love for classic American literature..."
  },
  ...
]
```

---

## 🎓 Model Features

### gemini-pro (Current)

**Strengths:**
✅ Fast response (2-5 seconds)  
✅ Good quality text generation  
✅ Works with all API keys  
✅ High rate limit (60 req/min)  
✅ Reliable and stable  

**Best For:**
- Book summaries
- Recommendations
- Quick questions
- General text generation

**Limitations:**
⚠️ ไม่รองรับรูปภาพ (text-only)  
⚠️ Context window เล็กกว่า 1.5 models  

---

## 💡 ถ้าต้องการ Model ที่ดีกว่า

### Option 1: ใช้ gemini-1.5-pro (คุณภาพสูงสุด)

**ต้องทำ:**
1. ไป Google AI Studio
2. สร้าง API key ใหม่ที่มี access ถึง Gemini 1.5
3. แก้โค้ด:
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
```

**ข้อดี:**
- คุณภาพสูงสุด
- Context window ใหญ่มาก
- เข้าใจบริบทลึกซึ้งกว่า

**ข้อเสีย:**
- ช้ากว่า (10-15 วินาที)
- Rate limit ต่ำ (2 req/min)

### Option 2: ใช้ gemini-1.5-flash (เร็วที่สุด)

**แก้โค้ด:**
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

**ข้อดี:**
- เร็วมาก (1-3 วินาที)
- คุณภาพดี

**ข้อเสีย:**
- อาจต้องขออนุญาตพิเศษ
- Rate limit ต่ำกว่า (15 req/min)

---

## ✅ Checklist

หลังแก้ไขแล้ว:

- [x] เปลี่ยน model เป็น `gemini-pro`
- [x] ใช้ API version `v1beta`
- [x] อัพเดททั้ง 2 ไฟล์:
  - [x] `GeminiBookDetails.jsx`  
  - [x] `BookRecommendationPage.jsx`
- [ ] Refresh หน้าเว็บ (Ctrl+Shift+R)
- [ ] ทดสอบ AI features
- [ ] ตรวจสอบว่าทำงานปกติ

---

## 🐛 Troubleshooting

### ยังไม่ทำงาน?

1. **ตรวจสอบ API Key:**
   - เปิด `.env`
   - ตรวจว่ามี `VITE_GEMINI_API_KEY=...`
   - Key ต้องขึ้นต้นด้วย `AIzaSy`

2. **Restart Server:**
   ```bash
   # กด Ctrl+C
   npm run dev
   ```

3. **Hard Refresh:**
   ```
   Ctrl + Shift + R
   ```

4. **Check Console:**
   - กด F12
   - ดู Console tab
   - มี error อะไรไหม?

5. **ตรวจสอบ Network:**
   - F12 → Network tab
   - คลิกปุ่ม AI
   - ดู request ไป generateContent
   - มี response 200 หรือไม่?

---

## 📊 API Pricing (Free Tier)

| Model | Requests/min | Requests/day |
|-------|-------------|--------------|
| gemini-pro | 60 | 1,500 |
| gemini-1.5-flash | 15 | 1,500 |
| gemini-1.5-pro | 2 | 50 |

**หมายเหตุ**: ราคาอาจเปลี่ยนแปลง ตรวจสอบที่: https://ai.google.dev/pricing

---

## 🎉 สรุป

✅ **ตอนนี้ใช้**: gemini-pro (stable, reliable)  
✅ **API Version**: v1beta (รองรับดี)  
✅ **Rate Limit**: 60 requests/minute (เพียงพอมาก)  
✅ **แก้ไขแล้ว**: ทั้ง 2 ไฟล์  

**Refresh หน้าเว็บแล้วลองใช้ได้เลย! 🚀**
