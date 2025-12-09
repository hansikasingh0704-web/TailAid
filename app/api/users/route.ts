import { NextRequest, NextResponse } from 'next/server'
import { getCollection, collections } from '@/lib/db-utils'
import { ObjectId } from 'mongodb'

// GET user by email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const usersCollection = await getCollection(collections.users)
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('[v0] Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// POST create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const usersCollection = await getCollection(collections.users)

    // Check if user already exists
    const existing = await usersCollection.findOne({ email: body.email })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const user = {
      ...body,
      _id: new ObjectId(),
      createdAt: new Date(),
    }

    const result = await usersCollection.insertOne(user)
    return NextResponse.json({ ...user, id: result.insertedId })
  } catch (error) {
    console.error('[v0] Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
