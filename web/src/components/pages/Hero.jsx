import { Link } from '@tanstack/react-router'

function Hero() {
    return (
        <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

                <div className="max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-tight mb-6">
                        ElectroMundo <br />
                        <span className="text-brand-orange">
                            transforma tu hogar
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                         Equipa tu casa con los mejores precios.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/productos" 
                            className="px-8 py-4 text-center text-white bg-brand-orange rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 active:scale-95"
                        >
                            Ver Ofertas
                        </Link>
                        
                        <Link 
                            to="/menu" 
                            className="px-8 py-4 text-center text-brand-blue bg-white border-2 border-brand-blue rounded-full font-bold text-lg hover:bg-brand-light transition-all active:scale-95"
                        >
                            Más Vendidos
                        </Link>
                    </div>
                </div>

            </div>

            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-brand-light rounded-full blur-3xl opacity-50 -z-0"></div>
        </section>
    );
}

export default Hero;