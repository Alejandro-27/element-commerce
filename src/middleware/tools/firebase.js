import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC7jWCJ6X5hY5RegG41IyCUGTEuW8y7-l8",
  authDomain: "elemet-commerce.firebaseapp.com",
  projectId: "elemet-commerce",
  storageBucket: "elemet-commerce.appspot.com",
  messagingSenderId: "190062651462",
  appId: "1:190062651462:web:a7d780f1d4021567788247",
  measurementId: "G-M3W3BXMVZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFile(file, fileName) {
  const storageRef = ref(storage, `uploads/${fileName}`); // Almacena el archivo en la carpeta 'uploads'
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref); // Obtén la URL de descarga

  return downloadURL; // Retorna la URL de la imagen subida
}
