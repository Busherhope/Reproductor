import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const caption = (formData.get('caption') || '').toString().trim();
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json({ error: 'Falta la foto.' }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const blob = await put(`photos/${id}-${file.name}`, file, { access: 'public' });

    const photo = {
      id,
      url: blob.url,
      caption,
      createdAt: Date.now(),
    };

    const photos = (await kv.get('photos')) || [];
    photos.unshift(photo); // las más recientes primero
    await kv.set('photos', photos);

    return NextResponse.json({ ok: true, photo });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Error al subir la foto. Revisa que Blob y KV estén conectados al proyecto.' },
      { status: 500 }
    );
  }
}
