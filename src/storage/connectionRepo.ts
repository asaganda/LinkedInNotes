import type { Connection } from "@/models/connection";

const getAllConnections = (): Connection[] => {
    const connections: Connection[] = JSON.parse(localStorage.getItem('connections') || '[]');
    return connections
}

const getConnectionById = (id: string): Connection | undefined=> {
    const connections: Connection[] = getAllConnections()
    const foundConnection: Connection | undefined = connections.find((connection: Connection) => connection.id === id)
    return foundConnection
}

const saveConnection = (connection: Connection): void => {
    const existingConnections: Connection[] = getAllConnections()
    const updatedConnections: Connection[] = [...existingConnections, connection]
    localStorage.setItem('connections', JSON.stringify(updatedConnections))
}

const deleteConnection = (id: string): void => {
    const existingConnections: Connection[] = getAllConnections()
    const updatedConnections: Connection[] = existingConnections.filter(connection => connection.id !== id)
    localStorage.setItem('connections', JSON.stringify(updatedConnections))
}

export { getAllConnections, getConnectionById, saveConnection, deleteConnection}