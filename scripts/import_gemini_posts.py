import json
import re
import os
from datetime import datetime, timedelta

def determine_category_and_tags(slug: str, title: str):
    s = slug.lower()
    t = title.lower()
    
    # Defaults
    category = "Sistem Mimarisi"
    tags = ["Sistem Mimarisi"]

    if any(k in s for k in ["dagitik-sistem", "cxl"]):
        category = "Dağıtık Sistemler"
        tags = ["Dağıtık Sistemler", "Sistem Mimarisi"]
        if "simulasyon" in s or "test" in s:
            tags.append("Simülasyon")
            tags.append("Yazılım Testi")
        if "cxl" in s:
            tags.append("CXL")
            tags.append("Bellek Havuzu")
    elif any(k in s for k in ["cheri", "fotonik", "sram", "cim", "48v", "donanim", "risc-v"]):
        category = "Donanım & Mimari"
        tags = ["Donanım", "Mikromimari"]
        if "cheri" in s:
            tags.append("CHERI")
        if "risc-v" in s:
            tags.append("RISC-V")
        if "fotonik" in s:
            tags.append("Fotonik")
    elif any(k in s for k in ["linux", "ebpf", "kernel", "cekirdek", "posix", "preempt", "sched", "io-uring", "lsm", "rcu", "zram", "zswap", "mglru", "psi"]):
        category = "Linux & Çekirdek"
        tags = ["Linux", "Çekirdek", "Sistem Programlama"]
        if "ebpf" in s or "bpf" in s:
            tags.append("eBPF")
        if "sched" in s or "preempt" in s:
            tags.append("Zamanlayıcı")
        if "io-uring" in s:
            tags.append("io_uring")
        if "rcu" in s:
            tags.append("RCU")
    elif any(k in s for k in ["mamba", "transformer", "yapay-zeka", "webllm", "dunya-modelleri", "bitnet", "ajan", "spekulatif", "sentetik-veri"]):
        category = "Yapay Zeka"
        tags = ["Yapay Zeka", "Derin Öğrenme"]
        if "mamba" in s or "transformer" in s:
            tags.append("LLM Mimarisi")
        if "bitnet" in s:
            tags.append("Kuantizasyon")
        if "dunya-modelleri" in s:
            tags.append("Dünya Modelleri")
    elif any(k in s for k in ["robotik", "motor", "foc", "imu", "sim-to-real", "dron", "tekillik"]):
        category = "Robotik & Kontrol"
        tags = ["Robotik", "Kontrol Sistemleri", "Gömülü"]
        if "foc" in s:
            tags.append("FOC")
        if "imu" in s:
            tags.append("IMU")
    elif any(k in s for k in ["rust", "cpp", "cxx", "c-", "webassembly", "wasi", "typestate", "nodejs", "wintertc"]):
        category = "Diller & Çalışma Zamanları"
        tags = ["Diller", "Sistem Programlama"]
        if "rust" in s:
            tags.append("Rust")
        if "cpp" in s:
            tags.append("C++26")
        if "wasi" in s or "webassembly" in s:
            tags.append("WebAssembly")
    elif any(k in s for k in ["quic", "tcp", "lora", "bluetooth", "wifi", "ethernet", "wireguard", "xdp", "can-bus"]):
        category = "Ağ & Protokoller"
        tags = ["Ağ Mimarisi", "Protokoller"]
        if "quic" in s or "tcp" in s:
            tags.append("QUIC")
        if "xdp" in s:
            tags.append("XDP")
        if "wireguard" in s:
            tags.append("WireGuard")
        if "bluetooth" in s:
            tags.append("Bluetooth")
    elif any(k in s for k in ["kripto", "kuantum", "openssh", "sifre", "guvenlik", "rowhammer", "dpa", "puf", "homomorfik", "fhe"]):
        category = "Güvenlik & Kriptografi"
        tags = ["Siber Güvenlik", "Kriptografi"]
        if "kuantum" in s or "openssh" in s:
            tags.append("Post-Quantum")
        if "rowhammer" in s:
            tags.append("Donanım Güvenliği")
    elif any(k in s for k in ["gpu", "webgpu", "mesh-shader", "restir", "gaussian", "render", "cizim", "hdr", "wayland", "bindless"]):
        category = "Grafik & Render"
        tags = ["Grafik Mimarisi", "GPU"]
        if "gaussian" in s:
            tags.append("3D Gaussian Splatting")
        if "restir" in s:
            tags.append("Işın İzleme (Ray Tracing)")
        if "webgpu" in s:
            tags.append("WebGPU")
    elif any(k in s for k in ["duckdb", "veritabani", "crdt", "bcachefs", "btrfs"]):
        category = "Veri & Dosya Sistemleri"
        tags = ["Dosya Sistemleri", "Veri Tabanı"]
        if "duckdb" in s:
            tags.append("DuckDB")
        if "crdt" in s:
            tags.append("CRDT")
        if "bcachefs" in s or "btrfs" in s:
            tags.append("CoW")

    return category, list(dict.fromkeys(tags))

