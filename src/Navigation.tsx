import { Button } from "./components/ui/button"
type NavigationProps= {
    dialogOpen: boolean,
    setDialogOpen: (value: boolean) => void
}

const Navigation = ({ dialogOpen, setDialogOpen }: NavigationProps): React.JSX.Element => {

    const handleClick = () => {
        setDialogOpen(!dialogOpen)
    }
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