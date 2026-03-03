import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"


// type AddContactFormProps = {
//     open: boolean,
//     onOpenChange: 
// }

const AddContactForm = (open, onOpenChange) => {
    const [name, setName] = useState<string>("")
    const [jobTitle, setJobTitle] = useState<string>("")
    const [linkedinUrl, setLinkedinUrl] = useState<string>("")
    const [company, setCompany] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                        required        {/* HTML5 built-in validation — browser prevents empty submit */}
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
                        type="url"     {/* HTML5 url validation — browser checks format */}
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
                        type="email"   {/* HTML5 email validation */}
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