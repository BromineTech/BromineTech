import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

let indexeddbProvider = null

export function initializeIndexedDB(ydoc, roomName) {
  if (indexeddbProvider) return indexeddbProvider

  // Create a new IndexedDB provider
  indexeddbProvider = new IndexeddbPersistence(roomName, ydoc)

  // Log when the data is loaded from IndexedDB
  indexeddbProvider.on('synced', () => {
    console.log('Content loaded from IndexedDB')
  })

  // Log when the data is saved to IndexedDB
  indexeddbProvider.on('update', () => {
    console.log('Content saved to IndexedDB')
  })

  return indexeddbProvider
} 