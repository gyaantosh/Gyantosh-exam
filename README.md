# Gyaantosh Exams: website ka code

Ye website ka pehla asli hissa hai. Isme ye kaam karta hai:

- Home page, exam cards aur Paper Library (design wahi hai jo prototype mein tha)
- Register, Login, Logout
- **Admin panel (`/admin`)**: yahan se aap PDF ya image upload karte hain, daam aur exam chunte hain, aur material website par aa jata hai
- Free material sabko khulta hai. Paid material sirf us user ko khulta hai jisne use khareeda ho (ya monthly plan liya ho). File ka asli link kabhi page mein nahi hota.

**Abhi shamil nahi hai:** online payment (Razorpay). "Buy" button abhi sirf message dikhata hai. Payment agla step hai.

> Dhyan dein: ye code abhi asli Supabase account ke saath test nahi hua hai (sirf build aur page dikhne tak jaanch hui hai). Pehli baar chalane par login, upload aur download ko ek baar khud try karein.

---

## 1. Teen free accounts banayein

1. **Supabase** (supabase.com): database, login aur files ke liye
2. **GitHub** (github.com): code rakhne ke liye
3. **Vercel** (vercel.com): website live karne ke liye (GitHub se login karein)

## 2. Supabase tayyar karein

1. Supabase mein **New project** banayein (region: Mumbai, agar dikhe).
2. Left menu mein **SQL Editor** kholein, `supabase/schema.sql` file ka poora text paste karein aur **Run** dabayein. Isse saari tables, security rules aur do storage buckets (`materials` private, `covers` public) ban jayenge.
3. **Project Settings > API** mein se teen cheezein copy karein: Project URL, `anon` key, aur `service_role` key.
4. (Sirf testing ke liye) **Authentication > Sign In / Providers > Email** mein "Confirm email" band kar sakte hain, taaki register karte hi login ho jaye. Live karte waqt ise chalu rakhein.

## 3. Apne computer par chalayein

1. Node.js (version 20 ya naya) install karein: nodejs.org
2. Is folder mein terminal kholein aur chalayein:
   ```
   npm install
   ```
3. `.env.example` ko copy karke `.env.local` naam dein aur teeno values bharein.
4. Chalayein:
   ```
   npm run dev
   ```
   Browser mein `http://localhost:3000` kholein.

## 4. Apne aap ko admin banayein

1. Website par **Register** karke apna account banayein.
2. Supabase ke **SQL Editor** mein ye chalayein (email apna likhein):
   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'AAPKA-EMAIL@example.com');
   ```
3. Website par login karein. Upar **Admin** button dikhega.

## 5. Materials jodein

`/admin` par "Naya material jodein" form bharein: title, topic, daam (0 = free), pages, exam, file, aur chahein to cover photo.

`seed-assets/` folder mein aapki zip ke 4 free sheets aur 8 cover photos rakhi hain, taaki aap unhe seedha upload karke dekh sakein.

## 6. Website live karein (Vercel)

1. Code ko GitHub par daalein (`.env.local` file upload **nahi** karni, `.gitignore` use rok deta hai).
2. Vercel mein **Add New > Project** se wo GitHub repo chunein.
3. **Environment Variables** mein `.env.example` wali teeno values daalein, phir **Deploy**.
4. Apna domain Vercel ke **Domains** mein jodein.

## Zaroori suraksha baatein

- `SUPABASE_SERVICE_ROLE_KEY` ko kisi ko na dein aur GitHub par na daalein. Ye sab rules bypass karti hai.
- Supabase free plan mein ek file ki limit 50 MB hai, aur kuch din koi use na ho to project "pause" ho jata hai (dashboard se dobara chalu hota hai).
- Apna email, phone aur social links `lib/site.js` mein bharein.
- Naya exam jodna ho to `lib/exams.js` mein ek line badhayein.

## Agla step: payment

Razorpay account (KYC ke saath) banane ke baad hum "Buy" button ko payment se jodenge: order banega, payment hone par `purchases` table mein entry apne aap hogi, aur user ko download khul jayega.
