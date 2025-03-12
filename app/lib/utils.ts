import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * This function is used to merge tailwind and custom classes
 * @param inputs List of classes and variants
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a specific format (DD/MM/YYYY)
 * @param dateString Date string to be formatted
 * @returns Formatted date string or an empty string if input is undefined
 */
export function formatDate(dateString: string | undefined) {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  } else {
    return '';
  }
}