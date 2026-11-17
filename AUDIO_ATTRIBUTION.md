# Kalpavriksha Module 03, Part B — Audio Asset Checklist & Recording Attribution

## Compliance & Legal Attribution Notice
This educational platform enforces strict adherence to intellectual property laws and educational fair use guidelines. No copyrighted recordings are scraped, downloaded, or redistributed without verified authorization. Traditional, devotional, or public-domain status of a musical composition does not automatically imply that a modern sound recording of that composition is in the public domain.

---

## 1. Verified Asset Checklist

| # | Song Title | File Name | Format | Status | Source / Attribution |
|---|------------|-----------|--------|--------|----------------------|
| 1 | **Jana Gana Mana** | `jana-gana-mana.mp3` | MP3 (256 kbps) | **Available** | Supplied with project repository assets (`Songs/`). Public performance / educational anthem recording. |
| 2 | **Vande Mataram** | `vande-mataram.ogg` | OGG Vorbis | **Available** | Performed by Pt. Chandrashekhar Vaze. Provided under open repository distribution. |
| 3 | **Senthamizh Naadu** | `senthamizh-naadu.ogg` | OGG Vorbis | **Available** | Mahakavi Bharathiyar patriotic recording. Provided under open repository distribution. |
| 4 | **Aaduvome Pallu Paaduvome** | `aaduvome-pallu-paaduvome.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 5 | **Odi Vilayaadu Paappa** | `odi-vilayaadu-paappa.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 6 | **Nila Nila Odi Vaa** | `nila-nila-odi-vaa.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 7 | **Twinkle Twinkle Little Star** | `twinkle-twinkle.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 8 | **Johny Johny Yes Papa** | `johny-johny.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 9 | **The Wheels on the Bus** | `wheels-on-the-bus.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |
| 10 | **If You're Happy and You Know It** | `if-youre-happy.mp3` | — | **Placeholder** | Awaiting licensed master recording from project team. UI displays graceful unavailable state. |

---

## 2. Playback Architecture
- **Engine**: Single HTML5 `Audio` instance managed by `useMusicPlayer`.
- **Clock**: Browser `HTMLAudioElement.currentTime` acts as the single source of truth for synchronization across circular progress rings, horizontal timeline bars, and karaoke lyrics.
- **Fallbacks**: For entries where `audioSrc === null`, the user interface displays full interactive lyrics, educational descriptions, vocabulary definitions, and historical context without crashing or generating fake speech.

