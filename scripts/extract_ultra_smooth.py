import cv2
import numpy as np
import os
import sys
import json

def clean_frame(img):
    """
    Cleans generator watermark in the bottom-right corner and ensures
    outer border margins blend smoothly into pure #000000 black.
    """
    out = img.copy()
    # 1. Clean generator watermark star in bottom right
    out[840:960, 1680:1820] = 0
    
    # 2. Clean outer border margins so background is pure #000000
    for roi in [
        (slice(0, 70), slice(None)),
        (slice(1000, None), slice(None)),
        (slice(None), slice(0, 220)),
        (slice(None), slice(1600, None))
    ]:
        mask = (out[roi].max(axis=2) < 25)
        out[roi][mask] = 0
        
    return out

def main():
    print("=" * 75)
    print("  ULTRA-SMOOTH 360° EXTRACTION: 207 PERIMETER + 8-WAY INWARD FRAMES")
    print("=" * 75)
    
    video_path = r"frontend\public\character2.mp4"
    if not os.path.exists(video_path):
        video_path = r"public\character2.mp4"
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open {video_path}")
        sys.exit(1)
        
    all_frames = []
    while True:
        ret, f = cap.read()
        if not ret: break
        all_frames.append(f)
    cap.release()
    print(f"Loaded {len(all_frames)} video frames from {video_path}")
    
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames",
        r"frontend\build\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    webp_params = [cv2.IMWRITE_WEBP_QUALITY, 93]
    
    # =========================================================================
    # STEP 1: Build 207-frame perimeter using EVERY unique video frame
    # =========================================================================
    # The character rotates through these video segments:
    segments = [
        # (vid_start, vid_end, angle_start_deg, angle_end_deg)
        (63, 84, 0, 45),       # RIGHT to DOWN-RIGHT
        (84, 112, 45, 90),     # DOWN-RIGHT to DOWN
        (112, 140, 90, 135),   # DOWN to DOWN-LEFT
        (140, 162, 135, 180),  # DOWN-LEFT to LEFT
        (162, 178, 180, 225),  # LEFT to UP-LEFT
        (178, 207, 225, 270),  # UP-LEFT to UP
        (0, 48, 270, 315),     # UP to UP-RIGHT
        (48, 63, 315, 360),    # UP-RIGHT to RIGHT
    ]
    
    # Build (angle, video_frame_index) pairs
    perimeter_entries = []
    for vid_start, vid_end, ang_start, ang_end in segments:
        count = vid_end - vid_start
        for j in range(count):
            angle = ang_start + (ang_end - ang_start) * (j / float(count))
            vid_idx = vid_start + j
            perimeter_entries.append((angle % 360, vid_idx))
    
    # Sort by angle for continuous 0->360 ordering
    perimeter_entries.sort(key=lambda x: x[0])
    
    TOTAL_PERIMETER = len(perimeter_entries)
    print(f"\nPerimeter: {TOTAL_PERIMETER} unique frames covering 360°")
    
    # Extract and save all perimeter frames as 0.webp through 206.webp
    print("Extracting perimeter frames...")
    angle_map = []  # angle for each index
    for i, (angle, vid_idx) in enumerate(perimeter_entries):
        cleaned = clean_frame(all_frames[vid_idx])
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"{i}.webp"), cleaned, webp_params)
        angle_map.append(angle)
    
    # Save angle map as JSON so the frontend knows the exact angle for each frame
    angle_map_path = os.path.join("frontend", "public", "frames", "angle_map.json")
    with open(angle_map_path, 'w') as f:
        json.dump(angle_map, f)
    for d in dest_dirs:
        with open(os.path.join(d, "angle_map.json"), 'w') as f:
            json.dump(angle_map, f)
    
    # Compute quality metrics
    diffs = []
    for i in range(TOTAL_PERIMETER):
        next_i = (i + 1) % TOTAL_PERIMETER
        f1 = all_frames[perimeter_entries[i][1]][180:600, 680:1120].astype(float)
        f2 = all_frames[perimeter_entries[next_i][1]][180:600, 680:1120].astype(float)
        diffs.append(np.abs(f1 - f2).mean())
    
    print(f"  Mean step delta: {np.mean(diffs):.2f} px")
    print(f"  Max step delta:  {max(diffs):.2f} px")
    print(f"  Steps > 15 px: {sum(1 for d in diffs if d > 15)} (only the seam)")
    print(f"  Steps > 10 px: {sum(1 for d in diffs if d > 10)}")
    
    # =========================================================================
    # STEP 2: Extract 8-way inward transition frames
    # =========================================================================
    inward_sets = {
        'in_right':     [69, 73, 77, 81, 85, 89, 93, 97, 101, 105],
        'in_downright':  [80, 83, 86, 89, 92, 95, 98, 101, 105],
        'in_down':       [116, 115, 114, 113, 112, 111, 110, 109, 108, 106],
        'in_downleft':   [140, 134, 128, 122, 116, 112, 108, 106],
        'in_left':       [166, 172, 178, 184, 190, 196, 202, 208, 214, 220],
        'in_upleft':     [184, 188, 192, 196, 200, 204, 208, 211, 214],
        'in_up':         [204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234],
        'in_upright':    [48, 44, 40, 36, 30, 24, 16, 8, 0, 228]
    }
    
    print("\nExtracting 8-way inward transition frames...")
    for prefix, frame_indices in inward_sets.items():
        print(f"  {prefix}: {len(frame_indices)} frames")
        for step, f_idx in enumerate(frame_indices):
            cleaned = clean_frame(all_frames[f_idx])
            for d in dest_dirs:
                cv2.imwrite(os.path.join(d, f"{prefix}_{step}.webp"), cleaned, webp_params)
    
    # =========================================================================
    # STEP 3: Center neutral frame
    # =========================================================================
    print("\nWriting center.webp (Video Frame 236)...")
    center_cleaned = clean_frame(all_frames[236])
    for d in dest_dirs:
        cv2.imwrite(os.path.join(d, "center.webp"), center_cleaned, webp_params)
    
    # =========================================================================
    # STEP 4: Clean up old frames > 206 that may exist from previous extractions
    # =========================================================================
    for d in dest_dirs:
        for old_idx in range(TOTAL_PERIMETER, 300):
            old_path = os.path.join(d, f"{old_idx}.webp")
            if os.path.exists(old_path):
                os.remove(old_path)
                print(f"  Removed old {old_path}")
    
    print("\n" + "=" * 75)
    print(f"  EXTRACTION COMPLETE!")
    print(f"  Perimeter frames: {TOTAL_PERIMETER} (every unique video frame)")
    print(f"  Inward frames: {sum(len(v) for v in inward_sets.values())} across 8 directions")
    print(f"  Center frame: center.webp")
    print(f"  Total assets: {TOTAL_PERIMETER + sum(len(v) for v in inward_sets.values()) + 1}")
    print("=" * 75)

if __name__ == '__main__':
    main()
