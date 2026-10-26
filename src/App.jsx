import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import VideoToMp3Page from './pages/VideoToMp3Page';
import ImageToWebpPage from './pages/ImageToWebpPage';
import PdfToWordPage from './pages/PdfToWordPage';
import ImageUpscalerPage from './pages/ImageUpscalerPage';
import RemoveBackgroundPage from './pages/RemoveBackgroundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<VideoToMp3Page />} />
        <Route path="video-to-mp3" element={<Navigate to="/" replace />} />
        <Route path="image-to-webp" element={<ImageToWebpPage />} />
        <Route path="image-upscaler" element={<ImageUpscalerPage />} />
        <Route path="remove-background" element={<RemoveBackgroundPage />} />
        <Route path="pdf-to-word" element={<PdfToWordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
