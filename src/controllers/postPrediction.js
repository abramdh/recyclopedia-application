async function postPredictHandler(req, res) {
    const model = req.model;
    if (!model) {
        return res.status(500).send('Model not loaded');
    }

    res.send('Prediction logic goes here');
}
let model;
// Load the model before starting the server
loadModel().then((loadedModel) => {
    model = loadedModel;
    console.log('Model loaded successfully');
}).catch(err => {
    console.error('Failed to load model', err);
    process.exit(1); // Exit the process with failure
});
module.exports = postPredictHandler;
