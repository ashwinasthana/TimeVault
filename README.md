# TimeVault

<p align="center">
  <img src="https://cdn.discordapp.com/attachments/838638355528024064/1414243296771051602/Airbrush-OBJECT-REMOVER-1757248788284.jpg?ex=68bedc35&is=68bd8ab5&hm=b6ae521789dad14155c64645eae8a68367edb35086b6bb90c4d64b6f6c5bbee0" alt="TimeVault logo" width="480" />
</p>

<p align="center">
  <a href="https://github.com/ashwinasthana/TimeVault"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ashwinasthana/TimeVault?style=flat-square" /></a>
  <a href="https://github.com/ashwinasthana/TimeVault"><img alt="GitHub forks" src="https://img.shields.io/github/forks/ashwinasthana/TimeVault?style=flat-square" /></a>
  <a href="https://github.com/ashwinasthana/TimeVault/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/ashwinasthana/TimeVault?style=flat-square" /></a>
  <a href="https://github.com/ashwinasthana/TimeVault/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" /></a>
  <a href="https://time-vault-taupe.vercel.app"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-brightgreen?style=flat-square" /></a>
  <a href="https://vercel.com/"><img alt="Deploy on Vercel" src="https://img.shields.io/badge/deploy-vercel-black?style=flat-square" /></a>
</p>

> Rediscover history through NASA’s Astronomy Picture of the Day, turn birthdays and anniversaries into beautiful, shareable snapshots.

[Visit](https://time-vault-taupe.vercel.app) · Try: `/?date=1999-10-12`

---

## Table of Contents
- [About](#about)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Installation](#installation)
- [Environment](#environment)
- [Usage](#usage)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Support](#support)
- [Credits & Acknowledgements](#credits--acknowledgements)

---

## About
TimeVault fetches and presents NASA’s Astronomy Picture of the Day (APOD) for any date you choose, so you can relive space history tied to birthdays and anniversaries. The app validates dates (no future dates; APOD archive begins 1995‑06‑16), displays the APOD image and explanation, and provides share/copy workflows so each date becomes a shareable story.

---

## Demo
Open the app and pass a date with the `?date=` query parameter:

`[https://time-vault-taupe.vercel.app](https://time-vault-iota.vercel.app/)/?date=1999-10-12`

You can share any story by copying the URL with the `?date=YYYY-MM-DD` parameter.

---

## Screenshots

Landing (date picker)  
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/838638355528024064/1414244186990968903/Screenshot_2025-09-07_at_7.11.07_PM.png?ex=68bedd09&is=68bd8b89&hm=7baaaaa2930490a8882f72343d517718d0aa2b1cc90d3d8a54702a5cef9eb83f" alt="Landing - Date Picker" width="720" />
</p>

Result view (APOD card)  
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/838638355528024064/1414244806153998418/Screenshot_2025-09-07_at_7.13.43_PM.png?ex=68bedd9d&is=68bd8c1d&hm=991aa3142076fc8734fd302b89adc796c6fe4944963c2dabbcdf4fe57ed64301" alt="Result view - APOD" width="720" />
</p>

Shareable story  
<p align="center">
  <img src="https://cdn.discordapp.com/attachments/838638355528024064/1414245082973863986/Screenshot_2025-09-07_at_7.14.53_PM.png?ex=68bedddf&is=68bd8c5f&hm=990ba6dba3e50d6cda1d6423f6676f8a83e4d87ec7cf3d37bfb0e70ddf328e72" alt="Shareable view" width="720" />
</p>

Info: These images are hotlinked from Discord for content delivery convenience.

---

## Features
- Fetch NASA APOD by arbitrary date
- URL-shareable stories: `?date=YYYY-MM-DD`
- Client-side validation (no future dates; APOD archive starts 1995‑06‑16)
- Animated and accessible UI with card-style presentation
- Web Share API + clipboard fallback for sharing links
- Responsive layout, graceful loading states, and error handling
- Shareable metadata for social previews (og:title, og:description, og:image)
- Small footprint and serverless-friendly API route for NASA queries

---

## Installation
1. Clone the repository
```bash
git clone https://github.com/ashwinasthana/TimeVault.git
cd TimeVault
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. (Optional) Add screenshots/logo locally  
If you prefer hosting images in the repo, create the folder `public/screenshots/` and `public/assets/` then save images there and update their paths above.

4. Configure environment variables  
Create a `.env.local` in the project root and add your NASA API key if your deployment requires it:
```
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
```
Note: Do not expose secret API keys in client-side bundles. If you proxy requests through an API route, place the key in the server-side environment.

5. Run the development server
```bash
npm run dev
# or
yarn dev
```
Open `http://localhost:3000` and try `/?date=1999-10-12`.

---

## Environment
- Node.js >= 18
- npm >= 9 or yarn >= 1.22
- A NASA API key (register at https://api.nasa.gov) — optional if the server proxies to a public APOD endpoint

---

## Usage
- Select a date using the picker and click **Explore Date**.
- If valid and available, the APOD image, explanation, and metadata appear.
- Use the share button to trigger the native share dialog or copy the shareable URL (includes `?date=YYYY-MM-DD`).
- The page is linkable — open the app with `?date=` to directly view any archived APOD.

---

## Contributing
Contributions are welcome — thank you! Suggested workflow:

1. Fork the repository and create a branch:
```bash
git checkout -b feat/your-feature
```

2. Make your changes, keep commits focused, and add tests if applicable.

3. Push and open a Pull Request with screenshots and a clear description.

4. Maintain code style and run lint/test scripts before submitting.

Please open an issue to discuss larger features or architectural changes before implementing.

---

## Roadmap
Planned enhancements:
- Add user accounts to save favorite dates
- Allow custom share cards / captions
- Add a gallery of notable historical dates
- i18n / localization support
- Better caching and offline support (service worker)

---

## Tech Stack
- Next.js — routing and server-side helpers
- React — UI
- Framer Motion — animations & entrance/exit transitions
- Tailwind CSS — styling system
- lucide-react — icons
- Vercel — hosting/deployment

---

## License
This project is licensed under the MIT License — see the `LICENSE` file for full details.
---

## Support
Found a bug or want a feature? Open an issue:  
https://github.com/ashwinasthana/TimeVault/issues

When reporting issues, include:
- Deployed URL (or `localhost` URL)
- The date you tried (e.g., `1999-10-12`)
- Any error messages shown in the UI or browser console

---

## Credits & Acknowledgements
- NASA APOD — the source of the images and explanations
- Tailwind Labs — Tailwind CSS
- Framer Motion — animations
- lucide.dev — icons
- Shields.io — status badges

---

Thank you for using TimeVault, may every date reveal a beautiful view of our universe. 🪐
