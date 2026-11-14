import { drawRoom } from './room-art.js';
import { defaultLayout } from './room-core.js';
// Draw the preview and the downloaded file from the same local canvas.
// System fonts and the cached Lou sprite keep card export available offline.
export async function makeRecordCard(record) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const font = '"Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  function box(x, y, width, height, radius, fill) {
    ctx.beginPath(); ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius); ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function text(value, x, y, size, color = '#35533e', weight = 500) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px ${font}`;
    ctx.textAlign = 'center'; ctx.fillText(value, x, y);
  }
  ctx.fillStyle = '#f8f5eb'; ctx.fillRect(0, 0, 1080, 1350);
  box(38, 38, 1004, 1274, 38, '#fffdf6');
  ctx.strokeStyle = '#c5d2b7'; ctx.lineWidth = 2; ctx.setLineDash([8, 10]);
  ctx.strokeRect(62, 62, 956, 1226); ctx.setLineDash([]);
  text('F R E N C H   A L O N E', 540, 126, 24, '#66805b', 700);
  const [year, month, day] = record.date.split('-').map(Number);
  text(`${year}년 ${month}월 ${day}일`, 540, 194, 29, '#728268');
  text('프랑스어와 보낸 하루.', 540, 283, 58, '#35533e', 700);
  text('조금씩, 내 말이 되어 가요.', 540, 336, 27, '#728268');

  box(112, 365, 856, 535, 42, '#edf2e3');
  ctx.save(); ctx.clip();
  await drawRoom(ctx, record.room || defaultLayout(), 112, 365, 856, 535);
  ctx.restore();
  box(388, 874, 304, 53, 26, record.stamp ? '#dce9ce' : '#eee8d7');
  text('오늘의 학습 완료', 540, 909, 24, '#526c41', 700);

  box(112, 956, 856, 155, 24, '#f4f2e8');
  const questions = record.partial && !record.questions ? '기록 있음' : `${record.questions}문제`;
  text(questions, 330, 1019, 45, '#35533e', 700);
  text(record.partial ? '기록된 문제' : '완료한 문제', 330, 1068, 23, '#718165');
  text(`+${record.xp.toLocaleString('ko-KR')} XP`, 750, 1019, 45, '#35533e', 700);
  text('경험치', 750, 1068, 23, '#718165');
  text(`${record.streak}일 연속 학습`, 540, 1160, 27);
  text(record.partial ? '이전 기초 학습은 문제 수가 남아 있지 않아요.' : 'Un petit pas, chaque jour.', 540, 1210, 22, '#7b8970');
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png'));
}