def escape_yaml_string(s: str) -> str:
    s = s.replace('"', '\\"')
    return s.strip()

def main():
    json_path = 'extracted_gemini_posts.json'
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    messages = data['messages']
    posts_dir = os.path.join('content', 'posts')
    os.makedirs(posts_dir, exist_ok=True)

    extracted = []
    for i, m in enumerate(messages):
        text = m['text']
        if 'Slug (URL Yolu):' not in text:
            continue
        
        slug_m = re.search(r'Slug\s*(?:\(URL Yolu\))?:\s*([a-z0-9-]+)', text, re.I)
        prompt_m = re.search(r'Kapak Görseli İstemi\s*(?:\(Prompt\))?:\s*([^\n]+(?:\n[^\n#]+)*?)(?=\n*(?:Yayında|Öne Çıkan|BAŞLIK|ÖZET|$))', text)
        title_m = re.search(r'BAŞLIK\s*\(TÜRKÇE\)\s*\n+([^\n]+)', text)
        excerpt_m = re.search(r'ÖZET\s*/\s*SPOT\s*\(TÜRKÇE\)\s*\n+([^\n]+(?:\n[^\n#]+)*?)(?=\n*İÇERİK|$)', text)
        content_m = re.search(r'İÇERİK\s*\(TÜRKÇE\s*—\s*MARKDOWN\)\s*\n+([\s\S]+)$', text)
        
        if not (slug_m and title_m and excerpt_m and content_m):
            continue
            
        slug = slug_m.group(1).strip()
        title_tr = title_m.group(1).strip()
        excerpt_tr = excerpt_m.group(1).strip().replace('\n', ' ')
        content = content_m.group(1).strip()
        prompt = prompt_m.group(1).strip().replace('\n', ' ') if prompt_m else ""
        
        extracted.append({
            'msg_idx': i,
            'slug': slug,
            'title_tr': title_tr,
            'excerpt_tr': excerpt_tr,
            'content': content,
            'prompt': prompt,
            'has_image': len(m['imgs']) > 0
        })

    # Sequential daily dates backwards from 2026-11-15
    base_date = datetime(2026, 11, 15)
    for idx, post in enumerate(reversed(extracted)):
        post_date = base_date - timedelta(days=idx)
        post['date'] = post_date.strftime("%Y-%m-%d")

    count_written = 0
    for post in extracted:
        slug = post['slug']
        title_tr = post['title_tr']
        excerpt_tr = post['excerpt_tr']
        content = post['content']
        date_str = post['date']
        
        category, tags = determine_category_and_tags(slug, title_tr)
        
        cover_image_line = ""
        featured = False
        if post['msg_idx'] == 59:
            cover_image_line = '\ncover_image: "/blog/gemini/gemini_captured_1.png"'
            featured = True
        elif post['msg_idx'] == 60:
            cover_image_line = '\ncover_image: "/blog/gemini/gemini_captured_2.png"'
            featured = True

        tag_strs = ', '.join(f'"{t}"' for t in tags)
        
        frontmatter = f"""---
slug: "{slug}"
title_tr: "{escape_yaml_string(title_tr)}"
title_en: "{escape_yaml_string(title_tr)}"
excerpt_tr: "{escape_yaml_string(excerpt_tr)}"
excerpt_en: "{escape_yaml_string(excerpt_tr)}"
date: "{date_str}"
tags: [{tag_strs}]
category: "{category}"
featured: {str(featured).lower()}
published: true{cover_image_line}
---

{content}
"""
        file_path = os.path.join(posts_dir, f"{slug}.md")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
        count_written += 1

    print(f"Refined and updated {count_written} Markdown posts in {posts_dir}!")

if __name__ == '__main__':
    main()
