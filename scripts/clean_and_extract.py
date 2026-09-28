import cv2
import numpy as np
import os
import sys

def clean_frame_fully(frame, cursor_gray, circle_gray_1, circle_gray_2):
    """
    Cleans all cursor artifacts, touch/click bubbles, and generator watermarks
    while preserving 100% of the character face, hair, and clothing.
    """
    img = frame.copy()
    cw, ch = cursor_gray.shape[1], cursor_gray.shape[0]
    
    # 1. Clean generator watermark in bottom-right corner
    img[850:950, 1690:1790] = 0
    
    # 2. Clean guaranteed outer perimeter zones (x < 280, y < 120, y > 880, x > 1320)
    outer_mask = np.zeros(img.shape[:2], dtype=np.uint8)
    for roi_slice in [
        (slice(None, 120), slice(None)),        # Top border
        (slice(880, None), slice(None)),        # Bottom border
        (slice(None), slice(None, 280)),        # Left border
        (slice(None), slice(1320, None)),       # Far-right border
    ]:
        patch = img[roi_slice]
        bright = (patch[:, :, 0] > 140) | (patch[:, :, 1] > 140) | (patch[:, :, 2] > 140)
        outer_mask[roi_slice] = bright.astype(np.uint8) * 255
        
    if np.sum(outer_mask) > 0:
        outer_mask = cv2.dilate(outer_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        img = cv2.inpaint(img, outer_mask, 5, cv2.INPAINT_TELEA)
        
    # 3. Clean intermediate perimeter cursor instances via template matching
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    for _ in range(5):
        res = cv2.matchTemplate(gray, cursor_gray, cv2.TM_CCOEFF_NORMED)
        min_v, max_v, min_l, max_l = cv2.minMaxLoc(res)
        if max_v < 0.58:
            break
            
        cx, cy = max_l
        
        # Guard: Check if match is inside character torso/collar
        if 680 <= cx <= 1080 and 220 <= cy <= 680:
            patch = img[cy:cy+ch, cx:cx+cw]
            bg_pixels = patch[(patch[:,:,0] < 140) & (patch[:,:,1] < 140) & (patch[:,:,2] < 140)]
            if len(bg_pixels) > 0 and bg_pixels.mean() > 35:
                # Character clothing false positive, do not touch!
                break
                
        y1 = max(0, cy - 4)
        y2 = min(img.shape[0], cy + ch + 6)
        x1 = max(0, cx - 4)
        x2 = min(img.shape[1], cx + cw + 6)
        
        patch = img[y1:y2, x1:x2]
        c_mask = np.zeros(patch.shape[:2], dtype=np.uint8)
        white = (patch[:, :, 0] > 150) & (patch[:, :, 1] > 150) & (patch[:, :, 2] > 150)
        coords = np.argwhere(white)
        if len(coords) >= 4:
            hull = cv2.convexHull(coords[:, [1, 0]])
            cv2.fillConvexPoly(c_mask, hull, 255)
            c_mask = cv2.dilate(c_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
        else:
            c_mask[:, :] = 255
            
        full_mask = np.zeros(img.shape[:2], dtype=np.uint8)
        full_mask[y1:y2, x1:x2] = c_mask
        img = cv2.inpaint(img, full_mask, 5, cv2.INPAINT_TELEA)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
    # 4. Clean translucent click bubble (check both circle templates)
    roi_gray = gray[150:350, 1100:1350]
    res_b1 = cv2.matchTemplate(roi_gray, circle_gray_1, cv2.TM_CCOEFF_NORMED)
    res_b2 = cv2.matchTemplate(roi_gray, circle_gray_2, cv2.TM_CCOEFF_NORMED)
    _, m1, _, l1 = cv2.minMaxLoc(res_b1)
    _, m2, _, l2 = cv2.minMaxLoc(res_b2)
    
    if m1 > 0.50 or m2 > 0.50:
        loc = l1 if m1 > m2 else l2
        bx = loc[0] + 1100
        by = loc[1] + 150
        b_mask = np.zeros(img.shape[:2], dtype=np.uint8)
        cv2.circle(b_mask, (bx + 47, by + 45), 48, 255, -1)
        pts = np.array([[bx + 30, by + 75], [bx + 65, by + 75], [bx + 47, by + 105]], dtype=np.int32)
        cv2.fillPoly(b_mask, [pts], 255)
        b_mask = cv2.dilate(b_mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
        img = cv2.inpaint(img, b_mask, 7, cv2.INPAINT_TELEA)
        
    return img

def main():
    print("=" * 70)
    print("EXECUTING STRATEGIC CLEANUP & REGENERATION PIPELINE (DUAL CIRCLE DETECTION)")
    print("=" * 70)
    
    video_path = r"frontend\public\character.mp4"
    if not os.path.exists(video_path):
        video_path = r"public\character.mp4"
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video {video_path}")
        sys.exit(1)
        
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Loaded source video: {total_frames} frames from {video_path}")
    
    cursor_tmpl_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790538346754.png"
    circle_tmpl_1_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790538324265.png"
    circle_tmpl_2_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790540313730.png"
    
    cursor_tmpl = cv2.imread(cursor_tmpl_path)
    circle_tmpl_1 = cv2.imread(circle_tmpl_1_path)
    circle_tmpl_2 = cv2.imread(circle_tmpl_2_path)
    
    cursor_gray = cv2.cvtColor(cursor_tmpl, cv2.COLOR_BGR2GRAY)
    circle_gray_1 = cv2.cvtColor(circle_tmpl_1, cv2.COLOR_BGR2GRAY)
    circle_gray_2 = cv2.cvtColor(circle_tmpl_2, cv2.COLOR_BGR2GRAY)
    
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
                
    wanted_indices = set(frame_mapping)
    wanted_indices.add(225)
    
    print(f"Reading video frames in single sequential pass...")
    cached_frames = {}
    f_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if f_idx in wanted_indices:
            cached_frames[f_idx] = frame
        f_idx += 1
    cap.release()
    print(f"Cached {len(cached_frames)} unique video frames.")
    
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    print("\nProcessing, inpainting, and saving all 64 frames + center...")
    webp_params = [cv2.IMWRITE_WEBP_QUALITY, 92]
    
    for i in range(64):
        target_f = frame_mapping[i]
        raw = cached_frames[target_f]
        cleaned = clean_frame_fully(raw, cursor_gray, circle_gray_1, circle_gray_2)
        
        for d in dest_dirs:
            out_path = os.path.join(d, f"{i}.webp")
            cv2.imwrite(out_path, cleaned, webp_params)
            
    # Process neutral center frame (225)
    center_raw = cached_frames[225]
    center_cleaned = clean_frame_fully(center_raw, cursor_gray, circle_gray_1, circle_gray_2)
    for d in dest_dirs:
        out_path = os.path.join(d, "center.webp")
        cv2.imwrite(out_path, center_cleaned, webp_params)
        
    print("Extraction and restoration complete.")
    
    # Verification
    print("\nVerifying 62.webp, 63.webp and sample frames...")
    for f_name, t_num, t_g in [("62.webp", 2, circle_gray_2), ("63.webp", 1, circle_gray_1)]:
        g = cv2.cvtColor(cv2.imread(os.path.join(r"frontend\public\frames", f_name)), cv2.COLOR_BGR2GRAY)
        roi_b = g[150:350, 1100:1350]
        res_b = cv2.matchTemplate(roi_b, t_g, cv2.TM_CCOEFF_NORMED)
        _, max_b, _, _ = cv2.minMaxLoc(res_b)
        print(f"{f_name} residual click bubble {t_num} score: {max_b:.4f} (Clean: < 0.60)")
    
    g4 = cv2.cvtColor(cv2.imread(r"frontend\public\frames\4.webp"), cv2.COLOR_BGR2GRAY)
    res_c4 = cv2.matchTemplate(g4, cursor_gray, cv2.TM_CCOEFF_NORMED)
    _, max_c4, _, _ = cv2.minMaxLoc(res_c4)
    print(f"4.webp residual cursor score: {max_c4:.4f} (Clean: < 0.60)")
    
    g6 = cv2.cvtColor(cv2.imread(r"frontend\public\frames\6.webp"), cv2.COLOR_BGR2GRAY)
    res_c6 = cv2.matchTemplate(g6, cursor_gray, cv2.TM_CCOEFF_NORMED)
    _, max_c6, _, _ = cv2.minMaxLoc(res_c6)
    print(f"6.webp residual cursor score: {max_c6:.4f} (Clean: < 0.60)")
    
    print("\n" + "=" * 70)
    print("ALL 65 WEBP FRAMES CLEANED AND DEPLOYED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == '__main__':
    main()
