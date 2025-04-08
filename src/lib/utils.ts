import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict'
import {format} from 'date-fns'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return format(from, "dd MMM ");
    } else {
      return format(from, "MMM dd yyyy");
    }
  }
}

export function formatNumber(n:number):string {
  return Intl.NumberFormat("en-Us",{
    notation:"compact",
    maximumFractionDigits:1
  }).format(n);
}

