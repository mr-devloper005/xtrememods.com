// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tuned to the brand (terracotta accent, warm paper).
export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid rgba(28,24,19,0.10)',
  shadow: '0 8px 30px rgba(28,24,19,0.06)',
  background: '#fbf9f4',
  labelClassName: 'bg-[#9a3412] text-[#fbf9f4]',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '12px', shadow: 'none', border: '1px solid rgba(28,24,19,0.12)' },
  popup: { radius: '24px' },
  header: { radius: '18px', background: '#efeade' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak
