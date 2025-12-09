import { NextRequest, NextResponse } from 'next/server'
import { getCollection, collections } from '@/lib/db-utils'
import { ObjectId } from 'mongodb'

// GET notes by alertId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('alertId')

    if (!alertId) {
      return NextResponse.json({ error: 'AlertId required' }, { status: 400 })
    }

    const notesCollection = await getCollection(collections.notes)
    const notes = await notesCollection.find({ alertId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(notes)
  } catch (error) {
    console.error('[v0] Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST create note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const notesCollection = await getCollection(collections.notes)

    const note = {
      ...body,
      _id: new ObjectId(),
      createdAt: new Date(),
    }

    const result = await notesCollection.insertOne(note)
    return NextResponse.json({ ...note, id: result.insertedId })
  } catch (error) {
    console.error('[v0] Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
