import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tracks = (await kv.get('tracks')) || [];
    return NextResponse.json(tracks);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'No se pudo leer la base de datos. ¿Ya conectaste Vercel KV al proyecto?' },
      { status: 500 }
    );
  }
}
