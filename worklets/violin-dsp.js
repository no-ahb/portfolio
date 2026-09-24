import { ViolinEngine } from './violin-core.js';
class ViolinProcessor extends AudioWorkletProcessor {
  constructor() {
    super(); this.engine = new ViolinEngine(sampleRate); this.frames = 0;
    this.port.onmessage = ({ data: m }) => {
      if (m.type === 'record') this.port.postMessage({ type: 'selected', id: this.engine.record() });
      if (m.type === 'close') this.engine.closeRecording();
      if (m.type === 'clear') this.engine.clear();
    };
  }
  process(inputs, outputs) {
    const out = outputs[0];
    this.engine.process(inputs[0]?.[0] || [], out[0], out[1]);
    this.frames += out[0].length;
    if (this.frames >= sampleRate / 20) { this.frames = 0; this.port.postMessage({ type: 'state', ...this.engine.snapshot() }); }
    return true;
  }
}
registerProcessor('violin-performance', ViolinProcessor);
