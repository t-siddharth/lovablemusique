import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// iOS PWA detection utilities
export function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isStandalonePWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

export function isIOSPWA(): boolean {
  return isIOSDevice() && isStandalonePWA();
}
