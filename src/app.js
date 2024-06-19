const tf = require('@tensorflow/tfjs-node');
const router = require("./routes");
const { Firestore } = require('@google-cloud/firestore');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config();


const {storeData} = require('./services/storeData');
const {storeDataAdmin} = require('./services/storeData')
const InputError = require('./exceptions/inputError')
const PORT = parseInt(process.env.PORT) || 6942;
const HOST = process.env.HOST;
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(router)

let model;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Load the model
async function loadModel() {
    try {
        const modelUrl = process.env.MODEL_URL; //|| `file://${process.cwd()}/src/model/model.json`;
        model = await tf.loadLayersModel(modelUrl);
        console.log('Model loaded successfully from', modelUrl);
    } catch (error) {
        console.error('Error loading the model:', error);
    }
}
class L2 {
    static className = "L2";
  
    constructor(config) {
      return tf.regularizers.l1l2(config);
    }
  }
  tf.serialization.registerClass(L2);

app.get('/model-status', (_req, res) => {
    if (model) {
        res.status(200).send('Model is loaded');
    } else {
        res.status(500).send('Model is not loaded');
    }
});


async function predictClassification(model, imageBuffer) {
    try {
        // Decode and preprocess the image
        const tensor = tf.node
            .decodeImage(imageBuffer)
            .resizeNearestNeighbor([240, 240])
            .expandDims()
            .toFloat()
            .div(255); // Normalize pixel values to [0, 1]

        // Make predictions
        const prediction = model.predict(tensor);
        const scores = await prediction.data();

        // Determine the predicted class label
        const classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic'];
        const predictedIndex = scores.indexOf(Math.max(...scores));
        const label = classes[predictedIndex];

        // Generate explanation and congrats based on the predicted class
        let explanation, congrats;
        switch (label) {
            case 'plastic':
                explanation = 'Berikut sampah plastik yang telah didaur ulang';
                congrats = 'Selamat anda mendapatkan point sebesar 100';
                break;
            case 'cardboard':
                explanation = 'Ini adalah sampah kardus yang dapat didaur ulang';
                congrats = 'Selamat anda mendapatkan point sebesar 100';
                break;
            case 'glass':
                explanation = 'Ini adalah sampah kaca yang dapat didaur ulang';
                congrats = 'Selamat anda mendapatkan point sebesar 100';
                break;
            case 'metal':
                explanation = 'Ini adalah sampah logam yang dapat didaur ulang';
                congrats = 'Selamat anda mendapatkan point sebesar 100';
                break;
            case 'paper':
                explanation = 'Ini adalah sampah kertas yang dapat didaur ulang';
                congrats = 'Selamat anda mendapatkan point sebesar 100';
                break;
            default:
                explanation = `Tidak dapat mengidentifikasi jenis sampah: ${label}`;
                congrats = 'Silakan coba lagi dengan jenis sampah yang berbeda';
                break;
        }

        // Log the prediction details
        console.log('Predicted Class:', label);
        console.log('Confidence Scores:', scores);

        // Store prediction data
        const poin = 100;
        const poin1 = {
            label: label,
            poin: poin
        };
        await storeDataAdmin(label, poin1);

        // Return prediction results
        return { label, confidenceScore: Math.max(...scores) * 100, explanation, congrats };
    } catch (error) {
        throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }
}

app.post('/predict', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'error',
            message: 'No file uploaded.'
        });
    }

    try {
        const { confidenceScore, label, congrats } = await predictClassification(model, req.file.buffer);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id: id,
            result: label,
            congrats: congrats,
            confidenceScore: confidenceScore,
            createdAt: createdAt
        };

        await storeData(id, data);

        res.status(201).json({
            status: 'success',
            message: 'Model is predicted successfully',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Endpoint for fetching prediction histories
app.get('/predict/histories', async (req, res) => {
    const db = new Firestore();
    const predictCollection = db.collection('trash-predictions');

    try {
        const snapshot = await predictCollection.get();
        const histories = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                history: {
                    id: id,
                    confidenceScore: data.confidenceScore,
                    result: data.result,
                    createdAt: data.createdAt,
                    id: data.id
                }
            };
        });

        res.status(200).json({
            status: 'success',
            data: histories
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

app.get('/', (_req, res) => {
    res.send('This Is My World');
});


app.listen(PORT, HOST, async() => {
  console.log(`Server is running on http: ${HOST}:${PORT}`);
  await loadModel();
});




