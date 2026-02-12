# Panduan Integrasi SSO dengan "Jonathan SSO" (Single Model)

Dokumen ini menjelaskan langkah-langkah lengkap untuk mengintegrasikan Login SSO dari Jonathan ke dalam aplikasi MERN ini menggunakan tabel `User` yang sudah ada.

## 1. Prasyarat (Data dari Jonathan)

Minta data berikut kepada Jonathan:

1.  **Client ID**
2.  **Client Secret**
3.  **Authorization URL**
4.  **Token URL**
5.  **User Info URL**

> **Redirect URI**: `http://localhost:5000/api/auth/sso/callback`

---

## 2. Persiapan Environment Variables

Tambahkan ke file `.env` di backend:

```env
SSO_CLIENT_ID=dapatkan_dari_jonathan
SSO_CLIENT_SECRET=dapatkan_dari_jonathan
SSO_REDIRECT_URI=http://localhost:5000/api/auth/sso/callback
SSO_AUTH_URL=https://jonathan-sso.com/oauth/authorize
SSO_TOKEN_URL=https://jonathan-sso.com/oauth/token
SSO_USER_INFO_URL=https://jonathan-sso.com/oauth/userinfo
```

---

## 3. Implementasi Backend

### A. Update `routes/auth.route.js`

```javascript
router.get("/sso/login", ssoLogin);
router.get("/sso/callback", ssoCallback);
```

### B. Update `controllers/auth.controller.js`

Gunakan model `User` asli:

```javascript
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import axios from "axios";
import crypto from "crypto";

export const ssoLogin = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SSO_CLIENT_ID,
    redirect_uri: process.env.SSO_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
  });
  res.redirect(`${process.env.SSO_AUTH_URL}?${params.toString()}`);
};

export const ssoCallback = async (req, res) => {
  const { code } = req.query;
  try {
    // A. Tukar token
    const tokenResponse = await axios.post(process.env.SSO_TOKEN_URL, {
      client_id: process.env.SSO_CLIENT_ID,
      client_secret: process.env.SSO_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: process.env.SSO_REDIRECT_URI,
    });

    // B. Ambil data user
    const userRes = await axios.get(process.env.SSO_USER_INFO_URL, {
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
    });

    const userData = userRes.data;

    // C. Cari atau Buat di tabel User (BUKAN SSOUser)
    let user = await User.findOne({
      $or: [{ ssoId: userData.sub }, { email: userData.email }],
    });

    if (!user) {
      user = new User({
        email: userData.email,
        name: userData.name,
        ssoId: userData.sub,
        ssoProvider: "jonathan-sso",
        username: userData.preferred_username || userData.email.split("@")[0],
        // password tidak wajib karena ssoId terisi (lihat skema)
      });
      await user.save();
    }

    generateTokenAndSetCookie(res, user._id);
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    res.redirect(`${process.env.CLIENT_URL}/login?error=sso_failed`);
  }
};
```

---

## 4. Implementasi Frontend

Gunakan tombol yang mengarahkan ke `http://localhost:5000/api/auth/sso/login`.
