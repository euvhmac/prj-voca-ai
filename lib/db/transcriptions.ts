import { prisma } from './client';
import type { Transcription, Prisma } from '@prisma/client';

export interface CreateTranscriptionData {
  userId: string;
  filename: string;
  durationSeconds?: number;
  wordCount?: number;
  rawTranscription: string;
  optimizedPrompt: string;
  // Prisma exige InputJsonValue para campos Json — usa o tipo oficial para evitar cast
  metadata?: Prisma.InputJsonValue;
}

export const transcriptionRepository = {
  async create(data: CreateTranscriptionData): Promise<Transcription> {
    return prisma.transcription.create({ data });
  },

  async findByUser(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ items: Transcription[]; total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.transcription.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transcription.count({ where: { userId } }),
    ]);
    return { items, total };
  },

  // Escopa sempre pelo userId — nunca retorna dados de outro usuário.
  async findById(
    id: string,
    userId: string,
  ): Promise<Transcription | null> {
    return prisma.transcription.findFirst({
      where: { id, userId },
    });
  },

  // deleteMany com userId no WHERE garante que só o dono pode deletar.
  async delete(id: string, userId: string): Promise<void> {
    await prisma.transcription.deleteMany({
      where: { id, userId },
    });
  },
};
