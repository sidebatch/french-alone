// Subtle, offline-generated feedback tones. Missing audio support never interrupts study.
let context;
export function playFeedback(kind,enabled=true){
  if(!enabled || typeof window==='undefined')return false;
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return false;
  try{
    context ||= new Audio();
    if(context.state==='suspended')context.resume().catch(()=>{});
    const correct=kind==='correct',notes=correct?[523.25,659.25,783.99]:[392,329.63];
    const start=context.currentTime+0.012;
    notes.forEach((frequency,i)=>{
      const oscillator=context.createOscillator(),gain=context.createGain();
      const at=start+i*(correct?0.075:0.11),end=at+0.16;
      oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency,at);
      gain.gain.setValueAtTime(0.0001,at);
      gain.gain.exponentialRampToValueAtTime(correct?0.038:0.027,at+0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001,end);
      oscillator.connect(gain);gain.connect(context.destination);
      oscillator.start(at);oscillator.stop(end+0.015);
    });
    return true;
  }catch{return false;}
}
