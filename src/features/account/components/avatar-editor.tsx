'use client';

import { ImagePlus, LoaderCircle, Minus, Plus, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui';
import { removeProfileAvatar, uploadProfileAvatar } from '@/features/account/actions/avatar';

const VIEWPORT_SIZE = 288;
const OUTPUT_SIZE = 512;

type Point = { x: number; y: number };
type ImageSize = { width: number; height: number };

function clampPan(point: Point, size: ImageSize, zoom: number, viewportSize: number): Point {
  const baseScale = Math.max(viewportSize / size.width, viewportSize / size.height);
  const maxX = Math.max(0, (size.width * baseScale * zoom - viewportSize) / 2);
  const maxY = Math.max(0, (size.height * baseScale * zoom - viewportSize) / 2);
  return { x: Math.max(-maxX, Math.min(maxX, point.x)), y: Math.max(-maxY, Math.min(maxY, point.y)) };
}

export function AvatarEditor({ initialUrl, initials }: { initialUrl?: string; initials: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointer: Point; pan: Point } | null>(null);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<string>();
  const [imageSize, setImageSize] = useState<ImageSize>();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState(VIEWPORT_SIZE);
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string }>();

  useEffect(() => {
    if (!open || !editorRef.current) return;
    const editor = editorRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const nextSize = entry.contentRect.width;
      setViewportSize(nextSize);
      if (imageSize) setPan((current) => clampPan(current, imageSize, zoom, nextSize));
    });
    observer.observe(editor);
    return () => observer.disconnect();
  }, [imageSize, open, zoom]);

  function resetEditor() {
    if (source) URL.revokeObjectURL(source);
    setSource(undefined);
    setImageSize(undefined);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function chooseFile(file?: File) {
    setMessage(undefined);
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Use uma imagem JPG, PNG ou WebP.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'O arquivo original deve ter no máximo 10 MB.' });
      return;
    }
    if (source) URL.revokeObjectURL(source);
    setSource(URL.createObjectURL(file));
    setImageSize(undefined);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOpen(true);
  }

  function changeZoom(nextZoom: number) {
    const value = Math.max(1, Math.min(3, nextZoom));
    setZoom(value);
    if (imageSize) setPan((current) => clampPan(current, imageSize, value, viewportSize));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!imageSize) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointer: { x: event.clientX, y: event.clientY }, pan };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !imageSize) return;
    const next = {
      x: dragRef.current.pan.x + event.clientX - dragRef.current.pointer.x,
      y: dragRef.current.pan.y + event.clientY - dragRef.current.pointer.y,
    };
    setPan(clampPan(next, imageSize, zoom, viewportSize));
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  async function saveCrop() {
    if (!source || !imageSize) return;
    setBusy(true);
    setMessage(undefined);
    try {
      const image = new Image();
      image.src = source;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas indisponível');

      const scale = Math.max(viewportSize / imageSize.width, viewportSize / imageSize.height) * zoom;
      const sourceSize = viewportSize / scale;
      const sourceX = imageSize.width / 2 - pan.x / scale - sourceSize / 2;
      const sourceY = imageSize.height / 2 - pan.y / scale - sourceSize / 2;
      context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.88));
      if (!blob) throw new Error('Falha ao recortar imagem');

      const formData = new FormData();
      formData.set('avatar', new File([blob], 'avatar.webp', { type: 'image/webp' }));
      const result = await uploadProfileAvatar(formData);
      if (result.status === 'error') {
        setMessage({ type: 'error', text: result.message });
        return;
      }
      if (result.signedUrl) setAvatarUrl(result.signedUrl);
      setMessage({ type: 'success', text: result.message });
      setOpen(false);
      resetEditor();
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível preparar a imagem. Tente outra foto.' });
    } finally {
      setBusy(false);
    }
  }

  async function removeAvatar() {
    setBusy(true);
    setMessage(undefined);
    const result = await removeProfileAvatar();
    setBusy(false);
    setMessage({ type: result.status, text: result.message });
    if (result.status === 'success') {
      setAvatarUrl(undefined);
      router.refresh();
    }
  }

  const displayScale = imageSize ? Math.max(viewportSize / imageSize.width, viewportSize / imageSize.height) * zoom : 1;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-20 ring-1 ring-line">
          {avatarUrl && <AvatarImage src={avatarUrl} alt="Foto do perfil" />}
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1"><h2 className="font-serif text-xl font-semibold text-ink">Foto do perfil</h2><p className="mt-1 text-sm text-muted">Escolha uma foto e ajuste o enquadramento antes de salvar.</p></div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />
          {avatarUrl && <Button type="button" variant="ghost" onClick={removeAvatar} disabled={busy}><Trash2 className="size-4" />Remover</Button>}
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={busy}>{busy ? <LoaderCircle className="size-4 animate-spin" /> : avatarUrl ? <ImagePlus className="size-4" /> : <Upload className="size-4" />}{avatarUrl ? 'Trocar foto' : 'Enviar foto'}</Button>
        </div>
      </div>

      {message && <div className={`mt-4 rounded-control border px-4 py-3 text-sm ${message.type === 'success' ? 'border-success bg-success-subtle' : 'border-danger bg-danger-subtle'}`} role={message.type === 'success' ? 'status' : 'alert'}>{message.text}</div>}

      <Dialog open={open} onOpenChange={(next) => { if (!busy) { setOpen(next); if (!next) resetEditor(); } }}>
        <DialogContent className="max-w-md border-line bg-surface text-ink" showCloseButton={!busy}>
          <DialogHeader><DialogTitle className="font-serif text-xl">Ajustar foto</DialogTitle><DialogDescription className="text-muted">Arraste a imagem para enquadrar e use o controle para aproximar.</DialogDescription></DialogHeader>
          <div ref={editorRef} className="mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-control bg-ink/90 shadow-inner" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            {source && <div className="relative size-full touch-none cursor-grab active:cursor-grabbing">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={source} alt="Prévia para recorte" draggable={false} onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none" style={imageSize ? { width: imageSize.width * displayScale, height: imageSize.height * displayScale, transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px))` } : undefined} />
              <div className="pointer-events-none absolute inset-3 rounded-full border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.48)]" />
            </div>}
          </div>
          <div className="flex items-center gap-3"><Minus className="size-4 text-muted" /><input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => changeZoom(Number(event.target.value))} className="h-2 flex-1 cursor-pointer accent-[var(--color-accent)]" aria-label="Zoom da foto" /><Plus className="size-4 text-muted" /></div>
          {message?.type === 'error' && <p className="text-sm text-danger" role="alert">{message.text}</p>}
          <DialogFooter><Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={busy}>Cancelar</Button><Button type="button" onClick={saveCrop} disabled={busy || !imageSize}>{busy ? <><LoaderCircle className="size-4 animate-spin" />Salvando…</> : 'Aplicar e salvar'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
