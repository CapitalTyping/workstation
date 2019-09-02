import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WavConverterService {

  constructor() { }

  createWaveFileData(audioBuffer: AudioBuffer) {
    const frameLength = audioBuffer.length;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const bitsPerSample = 16;
    const byteRate = sampleRate * numberOfChannels * bitsPerSample/8;
    const blockAlign = numberOfChannels * bitsPerSample/8;
    const wavDataByteLength = frameLength * numberOfChannels * 2; // 16-bit audio
    const headerByteLength = 44;
    const totalLength = headerByteLength + wavDataByteLength;

    const waveFileData = new Uint8Array(totalLength);

    const subChunk1Size = 16; // for linear PCM
    const subChunk2Size = wavDataByteLength;
    const chunkSize = 4 + (8 + subChunk1Size) + (8 + subChunk2Size);

    this.writeString('RIFF', waveFileData, 0);
    this.writeInt32(chunkSize, waveFileData, 4);
    this.writeString('WAVE', waveFileData, 8);
    this.writeString('fmt ', waveFileData, 12);

    this.writeInt32(subChunk1Size, waveFileData, 16);      // SubChunk1Size (4)
    this.writeInt16(1, waveFileData, 20);                  // AudioFormat (2)
    this.writeInt16(numberOfChannels, waveFileData, 22);   // NumChannels (2)
    this.writeInt32(sampleRate, waveFileData, 24);         // SampleRate (4)
    this.writeInt32(byteRate, waveFileData, 28);           // ByteRate (4)
    this.writeInt16(blockAlign, waveFileData, 32);         // BlockAlign (2)
    this.writeInt32(bitsPerSample, waveFileData, 34);      // BitsPerSample (4)

    this.writeString('data', waveFileData, 36);
    this.writeInt32(subChunk2Size, waveFileData, 40);      // SubChunk2Size (4)

    // Write actual audio data starting at offset 44.
    this.writeAudioBuffer(audioBuffer, waveFileData, 44);

    return waveFileData;

  }

  private writeString(s, a, offset) {
    for (let i = 0; i < s.length; ++i) {
      a[offset + i] = s.charCodeAt(i);
    }
  }

  private writeInt16(n, a, offset) {
    n = Math.floor(n);

    const b1 = n & 255;
    const b2 = (n >> 8) & 255;

    a[offset + 0] = b1;
    a[offset + 1] = b2;
  }

  private writeInt32(n, a, offset) {
    n = Math.floor(n);
    const b1 = n & 255;
    const b2 = (n >> 8) & 255;
    const b3 = (n >> 16) & 255;
    const b4 = (n >> 24) & 255;

    a[offset + 0] = b1;
    a[offset + 1] = b2;
    a[offset + 2] = b3;
    a[offset + 3] = b4;
  }

  private writeAudioBuffer(audioBuffer, a, offset) {
    const n = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;

    for (let i = 0; i < n; ++i) {
      for (let k = 0; k < channels; ++k) {
        const buffer = audioBuffer.getChannelData(k);
        let sample = buffer[i] * 32768.0;

        // Clip samples to the limitations of 16-bit.
        // If we don't do this then we'll get nasty wrap-around distortion.
        if (sample < -32768)
          sample = -32768;
        if (sample > 32767)
          sample = 32767;

        this.writeInt16(sample, a, offset);
        offset += 2;
      }
    }
  }
}
