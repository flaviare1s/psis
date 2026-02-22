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

const COLLECTION = "assistidos";

/**
 * Busca assistido por ID
 */
export async function getAssistido(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Lista todos os assistidos
 */
export async function getAssistidos() {
  const q = query(collection(db, COLLECTION), orderBy("nome"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Cria novo assistido
 */
export async function createAssistido(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    nome: data.nome,
    status: data.status || "Ativo", // "Ativo" ou "Inativo"
    dataInicio: data.dataInicio || new Date().toISOString().split("T")[0],
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Atualiza assistido existente
 */
export async function updateAssistido(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Deleta assistido
 */
export async function deleteAssistido(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
