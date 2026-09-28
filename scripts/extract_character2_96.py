import cv2
import numpy as np
import os
import sys

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
    print("=" * 70)
    print("EXTRACTING 96 ZERO-GHOSTING PURE WEBP FRAMES FROM character2.mp4")
    print("=" * 70)
    
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
    
    raw_sequence = []
    
    # Sector 0: 0° -> 45° (idx 0..11) from RIGHT (63) to DOWN-RIGHT (84)
    for i in range(12):
        f_idx = int(round(63 + (84 - 63) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 1: 45° -> 90° (idx 12..23) from DOWN-RIGHT (84) to DOWN (112)
    for i in range(12):
        f_idx = int(round(84 + (112 - 84) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 2: 90° -> 135° (idx 24..35) from DOWN (112) to DOWN-LEFT (140)
    for i in range(12):
        f_idx = int(round(112 + (140 - 112) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 3: 135° -> 180° (idx 36..47) from DOWN-LEFT (140) to LEFT (162)
    for i in range(12):
        f_idx = int(round(140 + (162 - 140) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 4: 180° -> 225° (idx 48..59) from LEFT (162) to UP-LEFT (178)
    for i in range(12):
        f_idx = int(round(162 + (178 - 162) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 5: 225° -> 270° (idx 60..71) from UP-LEFT (178) to UP (204)
    for i in range(12):
        f_idx = int(round(178 + (204 - 178) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 6: 270° -> 315° (idx 72..83) from UP (16) to UP-RIGHT (48) - 100% REAL VIDEO FRAMES
    for i in range(12):
        f_idx = int(round(16 + (48 - 16) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Sector 7: 315° -> 360° (idx 84..95) from UP-RIGHT (48) to RIGHT (63)
    for i in range(12):
        f_idx = int(round(48 + (63 - 48) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    assert len(raw_sequence) == 96, f"Expected 96 frames, got {len(raw_sequence)}"
    print("Constructed 96 pure video frames without any synthetic blending.")
    
    # Save destination directories
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames",
        r"frontend\build\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    webp_params = [cv2.IMWRITE_WEBP_QUALITY, 93]
    
    print("Writing 96 WebP frames to all destination directories...")
    for i, frame in enumerate(raw_sequence):
        cleaned = clean_frame(frame)
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"{i}.webp"), cleaned, webp_params)
            
    # Center neutral frame: Frame 236 (crystal clear direct eye contact with open eyes)
    print("Writing center.webp neutral eye contact frame...")
    center_cleaned = clean_frame(all_frames[236])
    for d in dest_dirs:
        cv2.imwrite(os.path.join(d, "center.webp"), center_cleaned, webp_params)
        
    cv2.imwrite(r"frontend\public\center.webp", center_cleaned, webp_params)
    cv2.imwrite(r"public\center.webp", center_cleaned, webp_params)
    
    # Compute continuity metrics across all 96 frames
    step_diffs = []
    for i in range(96):
        next_i = (i + 1) % 96
        p1 = os.path.join(dest_dirs[0], f"{i}.webp")
        p2 = os.path.join(dest_dirs[0], f"{next_i}.webp")
        h1 = cv2.imread(p1)[180:600, 680:1120].astype(float)
        h2 = cv2.imread(p2)[180:600, 680:1120].astype(float)
        step_diffs.append(np.abs(h1 - h2).mean())
        
    print("=" * 70)
    print(f"Extraction & Optimization Complete!")
    print(f"  - Total Directional WebP Frames: 96 (100% Real Video Frames)")
    print(f"  - Synthetic Morphing / Ghosting: 0% (Completely Eliminated)")
    print(f"  - Neutral Eye Contact Frame: center.webp (Video Frame 236)")
    print(f"  - Average Head Step Delta:   {np.mean(step_diffs):.2f} px")
    print(f"  - Maximum Head Step Delta:   {max(step_diffs):.2f} px")
    print("=" * 70)

if __name__ == '__main__':
    main()
