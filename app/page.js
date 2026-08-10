'use client';

import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------
// Canciones que ya tenías (archivos locales en /public/assets).
// Se combinan con las que la gente vaya subiendo desde el formulario.
// ---------------------------------------------------------------------
const STATIC_TRACKS = [
  {
    id: 'how-much-longer',
    title: 'How Much Longer?',
    artist: 'Alexander 23',
    cover: '/assets/portada.jpg',
    audio: '/assets/how-much-longer.mp3',
    lyrics: [
      { time: 14, text: 'Lo intento tanto' },
      { time: 17, text: '¿Te he asustado?' },
      { time: 23, text: 'Cuando lo deseo con todas mis fuerzas' },
      { time: 30, text: 'me pongo trabas a mí mismo.' },
      { time: 36, text: 'Y te prometo con el meñique' },
      { time: 41, text: 'que puedo ser la persona de la que' },
      { time: 44, text: 'te enamoraste.' },
      { time: 47, text: 'Pero, si soy sincero,' },
      { time: 53, text: 'no veo hacia dónde correr.' },
      { time: 60, text: '¿Dónde te has ido, amor?' },
      { time: 63, text: '¿Cómo te he perdido?' },
      { time: 66, text: '¿Te he hecho daño?' },
      { time: 68, text: '¿Estás enfadada?' },
      { time: 72, text: 'No hay nada que,' },
      { time: 74, text: 'no haría,amor' },
      { time: 77, text: 'para recuperar lo que teníamos.' },
      { time: 84, text: 'Y esperaría hasta el' },
      { time: 86, text: 'fin de los tiempos' },
      { time: 89, text: 'si me aceptaras,' },
      { time: 92, text: 'con el corazón en la mano.' },
      { time: 96, text: '¿Y cuánto tiempo más puedo quererte' },
      { time: 102, text: 'cuando, cariño, tú no me quieres?' },
      { time: 119, text: 'Necesito saberlo' },
      { time: 123, text: '¿Estoy empeorando las cosas?' },
      { time: 129, text: 'Porque mi corazón roto' },
      { time: 135, text: 'Nunca ha sufrido tanto' },
      { time: 140, text: 'Oh, y te lo prometo con el meñique (oh, oh, oh-oh)' },
      { time: 148, text: 'Puedo ser de quien te enamoraste (oh, oh, oh-oh)' },
      { time: 154, text: 'Pero si soy sincero (oh, oh, oh-oh)' },
      { time: 160, text: 'No veo hacia dónde correr (oh, oh)' },
      { time: 166, text: '¿Adónde te has ido, amor?' },
      { time: 169, text: '¿Cómo te he perdido?' },
      { time: 172, text: '¿Te he hecho daño?' },
      { time: 175, text: '¿Estás enfadada?' },
      { time: 178, text: 'No hay nada que no haría, amor' },
      { time: 184, text: 'Para recuperar lo que teníamos' },
      { time: 190, text: 'Y esperaría hasta el fin de los tiempos' },
      { time: 196, text: 'Si me aceptaras, con el corazón en la mano' },
      { time: 202, text: '¿Y cuánto tiempo más puedo quererte' },
      { time: 208, text: 'Cuando, cariño, tú no me quieres?' },
      { time: 214, text: '¿Y cuánto tiempo más puedo quererte' },
      { time: 219, text: 'Cuando, cariño, tú no me quieres?' },
    ],
  },
];

const ICON_PLAY = 'M8 5v14l11-7z';
const ICON_PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z';

