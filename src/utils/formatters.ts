export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatPercentageReduction(original: number, current: number): {
  percentage: number;
  label: string;
  isReduction: boolean;
} {
  if (original <= 0 || current <= 0) {
    return { percentage: 0, label: '0%', isReduction: true };
  }
  const diff = original - current;
  const percent = Math.round((diff / original) * 100);
  if (percent > 0) {
    return { percentage: percent, label: `-${percent}%`, isReduction: true };
  } else if (percent < 0) {
    return { percentage: Math.abs(percent), label: `+${Math.abs(percent)}%`, isReduction: false };
  }
  return { percentage: 0, label: '0%', isReduction: true };
}
