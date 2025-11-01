"use client"
import { del, get, set } from 'idb-keyval'

export type ChatMessage = { role: 'user'|'assistant', content: string }

export class MemoryStore {
  public key: string
  constructor(namespace: string) {
    this.key = namespace
  }
}

const KEY_STORAGE = 'jarvis-k'

async function getOrCreateCryptoKey(): Promise<CryptoKey> {
  const existing = localStorage.getItem(KEY_STORAGE)
  if (existing) {
    const raw = Uint8Array.from(atob(existing), c => c.charCodeAt(0))
    return await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
  localStorage.setItem(KEY_STORAGE, btoa(String.fromCharCode(...raw)))
  return key
}

async function encryptString(plain: string): Promise<string> {
  const key = await getOrCreateCryptoKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plain)
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  const out = new Uint8Array(iv.byteLength + cipherBuf.byteLength)
  out.set(iv, 0)
  out.set(new Uint8Array(cipherBuf), iv.byteLength)
  return btoa(String.fromCharCode(...out))
}

async function decryptString(payload: string): Promise<string> {
  const key = await getOrCreateCryptoKey()
  const bytes = Uint8Array.from(atob(payload), c => c.charCodeAt(0))
  const iv = bytes.slice(0, 12)
  const data = bytes.slice(12)
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return new TextDecoder().decode(new Uint8Array(plainBuf))
}

export async function saveMessage(store: MemoryStore, msg: ChatMessage) {
  const list = await loadMessages(store)
  const updated = [...list, msg]
  const cipher = await encryptString(JSON.stringify(updated))
  await set(store.key, cipher)
}

export async function loadMessages(store: MemoryStore): Promise<ChatMessage[]> {
  try {
    const cipher = await get<string>(store.key)
    if (!cipher) return []
    const plain = await decryptString(cipher)
    return JSON.parse(plain)
  } catch {
    return []
  }
}

export async function clearMemory(store: MemoryStore) {
  await del(store.key)
}
