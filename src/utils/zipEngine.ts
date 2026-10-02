import JSZip from 'jszip';

export interface ZipItem {
  filename: string;
  blob: Blob;
}

export async function createAndDownloadZip(
  items: ZipItem[],
  zipFilename = 'bulkresize_images.zip',
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();

  // Keep track of duplicate filenames to prevent overwrites in zip
  const nameCounts: Record<string, number> = {};

  items.forEach((item) => {
    let finalName = item.filename;
    if (nameCounts[finalName] !== undefined) {
      nameCounts[finalName]++;
      const dotIndex = finalName.lastIndexOf('.');
      if (dotIndex !== -1) {
        const base = finalName.substring(0, dotIndex);
        const ext = finalName.substring(dotIndex);
        finalName = `${base}_(${nameCounts[item.filename]})${ext}`;
      } else {
        finalName = `${finalName}_(${nameCounts[item.filename]})`;
      }
    } else {
      nameCounts[finalName] = 0;
    }

    zip.file(finalName, item.blob);
  });

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  // Trigger download via anchor element
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = zipFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up object URL after a brief delay
  setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 1000);
}

export function downloadSingleFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
