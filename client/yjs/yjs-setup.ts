// yjs-setup.ts
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { initializeIndexedDB } from './indexeddb-persistence'

type YjsInstance = {
  ydoc: Y.Doc
  provider: WebsocketProvider
  yXmlFragment: Y.XmlFragment
}

export function createYjsInstance(roomName: string, user: { name: string; color: string }): YjsInstance {
  const ydoc = new Y.Doc()

  // Optional: Initialize IndexedDB persistence
  initializeIndexedDB(ydoc, roomName)

  const provider = new WebsocketProvider('ws://localhost:1234', roomName, ydoc)

  provider.on('status', ({ status }) => {
    console.log(`[${roomName}] Connection status:`, status)
  })

  provider.on('sync', (isSynced) => {
    console.log(`[${roomName}] Document synced:`, isSynced)
  })

  provider.awareness.setLocalStateField('user', user)

  const yXmlFragment = ydoc.get('prosemirror', Y.XmlFragment)

  return { ydoc, provider, yXmlFragment }
}
