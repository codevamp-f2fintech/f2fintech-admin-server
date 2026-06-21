import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { AssignMemberDto } from './dto/assign-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async assignMember(dto: AssignMemberDto) {
    const { memberId, supervisorId, level, role } = dto;

    if (memberId === supervisorId) {
      throw new BadRequestException('A user cannot be their own supervisor');
    }

    const member = await this.userRepository.findOne({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member not found');

    const supervisor = await this.userRepository.findOne({ where: { id: supervisorId } });
    if (!supervisor) throw new NotFoundException('Supervisor not found');

    // Check if an assignment already exists for this member, level, and role
    let assignment = await this.teamRepository.findOne({
      where: { member_id: memberId, level, role },
    });

    if (assignment) {
      // Update existing assignment
      assignment.supervisor_id = supervisorId;
    } else {
      // Create new assignment
      assignment = this.teamRepository.create({
        member_id: memberId,
        supervisor_id: supervisorId,
        level,
        role,
      });
    }

    return await this.teamRepository.save(assignment);
  }

  async removeMember(dto: RemoveMemberDto) {
    const { memberId, level, role } = dto;

    const assignment = await this.teamRepository.findOne({
      where: { member_id: memberId, level, role },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.teamRepository.remove(assignment);
    return { message: 'Assignment removed successfully' };
  }

  async getTeamOf(supervisorId: number, level?: 'l1' | 'l2', role: string = 'sales') {
    const whereClause: any = { supervisor_id: supervisorId, role };
    if (level) {
      whereClause.level = level;
    }

    const assignments = await this.teamRepository.find({
      where: whereClause,
      relations: ['member'],
    });

    return assignments.map(a => a.member);
  }

  async getSupervisorsOf(memberId: number, role: string = 'sales') {
    const assignments = await this.teamRepository.find({
      where: { member_id: memberId, role },
      relations: ['supervisor'],
    });

    const result: { l1?: User, l2?: User } = {};
    for (const assignment of assignments) {
      if (assignment.level === 'l1') result.l1 = assignment.supervisor;
      if (assignment.level === 'l2') result.l2 = assignment.supervisor;
    }

    return result;
  }

  async getAllAssignments(role: string = 'sales') {
    const assignments = await this.teamRepository.find({
      where: { role },
      relations: ['member', 'supervisor'],
    });
    return assignments;
  }

  async getMemberIdsForTicketFilter(userId: number, designation: string, role: string = 'sales'): Promise<number[]> {
    const levelMap: Record<string, 'l1' | 'l2'> = {
      'sales manager': 'l2',
      'team leader': 'l1',
    };

    const userLevel = levelMap[designation.toLowerCase()];

    if (!userLevel) {
      // User is L0 (member), they can only see their own tickets
      return [userId];
    }

    const visibleUserIds = new Set<number>();
    visibleUserIds.add(userId); // They can always see their own tickets

    if (userLevel === 'l1') {
      // TLs see their direct members
      const directMembers = await this.teamRepository.find({
        where: { supervisor_id: userId, level: 'l1', role },
        select: ['member_id'],
      });
      directMembers.forEach(m => visibleUserIds.add(m.member_id));
    } else if (userLevel === 'l2') {
      // Managers see their direct members (l2) + members of their TLs

      // 1. Get direct reports (could be members or TLs)
      const directReports = await this.teamRepository.find({
        where: { supervisor_id: userId, level: 'l2', role },
        select: ['member_id'],
      });

      const directReportIds = directReports.map(m => m.member_id);
      directReportIds.forEach(id => visibleUserIds.add(id));

      if (directReportIds.length > 0) {
        // 2. Find any members who report to those TLs (where TL is l1)
        const indirectMembers = await this.teamRepository.find({
          where: { supervisor_id: In(directReportIds), level: 'l1', role },
          select: ['member_id'],
        });
        indirectMembers.forEach(m => visibleUserIds.add(m.member_id));
      }
    }

    return Array.from(visibleUserIds);
  }

  async getSubordinates(userId: number, designation: string, role: string = 'sales'): Promise<Partial<User>[]> {
    const memberIds = await this.getMemberIdsForTicketFilter(userId, designation, role);
    
    if (memberIds.length === 0) {
      return [];
    }

    return this.userRepository.find({
      where: { id: In(memberIds) },
      select: ['id', 'username', 'designation', 'email', 'role'],
    });
  }
}
