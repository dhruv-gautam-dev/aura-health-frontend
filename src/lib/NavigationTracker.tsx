import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { appLogsApi } from '../api/appLogs.api';
import { pagesConfig } from '../pages.config';

export default function NavigationTracker() {
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const { Pages, mainPage } = pagesConfig;
    const mainPageKey = mainPage ?? Object.keys(Pages)[0];

    // Log user activity when navigating to a page
    useEffect(() => {
        const pathname = location.pathname;
        let pageName: string | null;

        if (pathname === '/' || pathname === '') {
            pageName = mainPageKey;
        } else {
            const pathSegment = pathname.replace(/^\//, '').split('/')[0];

            const matchedKey = Object.keys(Pages).find(
                key => key.toLowerCase() === pathSegment.toLowerCase()
            );

            pageName = matchedKey ?? null;
        }

        if (!isAuthenticated || !pageName) return;

        appLogsApi.logUserInApp(pageName).catch((err) => {
            console.error("Navigation log failed:", err);
        });

    }, [location.pathname, isAuthenticated, Pages, mainPageKey]);

    return null;
}
