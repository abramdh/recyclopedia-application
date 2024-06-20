const { Firestore } = require('@google-cloud/firestore');

const storeData = async (id, data) => {
  const db = new Firestore();
  const predictCollection = db.collection('trash-predictions');

  try {
    await predictCollection.doc(id).set(data);
    return {
      status: 'success',
      message: 'Data stored successfully'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
};

const storeDataEmail = async (label, data) => {
  const db = new Firestore();
  const predictCollection = db.collection('users');

  try {
    await predictCollection.doc(label).set(data);
    return {
      status: 'success',
      message: 'Data stored successfully'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
};

const storeDataAdmin = async (id, poin1) => {
  const db = new Firestore();
  const predictCollection = db.collection('admin');
  try {
    await predictCollection.doc(id).set(poin1);
    return {
      status: 'success',
      message: 'Data stored successfully'
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message
    };
  }
};


module.exports ={
  storeData,
  storeDataEmail,
  storeDataAdmin

} 
