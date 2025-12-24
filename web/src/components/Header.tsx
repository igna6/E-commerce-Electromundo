import { Link } from '@tanstack/react-router'
import logoImg from '../logo.png'

function Header() {
    return (
        <header className="relative flex items-center justify-center h-20 px-6 bg-white shadow-md border-b border-gray-100">
            <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <Link to="/">
                    <img 
                        src={logoImg} 
                        alt="Company Logo" 
                        className="h-20 w-auto object-contain hover:opacity-80 transition-opacity" 
                    />
                </Link>
            </div>

            <nav>
                <ul className="flex items-center gap-10">
                    <NavItem to="/" text="Home" />
                    <NavItem to="/" text="Menu" />
                    <NavItem to="/" text="Productos" />
                </ul>
            </nav>
        </header>
    );
}
function NavItem({ to, text }: { to: string; text: string }) {
    return (
        <li>
            <Link 
                to={to} 
                className="text-gray-600 font-semibold text-sm uppercase tracking-wide hover:text-blue-600 transition-all duration-300 relative group"
            >
                {text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
        </li>
    );
}
export default Header;