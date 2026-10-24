const notesListPage = document.querySelector('#notes-list-page');
const notesDetailPage = document.querySelector('#notes-detail-page');
function openNotesApp() {
  stopNotesAudio();
  notesListPage.hidden = false;
  notesDetailPage.hidden = true;
  notesListPage.querySelector('.notes-scroll').scrollTop = 0;
}
function openNoteDetail(note) {
  stopNotesAudio();
  renderNoteDetail(note);
  notesListPage.hidden = true;
  notesDetailPage.hidden = false;
  document.querySelector('#notes-back').focus({ preventScroll: true });
}
const notesFolderIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V4h7l2 3h9v13H3Z"/></svg>';
const notesFolders = document.querySelector('#notes-folders');
document.querySelector('.notes-count').textContent = `${notesData.length} 个备忘录`;
document.querySelector('.notes-footer > span').textContent = `${notesData.length} 个备忘录`;
[{ name: '备忘录', count: notesData.length }, { name: '最近删除', count: 0 }].forEach((folder) => {
  const card = document.createElement('div');card.className = 'notes-folder';
  card.innerHTML = notesFolderIcon;
  const name = document.createElement('strong');name.textContent = folder.name;
  const count = document.createElement('span');count.textContent = `${folder.count} 个条目`;
  card.append(name, count);notesFolders.append(card);
});
[...notesData].sort((a, b) => {
  const dateNumber = (date) => {
    const [, year, month, day] = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
    return Number(year) * 10000 + Number(month) * 100 + Number(day);
  };
  return dateNumber(b.date) - dateNumber(a.date);
}).forEach((note) => {
  const row = document.createElement('button');row.type = 'button';row.className = 'notes-row';row.dataset.noteId = note.id;
  const title = document.createElement('strong');title.textContent = note.title;
  const preview = document.createElement('span');preview.className = 'notes-preview';preview.textContent = note.content;
  const time = document.createElement('small');time.textContent = note.date;
  row.append(title, preview, time);row.addEventListener('click', () => openNoteDetail(note));
  document.querySelector('#notes-list').append(row);
});
document.querySelector('#notes-compose').addEventListener('click', () => openNoteDetail(null));
document.querySelector('#notes-back').addEventListener('click', () => {
  openNotesApp();
  notesListPage.querySelector('[data-close-app]').focus({ preventScroll: true });
});

// 独立附件播放器，不替换或销毁全局音乐的 Audio 实例。
let notesAudio = null;
let notesPlaybackToken = 0;
function stopNotesAudio() {
  notesPlaybackToken++;
  if (notesAudio) {
    notesAudio.pause();
    notesAudio.removeAttribute('src');
    notesAudio.load();
    notesAudio = null;
  }
}
function renderNoteDetail(note) {
  const content = notesDetailPage.querySelector('.notes-detail-scroll');
  content.replaceChildren();content.scrollTop = 0;
  if (!note) return;
  const date = document.createElement('p');date.className = 'notes-detail-date';date.textContent = note.date;
  const title = document.createElement('h1');title.textContent = note.title;
  const lyrics = document.createElement('div');lyrics.className = 'notes-lyrics';lyrics.textContent = note.content;
  content.append(date, title);
  if (!note.audioSrc) {
    content.append(lyrics);
    return;
  }
  const attachment = document.createElement('div');attachment.className = 'notes-audio';
  attachment.innerHTML = '<button class="notes-audio-toggle" type="button" aria-label="播放语音附件"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg></button><div class="notes-audio-controls"><span>语音附件</span><input type="range" min="0" max="100" value="0" step="0.1" aria-label="音频播放进度" disabled><small class="notes-audio-time">0:00 / 0:00</small></div><span class="notes-audio-status" role="status"></span>';
  content.append(attachment, lyrics);
  const audio = new Audio(note.audioSrc);audio.preload = 'metadata';notesAudio = audio;
  const toggle = attachment.querySelector('button');
  const progress = attachment.querySelector('input');
  const status = attachment.querySelector('[role="status"]');
  const format = (seconds) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  const sync = () => {
    if (notesAudio !== audio) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    progress.disabled = !duration;progress.value = duration ? audio.currentTime / duration * 100 : 0;
    attachment.querySelector('.notes-audio-time').textContent = `${format(audio.currentTime)} / ${format(duration)}`;
    const playing = !audio.paused && !audio.ended;
    toggle.setAttribute('aria-label', playing ? '暂停语音附件' : '播放语音附件');
    toggle.innerHTML = playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zm7 0h4v14h-4Z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>';
  };
  ['loadedmetadata','durationchange','timeupdate','play','pause','ended'].forEach((name) => audio.addEventListener(name, sync));
  audio.addEventListener('error', () => { if (notesAudio === audio) status.textContent = '附件加载失败，请检查音频文件'; });
  toggle.addEventListener('click', async () => {
    if (notesAudio !== audio) return;
    if (!audio.paused) { audio.pause(); return; }
    const token = ++notesPlaybackToken;
    if (typeof pauseMusic === 'function') pauseMusic();
    status.textContent = '';
    try { await audio.play(); } catch (error) {
      if (notesAudio === audio && token === notesPlaybackToken) status.textContent = '暂时无法播放，请再试一次';
    }
  });
  progress.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(progress.value) / 100 * audio.duration;
    sync();
  });
}
