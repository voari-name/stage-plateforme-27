
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction pour formater les dates
export function formatDateFr(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Fonction pour capitaliser la première lettre
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Fonction pour tronquer un texte
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}

// Fonction pour générer des dégradés aléatoires
export function randomGradient(): string {
  const gradients = [
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-green-500 to-emerald-500',
    'bg-gradient-to-r from-amber-500 to-orange-500',
    'bg-gradient-to-r from-rose-500 to-red-500',
    'bg-gradient-to-r from-indigo-500 to-violet-500',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
}
