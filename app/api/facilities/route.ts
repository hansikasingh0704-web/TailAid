import { NextRequest, NextResponse } from 'next/server'
import { getCollection, collections } from '@/lib/db-utils'

// GET all hospitals and rescue centers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    const usersCollection = await getCollection(collections.users)
    
    // Query for hospitals and rescue centers
    const query: any = { 
      role: { $in: ['hospital', 'rescue_center'] }
    }

    if (type) {
      const roleMap: any = {
        'Hospital': 'hospital',
        'Rescue Center': 'rescue_center',
        'rescue_center': 'rescue_center',
        'hospital': 'hospital'
      }
      query.role = roleMap[type]
    }

    const facilities = await usersCollection.find(query).toArray()

    return NextResponse.json(facilities)
  } catch (error) {
    console.error('[v0] Error fetching facilities:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}
