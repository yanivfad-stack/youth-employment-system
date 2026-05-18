# 📦 הוראות הנגשה ל-Netlify

## צעדים להעלאה ל-Netlify

### שלב 1: הכנת הקבצים

```bash
# במחשבך, בתיקיית הפרויקט
cd C:\projects\youth-employment-system

# וודא שכל ה-dependencies מותקנים
npm install

# בדוק שהבuild עובד בהצלחה
npm run build
```

### שלב 2: אתחול Git (אם לא בוצע)

```bash
git init
git add .
git commit -m "Initial commit: Youth Employment Management System"
```

### שלב 3: העלאה ל-GitHub

1. **יצור ריפוזיטורי חדש ב-GitHub**
   - לך ל-[github.com](https://github.com)
   - לחץ על "New repository"
   - תן לו שם: `youth-employment-system`
   - בחר "Public" (אם רוצה שיהיה גם פרטי)

2. **פוש את הקוד ל-GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/youth-employment-system.git
   git branch -M main
   git push -u origin main
   ```

### שלב 4: התחברות ל-Netlify והעלאה

⚠️ **חשוב: הגדרת Environment Variables לפני ההעלאה**

ל-Netlify צריך להיות מוגדר `NEXT_PUBLIC_TEST_MODE=true` כדי שהמערכת תעבוד בלי Firebase:

```
NEXT_PUBLIC_TEST_MODE=true
```

אם אתה רוצה להשתמש בFirebase האמיתי, הוסף את כל ה-environment variables מ-.env.example בשלב 4.3 להלן.

#### אפשרות A: דרך Netlify (המלצה)

1. **הירשם/התחבר ל-[Netlify](https://netlify.com)**
   - לחץ על "GitHub" כדי להתחבר עם GitHub

2. **התרשם את הריפוזיטורי**
   - לחץ על "New site from Git"
   - בחר את GitHub
   - בחר את הריפוזיטורי `youth-employment-system`

3. **הגדר את ה-Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (Netlify יגלה את הקובץ `netlify.toml` אוטומטית)

4. **הוסף Environment Variables**
   - לך ל-"Site settings" → "Environment"
   - **הוסף תחילה את זה (חובה לדיפלוי בהצלחה)**:
     ```
     NEXT_PUBLIC_TEST_MODE=true
     ```
   - **אם אתה רוצה להשתמש ב-Firebase:**
     - הוסף את הממשתנים מ-`.env.example`:
       ```
       NEXT_PUBLIC_FIREBASE_API_KEY=...
       NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
       NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
       וכו'
       ```
     - שנה את `NEXT_PUBLIC_TEST_MODE=false`

5. **Deploy**
   - לחץ על "Deploy"

#### אפשרות B: דרך Netlify CLI

```bash
# התקן את Netlify CLI
npm install -g netlify-cli

# התחבר ל-Netlify
netlify login

# תחקור את הפרויקט
netlify init

# Deploy
netlify deploy --prod
```

### שלב 5: הגדר את Firebase (אם משתמש בFirebase)

אם אתה משתמש בFirebase (לא במצב בדיקה):

1. **צור Firebase Project**
   - לך ל-[Firebase Console](https://console.firebase.google.com)
   - צור פרויקט חדש

2. **קבל את ה-Configuration**
   - לך ל-"Project Settings"
   - העתק את ה-Config values

3. **הוסף את ה-Environment Variables ב-Netlify**
   - עבור לאתר שלך ב-Netlify
   - Site settings → Environment
   - הוסף את כל הממשתנים

## משתנות סביבה (Environment Variables)

### אפשרות 1: Test Mode (מומלץ להתחלה)
```
NEXT_PUBLIC_TEST_MODE=true
```
זה מאפשר לך לבדוק את המערכת בלי צורך בFirebase. בדוק עם תפקידים שונים (Admin, Coordinator, Youth Worker).

### אפשרות 2: עם Firebase אמיתי
```
NEXT_PUBLIC_TEST_MODE=false
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

## בדיקת הפיתוח המקומית

לפני ההנגשה, בדוק את האתר בהצלחה בהתקנה המקומית:

```bash
# התקן dependencies
npm install

# בדוק בפיתוח
npm run dev
# פתח http://localhost:3000

# בדוק בפרודקשן
npm run build
npm start
# פתח http://localhost:3000
```

## כתובת האתר בניטליפיי

לאחר ההנגשה בהצלחה, האתר שלך יהיה זמין בכתובת כזו:
```
https://your-site-name.netlify.app
```

אתה יכול לשנות את השם בעבור לאתר של Netlify → Site settings → Change site name

## אתחול ראשון וגודל בעלויות

### דרישות מינימליות:
- **Nodejs**: 18 או גבוה יותר
- **npm**: 9 או גבוה יותר
- **זמן Build**: ~5-10 דקות בהעלאה הראשונה

### תרומות לביצועים:
- ✅ Next.js Optimizations כבר מסודרות
- ✅ Tailwind CSS עם PurgeCSS לקובץ קטן יותר
- ✅ תמונות מותאמות
- ✅ Code splitting אוטומטי

## טרובלשוטינג

### בעיה: "Error: Cannot find module"
```bash
# הסר את node_modules ובנה מחדש
rm -rf node_modules package-lock.json
npm install
npm run build
```

### בעיה: "Build failed"
- בדוק את ה-build logs בNerlify
- וודא שכל ה-environment variables מוגדרים
- בדוק את ה-Console לשגיאות TypeScript

### בעיה: "White screen after deploy"
- בדוק את Browser Console (F12)
- בדוק את Network tab
- וודא שה-public folder מועלה

## שמירה וגיבוי

לפני ההנגשה, וודא שהכל גיבוי:

```bash
# בדוק את ה-Git status
git status

# גיבוי מלא
git add .
git commit -m "Full backup before Netlify deployment"
git push origin main
```

## שאלות נוספות?

- 📚 [Netlify Documentation](https://docs.netlify.com)
- 📚 [Next.js Documentation](https://nextjs.org/docs)
- 💬 [Netlify Support](https://support.netlify.com)

---

**הערה**: אתה יכול גם להעלות ישירות דרך GitHub Actions או GitHub Pages אם תרצה.
