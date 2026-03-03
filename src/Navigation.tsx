import { Button } from "./components/ui/button"

const handleClick = () => {
    alert("button click!")
}

const Navigation = () => {
    return (
        <header>
            <nav>
                <div className="nav-title">
                    <span className="text-white">LinkedIn Connections</span>
                </div>
                <div className="nav-contact">
                    <Button variant="outline" size="lg" onClick={ handleClick}>+ New Contact</Button>
                </div>
            </nav>
        </header>
    )
}

export default Navigation