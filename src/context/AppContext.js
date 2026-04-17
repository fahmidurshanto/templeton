"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';
import logger from '@/lib/logger';
import { getFriendlyErrorMessage } from '@/lib/error-utils';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Centralized state
    const [currentUser, setCurrentUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    const [documents, setDocuments] = useState([]);
    const [userList, setUserList] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [activeTab, setActiveTab] = useState('DASHBOARD');
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    const [adminTab, setAdminTab] = useState('OVERVIEW');

    // Centralized Theme State (Monochrome)
    const [theme, setTheme] = useState({
        primary: '#000000',
        secondary: '#ffffff',
        text: '#171717',
        muted: '#666666'
    });

    // Global 401 Interceptor
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    setCurrentUser(null);
                    
                    const currentPath = window.location.pathname + window.location.search;
                    if (currentPath !== '/login') {
                        const loginUrl = (currentPath && currentPath !== '/') 
                            ? `/login?redirect=${encodeURIComponent(currentPath)}` 
                            : '/login';
                        router.push(loginUrl);
                    }
                    
                    // Return a rejected promise with a silent flag to stop caller execution
                    return Promise.reject({ ...error, silent: true });
                }
                return Promise.reject(error);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, [router]);

    const logout = () => {
        const userLogout = async () => {
            try {
                const response = await api.get('/auth/logout');
                const data = response.data;
                if (data.success) {
                    router.push('/login');
                }
            } catch (error) {
                if (error.response?.status !== 401) {
                    logger.error('Logout error:', error);
                }
            }
        }
        userLogout();
    };

    const logActivity = (userId, title, description) => {
        const now = new Date();
        const newActivity = {
            id: Date.now(),
            title,
            description,
            date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };

        setUserList(prev => prev.map(u => {
            if (String(u._id || u.id) === String(userId)) {
                return {
                    ...u,
                    activities: [newActivity, ...(u.activities || [])]
                };
            }
            return u;
        }));
    };

    // API: Upload Document
    const addDocument = async (file, targetUserId = null) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', targetUserId || currentUser?.id);

            const response = await api.post('/document/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;
            if (data.success) {
                const newDoc = {
                    id: data.document._id,
                    userId: targetUserId || currentUser?.id,
                    name: data.document.name,
                    date: new Date(data.document.createdAt).toISOString().split('T')[0],
                    size: 'N/A',
                    category: 'Recent Uploads',
                    hasUserSeen: data.document.hasUserSeen || false
                };
                setDocuments(prev => [newDoc, ...prev]);

                // Log Activity
                logActivity(targetUserId || currentUser?.id, 'Document Uploaded', `File "${file.name}" was added to the vault.`);

                return data;
            }
            throw new Error(data.message || 'Upload failed');
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    // API: Delete Document (Admin only)
    const deleteDocument = async (docId) => {
        try {
            const response = await api.delete(`/document/delete/${docId}`);
            const data = response.data;
            if (data.success) {
                setDocuments(prev => prev.filter(doc => doc.id !== docId));
                return data;
            }
            throw new Error(data.message || 'Deletion failed');
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    };

    // API: View Document
    const viewDocument = async (docId) => {
        try {
            const response = await api.get(`/document/view/${docId}`, {
                responseType: 'blob'
            });

            if (response.status === 200) {
                const blob = response.data;
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');

                return true;
            }
            throw new Error('Could not open document');
        } catch (error) {
            // Since responseType was 'blob', Axios returns the error message as a Blob too.
            // We need to parse it back into text/JSON to see the real error message.
            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const data = JSON.parse(text);
                    if (data.message) {
                        error.message = data.message;
                    }
                } catch (e) {
                    console.error('Error parsing blob error message:', e);
                }
            }
            console.error('View error:', error.message);
            throw error;
        }
    };

    // API: Register User (Admin Only)
    const registerUser = async (userData) => {
        try {
            const response = await api.post('/auth/user/register', userData);
            const data = response.data;
            if (data.success) {
                await fetchAllUsers(); // Refresh user list after registration
                return data;
            }
            throw new Error(data.message || 'Registration failed');
        } catch (error) {
            // console.error('Registration error:', error);
            throw error;
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/auth/me');
            const data = response.data;
            if (data.success) {
                setCurrentUser({
                    id: data.user._id,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    name: `${data.user.firstName} ${data.user.lastName}`,
                    email: data.user.email,
                    role: data.user.role || data.user.Role,
                    phone: data.user.Phone,
                    gender: data.user.gender,
                    nric: data.user.nric,
                    address: data.user.address,
                    nationality: data.user.nationality,
                    secondaryPhone: data.user.secondaryPhone,
                    secondaryEmail: data.user.secondaryEmail
                });
                return data.user;
            }

            // If the interceptor handled a 401 and returned silent: true, exit gracefully
            if (data.silent) return null;

            const err = new Error(data.message || 'Could not fetch profile');
            err.data = data;
            throw err;
        } catch (error) {
            // Only log if it's NOT a silent auth failure
            if (error?.data?.silent !== true && error?.response?.status !== 401) {
                logger.error('Fetch profile error:', error);
            }
            // Do not re-throw to prevent Red Screen overlay
        }
    };

    // API: Change Password
    const changePassword = async (passwordData, isUserSpecific = false) => {
        const endpoint = isUserSpecific
            ? '/auth/user/changepassword'
            : '/auth/admin/changepassword';

        try {
            const response = await api.post(endpoint, passwordData);
            const data = response.data;
            if (data.success) return data;
            throw new Error(data.message || 'Password change failed');
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    };

    // API: Fetch All Users (Admin Only)
    const fetchAllUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await api.get('/auth/users');
            const data = response.data;
            if (data.success) {
                setUserList(data.users);
                return data.users;
            }
            throw new Error(data.message || 'Could not fetch users');
        } catch (error) {
            console.error('Fetch users error:', error);
            throw error;
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // API: Update User Details (Admin Only)
    const updateUser = async (id, userData) => {
        try {
            const response = await api.patch(`/auth/user/${id}`, userData);
            const data = response.data;
            if (data.success) {
                setUserList(prev => prev.map(u => u._id === id ? { ...u, ...data.user } : u));

                // Log Activity
                logActivity(id, 'Profile Updated', 'User account information was modified by admin.');

                return data;
            }
            throw new Error(data.message || 'Update failed');
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    // API: Delete User (Admin Only)
    const deleteUser = async (id) => {
        try {
            const response = await api.delete(`/auth/user/${id}`);
            const data = response.data;
            if (data.success) {
                setUserList(prev => prev.filter(u => u._id !== id));
                return data;
            }
            throw new Error(data.message || 'Delete failed');
        } catch (error) {
            console.error('Delete user error:', error);
            throw error;
        }
    };

    // API: Profile Data Fetchers
    const fetchFinancialSummary = async (userId) => {
        try {
            const response = await api.get(`/user/financial-summary/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Financial summary error:', error);
            throw error;
        }
    };

    const fetchEntities = async (userId) => {
        try {
            const response = await api.get(`/user/entities/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Entities error:', error);
            throw error;
        }
    };

    const fetchServiceStatus = async (userId) => {
        try {
            const response = await api.get(`/user/services/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Service status error:', error);
            throw error;
        }
    };

    const fetchInvestmentReports = async (userId) => {
        try {
            const response = await api.get(`/user/investment-reports/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Investment reports error:', error);
            throw error;
        }
    };

    // API: Fetch Documents for user (Admin Only as requested)
    const fetchUserDocuments = async (userId) => {
        if (!userId) return;

        // Prevent execution if user is not an admin
        if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') {
            return;
        }

        try {
            const response = await api.get(`/document/getall?id=${userId}`);
            const data = response.data;
            if (data.success) {
                const mapped = data.documents.map(doc => ({
                    id: doc._id,
                    userId: doc.user,
                    name: doc.name,
                    date: new Date(doc.createdAt).toISOString().split('T')[0],
                    size: doc.size || 'N/A',
                    category: 'Documents',
                    hasUserSeen: doc.hasUserSeen || false
                }));
                setDocuments(mapped);
            }
        } catch (error) {
            console.error('Fetch user documents error:', error);
        }
    };

    useEffect(() => {
        // Initial load of user if session exists and not on login page
        if (pathname !== '/login') {
            fetchCurrentUser()
                .catch(() => { })
                .finally(() => setIsAuthChecked(true));
        } else {
            setIsAuthChecked(true);
        }
    }, [pathname]);

    useEffect(() => {
        if (currentUser?.role === 'admin') {
            fetchAllUsers().catch(() => { });
        }
        if (currentUser?.id) {
            fetchUserDocuments(currentUser.id).catch(() => { });
        }
    }, [currentUser]);


    return (
        <AppContext.Provider value={{
            user: currentUser,
            setUser: setCurrentUser,
            logout,
            documents,
            addDocument,
            deleteDocument,
            viewDocument,
            registerUser,
            fetchCurrentUser,
            changePassword,
            fetchAllUsers,
            isLoadingUsers,
            updateUser,
            deleteUser,
            fetchFinancialSummary,
            fetchEntities,
            fetchServiceStatus,
            fetchInvestmentReports,
            userList,
            setUserList,
            activeTab,
            setActiveTab,
            adminTab,
            setAdminTab,
            theme,
            setTheme,
            fetchUserDocuments,
            isAuthChecked
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
