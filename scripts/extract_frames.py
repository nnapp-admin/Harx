import cv2
import numpy as np
import os
import sys

def clean_frame_artifacts(frame, f_idx):
    """Clean watermark and stray mouse pointer artifacts recorded in the source video."""
    img = frame.copy()
    
    # 1. Clean generator watermark in bottom-right corner (pure black background area)
    img[850:950, 1690:1790] = 0
    
    # 2. Known cursor zones:
    zones = []
    # Right turn cursor zone
    if 75 <= f_idx <= 103:
        zones.append((240, 420, 1200, 1340))
    # Down-right cursor zone
    if 101 <= f_idx <= 112:
        zones.append((560, 650, 1010, 1090))
    # Up-left cursor zone
    if 181 <= f_idx <= 190:
        zones.append((500, 600, 800, 890))
        
    for y1, y2, x1, x2 in zones:
        patch = img[y1:y2, x1:x2]
        white = (patch[:, :, 0] > 190) & (patch[:, :, 1] > 190) & (patch[:, :, 2] > 190)
        coords = np.argwhere(white)
        if len(coords) >= 6:
            min_y, min_x = coords.min(axis=0)
            max_y, max_x = coords.max(axis=0)
            bw = max_x - min_x + 1
            bh = max_y - min_y + 1
            if bw <= 45 and bh <= 60:
                hull = cv2.convexHull(coords[:, [1, 0]])
                mask = np.zeros(patch.shape[:2], dtype=np.uint8)
                cv2.fillConvexPoly(mask, hull, 255)
                mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
                patch_inp = cv2.inpaint(patch, mask, 7, cv2.INPAINT_TELEA)
                img[y1:y2, x1:x2] = patch_inp

    # Cursors in left background (around frames 210..240)
    if f_idx >= 200:
        for (cx, cy) in [(682, 534), (493, 594), (484, 604)]:
            patch = img[cy-35:cy+35, cx-35:cx+35]
            white = (patch[:, :, 0] > 180) & (patch[:, :, 1] > 180) & (patch[:, :, 2] > 180)
            coords = np.argwhere(white)
            if len(coords) >= 4:
                hull = cv2.convexHull(coords[:, [1, 0]])
                mask = np.zeros(patch.shape[:2], dtype=np.uint8)
                cv2.fillConvexPoly(mask, hull, 255)
                mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11)))
                inp = cv2.inpaint(patch, mask, 7, cv2.INPAINT_TELEA)
                img[cy-35:cy+35, cx-35:cx+35] = inp

    return img

def main():
    video_path = r"frontend\public\character.mp4"
    if not os.path.exists(video_path):
        video_path = r"public\character.mp4"
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: could not open {video_path}")
        sys.exit(1)
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    print(f"Loaded video: {total_frames} frames, {fps} FPS, {w}x{h}")
    
    compass_info = {
        "RIGHT (0°)": 90,
        "DOWN-RIGHT (45°)": 105,
        "DOWN (90°)": 120,
        "DOWN-LEFT (135°)": 135,
        "LEFT (180°)": 158,
        "UP-LEFT (225°)": 180,
        "UP (270°)": 34,
        "UP-RIGHT (315°)": 60,
        "CENTER (Neutral Eye Contact)": 225
    }
    
    print("\nExact Keyframe Identifications for 8 Compass Directions + Center:")
    for k, v in compass_info.items():
        print(f"  - {k:<30}: Video Frame {v}")
        
    anchors = [
        (0, 90),     # RIGHT
        (8, 105),    # DOWN-RIGHT
        (16, 120),   # DOWN
        (24, 135),   # DOWN-LEFT
        (32, 158),   # LEFT
        (40, 180),   # UP-LEFT
        (48, 34),    # UP
        (56, 60),    # UP-RIGHT
        (64, 90),    # Wrap to RIGHT
    ]
    
    frame_mapping = []
    for seg in range(8):
        start_idx, start_f = anchors[seg]
        end_idx, end_f = anchors[seg+1]
        
        if seg == 3: # DOWN-LEFT (135) to LEFT (158), avoiding blink 139..142
            sub_list = [135, 136, 137, 138, 145, 149, 153, 156]
            frame_mapping.extend(sub_list)
        elif seg == 4: # LEFT (158) to UP-LEFT (180), avoiding blink 169..175
            sub_list = [158, 160, 162, 164, 166, 176, 178, 179]
            frame_mapping.extend(sub_list)
        elif seg == 5: # UP-LEFT (180) to UP (34)
            sub_list = [180, 182, 184, 186, 187, 29, 31, 33]
            frame_mapping.extend(sub_list)
        else:
            for i in range(8):
                f = int(round(start_f + (end_f - start_f) * (i / 8.0)))
                frame_mapping.append(f)
                
    assert len(frame_mapping) == 64, f"Expected 64 frames, got {len(frame_mapping)}"
    
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    wanted_indices = set(frame_mapping)
    wanted_indices.add(225)
    
    cached_frames = {}
    f_idx = 0
    print("\nReading video stream in single pass...")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if f_idx in wanted_indices:
            cleaned = clean_frame_artifacts(frame, f_idx)
            cached_frames[f_idx] = cleaned
        f_idx += 1
    cap.release()
    print(f"Read and cleaned {len(cached_frames)} unique video frames.")
    
    print("Writing 64 WebP frames to frontend/public/frames/ and public/frames/...")
    for idx, vid_f in enumerate(frame_mapping):
        frame = cached_frames[vid_f]
        for d in dest_dirs:
            out_file = os.path.join(d, f"{idx}.webp")
            cv2.imwrite(out_file, frame, [cv2.IMWRITE_WEBP_QUALITY, 90])
            
    center_frame = cached_frames[225]
    for d in [r"frontend\public", r"public", r"frontend\public\frames", r"public\frames"]:
        os.makedirs(d, exist_ok=True)
        cv2.imwrite(os.path.join(d, "center.webp"), center_frame, [cv2.IMWRITE_WEBP_QUALITY, 90])
        
    print("All 64 WebP frames + center.webp successfully extracted and saved!")

if __name__ == "__main__":
    main()
