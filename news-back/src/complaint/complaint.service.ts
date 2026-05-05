import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { ComplaintFilterDto } from './dto/complaint-filter.dto';

@Injectable()
export class ComplaintService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComplaintDto, userId?: string) {
    return this.prisma.complaint.create({
      data: {
        address: dto.address,
        problemType: dto.problemType,
        phone: dto.phone,
        description: dto.description,
        cityId: dto.cityId,
        userId: userId ?? null,
      },
      include: { city: true },
    });
  }

  async findAll(filter: ComplaintFilterDto) {
    const { cityId, problemType, from, to, page = 1, limit = 20 } = filter;

    const where: any = {};
    if (cityId) where.cityId = cityId;
    if (problemType) where.problemType = problemType;
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    const [complaints, total] = await Promise.all([
      this.prisma.complaint.findMany({
        where,
        include: {
          city: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.complaint.count({ where }),
    ]);

    return {
      complaints,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const complaint = await this.prisma.complaint.findUnique({
      where: { id },
      include: {
        city: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!complaint) throw new NotFoundException('Жалоба не найдена');
    return complaint;
  }
}
