import { Button } from "./components/ui/button"
type NavigationProps= {
    dialogOpen: boolean,
    setDialogOpen: (value: boolean) => void,
    searchQuery: string,
    setSearchQuery: (value: string) => void
}

const Navigation = ({ dialogOpen, setDialogOpen, searchQuery, setSearchQuery }: NavigationProps): React.JSX.Element => {

    const handleClick = () => {
        setDialogOpen(!dialogOpen)
    }

    const inputStyle = {
        backgroundColor: "white"
    }
    return (
        <header>
            <nav>
                <div className="nav-title">
                    <span className="text-white">LinkedIn Connections</span>
                </div>
                <input id="searchQuery" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" style={inputStyle}/>
                <div className="nav-contact">
                    <Button variant="outline" size="lg" onClick={ handleClick}>+ New Contact</Button>
                </div>
            </nav>
        </header>
    )
}

export default Navigation