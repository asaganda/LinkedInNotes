import { supabase } from '../lib/supabaseClient';
import type { Connection } from '../../../shared/models/connection';

// Maps a raw Supabase row (snake_case) to the shared Connection type (camelCase)
const toConnection = (row: Record<string, string>): Connection => ({
    id: row.id,
    name: row.name,
    jobTitle: row.job_title,
    company: row.company,
    linkedinUrl: row.linkedin_url,
    phone: row.phone,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const getAllConnections = async (): Promise<Connection[]> => {
    const { data, error } = await supabase
        .from('connections')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(toConnection);
};

const getConnectionByLinkedinUrl = async (linkedinUrl: string): Promise<Connection | undefined> => {
    const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('linkedin_url', linkedinUrl)
        .maybeSingle();
    if (error) throw error;
    return data ? toConnection(data) : undefined;
};

const saveConnection = async (connection: Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Connection> => {
    const { data, error } = await supabase
        .from('connections')
        .insert({
            name: connection.name,
            job_title: connection.jobTitle,
            company: connection.company,
            linkedin_url: connection.linkedinUrl,
            phone: connection.phone,
            email: connection.email,
            avatar_url: connection.avatarUrl,
        })
        .select()
        .single();
    if (error) throw error;
    return toConnection(data);
};

const updateConnection = async (id: string, updates: Partial<Omit<Connection, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Connection> => {
    const { data, error } = await supabase
        .from('connections')
        .update({
            name: updates.name,
            job_title: updates.jobTitle,
            company: updates.company,
            phone: updates.phone,
            email: updates.email,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return toConnection(data);
};

const deleteConnection = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

export { getAllConnections, getConnectionByLinkedinUrl, saveConnection, updateConnection, deleteConnection };
