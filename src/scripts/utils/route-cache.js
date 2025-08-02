// src/scripts/utils/route-cache.js
import Cache from "../data/cache.js";

const RouteCache = {
    // Cache TTL for different route types (in milliseconds)
    TTL: {
        PROFILE: 5 * 60 * 1000,      // 5 minutes
        DASHBOARD: 2 * 60 * 1000,    // 2 minutes
        COURSE: 10 * 60 * 1000,      // 10 minutes
        STATIC: 30 * 60 * 1000,      // 30 minutes
    },

    // Check if current route data should be cached
    shouldCache(route) {
        // Routes that should not be cached
        const noCacheRoutes = ['#/login', '#/register', '#/logout'];
        return !noCacheRoutes.includes(route);
    },

    // Get cache key for route
    getCacheKey(route) {
        return `route_${route}`;
    },

    // Get TTL based on route type
    getTTL(route) {
        if (route.includes('profile')) return this.TTL.PROFILE;
        if (route.includes('dashboard')) return this.TTL.DASHBOARD;
        if (route.includes('course')) return this.TTL.COURSE;
        return this.TTL.STATIC;
    },

    // Clear cache for specific routes when data changes
    invalidateRelatedCache(action) {
        switch (action) {
            case 'PROFILE_UPDATE':
                Cache.clearPattern('profile');
                Cache.clearPattern('user_profile');
                Cache.clearPattern('role_profile');
                break;
            case 'COURSE_UPDATE':
                Cache.clearPattern('course');
                Cache.clearPattern('dashboard');
                break;
            case 'AUTH_CHANGE':
                Cache.clear(); // Clear all cache on auth changes
                break;
        }
    },

    // Save route content to cache
    saveRouteContent(route, content) {
        if (!this.shouldCache(route)) return;

        const key = this.getCacheKey(route);
        const ttl = this.getTTL(route);
        Cache.set(key, content, ttl);
    },

    // Get cached route content
    getRouteContent(route) {
        if (!this.shouldCache(route)) return null;

        const key = this.getCacheKey(route);
        return Cache.get(key);
    },

    // Middleware for route rendering
    async renderWithCache(route, renderFunction) {
        // Check cache first
        const cachedContent = this.getRouteContent(route);
        if (cachedContent) {
            //console.log(`[RouteCache] Using cached content for ${route}`);
            return cachedContent;
        }

        // If not cached, render normally
        //console.log(`[RouteCache] Rendering fresh content for ${route}`);
        const content = await renderFunction();

        // Save to cache if applicable
        if (content && typeof content === 'string') {
            this.saveRouteContent(route, content);
        }

        return content;
    }
};

export default RouteCache;