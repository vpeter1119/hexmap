import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexModule } from '@angular/flex-layout';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Material */

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/* Components */

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HexmapComponent } from './hexmap/hexmap.component';
import { TerrainButtonComponent } from './terrain-button/terrain-button.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    SidebarComponent,
    HexmapComponent,
    TerrainButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexModule,
    LeafletModule,
    FormsModule,
    FontAwesomeModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
