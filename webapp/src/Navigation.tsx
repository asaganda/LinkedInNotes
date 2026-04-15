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

    return (
        <header className="fixed w-full bg-blue-400 z-10">
            <nav className="flex flex-col md:flex-row justify-between items-center">
                <div className="p-1">
                    <span className="text-white">LinkedIn Connections</span>
                </div>
                <div className="p-1">
                    <input className="bg-white" id="searchQuery" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search"/>
                    <Button variant="outline" size="lg" onClick={ handleClick}>+ New Contact</Button>
                </div>
            </nav>
        </header>
    )
}

export default Navigation