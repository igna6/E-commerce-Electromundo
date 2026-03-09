import { and, eq, isNull } from 'drizzle-orm'
import db from '../db/db'
import { productCategoriesTable, productsTable } from '../db/schema'

interface CategoryRow {
  id: number
  name: string
  parentCategoryId: number | null
}

interface KeywordRule {
  keywords: string[]
  categoryName: string
}

// Order matters: most specific keywords first, broader ones last.
// Each rule maps keywords to a category name (looked up from DB).
const KEYWORD_RULES: KeywordRule[] = [
  // --- Celulares ---
  { keywords: ['celular', 'smartphone', 'telefono movil', 'poco m6', 'poco c65', 'readmi', 'xiaomi redmi', 'samsung a0', 'samsung a06', 'tcl 30', 'tcl 50', 'motorola e', 'alcatel', 'blu z5', 'philco p241', 'philco p510', 'sansei  dual', 'quantum up', 'noblex a50'], categoryName: 'Celulares' },

  // --- TV y Video subcategories ---
  { keywords: ['soporte tv', 'soporte brazo', 'soporte fijo', 'soporte plegable', 'soporte universal tv', 'soporteb movil', 'soporte neutek', 'soporte eurosound', 'soporte kanji de', 'soporte madison', 'soporte global', 'soporte movil hdl', 'chromecast', 'tv box', 'tv stick', 'conversor smart tv', 'convesor digital'], categoryName: 'Accesorios TV' },
  { keywords: ['smart tv', 'tv 32', 'tv 40', 'tv 43', 'tv 50', 'tv 55', 'tv 60', 'tv bgh', 'tv hyundai', 'tv kanji', 'tv motorola', 'tv noblex', 'tv rca', 'tv smart', 'dalton 32', 'dalton 43', 'dalton 55', 'monitor 19', 'televisor'], categoryName: 'Televisores' },

  // --- Audio subcategories ---
  { keywords: ['auricular', 'auriculares'], categoryName: 'Auriculares' },
  { keywords: ['microfono', 'microfomo'], categoryName: 'Micrófonos' },
  { keywords: ['estereo auto', 'estereo fijo', 'estereo bt', 'estereo souno', 'estereo stardome', 'estereo xbtod', 'estereo xbtqd', 'estereo de auto', 'estereo nevada', 'transmisor automovil'], categoryName: 'Estéreos Auto' },
  { keywords: ['radio '], categoryName: 'Radios' },
  { keywords: ['parlante', 'parlantes', 'cinema-3 barra', 'bigf sound'], categoryName: 'Parlantes' },

  // --- Informática subcategories ---
  { keywords: ['notebook', 'nootbock', 'computadora i5'], categoryName: 'Notebooks y PC' },
  { keywords: ['tablet', 'e-book', 'kindle'], categoryName: 'Tablets' },
  { keywords: ['mouse', 'teclado', 'alfombrilla', 'hub usb', 'soporte base para notebook', 'lector de memoria'], categoryName: 'Periféricos' },
  { keywords: ['router', 'repetidor', 'switch tp', 'placa de red', 'nano wifi', 'noxido', 'wifi usb', 'usb wifi', 'mini router', 'cable de red'], categoryName: 'Redes y Conectividad' },
  { keywords: ['pen drive', 'pendrive', 'disco solido', 'disco ssd', 'memoria 64', 'memoria hiker'], categoryName: 'Almacenamiento' },
  { keywords: ['toner', 'drump toner'], categoryName: 'Impresión' },

  // --- Electrodomésticos subcategories ---
  { keywords: ['heladera', 'freezer', 'frezzer'], categoryName: 'Heladeras y Freezers' },
  { keywords: ['lavarrop', 'lava secarrop', 'combo lavarrop'], categoryName: 'Lavarropas' },
  { keywords: ['secarrop'], categoryName: 'Secarropas' },
  { keywords: ['cocina ', 'anafe', 'horno electrico', 'horno eléctrico', '5 hornallas'], categoryName: 'Cocinas' },
  { keywords: ['microondas', 'horno microondas'], categoryName: 'Microondas' },
  { keywords: ['aspirad', 'sopladora'], categoryName: 'Aspiradoras' },

  // --- Pequeños Electrodomésticos subcategories ---
  { keywords: ['licuadora', 'procesadora', 'minipimer', 'multiprocesadora', 'juguera', 'salad maker'], categoryName: 'Licuadoras y Procesadoras' },
  { keywords: ['batidora', 'mixer to go'], categoryName: 'Batidoras' },
  { keywords: ['pava el', 'pava eléctrica', 'hervidor'], categoryName: 'Pavas Eléctricas' },
  { keywords: ['cafetera'], categoryName: 'Cafeteras' },
  { keywords: ['freidora'], categoryName: 'Freidoras' },
  { keywords: ['tostadora', 'sandwichera', 'waflera', 'maquina de hacer donas', 'maquina de hacer mini donas'], categoryName: 'Tostadoras y Sandwicheras' },
  { keywords: ['plancha a vapor', 'plancha seca', 'plancha  sovio', 'plancha atma', 'plancha de atma', 'plancha philco', 'plancha vitta', 'plancha w'], categoryName: 'Planchas de Ropa' },
  { keywords: ['exprimidor', 'fabrica de helados', 'fabrica de pastas', 'cuchillo electrico', 'rallador electrico', 'escurridor', 'picadora', 'vaporera'], categoryName: 'Otros Pequeños Electro' },

  // --- Climatización subcategories ---
  { keywords: ['ventilador', 'ventiladores'], categoryName: 'Ventiladores' },
  { keywords: ['estufa', 'caloventor', 'convector', 'calefactor', 'vitroconvector'], categoryName: 'Estufas y Calefactores' },
  { keywords: ['aire acondicionado'], categoryName: 'Aires Acondicionados' },

  // --- Belleza y Cuidado Personal subcategories ---
  { keywords: ['secador de pelo', 'secador cabello', 'secador kemey', 'secador orix', 'secador + ', 'capillo secador', 'set om planchita'], categoryName: 'Secadores de Pelo' },
  { keywords: ['plancha de pelo', 'planchita', 'plancha pelo', 'buclera', 'rizador', 'francesca plancha', 'gianna plancha'], categoryName: 'Planchas de Pelo' },
  { keywords: ['afeitadora', 'cortadora de pelo', 'cortadora de cabello', 'cortadora de barba', 'cortabarba', 'cortapelo', 'corta pelo', 'cotadora de barba', 'maquina corta pelo', 'maquina cortadora de vello'], categoryName: 'Afeitadoras y Cortapelos' },
  { keywords: ['depiladora'], categoryName: 'Depilación' },

  // --- Salud subcategories ---
  { keywords: ['nebulizador'], categoryName: 'Nebulizadores' },
  { keywords: ['tensiometro'], categoryName: 'Tensiómetros' },
  { keywords: ['balanza baño', 'balanza fit', 'balanza personal', 'balanza zenith'], categoryName: 'Balanzas Personales' },

  // --- Bicicletas subcategories ---
  { keywords: ['bici r 12', 'bicicleta r12', 'bicicleta r16', 'bicicleta r20', 'bicicleta kit', 'triciclo'], categoryName: 'Bicicletas Niños' },
  { keywords: ['bicicleta', 'bici '], categoryName: 'Bicicletas Adulto' },

  // --- Camping y Aire Libre ---
  { keywords: ['carpa', 'conservadora', 'reposera', 'silla plegable', 'silla de aluminio', 'silla aluminio', 'botella sport', 'linga', 'monopatin', 'mesa plegable'], categoryName: 'Camping y Aire Libre' },

  // --- Hogar y Muebles subcategories ---
  { keywords: ['colchon', 'sommier', 'somier', 'almohada'], categoryName: 'Colchones y Sommiers' },
  { keywords: ['cama ', 'mesa de pino', 'mesa plastico', 'silla plastico', 'silla plástico', 'sillon', 'escobero', 'multifuncion linea', 'multifuncion escobero'], categoryName: 'Muebles' },
  { keywords: ['sabana', 'toalla', 'toallo', 'toallon', 'frazada', 'cortina', 'salida de baño'], categoryName: 'Textiles' },
  { keywords: ['asadera', 'olla ', 'sarten', 'juego de cacerola', 'juego de cubiertos', 'juego de ollas', 'juego 3pzs', 'juego 5pzs', 'paellera', 'pala canelon', 'cesto de residuo', 'set  x 5 hermetico', 'mate ', 'termo ', 'termometro de cocina'], categoryName: 'Cocina y Menaje' },
  { keywords: ['ducha', 'caño ducha', 'campana '], categoryName: 'Baño' },
  { keywords: ['tender', 'tabla de planchar'], categoryName: 'Hogar y Muebles' },

  // --- Herramientas y Jardín ---
  { keywords: ['amoladora', 'bordeadora', 'cortadora de césped', 'cortadora de pasto', 'compresor de aire'], categoryName: 'Herramientas y Jardín' },

  // --- Termotanques y Calefones ---
  { keywords: ['termotanque', 'calefon', 'calefón'], categoryName: 'Termotanques y Calefones' },

  // --- Accesorios y Cables subcategories ---
  { keywords: ['cable hdmi', 'cable power', 'cable trebol', 'cable de red', 'cable legatus', 'cable micro usb', 'cable royal', 'usb cable'], categoryName: 'Cables' },
  { keywords: ['cargador'], categoryName: 'Cargadores' },
  { keywords: ['adaptador', 'conversor', 'otg usb', 'receptor blth', 'receptor bluetooth', 'receptor nano', 'bluetuht usb'], categoryName: 'Adaptadores' },

  // --- Smartwatches y Wearables ---
  { keywords: ['reloj', 'smartwatch', 'watch onn', 'watch 8'], categoryName: 'Smartwatches y Wearables' },

  // --- Gaming y Consolas ---
  { keywords: ['consola', 'joistick', 'joystick', 'controlador gamepad', 'controller game', 'teclado gamer', 'mouse gamer'], categoryName: 'Gaming y Consolas' },

  // --- Seguridad ---
  { keywords: ['camara de seguridad', 'cámara de seguridad', 'camara inteligente', 'camara ip', 'kit wifi', '4 camaras', 'espejo retrovisor con camara'], categoryName: 'Seguridad' },

  // --- Purificadores de Agua ---
  { keywords: ['purificador'], categoryName: 'Purificadores de Agua' },

  // --- Piletas ---
  { keywords: ['pileta'], categoryName: 'Piletas' },

  // --- Bebés y Niños ---
  { keywords: ['coche paseo', 'kit escolar'], categoryName: 'Bebés y Niños' },

  // --- Broader fallback matches (parent categories) ---
  { keywords: ['balanza'], categoryName: 'Salud' },
  { keywords: ['almohadilla'], categoryName: 'Salud' },
  { keywords: ['plancha'], categoryName: 'Planchas de Ropa' },
  { keywords: ['cortadora remington'], categoryName: 'Afeitadoras y Cortapelos' },
  { keywords: ['paralante'], categoryName: 'Parlantes' },
  { keywords: ['calculadora'], categoryName: 'Informática' },
  { keywords: ['placa de sonido'], categoryName: 'Periféricos' },
  { keywords: ['tp link usb'], categoryName: 'Redes y Conectividad' },
  { keywords: ['teléfono fijo', 'telefono fijo'], categoryName: 'Accesorios y Cables' },
  { keywords: ['lampara', 'velador', 'luz de emerciancia', 'luz solar', 'reflector solar', 'linterna', 'minera led', 'pilas'], categoryName: 'Accesorios y Cables' },
  { keywords: ['soporte celular', 'palo selfie', 'tripode', 'puntero laser', 'control remoto', 'control wireless', 'car wirelees', 'sellador de bolsa', 'estabilizador'], categoryName: 'Accesorios y Cables' },
  { keywords: ['calefon electrico'], categoryName: 'Termotanques y Calefones' },
  { keywords: ['volcan', '5700 tb', '3800 tb', '2000 tb', '2500 ss', '4000 ss', 'aa 5300', 'aa daewo'], categoryName: 'Climatización' },
]

