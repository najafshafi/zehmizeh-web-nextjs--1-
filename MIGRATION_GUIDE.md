# Migrating from react-query to @tanstack/react-query

This project is currently using both `react-query` (v3) and `@tanstack/react-query` (v4+). The long-term goal is to migrate all components to use the newer `@tanstack/react-query` library.

## Background

- The project was initially built with `react-query` v3
- We are gradually migrating to `@tanstack/react-query` (the official new name for react-query v4+)
- To maintain backward compatibility, both libraries are currently set up with their own providers

## Migration Steps for Components

When updating a component to use the new TanStack React Query:

1. Change the import statement:

   ```javascript
   // Old
   import { useQuery, useMutation, useQueryClient } from "react-query";

   // New
   import {
     useQuery,
     useMutation,
     useQueryClient,
   } from "@tanstack/react-query";
   ```

2. Update the hook usage:

   ```javascript
   // Old
   const { data } = useQuery("users", fetchUsers, {
     onSuccess: (data) => console.log(data),
   });

   // New
   const { data } = useQuery({
     queryKey: ["users"],
     queryFn: fetchUsers,
     onSuccess: (data) => console.log(data),
   });
   ```

3. Update mutation calls:

   ```javascript
   // Old
   const mutation = useMutation(createUser, {
     onSuccess: () => {
       queryClient.invalidateQueries("users");
     },
   });

   // New
   const mutation = useMutation({
     mutationFn: createUser,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ["users"] });
     },
   });
   ```

4. Update query invalidation:

   ```javascript
   // Old
   queryClient.invalidateQueries("users");

   // New
   queryClient.invalidateQueries({ queryKey: ["users"] });
   ```

## Benefits of Migration

1. Better TypeScript support
2. More structured API with object parameters
3. Improved performance
4. Active maintenance and new features

## Long-term Plan

Eventually, we will:

1. Migrate all components to use `@tanstack/react-query`
2. Remove the old `react-query` dependency and provider
3. Keep only the new TanStack Query provider

For now, both libraries will coexist to avoid breaking changes during the gradual migration process.
