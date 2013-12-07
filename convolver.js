var ctx = this;

this.impulseResponses = [];
this.buffer = null;

// Load all of the needed impulse responses and the actual sample.
var loader = new BufferLoader(context, [
    "full_techno_jacket_103_924.mp3",
    "dales_site3_4way_bformat.wav",
], onLoaded);

function onLoaded(buffers) {
    ctx.buffer = buffers[0];
    ctx.impulseResponses = buffers.splice(1);
    ctx.impulseResponseBuffer = ctx.impulseResponses[0];
}
loader.load();


// Make a source node for the sample.
var source = context.createBufferSource();
source.buffer = this.buffer;
// Make a convolver node for the impulse response.
var convolver = context.createConvolver();
convolver.buffer = this.impulseResponseBuffer;
// Connect the graph.
source.connect(convolver);
convolver.connect(context.destination);
// Save references to important nodes.
this.source = source;
this.convolver = convolver;
// Start playback.
this.source.start(0);
