import { useState, type SubmitEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import type { Connection } from "./models/connection"
import { saveConnection } from "./storage/connectionRepo"

type AddContactFormProps = {
    dialogOpen: boolean,
    setDialogOpen: (value: boolean) => void,
    setConnections: (value: Connection[] | ((prev: Connection[]) => Connection[])) => void

}

const AddContactForm = ({ dialogOpen, setDialogOpen, setConnections}: AddContactFormProps): React.JSX.Element => {
    const [name, setName] = useState<string>("")
    const [jobTitle, setJobTitle] = useState<string>("")
    const [linkedinUrl, setLinkedinUrl] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
        e.preventDefault()
        const newConnection: Connection = { 
            id: crypto.randomUUID(),
            name: name,
            jobTitle: jobTitle,
            linkedinUrl: linkedinUrl,
            company: company,
            phone: phone,
            email: email
        }
        saveConnection(newConnection)
        setDialogOpen(false)
        setConnections((prev: Connection[]): Connection[] => [...prev, newConnection])
    }

    return (
        <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                </DialogHeader>

                    <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        />
                    </div>

                    <div>
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Software Engineer"
                        required
                        />
                    </div>

                    <div>
                        <Label htmlFor="linkedinUrl">LinkedIn URL *</Label>
                        <Input
                        id="linkedinUrl"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                        type="url"
                        required
                        />
                    </div>

                    {/* Optional fields — same pattern but without `required` */}
                    <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Google"
                        />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="555-123-4567"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                        />
                    </div>

                    <Button type="submit">Add Contact</Button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}

export default AddContactForm