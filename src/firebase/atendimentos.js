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
} from "firebase/firestore";
import { db } from "./config";

const COLLECTION = "atendimentos";

/**
 * Busca atendimento por ID
 */
export async function getAtendimento(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Lista todos os atendimentos
 */
export async function getAtendimentos() {
  const querySnapshot = await getDocs(collection(db, COLLECTION));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Busca atendimentos de um assistido específico
 */
export async function getAtendimentosByAssistido(assistidoId) {
  const q = query(
    collection(db, COLLECTION),
    where("assistidoId", "==", assistidoId),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Busca atendimentos por tipo de terapia
 */
export async function getAtendimentosByTerapia(tipoTerapia) {
  const q = query(
    collection(db, COLLECTION),
    where("tipoTerapia", "==", tipoTerapia),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Cria novo atendimento
 */
export async function createAtendimento(data) {
  const sessoes = Array.from({ length: 10 }, (_, i) => ({
    numero: i + 1,
    data: null,
    presente: false,
    observacoes: "",
  }));

  const docRef = await addDoc(collection(db, COLLECTION), {
    assistidoId: data.assistidoId,
    terapeutaId: data.terapeutaId,
    tipoTerapia: data.tipoTerapia,
    sessoes: sessoes,
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Atualiza atendimento existente (incluindo sessões)
 */
export async function updateAtendimento(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Deleta atendimento
 */
export async function deleteAtendimento(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
