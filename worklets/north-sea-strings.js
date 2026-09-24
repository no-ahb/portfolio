import { SeaStringEngine } from './north-sea-engine.js';
class SeaStringsProcessor extends AudioWorkletProcessor {
  constructor(){
    super(); this.engine=new SeaStringEngine(sampleRate);
    this.port.onmessage=({data})=>{
      if(data.type==='clear')this.engine.clear();
      else if(data.type==='plucks')this.engine.enqueue(data.events.map(e=>({...e,frame:this.engine.frame+Math.round(e.delay*sampleRate)})));
    };
  }
  process(_inputs,outputs){this.engine.render(outputs[0][0],outputs[0][1]);return true;}
}
registerProcessor('north-sea-strings',SeaStringsProcessor);
