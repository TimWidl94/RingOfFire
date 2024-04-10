import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ringoffire-f2948',
          appId: '1:1046550550061:web:ef1bbf4c99557193ab0aa4',
          storageBucket: 'ringoffire-f2948.appspot.com',
          apiKey: 'AIzaSyBiwJ9up3uUC81-DwK8ykoVHEd5CdN-ZKw',
          authDomain: 'ringoffire-f2948.firebaseapp.com',
          messagingSenderId: '1046550550061',
          measurementId: 'G-JLX5GCQ7PC',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
