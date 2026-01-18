import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ErrorResponse } from "@/api/appConfig";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sentenceCase = (str: string) => {
  if (!str) return "";

  // return str;/
  return str?.charAt(0).toUpperCase() + str?.slice(1)?.toLowerCase();
};

export function sentenceCaseEachWord(str: string) {
  return str
    .split(" ")
    .map(
      (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase(),
    )
    .join(" ");
}

export const convertToSnakeCase = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, "_");

export function splitAmountByThousands(amount: number) {
  const parts = [];
  let remaining = amount?.toString();

  while (remaining.length > 3) {
    parts.unshift(remaining.slice(-3));
    remaining = remaining.slice(0, -3);
  }

  if (remaining.length > 0) {
    parts.unshift(remaining);
  }

  return parts.join(",");
}

export const useGetErrorMessage = () => {
  return (error: unknown): string => {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data;

      // Check for 'error' property first (API returns { error: "..." })
      // Then fall back to 'message' property
      return (
        errorData?.error || errorData?.message || "An unexpected error occurred"
      );
    }

    return "An unexpected error occurred";
  };
};

export const parseDate = (date?: string | Date) => {
  if (!date) return "";
  return format(
    typeof date === "string" ? parseISO(date) : date,
    "yyyy-MM-dd HH:mm:ss",
  );
};

export const formatDateAndTime = (dateTimeString: string) => {
  const date = parseISO(dateTimeString);

  const formattedDate = format(date, "EEE, dd MMM"); // e.g., "Sun, 20 Aug"
  const formattedTime = format(date, "HH:mm"); // e.g., "09:55"

  return { date: formattedDate, time: formattedTime };
};

export const formatTime = (dateString: string) => {
  return format(parseISO(dateString), "h:mm a").toLowerCase();
};

export function formatDateCustom(dateString: string | Date) {
  const date = new Date(dateString);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()]; // Get the abbreviated day name
  const day = date.getDate(); // Get the day of the month
  const monthName = months[date.getMonth()]; // Get the abbreviated month name
  const year = date.getFullYear(); // Get the year

  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);

  return `${day}${suffix} ${month}, ${year}`;
}

function getDaySuffix(day: number): string {
  if (day > 3 && day < 21) return "th"; // Covers 4-20
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatDateWithTime(dateString: string): string {
  // First, ensure we have a proper Date object
  // This handles both ISO strings and other string formats
  let date: Date;

  try {
    // Try to parse as ISO string first
    date = parseISO(dateString);

    // Check if date is valid (parseISO returns an invalid date for some non-ISO strings)
    if (isNaN(date.getTime())) {
      // If not valid ISO format, try regular Date constructor
      date = new Date(dateString);
    }
  } catch {
    // Fallback to regular Date constructor if parseISO fails
    date = new Date(dateString);
  }

  // Make sure we got a valid date
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Get day with suffix
  const day = date.getDate();

  // Format the month and year
  const month = format(date, "MMMM");
  const year = format(date, "yyyy");

  // Format the time (12-hour with AM/PM)
  const timePart = format(date, "h:mma").toLowerCase();

  // Combine everything
  return `${day} ${month}, ${year} | ${timePart}`;
}

export const naira = (amount: number | string): string => {
  const parsedAmount =
    typeof amount === "string" ? parseFloat(amount?.replace(/,/g, "")) : amount;

  if (isNaN(parsedAmount)) {
    throw new Error("Invalid amount");
  }

  const nairaFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  let formattedAmount = nairaFormatter.format(parsedAmount);
  formattedAmount = formattedAmount.replace("₦", "₦ ");

  return formattedAmount;
};

export const stripHtmlTags = (html: string) => {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};
