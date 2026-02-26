/**
 * Converts a number of bytes into a human-readable string (KB, MB, GB, etc.)
 * @param bytes - The numeric size in bytes
 * @param decimals - How many decimal places to show (default: 2)
 */
export const formatSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  // Determine which unit index to use
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // Limit to the max index of our sizes array
  const unitIndex = Math.min(i, sizes.length - 1);

  return `${parseFloat((bytes / Math.pow(k, unitIndex)).toFixed(dm))} ${sizes[unitIndex]}`;
};

export const generateUUID = () => crypto.randomUUID();