function fmt(t) {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function Page() {
  const [section, setSection] = useState('music'); // 'music' | 'photos'

  return (
    <div className="app">
      {section === 'music' ? (
        <MusicSection section={section} setSection={setSection} />
      ) : (
        <PhotosSection section={section} setSection={setSection} />
      )}
    </div>
  );
}

function SectionTabs({ section, setSection }) {
  return (
    <div className="tabs">
      <button
        className={'tab-btn' + (section === 'music' ? ' active' : '')}
        onClick={() => setSection('music')}
      >
        Música
      </button>
      <button
        className={'tab-btn' + (section === 'photos' ? ' active' : '')}
        onClick={() => setSection('photos')}
      >
        Fotos
      </button>
    </div>
  );
}

/* =====================================================================
   SECCIÓN DE MÚSICA
   ===================================================================== */
function MusicSection({ section, setSection }) {
  const [view, setView] = useState('library'); // 'library' | 'player' | 'upload'
  const [dynamicTracks, setDynamicTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);

  const tracks = [...STATIC_TRACKS, ...dynamicTracks];

  async function loadTracks() {
    setLoadingTracks(true);
    try {
      const res = await fetch('/api/tracks');
      const data = await res.json();
      if (Array.isArray(data)) setDynamicTracks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTracks(false);
    }
  }

  useEffect(() => {
    loadTracks();
  }, []);

  if (view === 'player' && currentTrack) {
    return (
      <PlayerView
        track={currentTrack}
        onBack={() => {
          setView('library');
          setCurrentTrack(null);
        }}
      />
    );
  }

  if (view === 'upload') {
    return (
      <UploadTrackForm
        onCancel={() => setView('library')}
        onUploaded={async () => {
          await loadTracks();
          setView('library');
        }}
      />
    );
  }

  return (
    <div className="library">
      <SectionTabs section={section} setSection={setSection} />
      <div className="library-top">
        <div>
          <div className="library-header">Tu música</div>
          <div className="library-sub">Elige una canción para reproducir</div>
        </div>
        <button className="add-btn" onClick={() => setView('upload')}>
          + Subir canción
        </button>
      </div>

      {loadingTracks && <div className="empty-state">Cargando…</div>}

      <div className="track-grid">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="track-card"
            onClick={() => {
              setCurrentTrack(track);
              setView('player');
            }}
          >
            <div
              className="track-card-art"
              style={{ backgroundImage: `url('${track.cover}')` }}
            />
            <div className="track-card-title">{track.title}</div>
            <div className="track-card-artist">{track.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadTrackForm({ onCancel, onUploaded }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !artist || !audioFile || !coverFile) {
      setMsg({ type: 'error', text: 'Completa título, artista, audio y portada.' });
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('artist', artist);
      fd.append('lyrics', lyrics);
      fd.append('audio', audioFile);
      fd.append('cover', coverFile);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al subir');

      setMsg({ type: 'ok', text: '¡Canción subida!' });
      onUploaded();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="upload">
      <div className="upload-header">
        <button className="icon-btn" onClick={onCancel} title="Volver">
          <BackIcon />
        </button>
        <div className="upload-title">Subir canción</div>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label>Artista</label>
          <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
        </div>
        <div className="field">
          <label>Archivo de audio (mp3)</label>
          <input
            className="file-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="field">
          <label>Portada (imagen)</label>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="field">
          <label>Letra (opcional)</label>
          <textarea
            placeholder={'14|Lo intento tanto\n17|¿Te he asustado?'}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
          />
          <div className="field-hint">
            Una línea por verso, formato: <code>segundos|texto</code>. El número es el
            segundo exacto en que empieza esa línea en la canción. Si no pones letra, la
            canción igual se reproduce, solo sin texto sincronizado.
          </div>
        </div>

        {msg && <div className={'form-msg ' + msg.type}>{msg.text}</div>}

        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Subiendo…' : 'Subir canción'}
        </button>
      </form>
    </div>
  );
}

function PlayerView({ track, onBack }) {
  const audioRef = useRef(null);
  const seekRef = useRef(null);
  const scrollWrapRef = useRef(null);
  const lineRefs = useRef([]);
  const [playing, setPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isSeekingRef = useRef(false);
  const userTouchingLyricsRef = useRef(false);
  const userScrollTimeoutRef = useRef(null);
  const activeIndexRef = useRef(-1);

  const lyrics = track.lyrics || [];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setCurTime(0);
    setDuration(0);
    activeIndexRef.current = -1;

    const onLoadedMeta = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      if (!audio.duration) return;
      if (!isSeekingRef.current) setCurTime(audio.currentTime);
      updateActiveLine(audio.currentTime);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  function updateActiveLine(t) {
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (t >= lyrics[i].time) idx = i;
      else break;
    }
    if (idx !== activeIndexRef.current) {
      activeIndexRef.current = idx;
      lineRefs.current.forEach((el, i) => {
        if (!el) return;
        el.classList.remove('active', 'past');
        if (i < idx) el.classList.add('past');
        if (i === idx) el.classList.add('active');
      });
      const activeEl = lineRefs.current[idx];
      if (activeEl && !userTouchingLyricsRef.current) {
        activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function handleSeekInput(e) {
    const audio = audioRef.current;
    const target = parseFloat(e.target.value);
    setCurTime(target);
    if (audio && audio.duration) audio.currentTime = target;
  }

  const progressPct = duration ? (curTime / duration) * 100 : 0;

  return (
    <div className="player">
      <button className="icon-btn back-btn" onClick={onBack} title="Volver">
        <BackIcon />
      </button>

      <div className="cover-side">
        <div className="cover-art" style={{ backgroundImage: `url('${track.cover}')` }} />
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>

        <div className="controls">
          <input
            ref={seekRef}
            className="seek"
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={curTime}
            style={{ '--progress': progressPct + '%' }}
            onInput={handleSeekInput}
            onMouseDown={() => (isSeekingRef.current = true)}
            onTouchStart={() => (isSeekingRef.current = true)}
            onMouseUp={() => (isSeekingRef.current = false)}
            onTouchEnd={() => (isSeekingRef.current = false)}
            onChange={() => (isSeekingRef.current = false)}
          />
          <div className="time-row">
            <span>{fmt(curTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
          <div className="transport">
            <button
              title="Retroceder 10s"
              onClick={() => {
                const audio = audioRef.current;
                if (audio) audio.currentTime = Math.max(0, audio.currentTime - 10);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6zM9.5 12l9-6v12z" />
              </svg>
            </button>
            <button id="playBtn" title="Reproducir" onClick={togglePlay}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d={playing ? ICON_PAUSE : ICON_PLAY} />
              </svg>
            </button>
            <button
              title="Adelantar 10s"
              onClick={() => {
                const audio = audioRef.current;
                if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 6h2v12h-2zM4.5 6l9 6-9 6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="lyrics-side">
        <div
          className="lyrics-scroll"
          ref={scrollWrapRef}
          onTouchStart={() => {
            userTouchingLyricsRef.current = true;
            if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
          }}
          onTouchEnd={() => {
            userScrollTimeoutRef.current = setTimeout(() => {
              userTouchingLyricsRef.current = false;
            }, 1200);
          }}
        >
          {lyrics.length === 0 && <div className="lyrics-empty">Esta canción no tiene letra cargada.</div>}
          {lyrics.map((line, i) => (
            <div
              key={i}
              ref={(el) => (lineRefs.current[i] = el)}
              className="lyric-line"
              onClick={() => {
                const audio = audioRef.current;
                if (audio) audio.currentTime = line.time;
                if (audio && audio.paused) togglePlay();
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>

      <audio ref={audioRef} src={track.audio} preload="auto" />
    </div>
  );
}

/* =====================================================================
   SECCIÓN DE FOTOS
   ===================================================================== */
function PhotosSection({ section, setSection }) {
  const [view, setView] = useState('gallery'); // 'gallery' | 'upload'
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  async function loadPhotos() {
    setLoading(true);
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      if (Array.isArray(data)) setPhotos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  if (view === 'upload') {
    return (
      <UploadPhotoForm
        onCancel={() => setView('gallery')}
        onUploaded={async () => {
          await loadPhotos();
          setView('gallery');
        }}
      />
    );
  }

  return (
    <div className="library">
      <SectionTabs section={section} setSection={setSection} />
      <div className="library-top">
        <div>
          <div className="library-header">Nuestras fotos</div>
          <div className="library-sub">Un lugar para guardar recuerdos</div>
        </div>
        <button className="add-btn" onClick={() => setView('upload')}>
          + Subir foto
        </button>
      </div>

      {loading && <div className="empty-state">Cargando…</div>}
      {!loading && photos.length === 0 && (
        <div className="empty-state">Todavía no hay fotos. Sube la primera.</div>
      )}

      <div className="photo-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card" onClick={() => setLightbox(photo)}>
            <img src={photo.url} alt={photo.caption || 'Foto'} loading="lazy" />
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button
            className="icon-btn lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            <CloseIcon />
          </button>
          <img src={lightbox.url} alt={lightbox.caption || 'Foto'} onClick={(e) => e.stopPropagation()} />
          {lightbox.caption && <div className="lightbox-caption">{lightbox.caption}</div>}
        </div>
      )}
    </div>
  );
}

function UploadPhotoForm({ onCancel, onUploaded }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setMsg({ type: 'error', text: 'Elige una foto primero.' });
      return;
    }
    setSubmitting(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('caption', caption);

      const res = await fetch('/api/photos/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir');

      setMsg({ type: 'ok', text: '¡Foto subida!' });
      onUploaded();
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="upload">
      <div className="upload-header">
        <button className="icon-btn" onClick={onCancel} title="Volver">
          <BackIcon />
        </button>
        <div className="upload-title">Subir foto</div>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Foto</label>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="field">
          <label>Descripción (opcional)</label>
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
        </div>

        {msg && <div className={'form-msg ' + msg.type}>{msg.text}</div>}

        <button className="submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Subiendo…' : 'Subir foto'}
        </button>
      </form>
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 4l-8 8 8 8 1.5-1.5L10.5 12l6.5-6.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.4 1.42 6.29 6.29-6.29 6.29 1.4 1.42L12 14.83l6.3 6.3 1.4-1.42-6.29-6.29 6.29-6.29z" />
    </svg>
  );
}
