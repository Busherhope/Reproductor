import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = (formData.get('title') || '').toString().trim();
    const artist = (formData.get('artist') || '').toString().trim();
    const lyricsRaw = (formData.get('lyrics') || '').toString();
    const audioFile = formData.get('audio');
    const coverFile = formData.get('cover');

    if (!title || !artist || !audioFile || !coverFile) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const audioBlob = await put(`audio/${id}-${audioFile.name}`, audioFile, { access: 'public' });
    const coverBlob = await put(`covers/${id}-${coverFile.name}`, coverFile, { access: 'public' });

    // Formato del textarea de letra: "segundos|texto", una línea por verso
    const lyrics = lyricsRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [time, ...rest] = line.split('|');
        return { time: parseFloat(time) || 0, text: rest.join('|').trim() };
      });

    const track = {
      id,
      title,
      artist,
      cover: coverBlob.url,
      audio: audioBlob.url,
      lyrics,
      createdAt: Date.now(),
    };

    const tracks = (await kv.get('tracks')) || [];
    tracks.push(track);
    await kv.set('tracks', tracks);

    return NextResponse.json({ ok: true, track });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Error al subir la canción. Revisa que Blob y KV estén conectados al proyecto.' },
      { status: 500 }
    );
  }
}
