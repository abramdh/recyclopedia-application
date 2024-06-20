FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . . 
ENV PORT=6942
ENV HOST=0.0.0.0
ENV MODEL_URL="https://storage.googleapis.com/model_recyclopedia/model-recyclepedia/model.json"
ENV FIREBASE_API_KEY=AIzaSyC4vyXq3dee8oBnERBcPo94HO0YdPmfDaA
ENV FIREBASE_AUTH_DOMAIN=recyclopedia-424814.firebaseapp.com
ENV FIREBASE_PROJECT_ID=recyclopedia-424814
ENV FIREBASE_STORAGE_BUCKET=recyclopedia-424814.appspot.com
ENV FIREBASE_MESSAGING_SENDER_ID=344575462300
ENV FIREBASE_APP_ID=1:344575462300:web:7e9e1ebcb2630efd121659
ENV FIREBASE_MEASUREMENT_ID=G-VF8VP1WW14
CMD [ "npm", "run", "start" ]
