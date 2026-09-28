import cv2
import numpy as np
import os
import sys

def clean_frame(img):
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
    print("EXTRACTING INWARD TRANSITION FRAMES FROM character2.mp4")
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
    print(f"Loaded {len(all_frames)} video frames")
    
    # Frames around 7s: Left -> Center (166 to 202)
    left_to_center = [166, 174, 182, 190, 196, 202]
    # Frames 0..20: Up -> Center (18 down to 2)
    up_to_center = [18, 14, 10, 6, 2]
    
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames",
        r"frontend\build\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    webp_params = [cv2.IMWRITE_WEBP_QUALITY, 93]
    
    print("Extracting in_left frames...")
    for i, f_idx in enumerate(left_to_center):
        cleaned = clean_frame(all_frames[f_idx])
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"in_left_{i}.webp"), cleaned, webp_params)
        print(f"  - Saved in_left_{i}.webp from video frame {f_idx}")
        
    print("Extracting in_up frames...")
    for i, f_idx in enumerate(up_to_center):
        cleaned = clean_frame(all_frames[f_idx])
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"in_up_{i}.webp"), cleaned, webp_params)
        print(f"  - Saved in_up_{i}.webp from video frame {f_idx}")
        
    print("All inward transition frames saved successfully.")
    print("=" * 70)

if __name__ == '__main__':
    main()
