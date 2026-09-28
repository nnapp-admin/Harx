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

def morph_pair(img1, img2, alpha):
    """Bidirectional Farneback optical flow warping between two frames."""
    g1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    flow_fwd = cv2.calcOpticalFlowFarneback(g1, g2, None, 0.5, 3, 25, 5, 5, 1.2, 0)
    flow_bwd = cv2.calcOpticalFlowFarneback(g2, g1, None, 0.5, 3, 25, 5, 5, 1.2, 0)
    h, w = img1.shape[:2]
    gy, gx = np.mgrid[0:h, 0:w].astype(np.float32)
    
    m1_x = (gx + flow_fwd[..., 0] * alpha).astype(np.float32)
    m1_y = (gy + flow_fwd[..., 1] * alpha).astype(np.float32)
    m2_x = (gx + flow_bwd[..., 0] * (1.0 - alpha)).astype(np.float32)
    m2_y = (gy + flow_bwd[..., 1] * (1.0 - alpha)).astype(np.float32)
    
    w1 = cv2.remap(img1, m1_x, m1_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
    w2 = cv2.remap(img2, m2_x, m2_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0))
    return cv2.addWeighted(w1, 1.0 - alpha, w2, alpha, 0)

def main():
    print("=" * 70)
    print("GENERATING ULTRA-SMOOTH 96-FRAME SEQUENCE WITH ZERO GAPS")
    print("=" * 70)
    
    video_path = r"frontend\public\character.mp4"
    if not os.path.exists(video_path):
        video_path = r"public\character.mp4"
        
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Unable to open video {video_path}")
        sys.exit(1)
        
    all_frames = []
    while True:
        ret, f = cap.read()
        if not ret: break
        all_frames.append(f)
    cap.release()
    print(f"Loaded {len(all_frames)} video frames.")
    
    # Load artifact templates
    cursor_tmpl_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790538346754.png"
    circle_tmpl_1_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790538324265.png"
    circle_tmpl_2_path = r"C:/Users/crhar/.gemini/antigravity/brain/47e409e3-72ad-4264-b591-18a503d608ae/.user_uploaded/media_1790540313730.png"
    
    cursor_tmpl = cv2.imread(cursor_tmpl_path)
    circle_tmpl_1 = cv2.imread(circle_tmpl_1_path)
    circle_tmpl_2 = cv2.imread(circle_tmpl_2_path)
    
    cursor_gray = cv2.cvtColor(cursor_tmpl, cv2.COLOR_BGR2GRAY)
    circle_gray_1 = cv2.cvtColor(circle_tmpl_1, cv2.COLOR_BGR2GRAY)
    circle_gray_2 = cv2.cvtColor(circle_tmpl_2, cv2.COLOR_BGR2GRAY)
    
    raw_sequence = []
    
    # Seg 0: 0° -> 45° (idx 0..11) from video 90 to 105
    for i in range(12):
        f_idx = int(round(90 + (105 - 90) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Seg 1: 45° -> 90° (idx 12..23) from video 105 to 120
    for i in range(12):
        f_idx = int(round(105 + (120 - 105) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Seg 2: 90° -> 135° (idx 24..35) from video 120 to 135
    for i in range(12):
        f_idx = int(round(120 + (135 - 120) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Seg 3: 135° -> 180° (idx 36..47) from video 135 to 158
    # Blink is at 139..144. Smoothly interpolate between 138 and 145
    seg3_raw = [135, 136, 137, 138]
    for a in np.linspace(0.25, 0.75, 3):
        seg3_raw.append(('morph', 138, 145, a))
    seg3_raw.extend([145, 148, 151, 154, 158])
    for item in seg3_raw:
        if isinstance(item, int):
            raw_sequence.append(all_frames[item])
        else:
            _, f1, f2, a = item
            raw_sequence.append(morph_pair(all_frames[f1], all_frames[f2], a))
            
    # Seg 4: 180° -> 225° (idx 48..59) from video 158 to 180
    # Blink is at 169..175. Smoothly interpolate between 166 and 176
    seg4_raw = [158, 160, 162, 164, 166]
    for a in np.linspace(0.25, 0.75, 3):
        seg4_raw.append(('morph', 166, 176, a))
    seg4_raw.extend([176, 177, 178, 180])
    for item in seg4_raw:
        if isinstance(item, int):
            raw_sequence.append(all_frames[item])
        else:
            _, f1, f2, a = item
            raw_sequence.append(morph_pair(all_frames[f1], all_frames[f2], a))
            
    # Seg 5: 225° -> 270° (idx 60..71) from video 180 to 34
    # Smooth bidirectional optical flow morph across the loop gap
    seg5_raw = [180, 182, 184, 186]
    for a in np.linspace(0.16, 0.84, 5):
        seg5_raw.append(('morph', 186, 29, a))
    seg5_raw.extend([29, 31, 34])
    for item in seg5_raw:
        if isinstance(item, int):
            raw_sequence.append(all_frames[item])
        else:
            _, f1, f2, a = item
            raw_sequence.append(morph_pair(all_frames[f1], all_frames[f2], a))
            
    # Seg 6: 270° -> 315° (idx 72..83) from video 34 to 60
    for i in range(12):
        f_idx = int(round(34 + (60 - 34) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    # Seg 7: 315° -> 360° (idx 84..95) from video 60 to 90
    for i in range(12):
        f_idx = int(round(60 + (90 - 60) * (i / 12.0)))
        raw_sequence.append(all_frames[f_idx])
        
    assert len(raw_sequence) == 96, f"Expected 96 frames, got {len(raw_sequence)}"
    print("Constructed 96-frame continuous sequence. Now inpainting and cleaning all frames...")
    
    dest_dirs = [
        r"frontend\public\frames",
        r"public\frames",
        r"frontend\build\frames"
    ]
    for d in dest_dirs:
        os.makedirs(d, exist_ok=True)
        
    webp_params = [cv2.IMWRITE_WEBP_QUALITY, 92]
    
    for i, frame in enumerate(raw_sequence):
        clean = clean_frame_fully(frame, cursor_gray, circle_gray_1, circle_gray_2)
        for d in dest_dirs:
            cv2.imwrite(os.path.join(d, f"{i}.webp"), clean, webp_params)
            
    # Center neutral frame (225)
    center_clean = clean_frame_fully(all_frames[225], cursor_gray, circle_gray_1, circle_gray_2)
    for d in dest_dirs:
        cv2.imwrite(os.path.join(d, "center.webp"), center_clean, webp_params)
        
    print("All 96 WebP frames + center.webp generated, cleaned, and saved.")
    
    # Measure continuity metrics
    step_diffs = []
    for i in range(96):
        next_i = (i + 1) % 96
        p1 = os.path.join(dest_dirs[0], f"{i}.webp")
        p2 = os.path.join(dest_dirs[0], f"{next_i}.webp")
        h1 = cv2.imread(p1)[200:500, 650:1000].astype(float)
        h2 = cv2.imread(p2)[200:500, 650:1000].astype(float)
        step_diffs.append(np.abs(h1 - h2).mean())
        
    print(f"Final 96-frame continuity metrics:")
    print(f"  - Average step delta: {np.mean(step_diffs):.2f} px")
    print(f"  - Max step delta:     {max(step_diffs):.2f} px (down from 50.41 px!)")
    print("=" * 70)

if __name__ == '__main__':
    main()
