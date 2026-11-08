// Layered, offline-generated chimes that stay clear on small phone speakers.
let context, stopPrevious;
export function playFeedback(kind, enabled=true, volume=80) {
  if (!enabled || typeof window==='undefined') return false;
  const level=Number.isFinite(volume)?Math.max(0,Math.min(100,volume))/100:0.8;
  const Audio=window.AudioContext||window.webkitAudioContext;
  if (!Audio || !level) return false;
  try {
    if (!context || context.state==='closed') context=new Audio();
    const audio=context;
    stopPrevious?.();
    let canceled=false;
    const voices=[];
    const master=audio.createGain(), limiter=audio.createDynamicsCompressor();
    master.gain.value=level*0.7;
    limiter.threshold.value=-12;limiter.knee.value=12;limiter.ratio.value=4;
    limiter.attack.value=0.003;limiter.release.value=0.12;
    master.connect(limiter);limiter.connect(audio.destination);
    const cleanup=()=>{master.disconnect();limiter.disconnect();};
    stopPrevious=()=>{
      canceled=true;
      for (const oscillator of voices) {try {oscillator.stop();} catch { /* Already ended. */ }}
      cleanup();
    };
    const schedule=()=>{
      if (canceled || audio.state==='closed') return;
      const complete=kind==='complete', wrong=kind==='wrong';
      const notes=complete?[523.25,659.25,783.99,1046.5,1318.51]:wrong?[349.23,293.66]:[587.33,739.99,880];
      const start=audio.currentTime+0.012, step=complete?0.105:wrong?0.14:0.085;
      let pending=notes.length*2;
      notes.forEach((frequency,i)=>{
        const at=start+i*step, duration=complete?0.3:wrong?0.19:0.22;
        for (const [multiple,type,peak] of [[1,'triangle',wrong?0.3:0.34],[2,'sine',wrong?0.035:0.065]]) {
          const oscillator=audio.createOscillator(), envelope=audio.createGain();
          oscillator.type=type;oscillator.frequency.setValueAtTime(frequency*multiple,at);
          envelope.gain.setValueAtTime(0.0001,at);
          envelope.gain.exponentialRampToValueAtTime(peak,at+0.009);
          envelope.gain.exponentialRampToValueAtTime(0.0001,at+duration);
          oscillator.connect(envelope);envelope.connect(master);voices.push(oscillator);
          oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();if (--pending===0) cleanup();};
          oscillator.start(at);oscillator.stop(at+duration+0.02);
        }
      });
    };
    // Resume first: a phone may suspend audio after locking or switching apps.
    if (audio.state!=='running') audio.resume().then(schedule).catch(cleanup);
    else schedule();
    return true;
  } catch {return false;}
}
