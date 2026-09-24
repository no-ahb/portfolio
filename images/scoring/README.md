# /images/scoring/

Self-hosted assets for the unlisted /scoring page.

## Posters

- `last-house-poster.png` — campaign image, Film Music Reporter (April 2026).
  756×533 PNG.
- `basquiat-poster.jpg` — film still, Tribeca 2026 *Jean-Michel*. 980×551 JPG.

## Video (re-encoded from sources, H.264 1080p ~2 Mbps + AAC 128k)

- `berluti-green.mp4`, `berluti-brown.mp4`, `berluti-blue.mp4`
  — Berluti *Jour de Poche / Hero*, three shorts (15s each).
  Source: `~/Documents/everything/sound/2026/commercial work/Lucca Advertisement Bach Project/feedback round/final/`
- `come-and-go-home.mp4`
  — *Come and Go, Home* (Lucca Lutzky), 1:52.
  Source: `~/Documents/everything/sound/2025/Lucca_Lutsky_Spring/4 da gram clip03.mp4`
- `aqualung.mp4`
  — *Aqualung* (Saif Maqbool, NYU), 44s — `idea_2` direction.
  Source: `~/Documents/everything/sound/2024/Aqualung – Film Score/video:score draft3 – 3 new directions/idea_2.mov`

## Audio (in /public/audio/)

- `/audio/scoring-basquiat-1.mp3`, `/audio/scoring-basquiat-2.mp3`
  — *Jean-Michel*, two ~6 min score samples at 192 kbps stereo.
  Source: `~/Documents/everything/sound/2025/Basquiat Project/BASQUIAT for JWB/`
  (re-encoded from 320 kbps MP3 source).

## Re-encode recipe

```bash
ffmpeg -y -loglevel error -i SRC.mp4 \
  -c:v libx264 -preset medium -crf 23 -maxrate 2500k -bufsize 5000k \
  -pix_fmt yuv420p -movflags +faststart \
  -vf "scale=-2:1080:force_original_aspect_ratio=decrease" \
  -c:a aac -b:a 128k -ac 2 OUT.mp4
```

Audio: `ffmpeg -y -i SRC.mp3 -c:a libmp3lame -b:a 192k -ac 2 OUT.mp3`

## Conventions

- Video: 1080p H.264, target ≤ ~30 MB per clip.
- Audio: 192 kbps stereo MP3 (matches existing site convention).
- File names lowercase-with-hyphens.
