import { Module } from '@nestjs/common';
import { DataParcerService } from './data-parcer.service';
import { ProjectionsController } from './projections.controller';
import { ProjectionsService } from './projections.service';

@Module({
    controllers: [ProjectionsController],
    providers: [DataParcerService, ProjectionsService],
})
export class ProjectionsModule {}
