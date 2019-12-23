import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PreloaderService } from './service/pre-loader.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ]
})
export class PreloaderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: PreloaderModule,
            providers: [
                PreloaderService
            ]
        };
    }
}