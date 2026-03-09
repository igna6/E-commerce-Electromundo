import { and, eq, isNull } from 'drizzle-orm'
import db from '../db/db'
import { productCategoriesTable } from '../db/schema'

interface CategoryDef {
  name: string
  description: string
  children?: CategoryDef[]
}

const CATEGORY_TREE: CategoryDef[] = [
  {
    name: 'Celulares',
    description: 'Smartphones y teléfonos móviles',
    children: [],
  },
  {
    name: 'TV y Video',
    description: 'Televisores, smart TVs y accesorios de video',
    children: [
      { name: 'Televisores', description: 'Smart TV, LED y monitores' },
      { name: 'Accesorios TV', description: 'Soportes, TV Box, Chromecast y sticks' },
    ],
  },
  {
    name: 'Audio',
    description: 'Parlantes, auriculares y equipos de audio',
    children: [
      { name: 'Parlantes', description: 'Parlantes portátiles, de PC y torres de sonido' },
      { name: 'Auriculares', description: 'Auriculares bluetooth, gamer y con cable' },
      { name: 'Micrófonos', description: 'Micrófonos inalámbricos y de mano' },
      { name: 'Radios', description: 'Radios AM/FM y parlantes con radio' },
      { name: 'Estéreos Auto', description: 'Estéreos y accesorios para auto' },
    ],
  },
  {
    name: 'Informática',
    description: 'Notebooks, tablets y periféricos',
    children: [
      { name: 'Notebooks y PC', description: 'Notebooks, computadoras y monitores' },
      { name: 'Tablets', description: 'Tablets y e-readers' },
      { name: 'Periféricos', description: 'Mouse, teclados y accesorios' },
      { name: 'Redes y Conectividad', description: 'Routers, adaptadores WiFi y cables de red' },
      { name: 'Almacenamiento', description: 'Pen drives, discos SSD y memorias' },
      { name: 'Impresión', description: 'Toners y accesorios de impresión' },
    ],
  },
  {
    name: 'Electrodomésticos',
    description: 'Grandes electrodomésticos para el hogar',
    children: [
      { name: 'Heladeras y Freezers', description: 'Heladeras, freezers y bajo mesada' },
      { name: 'Lavarropas', description: 'Lavarropas automáticos y semiautomáticos' },
      { name: 'Secarropas', description: 'Secarropas centrífugos' },
      { name: 'Cocinas', description: 'Cocinas, anafes y hornos' },
      { name: 'Microondas', description: 'Hornos microondas' },
      { name: 'Aspiradoras', description: 'Aspiradoras y sopladoras' },
    ],
  },
  {
    name: 'Pequeños Electrodomésticos',
    description: 'Electrodomésticos de cocina y uso diario',
    children: [
      { name: 'Licuadoras y Procesadoras', description: 'Licuadoras, minipimers y procesadoras' },
      { name: 'Batidoras', description: 'Batidoras de mano y planetarias' },
      { name: 'Pavas Eléctricas', description: 'Pavas eléctricas y hervidores' },
      { name: 'Cafeteras', description: 'Cafeteras de filtro y cápsulas' },
      { name: 'Freidoras', description: 'Freidoras de aire y sin aceite' },
      { name: 'Tostadoras y Sandwicheras', description: 'Tostadoras, sandwicheras y wafleras' },
      { name: 'Planchas de Ropa', description: 'Planchas a vapor y secas' },
      { name: 'Otros Pequeños Electro', description: 'Exprimidores, fábricas de pastas, cuchillos eléctricos y más' },
    ],
  },
  {
    name: 'Climatización',
    description: 'Ventiladores, estufas y aires acondicionados',
    children: [
      { name: 'Ventiladores', description: 'Ventiladores de pie, turbo y de techo' },
      { name: 'Estufas y Calefactores', description: 'Estufas de cuarzo, halógenas, caloventores y convectores' },
      { name: 'Aires Acondicionados', description: 'Split y portátiles' },
    ],
  },
  {
    name: 'Belleza y Cuidado Personal',
    description: 'Secadores, planchas de pelo, afeitadoras y más',
    children: [
      { name: 'Secadores de Pelo', description: 'Secadores y sets de secado' },
      { name: 'Planchas de Pelo', description: 'Alisadores, bucleras y planchitas' },
      { name: 'Afeitadoras y Cortapelos', description: 'Afeitadoras, cortadoras de pelo y barba' },
      { name: 'Depilación', description: 'Depiladoras y accesorios' },
    ],
  },
  {
    name: 'Salud',
    description: 'Tensiómetros, nebulizadores y equipamiento de salud',
    children: [
      { name: 'Nebulizadores', description: 'Nebulizadores a pistón y ultrasónicos' },
      { name: 'Tensiómetros', description: 'Tensiómetros digitales de brazo y muñeca' },
      { name: 'Balanzas Personales', description: 'Balanzas de baño y fit' },
    ],
  },
  {
    name: 'Bicicletas',
    description: 'Bicicletas para adultos, niños y accesorios',
    children: [
      { name: 'Bicicletas Adulto', description: 'Mountain bike, paseo y freestyle' },
      { name: 'Bicicletas Niños', description: 'Bicicletas rodado 12, 16, 20 y triciclos' },
    ],
  },
  {
    name: 'Camping y Aire Libre',
    description: 'Carpas, conservadoras, reposeras y equipamiento outdoor',
    children: [],
  },
  {
    name: 'Hogar y Muebles',
    description: 'Colchones, muebles, textiles y artículos para el hogar',
    children: [
      { name: 'Colchones y Sommiers', description: 'Colchones, sommiers y almohadas' },
      { name: 'Muebles', description: 'Camas, mesas, sillas y escoberos' },
      { name: 'Textiles', description: 'Sábanas, toallas, frazadas y cortinas' },
      { name: 'Cocina y Menaje', description: 'Ollas, sartenes, asaderas y cubiertos' },
      { name: 'Baño', description: 'Duchas, espejos y accesorios de baño' },
    ],
  },
  {
    name: 'Herramientas y Jardín',
    description: 'Herramientas eléctricas, cortadoras de césped y jardín',
    children: [],
  },
  {
    name: 'Termotanques y Calefones',
    description: 'Termotanques eléctricos y a gas, calefones',
    children: [],
  },
  {
    name: 'Accesorios y Cables',
    description: 'Cables, cargadores, adaptadores y accesorios tecnológicos',
    children: [
      { name: 'Cables', description: 'Cables HDMI, USB, de red y power' },
      { name: 'Cargadores', description: 'Cargadores de celular y notebook' },
      { name: 'Adaptadores', description: 'Adaptadores bluetooth, audio, video y red' },
    ],
  },
  {
    name: 'Smartwatches y Wearables',
    description: 'Relojes inteligentes y pulseras deportivas',
    children: [],
  },
  {
    name: 'Gaming y Consolas',
    description: 'Consolas de juegos, joysticks y accesorios gamer',
    children: [],
  },
  {
    name: 'Seguridad',
    description: 'Cámaras de seguridad y kits de vigilancia',
    children: [],
  },
  {
    name: 'Purificadores de Agua',
    description: 'Purificadores y filtros de agua',
    children: [],
  },
  {
    name: 'Piletas',
    description: 'Piletas de lona y accesorios',
    children: [],
  },
  {
    name: 'Bebés y Niños',
    description: 'Coches, triciclos y artículos para bebés',
    children: [],
  },
  {
    name: 'Otros',
    description: 'Productos generales',
    children: [],
  },
]

