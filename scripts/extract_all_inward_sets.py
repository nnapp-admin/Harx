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
    print("=" * 75)
    print("EXTRACTING 8-WAY HIGH-DENSITY INWARD TRANSITION FRAMES FROM character2.mp4")
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
    
    inward_sets = {
        # Right -> Center (10 frames)
        'in_right': [69, 73, 77, 81, 85, 89, 93, 97, 101, 105],
        # Down-Right -> Center (9 frames)
        'in_downright': [80, 83, 86, 89, 92, 95, 98, 101, 105],
        # Down -> Center (10 frames)
        'in_down': [116, 115, 114, 113, 112, 111, 110, 109, 108, 106],
        # Down-Left -> Center (8 frames, avoiding blink at 136)
        'in_downleft': [140, 134, 128, 122, 116, 112, 108, 106],
        # Left -> Center (10 frames)
        'in_left': [166, 172, 178, 184, 190, 196, 202, 208, 214, 220],
        # Up-Left -> Center (9 frames)
        'in_upleft': [184, 188, 192, 196, 200, 204, 208, 211, 214],
        # Up -> Center (11 frames)
        'in_up': [204, 207, 210, 213, 216, 219, 222, 225, 228, 231, 234],
        # Up-Right -> Center (10 frames)
        'in_upright': [48, 44, 40, 36, 30, 24, 16, 8, 0, 228]
    }
    
    for prefix, frame_indices in inward_sets.items():
        print(f"Extracting {prefix} ({len(frame_indices)} frames): {frame_indices}")
        for step, f_idx in enumerate(frame_indices):
            cleaned = clean_frame(all_frames[f_idx])
            filename = f"{prefix}_{step}.webp"
            for d in dest_dirs:
                cv2.imwrite(os.path.join(d, filename), cleaned, webp_params)
                
    # Also optimize the 96 perimeter frames with the seamless 207 -> 0 seam bridge
    print("Re-generating 96 perimeter frames with top seam bridge (F207 -> F0)...")
    perimeter_indices = []
    # Sector 0: 0° -> 45° (idx 0..11) from RIGHT (63) to DOWN-RIGHT (84)
    for i in range(12): perimeter_indices.append(int(round(63 + (84 - 63) * (i / 12.0))))
    # Sector 1: 45° -> 90° (idx 12..23) from DOWN-RIGHT (84) to DOWN (112)
    for i in range(12): perimeter_indices.append(int(round(84 + (112 - 84) * (i / 12.0))))
    # Sector 2: 90° -> 135° (idx 24..35) from DOWN (112) to DOWN-LEFT (140)
    for i in range(12): perimeter_indices.append(int(round(112 + (140 - 112) * (i / 12.0))))
    # Sector 3: 135° -> 180° (idx 36..47) from DOWN-LEFT (140) to LEFT (162)
    for i in range(12): perimeter_indices.append(int(round(140 + (162 - 140) * (i / 12.0))))
    # Sector 4: 180° -> 225° (idx 48..59) from LEFT (162) to UP-LEFT (178)
    for i in range(12): perimeter_indices.append(int(round(162 + (178 - 162) * (i / 12.0))))
    # Sector 5: 225° -> 270° (idx 60..71) from UP-LEFT (178) to UP (207)
    for i in range(12): perimeter_indices.append(int(round(178 + (207 - 178) * (i / 12.0))))
    # Sector 6: 270° -> 315° (idx 72..83) from UP (0) to UP-RIGHT (48) - 100% REAL VIDEO FRAMES
    for i in range(12): perimeter_indices.append(int(round(0 + (48 - 0) * (i / 12.0))))
    # Sector 7: 315° -> 360° (idx 84..95) from UP-RIGHT (48) to RIGHT (63)
    for i in range(12): perimeter_indices.append(int(round(48 + (63 - 48) * (i / 12.0))))
    
    assert len(perimeter_indices) == 96
    for i, f_idx in enumerate(perimeter_indices):
        cleaned = clean_frame(all_frames[f_idx])
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"{i}.webp"), cleaned, webp_params)
            
    # Save center.webp neutral frame (Video Frame 236)
    print("Writing center.webp neutral eye contact frame...")
    center_cleaned = clean_frame(all_frames[236])
    for d in dest_dirs:
        cv2.imwrite(os.path.join(d, "center.webp"), center_cleaned, webp_params)
        
    print("=" * 75)
    print("All 8 inward sets + 96 optimized perimeter frames extracted successfully!")
    print("=" * 75)

if __name__ == '__main__':
    main()
