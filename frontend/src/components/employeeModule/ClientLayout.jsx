import React, { useState, useEffect, createContext } from 'react';
export const ClientContext = createContext();
import { useParams, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ArrowLeft, Search, Bell, ChevronDown, Check } from 'lucide-react';
import { clientAPI } from '../../services/api';

const ClientLayout = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    async function fetchData() {
        try {
            setLoading(true);
            const res = await clientAPI.getClient(id);
            const currentClient = res.data;
            setClient(currentClient);

            let list = [];
            if (currentClient.groupCompany) {
                // It's a child. Fetch parent and siblings.
                const parentId = currentClient.groupCompany._id || currentClient.groupCompany;
                const parentRes = await clientAPI.getClient(parentId);
                const childrenRes = await clientAPI.getChildCompanies(parentId);
                list = [parentRes.data, ...childrenRes.data.data];
            } else {
                // It's a parent. Fetch children.
                const childrenRes = await clientAPI.getChildCompanies(id);
                list = [currentClient, ...childrenRes.data.data];
            }
            setCompanies(list);
        } catch (err) {
            console.error("Failed to fetch layout data", err);
        } finally {
            setLoading(false);
        }
    }

    const handleSwitch = (newId) => {
        setIsOpen(false);
        if (newId === id) return;

        const pathParts = location.pathname.split('/');
        // Expected: ["", "employee", "clients", ":id", ...]
        const subPath = pathParts.slice(4).join('/');
        navigate(`/employee/clients/${newId}${subPath ? '/' + subPath : ''}`);
    };

    const backUrl = location.pathname === `/employee/clients/${id}` 
        ? '/employee/clients' 
        : `/employee/clients/${id}`;

    const selectedCompany = companies.find(c => c._id === id) || client;

    return (
        <ClientContext.Provider value={{ client, companies, loading, handleSwitch, selectedCompany }}>
            <Outlet />
        </ClientContext.Provider>
    );
};

export default ClientLayout;
