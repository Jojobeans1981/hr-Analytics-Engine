import { ObjectId, Collection, Db, WithId } from 'mongodb';
import { getDb } from '../db/connect';
import { Team } from '../models/team.model';
import { ApiError } from '../errors/apiError';

export class TeamService {
  static async getTeams(query: any): Promise<Team[]> {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    const filter: any = {};

    if (query.department) {
      filter.department = new RegExp(query.department, 'i');
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.minRisk || query.maxRisk) {
      filter.avgRiskScore = {};
      if (query.minRisk) filter.avgRiskScore.$gte = Number(query.minRisk);
      if (query.maxRisk) filter.avgRiskScore.$lte = Number(query.maxRisk);
    }

    return collection.find(filter).toArray();
  }

  static async getTeamById(id: ObjectId): Promise<WithId<Team>> {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    const team = await collection.findOne({ _id: id });

    if (!team) {
      throw new ApiError('Team not found', 404);
    }

    return team;
  }

  static async createTeam(teamData: Omit<Team, '_id'>): Promise<WithId<Team>> {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    
    const newTeam = {
      ...teamData,
      _id: new ObjectId(), // Generate ID upfront
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newTeam);
    
    // Return the inserted document with proper typing
    const inserted = await collection.findOne({ _id: result.insertedId });
    if (!inserted) {
      throw new ApiError('Failed to create team', 500);
    }
    return inserted;
  }

  static async updateTeam(id: ObjectId, updateData: Partial<Team>): Promise<WithId<Team>> {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    
    const update = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { _id: id },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new ApiError('Team not found', 404);
    }

    return result.value;
  }

  static async deleteTeam(id: ObjectId): Promise<void> {
    const db = await getDb();
    const collection = db.collection<Team>('teams');
    const result = await collection.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new ApiError('Team not found', 404);
    }
  }
}