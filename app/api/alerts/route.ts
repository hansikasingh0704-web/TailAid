import { NextRequest, NextResponse } from 'next/server'
import { getCollection, collections } from '@/lib/db-utils'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const alertsCollection = await getCollection(collections.alerts)
    
    const query: any = {}
    if (userId) query.userId = userId
    if (status) query.status = status

    const findResult = alertsCollection.find(query)
    const sortedResult = findResult.sort ? findResult.sort({ timestamp: -1 }) : findResult
    const alerts = await sortedResult.toArray()
    
    return NextResponse.json(alerts)
  } catch (error) {
    console.error('[v0] Error fetching alerts:', error)
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const alertsCollection = await getCollection(collections.alerts)

    const alert = {
      ...body,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await alertsCollection.insertOne(alert)
    return NextResponse.json({ ...alert, _id: result.insertedId })
  } catch (error) {
    console.error('[v0] Error creating alert:', error)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
