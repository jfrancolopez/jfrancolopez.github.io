+++
title= 'Always Learning: Building My PC and Fixing a DRAM Training Issue'
date= '2025-09-09'
description= 'Fixing a DRAM Training Issue on B650'
tags = ['b650', 'dram', 'ram']
<!--more-->
+++

One of the things I’ve loved most about my career in technology is that you never stop learning. Even after a lifetime of building, programming, and troubleshooting systems, there’s always something new waiting around the corner. This past week, I was reminded of that truth while building my latest PC workstation.
  <!--more-->
  
---

## The Setup

  

My new build is based on the following components:

- Motherboard: Gigabyte B650 Gaming X AX (rev. 1.3), BIOS version FB7
    
- CPU: AMD Ryzen 9 7950X3D
    
- Memory: Corsair Vengeance DDR5 64GB (2×32GB) 5600 MHz CL40 (XMP, CMK64GX5M2B5600C40)
    
- OS: Dualboot = Win11 pro for Workstations / Arch linux
    

  
On paper, everything looked straightforward. The ram is even at the official mobo support list. But once I started putting it together, I hit a problem I had never encountered before: the dreaded DRAM LED stuck during POST.

---
## The Problem
  

Every time I powered on the system, the motherboard would hang on the DRAM status LED. The only way to get past it was to manually hit the reset switch (RST_SW), at which point the board would finally allow me to enter the BIOS. The memory itself wasn’t faulty—I ran MemTest86+ and confirmed both sticks were solid. This was clearly a training/compatibility issue between DDR5 and the AM5 platform.

  
---
## The Solution


After experimenting with multiple options, the fix came down to:

1. Updating the BIOS to a stable release (FB7 in my case).
    
2. Booting with both RAM sticks and CPU installed, then using the reset button to reach BIOS.
    
3. Manually tuning memory settings:
    
    - Set DRAM voltages slightly higher (1.30 V instead of 1.25 V).
        
    - Entered timings manually (CL40-40-40-77).
        
    - Disabled Power Down Mode.
        
    - Disabled Memory Context Restore.
        

  

With those changes, the system trained successfully, booted reliably, and has been stable since.

---  
## Conclusion
  

I'm writing this, because i could not find any real solution to this problem. This experience was a reminder that PC building in 2025 still isn’t completely “plug-and-play”—especially when working with new platforms like AM5 and high-capacity DDR5 kits. Even after decades in technology, I find myself learning something new every week.
  

And honestly? That’s one of the reasons I’ll never get bored of this field. There’s always a new problem to solve, a new lesson to take away, and another chance to share knowledge with others who might face the same issue.

-Franco