async function assignProductCategories() {
  try {
    console.log('Assigning products to categories...\n')

    // Load all categories
    const allCategories = await db
      .select({
        id: productCategoriesTable.id,
        name: productCategoriesTable.name,
        parentCategoryId: productCategoriesTable.parentCategoryId,
      })
      .from(productCategoriesTable)
      .where(isNull(productCategoriesTable.deletedAt))

    // Build name → id map
    const categoryByName = new Map<string, CategoryRow>()
    for (const cat of allCategories) {
      categoryByName.set(cat.name, cat)
    }

    // Resolve keyword rules to category IDs
    const resolvedRules: { keywords: string[]; categoryId: number; categoryName: string }[] = []
    for (const rule of KEYWORD_RULES) {
      const cat = categoryByName.get(rule.categoryName)
      if (!cat) {
        console.warn(`  WARNING: Category "${rule.categoryName}" not found in DB, skipping rule`)
        continue
      }
      resolvedRules.push({
        keywords: rule.keywords,
        categoryId: cat.id,
        categoryName: rule.categoryName,
      })
    }

    // Find "Otros" catch-all category
    const otrosCat = categoryByName.get('Otros')
    if (!otrosCat) {
      console.error('ERROR: "Otros" category not found. Run seed:categories first.')
      process.exit(1)
    }

    // Load all products
    const products = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        category: productsTable.category,
      })
      .from(productsTable)
      .where(isNull(productsTable.deletedAt))

    let assigned = 0
    let skippedAlreadyAssigned = 0
    let assignedToOtros = 0
    const unmatchedProducts: string[] = []

    for (const product of products) {
      // Skip products that already have a category
      if (product.category != null) {
        skippedAlreadyAssigned++
        continue
      }

      const nameLower = product.name.toLowerCase()
      let matchedCategoryId: number | undefined
      let matchedCategoryName: string | undefined

      // Try each rule in order (most specific first)
      for (const rule of resolvedRules) {
        for (const keyword of rule.keywords) {
          if (nameLower.includes(keyword.toLowerCase())) {
            matchedCategoryId = rule.categoryId
            matchedCategoryName = rule.categoryName
            break
          }
        }
        if (matchedCategoryId != null) break
      }

      if (matchedCategoryId == null) {
        // Assign to "Otros"
        matchedCategoryId = otrosCat.id
        matchedCategoryName = 'Otros'
        unmatchedProducts.push(product.name)
        assignedToOtros++
      }

      // Update product
      await db
        .update(productsTable)
        .set({ category: matchedCategoryId, updatedAt: new Date() })
        .where(eq(productsTable.id, product.id))

      assigned++
    }

    console.log('--- Summary ---')
    console.log(`Total products: ${products.length}`)
    console.log(`Assigned to category: ${assigned}`)
    console.log(`  - Matched by keyword: ${assigned - assignedToOtros}`)
    console.log(`  - Assigned to "Otros" (unmatched): ${assignedToOtros}`)
    console.log(`Skipped (already had category): ${skippedAlreadyAssigned}`)
    console.log(`Match rate: ${((assigned - assignedToOtros) / products.length * 100).toFixed(1)}%`)

    if (unmatchedProducts.length > 0) {
      console.log(`\n--- Unmatched products (assigned to "Otros") ---`)
      unmatchedProducts.forEach((name) => console.log(`  - ${name}`))
    }

    process.exit(0)
  } catch (error) {
    console.error('Error assigning product categories:', error)
    process.exit(1)
  }
}

assignProductCategories()
