// Six continuously resonating waveguides, two close-unison strings per axis.
// Excitations add to the existing state: no voice cap, stealing, or discarded tails.
// Shared by the AudioWorklet and the offline stress tests.
// Fixed calibration from all 4,423 crossings in the 10-minute excerpt at
// 44.1/48 kHz. Its loudest peak is -3 dBFS; quiet passages retain their dynamics.
// Reproduce with scripts/measure-north-sea-audio.mjs --reference.
export const RECORDING_GAIN = 7.04;
function output(value, gain) {
  const scaled=gain*value/(1+Math.abs(value)),magnitude=Math.abs(scaled);
  // Linear throughout the calibrated recording. A continuous soft knee catches
  // exceptional simultaneous manual sweeps, staying below full scale without
  // another audio node, voice allocation, or look-ahead buffer.
  if(magnitude<=.75)return scaled;
  const excess=magnitude-.75;
  return Math.sign(scaled)*(.75+.23*excess/(.23+excess));
}
export class SeaStringEngine {
  constructor(rate, gain=RECORDING_GAIN) {
    this.gain=gain;
    this.rate=rate; this.frame=0; this.events=[]; this.triggered=0;
    this.banks=Array.from({length:6},(_,i)=>{
      const length=Math.round(rate/(110*2**(((i%2)*13-6+(i/2|0)*2)/1200)));
      const noise=new Float32Array(length),excitation=new Float32Array(length);
      let seed=7919*(i+1),mean=0;
      for(let j=0;j<length;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;noise[j]=seed/2147483648-1;mean+=noise[j];}
      mean/=length;const pick=Math.round(length*.22);
      for(let j=0;j<length;j++)excitation[j]=(noise[j]-mean)-.72*(noise[(j+pick)%length]-mean);
      return {ring:new Float32Array(length),position:0,axis:i/2|0,dc:0,excitation};
    });
  }
  enqueue(events) { this.events.push(...events); this.events.sort((a,b)=>a.frame-b.frame); }
  excite(event) {
    const bank=this.banks[event.axis*2+(event.string%2)], ring=bank.ring, n=ring.length;
    const strength=Math.min(.065,.014+event.speed/60000);
    // A precomputed pick-position comb shapes the bright attack. Rotating its
    // phase varies the excitation without allocating or synthesizing a new voice.
    let p=bank.position,q=(event.string*37+this.triggered*11)%n;
    for(let i=0;i<n;i++){
      ring[p]+=strength*bank.excitation[q];
      if(++p===n)p=0;if(++q===n)q=0;
    }
    this.triggered++;
  }
  render(left,right) {
    let next=0;
    for(let i=0;i<left.length;i++,this.frame++){
      while(next<this.events.length && this.events[next].frame<=this.frame)this.excite(this.events[next++]);
      let l=0,r=0;
      for(const b of this.banks){
        const n=b.ring.length,p=b.position,q=p+1===n?0:p+1;
        const value=b.ring[p];
        b.ring[p]=.989*(.54*value+.46*b.ring[q]); b.position=q;
        b.dc+=.001*(value-b.dc);
        const v=value-b.dc;
        l+=v*(b.axis===0?.92:b.axis===1?.707:.39);
        r+=v*(b.axis===2?.92:b.axis===1?.707:.39);
      }
      left[i]=output(l,this.gain); right[i]=output(r,this.gain);
    }
    if(next)this.events.splice(0,next);
  }
  clear(){this.events.length=0;for(const b of this.banks){b.ring.fill(0);b.dc=0;}}
}
