import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const authApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        prepareHeaders: headers => {
            headers.set('Content-Type', 'application/json;charset=UTF-8');
            headers.set('Authorization', 'anonymous');

            return headers;
        },
    }),
    tagTypes: ['Example'],
    endpoints: _ => ({}),
});