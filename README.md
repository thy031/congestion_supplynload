# Module 3 · Lesson 1 — Congestion: Supply and Load (`module03-congestion-supply-load`)

Interactive web lesson for **Placement for EDA** (`learn_placement`), introducing global routing congestion analysis on a **4 × 3 GCell grid**. Students compare per-tile routing **demand** against routing **capacity** ($\text{surplus} = \text{demand} - \text{capacity}$, $\text{overflow} = \max(0, \text{demand} - \text{capacity})$) to identify oversubscribed hot spots ($\text{surplus} > 0$).

---

## Directory Structure

```text
congestion_l3/
├── README.md                     # Module documentation (this file)
├── README.txt                    # Plain-text notes
├── index.html                    # Main interactive lesson page (root entry)
├── player.html                   # Standalone video + WebVTT player
├── serve.py                      # Local HTTP development server
├── final_full.mp4                # Rendered lesson video (2:56)
├── video.mp4                     # Alias/copy of lesson video for fallback resolution
├── build_full.sh                 # Shell pipeline to render video, audio, and captions
├── render_full.py                # Python video/narration rendering script
├── slides_generation.py          # Extracts settled slide frames into lesson/slides.pdf
├── index_full.html               # HTML slide/animation source for rendering
├── index_full_run.html           # Runtime slide/animation capture page
├── supply_and_load_script.*      # Narration script source
├── video_source/                 # Source graphics, scenes, and slide assets
├── build/                        # Intermediate frame and audio build artifacts
├── .venv/                        # Python virtual environment (opencv-python, pillow, etc.)
└── lesson/                       # Self-contained deployable lesson bundle
    ├── index.html                # Lesson page (when served from lesson/)
    ├── quiz.json                 # 5-question MCQ bank with timestamps & explanations
    ├── slides.pdf                # Generated slide deck for student download
    ├── final_full.vtt            # Default WebVTT subtitle track
    ├── supply_and_load.zh.vtt    # Chinese WebVTT subtitles (default active)
    ├── supply_and_load.en.vtt    # English WebVTT subtitles
    ├── supply_and_load_narration.* # Synthesized narration audio
    └── supply_and_load_script.*  # Lesson narration transcript
```

---

## Quick Start (Local Preview)

Because browsers restrict loading external WebVTT subtitle tracks (`<track>`) and `fetch("quiz.json")` over `file://` URLs, serve the folder over HTTP:

```bash
# Option 1: Using the included server script
python serve.py

# Option 2: Using Python's built-in HTTP server
python3 -m http.server 8000
```

Then open `http://localhost:8000/` (or `http://localhost:8000/lesson/`) in your browser.

---

## Interactive Lesson Features

1. **Lesson Video with External WebVTT Subtitles & Compulsory Checkpoints**
   * Automatically resolves `final_full.mp4` / `video.mp4` and loads `.vtt` subtitle tracks (`中文` enabled by default, plus `English` and `English + 中文` if present) with responsive `video::cue` scaling in both windowed and fullscreen modes.
   * Pauses at 5 timed checkpoints (`0:39`, `0:55`, `1:10`, `1:34`, `2:16`) with an on-video modal quiz. Students cannot scrub past unanswered checkpoints.
   * Incorrect submissions highlight both the selected choice and the correct option, displaying the correct letter, answer text, and explanation.
   * Displays an **End-of-Video Scorecard** (`X / 5` correct and pass/fail status) once playback finishes.

2. **Downloadable Slide Deck (`lesson/slides.pdf`)**
   * Placed directly below the video player with **Download PDF** and **Open in Tab** buttons for offline student review.

3. **Interactive 4 × 3 GCell Supply & Load Lab**
   * **Direct box editing:** Click any GCell to inspect $\text{demand} - \text{capacity} = \text{surplus}$, or click the in-tile `−` / `+` buttons to adjust demand in $0.2$ increments.
   * **Drag-and-drop wire tokens:** Drag **Signal Net (`+0.4`)**, **Bus Bundle (`+1.0`)**, or **Clock Trunk (`+1.6`)** from the palette onto any GCell box to add routing load.
   * **Tile-to-tile rerouting:** Drag from one GCell box onto another to shift $0.4$ load away from oversubscribed hot spots.
   * **4 Teaching Presets:**
     1. *Toy starter (`Cap = 2.0`)* — shows two oversubscribed tiles (`2.6`, `3.0`) and one exact-full tile (`2.0`, $\text{surplus} = 0$).
     2. *Lower `Cap` $\to 1.0$* — keeps the same wires while shrinking supply so borderline tiles flip to hot.
     3. *Trap: `0.0` tile in hot zone* — demonstrates an empty tile surrounded by oversubscribed neighbors.
     4. *Spread wires (`0` overflow)* — balances demand so all 12 tiles satisfy $\text{demand} \le \text{Cap}$.

4. **Bilingual UI (`English` / `中文`) & Full Assessment**
   * Header toggle switches all headings, lab banners, checkpoint modals, quiz questions, and pitfall cards between English and Chinese without losing quiz progress.
   * Full 5-question quiz at the bottom with `@ mm:ss` video jump badges and an **80% (4 / 5)** passing threshold.

---

## Rebuilding Media & Slide Assets

### 1. Render Full Lesson Video
```bash
bash build_full.sh
# or directly:
python render_full.py
```

### 2. Regenerate `lesson/slides.pdf` from Video
Activate `.venv` (requires `opencv-python`, `numpy`, and `pillow`) and run:
```bash
source .venv/bin/activate
python slides_generation.py
```
`slides_generation.py` segments the video by top header/slide-counter transitions and captures the last settled frame of each slide after animations complete, exporting PNGs to `/tmp/lesson_slides/` and bundling them into `lesson/slides.pdf`.

---

## Course Integration Metadata

* **Course ID:** `learn_placement`
* **Module Directory:** `module03-congestion-supply-load`
* **Media Fallback Order:** Local relative paths (`lesson/`, `./`) $\to$ `course-media/learn_placement/module03-congestion-supply-load/` $\to$ jsDelivr / GitHub raw CDN.