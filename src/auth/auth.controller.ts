import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SetRoleDto } from './dto/set-role.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('assign-role')
  @ApiOperation({
    summary: 'Phân role người dùng',
    description: 'Phân role người dùng',
  })
  @ApiBearerAuth()
  assignRole(@Body() dto: SetRoleDto) {
    return this.authService.assignRole(dto);
  }

  @Post('validate-role')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xác minh role',
    description: 'Xác minh role người dùng trên hệ thống',
  })
  validateRole(@Body() dto: SetRoleDto) {
    return this.authService.validateRole(dto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
