import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION = "terapias";

/**
 * Busca terapia por ID
 */
export async function getTerapia(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Lista todas as terapias
 */
export async function getTerapias() {
  const q = query(collection(db, COLLECTION), orderBy("nome"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Cria nova terapia
 */
export async function createTerapia(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    nome: data.nome,
    cor: data.cor, // Ex: "therapy-reiki"
    icone: data.icone, // Nome do ícone do lucide-react
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Atualiza terapia existente
 */
export async function updateTerapia(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Deleta terapia
 */
export async function deleteTerapia(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
