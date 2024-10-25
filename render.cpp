
#include <Bela.h>
#include <libraries/Oscillator/Oscillator.h>
#include <libraries/Gui/Gui.h>
#include <cmath>

Gui gui;
Oscillator oscillator;
Oscillator oscillator2;

// compute the frequency based on the MIDI pitch helper fn
float calcFreq(float midiPitch) {
	int middleA = 432; // switching it up from a440 :)
    return middleA * powf(2, (midiPitch - 69) / 12);
}

int renderCount = 0;

void printData(float* data) {
	rt_printf("%d\n\n", renderCount);
	for (int i = 0; i < 10 ; ++i) {
		rt_printf("buffer[%d] = %.3f\n", i, data[i]);
	}
}

bool setup(BelaContext *context, void *userData)
{
	// Set up oscillator and GUI
	oscillator.setup(context->audioSampleRate);
	oscillator2.setup(context->audioSampleRate);
	gui.setup(context->projectName);

	//Set the buffer to receive from the GUI
	gui.setBuffer('f', 10);
    
	return true;
}

void render(BelaContext *context, void *userData)
{
	// We store the DataBuffer in 'buffer'
	DataBuffer& buffer = gui.getDataBuffer(0);
	// Retrieve contents of the buffer as floats
	float* data = buffer.getAsFloat();
	float amplitude = data[1]; //range [0,1]
	float play = data[2]; // 0.0 or 1.0
	// map sensor data from buffers from [0,1] to [20,80] MIDI pitches
	float s1 = data[0];
	float pitchS1 = map(s1,0,1,40,80);
	float s2 = data[3];
	float pitchS2 = map(s2,0,1,40,80);

	oscillator.setFrequency(calcFreq(pitchS1));
	oscillator2.setFrequency(calcFreq(pitchS2));

	for(unsigned int n = 0; n < context->audioFrames; n++) {
		float outPreAmp = oscillator.process();
		float out = outPreAmp * amplitude * play;
		audioWrite(context, n, 0, out); // write to right channel
		
		float outPreAmp2 = oscillator2.process();
		float out2 = outPreAmp2 * amplitude * play;
		audioWrite(context, n, 1, out2); // write to left channel
	}
	
	// print buffer for debugging
	if(renderCount % 10000 == 0) {
		printData(data);
	}
    renderCount++;
}

void cleanup(BelaContext *context, void *userData)
{}
