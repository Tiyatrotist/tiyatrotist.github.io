---
slug: "windows-dosya-gezginine-kenetlenen-terminal"
title_tr: "Windows Dosya Gezginine Kenetlenen Yerel C++ Terminal Modu: explorer-terminal ve Windhawk"
title_en: "Docking a Native C++ Terminal into Windows File Explorer: explorer-terminal & Windhawk"
excerpt_tr: "Windows Dosya Gezgini pencerelerini tersine mühendislik ile inceleyerek Win32 API kancaları (hooks) vasıtasıyla pencerelere alt panel olarak kenetlenen hafif C++ terminal modunun iç yapısı."
excerpt_en: "Reverse engineering Windows File Explorer windows to inject and dock a native C++ terminal pane using Win32 API hooks, ShellWindows interfaces, and Windhawk."
date: "2026-10-24"
tags: ["C++", "Windhawk", "Windows", "Win32", "Tersine Mühendislik"]
category: "Sistem Modifikasyonu"
featured: false
published: true
---

Yazılım geliştiriciler ve sistem yöneticileri olarak gün içinde en sık yaptığımız işlemlerden biri, Windows Gezgini'nde bir klasördeyken terminal açmaktır (`Shift + Sağ Tık` veya adres çubuğuna `cmd` yazmak).

Fakat bu yöntem her defasında bağımsız, yüzen bir terminal penceresi açar. Klasör değiştirdiğinizde terminal önceki dizinde kalır; pencereler birbirine karışır.

**explorer-terminal**, Windows Dosya Gezgini pencerelerinin içine doğrudan alt bölme (docked pane) olarak yerleşen ve klasör gezintisini anlık olarak takip eden bir C++ Windhawk modifikasyonudur.

---

## 1. Win32 Kancaları (API Hooking) ve Windhawk Altyapısı

Windows Gezgini (`explorer.exe`), kapalı kaynaklı ve korumalı bir sistem sürecidir. Bu sürecin kullanıcı arayüzüne yeni bir pencere elemanı enjekte etmek için Windhawk framework'ünün sunduğu bellek kancalama (memory patching) altyapısını kullandım.

Modülün çalışma prensibi:
1. `explorer.exe` içinde yeni bir pencere (`CabinetWClass`) oluşturulduğunda kanca tetiklenir (`WM_CREATE`).
2. Gezgin penceresinin kullanıcı alanı (`ShellTabWindowClass`) dinamik olarak yeniden boyutlandırılır.
3. Alt kısma gömülü bir Win32 alt penceresi (`child window`) tahsis edilir ve içine gömülü terminal denetleyicisi (ConPTY / Windows Terminal instance) bağlanır.

```cpp
// Explorer Penceresine Kanca Yerleştirme (C++ Mantık İskeleti)
#include <windows.h>
#include <windhawk_api.h>

HWND g_hExplorerWnd = NULL;
HWND g_hTerminalContainer = NULL;

void RepositionDockedTerminal(HWND hExplorer) {
    RECT rcClient;
    GetClientRect(hExplorer, &rcClient);

    int terminalHeight = 260; // Alt panel yüksekliği
    int explorerContentHeight = rcClient.bottom - terminalHeight;

    // Klasör listeleme alanını yukarı sıkıştır
    HWND hShellView = FindWindowEx(hExplorer, NULL, L"ShellTabWindowClass", NULL);
    if (hShellView) {
        SetWindowPos(hShellView, NULL, 0, 0, 
                     rcClient.right, explorerContentHeight, 
                     SWP_NOZORDER | SWP_NOACTIVATE);
    }

    // Terminal panelini alt kısma sabitle
    SetWindowPos(g_hTerminalContainer, NULL, 0, explorerContentHeight, 
                 rcClient.right, terminalHeight, 
                 SWP_NOZORDER | SWP_SHOWWINDOW);
}
```

---

## 2. Klasör Değişikliklerinin Çift Yönlü Takibi (Directory Sync)

Modun en can alıcı özelliği, kullanıcının Gezgin içinde bir klasöre tıkladığında terminalin de otomatik olarak o dizine `cd` yapmasıdır.

Bunu başarmak için Windows Shell API'sindeki `IShellWindows` ve `IShellBrowser` COM arayüzleri dinlenir:
* Kullanıcı bir alt klasöre girdiğinde `DISPID_NAVIGATECOMPLETE2` olayı yakalanır.
* Aktif klasörün tam dosya yolu (`LPITEMIDLIST` $\rightarrow$ `SHGetPathFromIDListW`) çözülür.
* Terminal oturumuna arka planda görünmez bir `cd /d "C:\Hedef\Klasor"` komutu iletilir.

---

## 3. Performans ve Güvenlik Sınırları

Sistem sürecine kod enjekte ederken en ufak bir bellek hatası tüm Windows masaüstünün (`explorer.exe`) çökmesine yol açabilir.

Bu sebeple:
* Tüm Win32 handle kontrolleri katı `nullptr` kontrollerinden geçirilir.
* Bellek tahsisleri RAII prensipleriyle yönetilir.
* Modül devre dışı bırakıldığında tüm kancalar temizlenip orijinal pencere boyutları anında geri yüklenir.

---

## 4. Sonuç

**explorer-terminal**, Windows üzerinde çalışan geliştiriciler için iş akışını tek bir pencereye indirgeyen, hafif ve son derece pratik bir araç haline geldi. C++ ve yerel Win32 API'lerinin gücü, üçüncü parti hantal araçlara ihtiyaç duymadan işletim sistemini ihtiyaçlarınıza göre nasıl şekillendirebileceğinizi gösteriyor.