async function findCategory(name: string): Promise<{ id: number } | undefined> {
  const results = await db
    .select({ id: productCategoriesTable.id })
    .from(productCategoriesTable)
    .where(and(eq(productCategoriesTable.name, name), isNull(productCategoriesTable.deletedAt)))
    .limit(1)

  return results[0]
}

async function seedCategories() {
  try {
    console.log('Seeding categories...\n')

    let created = 0
    let skipped = 0

    for (const topLevel of CATEGORY_TREE) {
      // Check if top-level category exists
      let parent = await findCategory(topLevel.name)

      if (parent) {
        console.log(`  SKIP (exists): ${topLevel.name}`)
        skipped++
      } else {
        const result = await db
          .insert(productCategoriesTable)
          .values({
            name: topLevel.name,
            description: topLevel.description,
            parentCategoryId: null,
          })
          .returning({ id: productCategoriesTable.id })

        parent = result[0]
        console.log(`  CREATE: ${topLevel.name}`)
        created++
      }

      // Seed children
      if (topLevel.children && parent) {
        for (const child of topLevel.children) {
          const existing = await findCategory(child.name)

          if (existing) {
            console.log(`    SKIP (exists): └─ ${child.name}`)
            skipped++
          } else {
            await db.insert(productCategoriesTable).values({
              name: child.name,
              description: child.description,
              parentCategoryId: parent.id,
            })
            console.log(`    CREATE: └─ ${child.name}`)
            created++
          }
        }
      }
    }

    console.log(`\n--- Summary ---`)
    console.log(`Created: ${created}`)
    console.log(`Skipped: ${skipped}`)
    console.log(`Total categories: ${created + skipped}`)

    process.exit(0)
  } catch (error) {
    console.error('Error seeding categories:', error)
    process.exit(1)
  }
}

seedCategories()
