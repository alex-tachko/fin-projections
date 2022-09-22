import {Module} from '@nestjs/common';
import {ProjectionsModule} from './projections/projections.module';

@Module({
    imports: [ProjectionsModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
