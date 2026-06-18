import { Controller, Get, Post, Body, Delete, Param, UseGuards, Query, Headers } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { AssignMemberDto } from './dto/assign-member.dto';
import { RemoveMemberDto } from './dto/remove-member.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Controller('api/v1/teams')
@UseGuards(RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('assign')
  async assignMember(@Body() assignMemberDto: AssignMemberDto) {
    const result = await this.teamsService.assignMember(assignMemberDto);
    return ResponseFormatter.success(201, 'Member assigned successfully', result);
  }

  @Delete('remove')
  async removeMember(@Body() removeMemberDto: RemoveMemberDto) {
    const result = await this.teamsService.removeMember(removeMemberDto);
    return ResponseFormatter.success(200, result.message, null);
  }

  @Get('supervisor/:supervisorId')
  async getTeamOf(
    @Param('supervisorId') supervisorId: string,
    @Query('level') level?: 'l1' | 'l2',
    @Query('role') role: string = 'sales',
  ) {
    const team = await this.teamsService.getTeamOf(+supervisorId, level, role);
    return ResponseFormatter.success(200, 'Team retrieved successfully', team);
  }

  @Get('member/:memberId')
  async getSupervisorsOf(
    @Param('memberId') memberId: string,
    @Query('role') role: string = 'sales',
  ) {
    const supervisors = await this.teamsService.getSupervisorsOf(+memberId, role);
    return ResponseFormatter.success(200, 'Supervisors retrieved successfully', supervisors);
  }

  @Get('all')
  async getAllAssignments(@Query('role') role: string = 'sales') {
    const assignments = await this.teamsService.getAllAssignments(role);
    return ResponseFormatter.success(200, 'All assignments retrieved successfully', assignments);
  }

  @Get('my-team-member-ids/:userId')
  async getMyTeamMemberIds(
    @Param('userId') userId: string,
    @Query('designation') designation: string,
    @Query('role') role: string = 'sales',
  ) {
    const memberIds = await this.teamsService.getMemberIdsForTicketFilter(+userId, designation, role);
    return ResponseFormatter.success(200, 'Team member IDs retrieved successfully', memberIds);
  }
}
