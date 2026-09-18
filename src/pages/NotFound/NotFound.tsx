import { Link } from "react-router";

export default function NotFound() {
    return (
        <main>
            <h1>Erro 404</h1>
            <h3>O endereço da página solicitada não foi encontrado</h3>
            <nav>
                <button><Link to ="/">HOME</Link></button>
            </nav>
        </main>
    
    )
}