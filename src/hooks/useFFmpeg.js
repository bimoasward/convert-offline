import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

/**
 * Custom hook to manage FFmpeg.wasm instance and file conversion.
 */
export function useFFmpeg() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  const ffmpegRef = useRef(null);

  // Initialize and load FFmpeg.wasm core binaries
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current && isLoaded) return ffmpegRef.current;

    setIsLoading(true);
    setLoadError(null);
    setStatusMessage('Memuat FFmpeg WebAssembly...');

    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on('log', ({ message }) => {
        console.debug('[FFmpeg Log]', message);
      });

      ffmpeg.on('progress', ({ progress: prog }) => {
        // progress is a float between 0 and 1
        const pct = Math.min(Math.max(Math.round(prog * 100), 0), 100);
        setProgress(pct);
      });

      // Load FFmpeg core wasm files via reliable unpkg CDN with Blob URLs
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      setIsLoaded(true);
      setStatusMessage('FFmpeg siap digunakan');
      return ffmpeg;
    } catch (err) {
      console.error('Gagal memuat FFmpeg:', err);
      setLoadError(err.message || 'Gagal menginisialisasi FFmpeg.wasm di browser.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded]);

  // Convert Video file to MP3
  const convertVideoToMp3 = useCallback(
    async (file, options = {}) => {
      const { bitrate = '192', onProgressUpdate } = options;

      let ffmpeg = ffmpegRef.current;
      if (!ffmpeg || !isLoaded) {
        ffmpeg = await loadFFmpeg();
      }

      setProgress(0);
      setStatusMessage('Menyiapkan file video...');

      const extension = file.name.split('.').pop() || 'mp4';
      const inputFilename = `input_${Date.now()}.${extension}`;
      const outputFilename = `output_${Date.now()}.mp3`;

      try {
        setStatusMessage('Menulis file ke virtual filesystem...');
        const fileData = await fetchFile(file);
        await ffmpeg.writeFile(inputFilename, fileData);

        setStatusMessage('Mengekstrak audio & mengonversi ke MP3...');
        
        // Setup progress handler wrapper
        const progressHandler = ({ progress: prog }) => {
          const pct = Math.min(Math.max(Math.round(prog * 100), 0), 100);
          setProgress(pct);
          if (onProgressUpdate) onProgressUpdate(pct);
        };
        ffmpeg.on('progress', progressHandler);

        // Run FFmpeg command: -i input -vn (disable video) -c:a libmp3lame -b:a {bitrate}k output.mp3
        const exitCode = await ffmpeg.exec([
          '-i',
          inputFilename,
          '-vn',
          '-acodec',
          'libmp3lame',
          '-b:a',
          `${bitrate}k`,
          outputFilename,
        ]);

        if (exitCode !== 0) {
          throw new Error(`FFmpeg eksekusi gagal dengan exit code ${exitCode}`);
        }

        setStatusMessage('Membaca file MP3 hasil konversi...');
        const outputData = await ffmpeg.readFile(outputFilename);
        
        // Convert Uint8Array to Blob & Object URL
        const mp3Blob = new Blob([outputData.buffer], { type: 'audio/mp3' });
        const mp3Url = URL.createObjectURL(mp3Blob);

        setProgress(100);
        setStatusMessage('Konversi berhasil!');

        // Cleanup virtual files to free memory
        try {
          await ffmpeg.deleteFile(inputFilename);
          await ffmpeg.deleteFile(outputFilename);
        } catch (cleanupErr) {
          console.warn('Gagal membersihkan temporary virtual files:', cleanupErr);
        }

        return {
          blob: mp3Blob,
          url: mp3Url,
          filename: `${file.name.replace(/\.[^/.]+$/, '')}.mp3`,
          size: mp3Blob.size,
        };
      } catch (err) {
        console.error('Gagal saat proses konversi:', err);
        throw err;
      }
    },
    [isLoaded, loadFFmpeg]
  );

  return {
    isLoaded,
    isLoading,
    loadError,
    progress,
    statusMessage,
    loadFFmpeg,
    convertVideoToMp3,
  };
}
