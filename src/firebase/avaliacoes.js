import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION = "avaliacoes";

/**
 * Busca avaliação por ID
 */
export async function getAvaliacao(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Lista todas as avaliações
 */
export async function getAvaliacoes() {
  const q = query(collection(db, COLLECTION), orderBy("dataAvaliacao", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Busca avaliações de um assistido específico
 */
export async function getAvaliacoesByAssistido(assistidoId) {
  const q = query(
    collection(db, COLLECTION),
    where("assistidoId", "==", assistidoId),
    orderBy("dataAvaliacao", "desc"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Cria nova avaliação
 */
export async function createAvaliacao(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    assistidoId: data.assistidoId,
    tipoTerapia: data.tipoTerapia,
    statusEvolucao: data.statusEvolucao, // "Melhora", "Estável", "Piora"
    dataAvaliacao: data.dataAvaliacao || new Date().toISOString().split("T")[0],
    observacoes: data.observacoes || "",
    encaminhamentos: data.encaminhamentos || [],
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Atualiza avaliação existente
 */
export async function updateAvaliacao(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Deleta avaliação
 */
export async function deleteAvaliacao(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
