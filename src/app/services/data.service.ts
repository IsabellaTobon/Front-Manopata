import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  regionsAndCities: { [key: string]: string[] } = {
    'Andalucía': ['Sevilla', 'Málaga', 'Córdoba', 'Granada', 'Almería', 'Cádiz', 'Jaén', 'Huelva'],
    'Aragón': ['Zaragoza', 'Huesca', 'Teruel'],
    'Asturias': ['Oviedo', 'Gijón', 'Avilés'],
    'Baleares': ['Palma de Mallorca', 'Ibiza', 'Manacor'],
    'Canarias': ['Las Palmas de Gran Canaria', 'Santa Cruz de Tenerife', 'La Laguna', 'Arona'],
    'Cantabria': ['Santander', 'Torrelavega'],
    'Castilla y León': ['Valladolid', 'León', 'Burgos', 'Salamanca', 'Segovia', 'Ávila', 'Palencia', 'Soria', 'Zamora'],
    'Castilla-La Mancha': ['Toledo', 'Albacete', 'Ciudad Real', 'Cuenca', 'Guadalajara'],
    'Cataluña': ['Barcelona', 'Girona', 'Lleida', 'Tarragona'],
    'Extremadura': ['Badajoz', 'Cáceres', 'Mérida'],
    'Galicia': ['Santiago de Compostela', 'A Coruña', 'Lugo', 'Ourense', 'Pontevedra', 'Vigo'],
    'Madrid': ['Madrid', 'Alcalá de Henares', 'Móstoles', 'Fuenlabrada'],
    'Murcia': ['Murcia', 'Cartagena', 'Lorca'],
    'Navarra': ['Pamplona', 'Tudela'],
    'País Vasco': ['Bilbao', 'San Sebastián', 'Vitoria-Gasteiz'],
    'La Rioja': ['Logroño', 'Calahorra'],
    'Comunidad Valenciana': ['Valencia', 'Alicante', 'Castellón de la Plana'],
    'Ceuta': ['Ceuta'],
    'Melilla': ['Melilla']
  };

  // Definir los tipos de animales y sus razas correspondientes
  animalTypesAndBreeds: { [key: string]: string[] } = {
    'Perro': [
      'Mestizo',
      'Labrador Retriever',
      'Pastor Alemán',
      'Bulldog',
      'Beagle',
      'Poodle',
      'Chihuahua',
      'Dachshund',
      'Golden Retriever',
      'Rottweiler',
      'Yorkshire Terrier',
      'Boxer',
      'Schnauzer',
      'Shih Tzu',
      'Doberman',
      'Mastín',
      'Galgo',
      'Pug',
      'Bóxer'
    ],
    'Gato': [
      'Mestizo',
      'Siamés',
      'Persa',
      'Maine Coon',
      'Bengala',
      'Sphynx',
      'British Shorthair',
      'Scottish Fold',
      'Ragdoll',
      'Abisinio',
      'Birmano',
      'Angora',
      'Siberiano',
      'Azul Ruso',
      'Somalí',
      'Manx',
      'Exótico de Pelo Corto'
    ],
    'Ave': [
      'Canario',
      'Periquito',
      'Loro',
      'Agaporni',
      'Cacatúa',
      'Ninfa',
      'Jilguero',
      'Gorrión',
      'Cotorra',
      'Mestizo'
    ],
    'Reptil': [
      'Iguana',
      'Camaleón',
      'Gecko',
      'Serpiente Pitón',
      'Tortuga',
      'Serpiente',
      'Lagarto',
      'Boa',
      'Cobra',
      'Mestizo',
    ],
    'Roedor': [
      'Hámster',
      'Cobaya',
      'Chinchilla',
      'Rata',
      'Ratón',
      'Conejo',
      'Jerbo',
      'Ardilla',
      'Puercoespín',
      'Conejo Enano',
      'Erizo',
      'Marmota',
      'Mestizo'
    ],
    'Pez': [
      'Goldfish',
      'Pez Ángel',
      'Pez Cebra',
      'Pez Globo',
      'Pez Payaso',
      'Mestizo'
    ],
    'Exótico': [
      'Hurón',
      'Tarántula',
      'Escorpión',
      'Serpiente Boa',
      'Cobra',
      'Erizo',
      'Mono',
      'Murciélago',
      'Dragón de Komodo',
      'Caimán',
      'Suricato',
      'Otros'
    ]
  };

  constructor() { }
}
