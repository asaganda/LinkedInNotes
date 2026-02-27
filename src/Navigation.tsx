import { Button } from "./components/ui/button"

const Navigation = () => {
    return (
        <header>
            <nav>
                <div className="nav-title">
                    {/* <a href="#">LinkedIn Connections</a> */}
                    <span className="text-white">LinkedIn Connections</span>
                </div>
                <div className="nav-contact">
                    {/* <button>+ new contact</button> */}
                    <Button variant="outline" size="lg">+ New Contact</Button>
                </div>
            </nav>
        </header>
    )
}

export default Navigation