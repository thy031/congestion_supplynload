import os
import shutil
import cv2
import numpy as np
from PIL import Image

VIDEO_PATH = "final_full.mp4"
OUT_DIR = "/tmp/lesson_slides"
PDF_OUT = "lesson/slides.pdf"

shutil.rmtree(OUT_DIR, ignore_errors=True)
os.makedirs(OUT_DIR, exist_ok=True)

cap = cv2.VideoCapture(VIDEO_PATH)
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
step = max(1, int(round(fps / 4)))  # sample 4 fps

samples = []
idx = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break
    if idx % step == 0:
        gray = cv2.cvtColor(cv2.resize(frame, (320, 180)), cv2.COLOR_BGR2GRAY)
        samples.append((idx, gray))
    idx += 1

# 1. Group frames into slide segments using the top title/counter band (y: 2%-14%)
segments = []
cur_seg = []
ref_header = None

for i, (f_idx, gray) in enumerate(samples):
    h, w = gray.shape
    header = gray[int(h * 0.02):int(h * 0.14), :]

    if ref_header is None:
        ref_header = header
        cur_seg = [i]
        continue

    header_diff = float(np.mean(cv2.absdiff(header, ref_header) > 20))
    full_diff = float(np.mean(cv2.absdiff(gray, samples[i - 1][1]) > 25))

    # New slide starts when header/page-number changes or a full-screen cut happens
    if header_diff > 0.02 or full_diff > 0.25:
        segments.append(cur_seg)
        cur_seg = [i]
        ref_header = header
    else:
        cur_seg.append(i)

if cur_seg:
    segments.append(cur_seg)

# 2. For each slide segment, pick the LAST settled frame with visible body content
chosen_frames = []
for seg in segments:
    valid = []
    for pos, s_idx in enumerate(seg):
        gray = samples[s_idx][1]
        h, w = gray.shape
        # Body region excluding top header and bottom-right corner mascot
        body = gray[int(h * 0.14):int(h * 0.85), :int(w * 0.82)]
        bg = int(np.median(body))
        content_ratio = float(np.mean(np.abs(body.astype(np.int16) - bg) > 15))

        if content_ratio < 0.004:  # skip blank / mascot-only intro frames
            continue

        if pos > 0:
            prev_gray = samples[seg[pos - 1]][1]
            prev_body = prev_gray[int(h * 0.14):int(h * 0.85), :int(w * 0.82)]
            motion = float(np.mean(cv2.absdiff(body, prev_body) > 12))
        else:
            motion = 0.0

        valid.append((s_idx, motion, content_ratio))

    if not valid:
        continue

    # Trim the very last sample in case it overlaps a transition, then search backward
    candidates = valid[:-1] if len(valid) > 2 else valid
    settled = [s_idx for (s_idx, motion, _) in candidates if motion < 0.003]

    if settled:
        best_s_idx = settled[-1]  # last settled frame = all animations complete
    else:
        best_s_idx = max(candidates, key=lambda x: x[2])[0]  # fallback: most content

    chosen_frames.append(samples[best_s_idx][0])

# 3. Export full-resolution PNGs and build lesson/slides.pdf
slides = []
for slide_num, f_idx in enumerate(chosen_frames, start=1):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
    ret, frame = cap.read()
    if not ret:
        continue
    png_path = os.path.join(OUT_DIR, f"slide_{slide_num:03d}.png")
    cv2.imwrite(png_path, frame)
    slides.append(Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
    print(f"Saved slide {slide_num:02d} at {f_idx / fps:6.2f}s")

cap.release()

if slides:
    slides[0].save(PDF_OUT, save_all=True, append_images=slides[1:], resolution=150.0)
    print(f"\nDone: {len(slides)} completed slides -> {PDF_OUT}")