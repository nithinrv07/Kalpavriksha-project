# Kalpavriksha

One learning app for Kalpavriksha Seva Trust students — digital learning, holistic growth, and GK & patriotic songs — in Tamil and English. Built with the GSX Chennai Chapter.

## Repository layout

| Folder | What's inside |
| --- | --- |
| [`frontend/`](frontend/) | The web app (Next.js + React + Tailwind). All UI lives here. |
| [`docs/`](docs/) | Project notes: plan, progress log and research findings. |

A `backend/` folder (API, database, sign-in) can sit next to `frontend/` when that work starts.

## Run the app

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000. On low-memory machines, `npm run dev -- --webpack` uses less RAM than the default bundler.

See [`frontend/README.md`](frontend/README.md) for the code structure and checks.
